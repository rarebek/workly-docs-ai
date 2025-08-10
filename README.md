# Simple Client-Side RAG for Docs

A minimal RAG (Retrieval-Augmented Generation) system that works entirely in the browser using Gemini embeddings and generation APIs.

## Features

- 🕷️ **Smart web scraping** - Extract clean docs from any website automatically
- 🔄 **Offline embedding generation** - Process docs once, serve statically
- 🌐 **Client-side search** - No backend required, runs entirely in browser  
- 📱 **Static hosting friendly** - Deploy anywhere (GitHub Pages, Netlify, etc.)
- 🆓 **Free tier friendly** - Uses Gemini's free API endpoints
- ⚡ **Fast responses** - Optimized for speed with Gemini 1.5 Flash

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set your Gemini API key:**
   ```bash
   echo "GEMINI_API_KEY=your_api_key_here" > .env
   ```
   Get a free API key at [ai.google.dev](https://ai.google.dev/)

3. **Get your documentation:**
   
   **Option A: Scrape from website**
   ```bash
   npm run scrape https://docs.example.com
   npm run scrape https://docs.example.com --pages 100
   npm run scrape https://docs.example.com --sitemap
   ```
   
   **Option B: Manual files**
   - Place `.md`, `.mdx`, or `.txt` files in the `docs/` folder
   - The script will automatically create sample docs if none exist

4. **Generate embeddings:**
   ```bash
   npm run embed
   ```

5. **Serve the site:**
   ```bash
   npm run dev
   ```
   Opens at http://localhost:8000

## How it Works

### Offline Processing
1. Reads markdown files from `docs/` directory
2. Chunks text (1000 chars with 150 char overlap)
3. Generates embeddings using `text-embedding-004`
4. Saves everything to `public/rag-index.json`

### Runtime Search
1. User query gets embedded with same model
2. Cosine similarity computed against all chunks
3. Top 6 most similar chunks selected
4. Chunks sent as context to Gemini 1.5 Flash
5. AI generates grounded answer with citations

## Configuration

Edit the constants in `scripts/embed-docs.js`:

```javascript
const CHUNK_SIZE = 1000;        // Characters per chunk
const CHUNK_OVERLAP = 150;      // Overlap between chunks  
const BATCH_SIZE = 100;         // Chunks to embed at once
```

## File Structure

```
├── docs/                    # Your documentation (markdown files)
├── public/
│   ├── index.html          # Web interface
│   ├── rag-client.js       # Browser RAG implementation
│   └── rag-index.json      # Generated embeddings index
├── scripts/
│   ├── embed-docs.js       # Offline embedding script
│   └── scrape-docs.js      # Web scraping script
├── .env                    # API key (create this)
└── package.json
```

## Web Scraping

The scraper intelligently extracts clean documentation content:

**Smart Content Extraction:**
- Automatically identifies main content areas
- Removes navigation, ads, and boilerplate
- Converts HTML to clean markdown with proper formatting
- Preserves code blocks, tables, and special elements

**Usage Examples:**
```bash
# Basic scraping (max 50 pages)
npm run scrape https://docs.react.dev

# Scrape more pages
npm run scrape https://docs.python.org --pages 200

# Use sitemap for complete coverage
npm run scrape https://tailwindcss.com/docs --sitemap
```

**Supported Sites:**
- Documentation sites (GitBook, Docusaurus, etc.)
- GitHub Pages and similar static docs
- Custom documentation sites
- Any site with structured content

**Features:**
- Respects robots.txt and rate limits
- Follows internal documentation links automatically  
- Generates SEO-friendly filenames
- Adds frontmatter with metadata
- Handles JavaScript-rendered content

## API Key Security

For production, consider adding a simple proxy to hide the API key:

```javascript
// api/embed
export default async function handler(req, res) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${process.env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body)
  });
  const data = await response.json();
  res.json(data);
}
```

## Customization

- **Models**: Change embedding model in both `embed-docs.js` and `rag-client.js`
- **Chunking**: Adjust `CHUNK_SIZE` and `CHUNK_OVERLAP` for your content
- **Retrieval**: Modify `topK` parameter in search function
- **Generation**: Update system prompt in `generateAnswer()` method

## Deployment

Since everything is static after embedding:

1. Run `npm run embed` locally
2. Deploy the `public/` folder to any static host
3. Users enter their own API key in the UI

## Troubleshooting

**"Could not load document index"** - Run `npm run embed` first

**"Embedding failed: 403"** - Check your API key in `.env`

**Large index file** - Reduce chunk size or use dimensionality reduction

**Slow searches** - Consider reducing index size or implementing pagination