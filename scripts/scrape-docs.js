import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
const DOCS_DIR = path.join(__dirname, '../docs');
const DELAY_MS = 1000; // Polite crawling delay
const MAX_CONCURRENT = 3; // Concurrent requests limit

class DocsScraper {
  constructor() {
    this.turndown = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      bulletListMarker: '-'
    });
    
    // Custom rules for better markdown conversion
    this.setupTurndownRules();
    this.visitedUrls = new Set();
    this.baseUrl = '';
    this.baseDomain = '';
  }

  setupTurndownRules() {
    // Remove script and style tags
    this.turndown.remove(['script', 'style', 'nav', 'header', 'footer']);
    
    // Custom rule for code blocks with syntax highlighting
    this.turndown.addRule('codeBlocks', {
      filter: function (node) {
        return node.nodeName === 'PRE' && node.firstChild && node.firstChild.nodeName === 'CODE';
      },
      replacement: function (content, node) {
        const codeElement = node.firstChild;
        const className = codeElement.getAttribute('class') || '';
        const language = className.match(/language-(\w+)/)?.[1] || '';
        return '\n\n```' + language + '\n' + codeElement.textContent + '\n```\n\n';
      }
    });

    // Better table handling
    this.turndown.addRule('tables', {
      filter: 'table',
      replacement: function (content) {
        return '\n\n' + content + '\n\n';
      }
    });

    // Handle special documentation elements
    this.turndown.addRule('alerts', {
      filter: function (node) {
        return node.classList && (
          node.classList.contains('alert') ||
          node.classList.contains('callout') ||
          node.classList.contains('note') ||
          node.classList.contains('warning') ||
          node.classList.contains('tip')
        );
      },
      replacement: function (content, node) {
        const type = Array.from(node.classList).find(c => 
          ['alert', 'callout', 'note', 'warning', 'tip', 'info'].includes(c)
        ) || 'note';
        return `\n\n> **${type.toUpperCase()}**: ${content.trim()}\n\n`;
      }
    });
  }

  async fetchWithRetry(url, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        console.log(`Fetching: ${url}`);
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; DocsScraper/1.0; +https://github.com/your-repo)'
          },
          timeout: 10000
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.text();
      } catch (error) {
        console.warn(`Attempt ${i + 1} failed for ${url}:`, error.message);
        if (i === maxRetries - 1) throw error;
        await this.sleep(2000 * (i + 1)); // Exponential backoff
      }
    }
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  extractMainContent($) {
    // Try common documentation selectors
    const contentSelectors = [
      'main',
      '[role="main"]',
      '.content',
      '.main-content',
      '.documentation',
      '.docs-content',
      '.markdown-body',
      '.rst-content',
      '.page-content',
      'article',
      '.container .content',
      '#content',
      '.post-content'
    ];

    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length && element.text().trim().length > 200) {
        return element;
      }
    }

    // Fallback to body but remove common unwanted sections
    const body = $('body').clone();
    body.find('nav, header, footer, aside, .sidebar, .nav, .navigation, .menu').remove();
    return body;
  }

  cleanContent($, element) {
    // Remove navigation, ads, and other noise
    element.find([
      'nav', 'header', 'footer', 'aside',
      '.nav', '.navigation', '.sidebar', '.menu',
      '.ads', '.advertisement', '.social',
      '.breadcrumb', '.pagination',
      '[class*="nav"]', '[id*="nav"]',
      '.edit-page', '.improve-page',
      '.contributors', '.last-updated'
    ].join(', ')).remove();

    // Clean up empty paragraphs and divs
    element.find('p, div').each((_, el) => {
      const $el = $(el);
      if ($el.text().trim() === '' && $el.find('img, code, pre').length === 0) {
        $el.remove();
      }
    });

    return element;
  }

  generateFilename(url, title) {
    const urlPath = new URL(url).pathname;
    let filename = urlPath.split('/').filter(p => p).pop() || 'index';
    
    // Clean filename
    filename = filename
      .replace(/\.html?$/, '')
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase();
    
    if (!filename || filename === 'index') {
      filename = title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50);
    }
    
    return filename + '.md';
  }

  findDocumentationLinks($, baseUrl) {
    const links = new Set();
    const baseDomain = new URL(baseUrl).hostname;
    
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (!href) return;
      
      try {
        const absoluteUrl = new URL(href, baseUrl).toString();
        const url = new URL(absoluteUrl);
        
        // Only include links from the same domain
        if (url.hostname !== baseDomain) return;
        
        // Skip non-documentation links
        const skipPatterns = [
          /\.(pdf|zip|tar|gz|exe|dmg)$/i,
          /#/,  // Skip anchors for now
          /\/api\//, // Skip API endpoints
          /\/search/, /\/login/, /\/signup/,
          /github\.com/, /twitter\.com/, /linkedin\.com/
        ];
        
        if (skipPatterns.some(pattern => pattern.test(absoluteUrl))) return;
        
        // Include likely documentation paths
        const docPatterns = [
          /\/docs?\//,
          /\/guide/,
          /\/tutorial/,
          /\/help/,
          /\/documentation/,
          /\/manual/,
          /\/reference/,
          /\/learn/
        ];
        
        if (docPatterns.some(pattern => pattern.test(absoluteUrl)) || url.pathname === '/') {
          links.add(absoluteUrl);
        }
      } catch (error) {
        // Invalid URL, skip
      }
    });
    
    return Array.from(links);
  }

  async scrapePage(url) {
    if (this.visitedUrls.has(url)) return null;
    this.visitedUrls.add(url);
    
    try {
      const html = await this.fetchWithRetry(url);
      const $ = cheerio.load(html);
      
      // Extract title
      const title = $('title').text().trim() || 
                   $('h1').first().text().trim() || 
                   'Untitled';
      
      // Extract main content
      const mainContent = this.extractMainContent($);
      const cleanedContent = this.cleanContent($, mainContent);
      
      // Convert to markdown
      const markdown = this.turndown.turndown(cleanedContent.html());
      
      // Clean up markdown
      const cleanMarkdown = markdown
        .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
        .replace(/^\s+/gm, '') // Remove leading whitespace
        .trim();
      
      if (cleanMarkdown.length < 100) {
        console.warn(`Skipping ${url}: Content too short`);
        return null;
      }
      
      return {
        url,
        title: title.replace(/[^\w\s-]/g, '').trim(),
        content: cleanMarkdown,
        links: this.findDocumentationLinks($, url)
      };
    } catch (error) {
      console.error(`Failed to scrape ${url}:`, error.message);
      return null;
    }
  }

  async saveToFile(pageData, filename) {
    const frontmatter = `---
title: "${pageData.title}"
url: "${pageData.url}"
scraped_at: "${new Date().toISOString()}"
---

`;

    const content = frontmatter + pageData.content;
    const filePath = path.join(DOCS_DIR, filename);
    
    await fs.writeFile(filePath, content, 'utf-8');
    console.log(`✅ Saved: ${filename}`);
  }

  async scrapeDocumentation(startUrl, maxPages = 50) {
    console.log(`🚀 Starting documentation scrape from: ${startUrl}`);
    
    this.baseUrl = startUrl;
    this.baseDomain = new URL(startUrl).hostname;
    
    // Ensure docs directory exists
    await fs.mkdir(DOCS_DIR, { recursive: true });
    
    const urlsToVisit = [startUrl];
    const scrapedPages = [];
    let pageCount = 0;
    
    while (urlsToVisit.length > 0 && pageCount < maxPages) {
      const currentBatch = urlsToVisit.splice(0, MAX_CONCURRENT);
      
      const promises = currentBatch.map(async (url) => {
        await this.sleep(DELAY_MS); // Rate limiting
        return this.scrapePage(url);
      });
      
      const results = await Promise.allSettled(promises);
      
      for (const result of results) {
        if (result.status === 'fulfilled' && result.value) {
          const pageData = result.value;
          const filename = this.generateFilename(pageData.url, pageData.title);
          
          await this.saveToFile(pageData, filename);
          scrapedPages.push(pageData);
          pageCount++;
          
          // Add new links to visit
          for (const link of pageData.links) {
            if (!this.visitedUrls.has(link) && !urlsToVisit.includes(link)) {
              urlsToVisit.push(link);
            }
          }
        }
      }
      
      console.log(`📄 Scraped ${pageCount} pages, ${urlsToVisit.length} URLs remaining`);
    }
    
    console.log(`\n🎉 Scraping complete!`);
    console.log(`- Pages scraped: ${scrapedPages.length}`);
    console.log(`- Files saved to: ${DOCS_DIR}`);
    
    return scrapedPages;
  }

  async scrapeSitemap(sitemapUrl) {
    console.log(`📋 Fetching sitemap: ${sitemapUrl}`);
    
    try {
      const xml = await this.fetchWithRetry(sitemapUrl);
      const $ = cheerio.load(xml, { xmlMode: true });
      
      const urls = [];
      $('url loc').each((_, el) => {
        const url = $(el).text().trim();
        if (url) urls.push(url);
      });
      
      console.log(`Found ${urls.length} URLs in sitemap`);
      return urls;
    } catch (error) {
      console.warn('Could not fetch sitemap:', error.message);
      return [];
    }
  }
}

