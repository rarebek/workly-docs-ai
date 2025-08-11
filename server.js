import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Serve static files from public directory
app.use(express.static('public'));

app.listen(port, '0.0.0.0', () => {
  console.log(`RAG server running at http://0.0.0.0:${port}`);
});