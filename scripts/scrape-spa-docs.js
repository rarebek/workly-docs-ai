import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
const DOCS_DIR = path.join(__dirname, '../docs');

class SPADocsScraper {
  constructor() {
    this.turndown = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      bulletListMarker: '-'
    });
    
    this.setupTurndownRules();
  }

  setupTurndownRules() {
    // Remove script and style tags
    this.turndown.remove(['script', 'style', 'nav']);
    
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

    // Better handling for API documentation elements
    this.turndown.addRule('apiSections', {
      filter: function (node) {
        return node.classList && (
          node.classList.contains('endpoint') ||
          node.classList.contains('method') ||
          node.classList.contains('api-section')
        );
      },
      replacement: function (content) {
        return '\n\n' + content + '\n\n';
      }
    });

    // Handle HTTP method badges
    this.turndown.addRule('httpMethods', {
      filter: function (node) {
        const text = node.textContent?.trim().toUpperCase();
        return ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(text);
      },
      replacement: function (content) {
        return `**${content.trim().toUpperCase()}**`;
      }
    });
  }

  async fetchPage(url) {
    console.log(`Fetching: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DocsScraper/1.0)'
      },
      timeout: 10000
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.text();
  }

  extractSections($) {
    const sections = [];
    
    // Try different heading selectors
    const headingSelectors = ['h1', 'h2', 'h3'];
    let headings = [];
    
    for (const selector of headingSelectors) {
      headings = $(selector).toArray();
      if (headings.length > 3) break; // Use the level with most headings
    }
    
    console.log(`Found ${headings.length} sections`);
    
    headings.forEach((heading, index) => {
      const $heading = $(heading);
      const title = $heading.text().trim();
      
      if (!title || title.length < 2) return;
      
      // Get content until next heading of same or higher level
      const currentLevel = parseInt(heading.tagName.charAt(1));
      let content = $heading;
      let nextElement = $heading.next();
      
      while (nextElement.length > 0) {
        const nextTag = nextElement[0].tagName;
        
        // Stop if we hit another heading of same or higher level
        if (nextTag && nextTag.match(/^h[1-6]$/i)) {
          const nextLevel = parseInt(nextTag.charAt(1));
          if (nextLevel <= currentLevel) break;
        }
        
        content = content.add(nextElement);
        nextElement = nextElement.next();
      }
      
      const contentHtml = $('<div>').append(content.clone()).html();
      const markdown = this.turndown.turndown(contentHtml);
      
      if (markdown.trim().length > 50) { // Only include substantial sections
        sections.push({
          title: title,
          content: markdown.trim(),
          order: index,
          id: this.generateId(title)
        });
      }
    });
    
    return sections;
  }

  generateId(title) {
    return title
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, '') // Unicode support for all letters/numbers including Cyrillic
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);
  }

  generateFilename(title, index) {
    const baseFilename = this.generateId(title);
    return `${String(index + 1).padStart(2, '0')}-${baseFilename}.md`;
  }

  async saveSection(section, filename, url) {
    const frontmatter = `---
title: "${section.title}"
url: "${url}#${section.id}"
section_order: ${section.order}
scraped_at: "${new Date().toISOString()}"
---

`;

    const content = frontmatter + section.content;
    const filePath = path.join(DOCS_DIR, filename);
    
    await fs.writeFile(filePath, content, 'utf-8');
    console.log(`✅ Saved: ${filename}`);
  }

  async saveFullPage(html, url) {
    const $ = cheerio.load(html);
    
    // Get page title
    const title = $('title').text().trim() || 'Documentation';
    
    // Extract main content (remove navigation, scripts, etc.)
    $('script, style, nav, header, footer, .sidebar, .nav, .navigation').remove();
    
    const mainContent = $('main, [role="main"], .content, .documentation, body').first();
    const markdown = this.turndown.turndown(mainContent.html());
    
    const frontmatter = `---
title: "${title}"
url: "${url}"
type: "full-page"
scraped_at: "${new Date().toISOString()}"
---

`;

    const content = frontmatter + markdown;
    const filePath = path.join(DOCS_DIR, '00-full-documentation.md');
    
    await fs.writeFile(filePath, content, 'utf-8');
    console.log(`✅ Saved full page: 00-full-documentation.md`);
    
    return { title, content: markdown };
  }

  async scrapeSPA(url, splitSections = true) {
    console.log(`🚀 Scraping single-page documentation: ${url}`);
    
    // Ensure docs directory exists
    await fs.mkdir(DOCS_DIR, { recursive: true });
    
    try {
      const html = await this.fetchPage(url);
      const $ = cheerio.load(html);
      
      const results = {
        fullPage: null,
        sections: []
      };
      
      if (splitSections) {
        console.log('📑 Extracting sections...');
        const sections = this.extractSections($);
        
        if (sections.length > 0) {
          console.log(`Found ${sections.length} sections to save`);
          
          for (const [index, section] of sections.entries()) {
            const filename = this.generateFilename(section.title, index);
            await this.saveSection(section, filename, url);
            results.sections.push({ ...section, filename });
          }
        } else {
          console.log('No clear sections found, saving as single document');
          splitSections = false;
        }
      }
      
      if (!splitSections) {
        console.log('📄 Saving full page...');
        results.fullPage = await this.saveFullPage(html, url);
      }
      
      console.log(`\n🎉 Scraping complete!`);
      if (results.sections.length > 0) {
        console.log(`- Sections saved: ${results.sections.length}`);
      }
      if (results.fullPage) {
        console.log(`- Full page saved: 00-full-documentation.md`);
      }
      console.log(`- Files saved to: ${DOCS_DIR}`);
      
      return results;
      
    } catch (error) {
      console.error('❌ Scraping failed:', error.message);
      throw error;
    }
  }
}

// CLI Usage
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
Usage: npm run scrape:spa <url> [options]

Examples:
  npm run scrape:spa https://dev.workly.io/
  npm run scrape:spa https://dev.workly.io/ --no-split
  npm run scrape:spa https://docs.example.com --split

Options:
  --split      Split into sections by headings (default: true)
  --no-split   Save as single document only
  --help       Show this help
    `);
    return;
  }
  
  if (args.includes('--help')) {
    return main();
  }
  
  const url = args[0];
  const splitSections = !args.includes('--no-split');
  
  try {
    new URL(url); // Validate URL
  } catch (error) {
    console.error('❌ Invalid URL:', url);
    process.exit(1);
  }
  
  const scraper = new SPADocsScraper();
  
  try {
    await scraper.scrapeSPA(url, splitSections);
    console.log('\n✨ Ready to embed! Run: npm run embed');
  } catch (error) {
    console.error('❌ Scraping failed:', error.message);
    process.exit(1);
  }
}

main();