// CLI Usage
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
Usage: npm run scrape <url> [options]

Examples:
  npm run scrape https://docs.example.com
  npm run scrape https://docs.example.com --pages 100
  npm run scrape https://docs.example.com --sitemap

Options:
  --pages <num>   Maximum pages to scrape (default: 50)
  --sitemap       Try to find and use sitemap.xml
  --help          Show this help
    `);
    return;
  }
  
  if (args.includes('--help')) {
    return main();
  }
  
  const url = args[0];
  const maxPages = args.includes('--pages') ? parseInt(args[args.indexOf('--pages') + 1]) : 50;
  const useSitemap = args.includes('--sitemap');
  
  try {
    new URL(url); // Validate URL
  } catch (error) {
    console.error('❌ Invalid URL:', url);
    process.exit(1);
  }
  
  const scraper = new DocsScraper();
  
  try {
    if (useSitemap) {
      const baseUrl = new URL(url).origin;
      const sitemapUrls = [
        `${baseUrl}/sitemap.xml`,
        `${baseUrl}/sitemap_index.xml`,
        `${url}/sitemap.xml`
      ];
      
      let urls = [];
      for (const sitemapUrl of sitemapUrls) {
        urls = await scraper.scrapeSitemap(sitemapUrl);
        if (urls.length > 0) break;
      }
      
      if (urls.length > 0) {
        console.log(`🎯 Using sitemap with ${Math.min(urls.length, maxPages)} URLs`);
        for (const [i, pageUrl] of urls.slice(0, maxPages).entries()) {
          const pageData = await scraper.scrapePage(pageUrl);
          if (pageData) {
            const filename = scraper.generateFilename(pageData.url, pageData.title);
            await scraper.saveToFile(pageData, filename);
          }
          
          if (i > 0 && i % 10 === 0) {
            console.log(`📄 Processed ${i}/${Math.min(urls.length, maxPages)} pages`);
          }
          
          await scraper.sleep(DELAY_MS);
        }
      } else {
        console.log('No sitemap found, falling back to crawling...');
        await scraper.scrapeDocumentation(url, maxPages);
      }
    } else {
      await scraper.scrapeDocumentation(url, maxPages);
    }
    
    console.log('\n✨ Ready to embed! Run: npm run embed');
  } catch (error) {
    console.error('❌ Scraping failed:', error.message);
    process.exit(1);
  }
}

main();