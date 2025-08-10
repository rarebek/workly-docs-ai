import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration  
const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 150;
const DOCS_DIR = path.join(__dirname, '../docs');
const OUTPUT_FILE = path.join(__dirname, '../public/rag-index.json');

function chunkText(text, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP) {
  const chunks = [];
  let start = 0;
  
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const chunk = text.slice(start, end);
    
    // Try to break at word boundaries
    if (end < text.length) {
      const lastSpace = chunk.lastIndexOf(' ');
      if (lastSpace > chunkSize * 0.8) {
        chunks.push(text.slice(start, start + lastSpace));
        start = start + lastSpace + 1 - overlap;
      } else {
        chunks.push(chunk);
        start = end - overlap;
      }
    } else {
      chunks.push(chunk);
      break;
    }
  }
  
  return chunks;
}

async function readMarkdownFiles(dir) {
  const files = [];
  
  async function traverse(currentDir, relativePath = '') {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relPath = path.join(relativePath, entry.name);
      
      if (entry.isDirectory()) {
        await traverse(fullPath, relPath);
      } else if (entry.isFile() && /\.(md|mdx|txt)$/i.test(entry.name)) {
        const content = await fs.readFile(fullPath, 'utf-8');
        files.push({
          path: relPath,
          content: content
        });
      }
    }
  }
  
  try {
    await traverse(dir);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(`Docs directory ${dir} not found. Creating sample docs...`);
      await createSampleDocs();
      await traverse(dir);
    } else {
      throw err;
    }
  }
  
  return files;
}

async function createSampleDocs() {
  await fs.mkdir(DOCS_DIR, { recursive: true });
  
  const sampleDocs = [
    {
      name: 'getting-started.md',
      content: `# Getting Started

This is a sample documentation site using client-side RAG with Gemini API.

## Features

- Offline embedding generation
- Browser-based cosine similarity search
- AI-powered answers with citations
- No vector database required
- Static hosting friendly

## Installation

1. Install dependencies: \`pnpm install\`
2. Set your Gemini API key in .env
3. Run the embedding script: \`pnpm run embed\`
4. Serve the site: \`pnpm run dev\`
`
    },
    {
      name: 'api-reference.md',
      content: `# API Reference

## Embedding API

Uses \`gemini-embedding-001\` model for generating embeddings.

### Features:
- Batch processing support
- Matryoshka dimensionality (768/1536/3072)
- Multilingual support

## Generation API

Uses \`gemini-1.5-flash\` for fast, cost-effective text generation.

### Parameters:
- Temperature: 0.7
- Max tokens: 2048
- Context window: 1M tokens
`
    },
    {
      name: 'architecture.md',
      content: `# Architecture Overview

## Components

### 1. Offline Processing
- Document chunking (1000 chars, 150 overlap)
- Batch embedding generation
- JSON index creation

### 2. Runtime Search
- Query embedding
- Cosine similarity calculation
- Top-k retrieval (k=6)

### 3. Answer Generation
- Context injection
- Grounded generation
- Citation extraction

## Data Flow

1. User submits query
2. Query gets embedded
3. Similarity search against index
4. Top chunks sent to generator
5. Formatted answer with citations returned
`
    }
  ];
  
  for (const doc of sampleDocs) {
    await fs.writeFile(path.join(DOCS_DIR, doc.name), doc.content);
  }
  
  console.log('Created sample documentation files');
}

async function embedBatch(texts, genAI) {
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
  
  try {
    const result = await model.embedContent(texts);
    return result.embeddings || result.embedding;
  } catch (error) {
    console.error('Embedding batch failed:', error);
    throw error;
  }
}

async function processDocuments(genAI) {
  console.log('Reading markdown files...');
  const files = await readMarkdownFiles(DOCS_DIR);
  console.log(`Found ${files.length} files`);
  
  const chunks = [];
  let chunkId = 0;
  
  // Create chunks from all files
  for (const file of files) {
    const fileChunks = chunkText(file.content);
    for (const chunk of fileChunks) {
      chunks.push({
        id: chunkId++,
        url: file.path,
        text: chunk.trim(),
        file: file.path
      });
    }
  }
  
  console.log(`Created ${chunks.length} chunks`);
  
  // Embed in batches (reduced to stay under 36KB limit)
  const BATCH_SIZE = 10;
  const ragIndex = [];
  
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    console.log(`Embedding batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(chunks.length / BATCH_SIZE)}...`);
    
    try {
      const embeddings = await embedBatch(batch.map(chunk => chunk.text), genAI);
      
      for (let j = 0; j < batch.length; j++) {
        ragIndex.push({
          ...batch[j],
          embedding: Array.isArray(embeddings) ? embeddings[j].values : embeddings.values
        });
      }
    } catch (error) {
      console.error(`Failed to embed batch starting at ${i}:`, error);
      throw error;
    }
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Write the index
  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(ragIndex, null, 2));
  
  console.log(`\nEmbedding complete!`);
  console.log(`- Total chunks: ${ragIndex.length}`);
  console.log(`- Index file: ${OUTPUT_FILE}`);
  console.log(`- File size: ${(JSON.stringify(ragIndex).length / 1024 / 1024).toFixed(2)}MB`);
}

// Main execution function
async function main() {
  // Load environment variables from .env file first
  try {
    const envFile = await fs.readFile(path.join(__dirname, '../.env'), 'utf-8');
    envFile.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key] = value.trim();
      }
    });
  } catch (err) {
    console.log('No .env file found, using system environment variables');
  }

  // Check API key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Please set GEMINI_API_KEY in your environment or .env file');
    process.exit(1);
  }

  // Initialize Gemini AI with the key
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Process documents
  await processDocuments(genAI);
}

main().catch(console.error);