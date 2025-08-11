class SimpleRAG {
  constructor() {
    // Embedded API key - no user input required
    this.apiKey = 'AIzaSyAM8lo0zthJbm6lrOwN6Z-HAYcVh2a2Wzs';
    this.ragIndex = null;
    this.isLoading = false;
  }

  async loadIndex() {
    if (this.ragIndex) return this.ragIndex;
    
    try {
      console.log('Loading RAG index...');
      const response = await fetch('./rag-index.json');
      this.ragIndex = await response.json();
      console.log(`Loaded ${this.ragIndex.length} chunks`);
      return this.ragIndex;
    } catch (error) {
      console.error('Failed to load RAG index:', error);
      throw new Error('Could not load document index. Make sure you ran the embedding script first.');
    }
  }

  async embedQuery(query) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: {
          parts: [{ text: query }]
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Embedding failed: ${response.status}`);
    }

    const data = await response.json();
    return data.embedding.values;
  }

  cosineSimilarity(a, b) {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  async searchSimilar(query, topK = 6) {
    await this.loadIndex();
    
    console.log('Embedding query...');
    const queryEmbedding = await this.embedQuery(query);
    
    console.log('Computing hybrid search scores...');
    const results = this.ragIndex.map(chunk => {
      const semanticScore = this.cosineSimilarity(queryEmbedding, chunk.embedding);
      const keywordScore = this.keywordMatch(query, chunk.text);
      const contentTypeScore = this.getContentTypeScore(query, chunk.text, chunk.file);
      
      // Combine scores with weights
      const hybridScore = (semanticScore * 0.4) + (keywordScore * 0.3) + (contentTypeScore * 0.3);
      
      return {
        ...chunk,
        similarity: hybridScore,
        semanticScore: semanticScore,
        keywordScore: keywordScore,
        contentTypeScore: contentTypeScore
      };
    });

    // Sort by hybrid score (highest first) and take top-k
    results.sort((a, b) => b.similarity - a.similarity);
    
    console.log('Top results breakdown:', results.slice(0, 5).map(r => ({
      file: r.file,
      hybrid: (r.similarity * 100).toFixed(1),
      semantic: (r.semanticScore * 100).toFixed(1),
      keyword: (r.keywordScore * 100).toFixed(1),
      content: (r.contentTypeScore * 100).toFixed(1),
      preview: r.text.substring(0, 80) + '...'
    })));
    
    return results.slice(0, topK);
  }

  keywordMatch(query, text) {
    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();
    
    // Extract key terms from query
    const queryTerms = queryLower.match(/\b\w+\b/g) || [];
    
    // Define keyword mappings for better matching (English, Russian, Uzbek)
    const keywordMappings = {
      'employee': ['employees', 'сотрудник', 'сотрудники', 'employee', 'xodim', 'xodimlar'],
      'employees': ['employee', 'сотрудник', 'сотрудники', 'employees', 'xodim', 'xodimlar'],
      'list': ['список', 'list', 'get', 'royxat'],
      'authentication': ['auth', 'oauth', 'token', 'аутентификация', 'авторизация', 'autentifikatsiya', 'ruxsat'],
      'department': ['отдел', 'отделы', 'departments', 'department', 'bolim', 'bolimlar'],
      'position': ['должность', 'должности', 'positions', 'position', 'lavozim', 'lavozimlar'],
      'error': ['errors', 'ошибка', 'ошибки', 'error', 'xato', 'xatolar'],
      'errors': ['error', 'ошибка', 'ошибки', 'errors', 'xato', 'xatolar'],
      'code': ['codes', 'код', 'коды', 'code', 'kod', 'kodlar'],
      'codes': ['code', 'код', 'коды', 'codes', 'kod', 'kodlar'],
      'validation': ['валидация', 'validation', 'tekshirish'],
      'authorization': ['авторизация', 'authorization', 'auth', 'avtorizatsiya', 'ruxsat'],
      // Russian terms
      'ошибка': ['error', 'errors', 'ошибка', 'ошибки', 'xato', 'xatolar'],
      'ошибки': ['error', 'errors', 'ошибка', 'ошибки', 'xato', 'xatolar'],
      'код': ['code', 'codes', 'код', 'коды', 'kod', 'kodlar'],
      'коды': ['code', 'codes', 'код', 'коды', 'kod', 'kodlar'],
      'авторизация': ['authorization', 'auth', 'аутентификация', 'авторизация', 'avtorizatsiya', 'ruxsat'],
      'сотрудник': ['employee', 'employees', 'сотрудник', 'сотрудники', 'xodim', 'xodimlar'],
      'сотрудники': ['employee', 'employees', 'сотрудник', 'сотрудники', 'xodim', 'xodimlar'],
      // Uzbek terms
      'xodim': ['employee', 'employees', 'сотрудник', 'сотрудники', 'xodim', 'xodimlar'],
      'xodimlar': ['employee', 'employees', 'сотрудник', 'сотрудники', 'xodim', 'xodimlar'],
      'xato': ['error', 'errors', 'ошибка', 'ошибки', 'xato', 'xatolar'],
      'xatolar': ['error', 'errors', 'ошибка', 'ошибки', 'xato', 'xatolar'],
      'kod': ['code', 'codes', 'код', 'коды', 'kod', 'kodlar'],
      'kodlar': ['code', 'codes', 'код', 'коды', 'kod', 'kodlar'],
      'bolim': ['department', 'отдел', 'отделы', 'departments', 'bolim', 'bolimlar'],
      'bolimlar': ['department', 'отдел', 'отделы', 'departments', 'bolim', 'bolimlar'],
      'lavozim': ['position', 'должность', 'должности', 'positions', 'lavozim', 'lavozimlar'],
      'lavozimlar': ['position', 'должность', 'должности', 'positions', 'lavozim', 'lavozimlar'],
      'royxat': ['list', 'список', 'list', 'get', 'royxat'],
      'tekshirish': ['validation', 'валидация', 'validation', 'tekshirish'],
      'avtorizatsiya': ['authorization', 'auth', 'авторизация', 'аутентификация', 'avtorizatsiya', 'ruxsat'],
      'ruxsat': ['authorization', 'auth', 'авторизация', 'аутентификация', 'avtorizatsiya', 'ruxsat']
    };
    
    let score = 0;
    let totalTerms = queryTerms.length;
    
    for (const term of queryTerms) {
      const variations = keywordMappings[term] || [term];
      let termFound = false;
      
      for (const variation of variations) {
        if (textLower.includes(variation)) {
          score += 1;
          termFound = true;
          break;
        }
      }
      
      // Extra weight for exact endpoint matches
      if (term === 'employees' && textLower.includes('/employees')) {
        score += 2;
      }
    }
    
    return totalTerms > 0 ? score / totalTerms : 0;
  }

  getContentTypeScore(query, text, filename) {
    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();
    
    let score = 0;
    
    // Boost HTTP endpoint documentation
    if (text.match(/GET|POST|PUT|DELETE/)) {
      score += 0.3;
    }
    
    // Boost curl examples
    if (textLower.includes('curl --request')) {
      score += 0.2;
    }
    
    // Boost content with actual endpoint URLs
    if (text.match(/https?:\/\/api\.workly\.io\/v1\/\w+/)) {
      score += 0.4;
    }
    
    // Context-specific boosts
    if (queryLower.includes('employee')) {
      // Boost employee-specific endpoints
      if (textLower.includes('/employees') && !textLower.includes('payroll') && !textLower.includes('fine')) {
        score += 0.6;
      }
      // Penalize payroll/fine content when asking about employee lists
      if ((textLower.includes('payroll') || textLower.includes('fine')) && 
          (queryLower.includes('list') || queryLower.includes('get'))) {
        score -= 0.4;
      }
    }
    
    if (queryLower.includes('auth') || queryLower.includes('avtorizatsiya') || queryLower.includes('ruxsat')) {
      // Boost authentication sections
      if (filename.includes('аутентификация') || filename.includes('autentifikatsiya') || 
          textLower.includes('oauth') || textLower.includes('token')) {
        score += 0.5;
      }
    }
    
    if (queryLower.includes('department') || queryLower.includes('bolim')) {
      // Boost department endpoints
      if (textLower.includes('/departments') || filename.includes('отделы') || filename.includes('bolimlar')) {
        score += 0.5;
      }
    }
    
    if (queryLower.includes('error') || queryLower.includes('ошибка') || queryLower.includes('ошибки') || 
        queryLower.includes('xato') || queryLower.includes('xatolar')) {
      // Boost error documentation
      if (filename.includes('errors') || filename.includes('17-errors') || 
          textLower.includes('ошибка') || textLower.includes('error') || textLower.includes('xato') ||
          textLower.includes('код ошибки') || textLower.includes('error code') || textLower.includes('xato kodi')) {
        score += 0.7;
      }
    }
    
    if (queryLower.includes('validation') || queryLower.includes('валидация') || queryLower.includes('tekshirish')) {
      // Boost validation error content
      if (textLower.includes('validation') || textLower.includes('валидация') || textLower.includes('tekshirish')) {
        score += 0.5;
      }
    }
    
    // Boost main section headers and descriptions
    if (text.match(/^##\s+/) || text.match(/Возвращает.*список/)) {
      score += 0.2;
    }
    
    return Math.min(score, 1.0); // Cap at 1.0
  }

  async generateAnswer(query, context) {
    const contextText = context
      .map((chunk, i) => `[${i + 1}] Source: ${chunk.file}\n${chunk.text}`)
      .join('\n\n');

    const prompt = `You are an expert API documentation assistant for the Workly API. Answer the user's question using the most relevant information from the provided context. The documentation is available in English, Russian, and Uzbek.

Instructions:
1. Provide the exact HTTP method and endpoint URL
2. Include complete curl examples from the documentation
3. List all required headers and parameters  
4. Translate Russian and Uzbek content to English while preserving technical accuracy
5. Use citations [1], [2], etc. to reference sources
6. Focus on the most relevant endpoints for the user's question
7. If the user asks in Russian or Uzbek, respond in the same language while maintaining technical precision

Context:
${contextText}

Question: ${query}

Answer:`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 65536
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Generation failed: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  async query(question, topK = 12) {
    if (this.isLoading) {
      throw new Error('Already processing a query. Please wait...');
    }

    this.isLoading = true;
    
    try {
      // Search for relevant chunks
      const relevantChunks = await this.searchSimilar(question, topK);
      
      console.log('Top relevant chunks:', relevantChunks.map(c => ({
        file: c.file,
        similarity: c.similarity.toFixed(3),
        preview: c.text.substring(0, 100) + '...'
      })));

      // Generate answer
      console.log('Generating answer...');
      const answer = await this.generateAnswer(question, relevantChunks);

      return {
        answer,
        sources: relevantChunks.map(chunk => ({
          file: chunk.file,
          url: chunk.url,
          similarity: chunk.similarity,
          text: chunk.text
        }))
      };
    } finally {
      this.isLoading = false;
    }
  }
}

// Global instance
window.SimpleRAG = SimpleRAG;