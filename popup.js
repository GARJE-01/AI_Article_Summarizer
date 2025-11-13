// AI Article Summarizer Pro - Enhanced Popup Script
class ArticleSummarizerPro {
  constructor() {
    this.currentSummary = '';
    this.currentText = '';
    this.currentUrl = '';
    this.isDarkMode = false;
    this.settings = {};
    this.history = [];
    this.speechSynthesis = window.speechSynthesis;
    this.currentUtterance = null;
    this.resolvedModel = null;
    
    this.init();
  }

  async init() {
    await this.loadSettings();
    await this.loadHistory();
    this.setupEventListeners();
    this.updateUI();
    this.checkAutoSummarize();
  }

  async loadSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get([
        'geminiApiKey', 'darkMode', 'fontSize', 'fontFamily', 
        'autoSummarize', 'summaryLength', 'rephraseStyle'
      ], (result) => {
        this.settings = {
          geminiApiKey: result.geminiApiKey || '',
          darkMode: result.darkMode || false,
          fontSize: result.fontSize || '13px',
          fontFamily: result.fontFamily || 'Segoe UI',
          autoSummarize: result.autoSummarize || false,
          summaryLength: result.summaryLength || 2,
          rephraseStyle: result.rephraseStyle || 'original'
        };
        resolve();
      });
    });
  }

  async loadHistory() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['summaryHistory'], (result) => {
        this.history = result.summaryHistory || [];
        resolve();
      });
    });
  }

  async saveHistory() {
    if (this.history.length > 10) {
      this.history = this.history.slice(-10);
    }
    chrome.storage.local.set({ summaryHistory: this.history });
  }

  setupEventListeners() {
    document.getElementById('summarize').addEventListener('click', () => this.summarizeArticle());
    document.getElementById('copy-btn').addEventListener('click', () => this.copySummary());
    document.getElementById('rephrase').addEventListener('click', () => this.rephraseSummary());
    document.getElementById('grammar-check').addEventListener('click', () => this.checkGrammar());
    document.getElementById('highlight-keywords').addEventListener('click', () => this.highlightKeywords());
    document.getElementById('voice-read').addEventListener('click', () => this.toggleVoiceRead());
    const vocabBtn = document.getElementById('vocab-helper');
    if (vocabBtn) {
      vocabBtn.addEventListener('click', () => this.toggleVocabularyHelper());
    }
    
    document.getElementById('export-pdf').addEventListener('click', () => this.exportSummary('pdf'));
    document.getElementById('export-txt').addEventListener('click', () => this.exportSummary('txt'));
    
    document.getElementById('share-twitter').addEventListener('click', () => this.shareSummary('twitter'));
    document.getElementById('share-linkedin').addEventListener('click', () => this.shareSummary('linkedin'));
    document.getElementById('share-whatsapp').addEventListener('click', () => this.shareSummary('whatsapp'));
    
    document.getElementById('plagiarism-check').addEventListener('click', () => this.checkPlagiarism());
    document.getElementById('show-history').addEventListener('click', () => this.showHistory());
    document.getElementById('toggle-dark').addEventListener('click', () => this.toggleDarkMode());
    document.getElementById('open-options').addEventListener('click', () => this.openOptions());
    
    document.getElementById('summary-length').addEventListener('input', (e) => {
      const values = ['Short', 'Medium', 'Long'];
      document.getElementById('length-value').textContent = values[e.target.value - 1];
    });
  }

  updateUI() {
    if (this.settings.darkMode) {
      document.body.classList.add('dark-mode');
      document.getElementById('toggle-dark').innerHTML = '<span>☀️</span> Light Mode';
    }
    
    document.body.style.fontSize = this.settings.fontSize;
    document.body.style.fontFamily = this.settings.fontFamily;
    
    document.getElementById('summary-length').value = this.settings.summaryLength;
    const values = ['Short', 'Medium', 'Long'];
    document.getElementById('length-value').textContent = values[this.settings.summaryLength - 1];
  }

  async checkAutoSummarize() {
    if (this.settings.autoSummarize && this.settings.geminiApiKey) {
      setTimeout(() => this.summarizeArticle(), 1000);
    }
  }

  async summarizeArticle() {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<div class="loading"><div class="loader"></div><p>Extracting article text and generating summary...</p></div>';

    if (!this.settings.geminiApiKey) {
      this.showError('API key not found. Please set your Gemini API key in settings.');
            return;
          }

          try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      this.currentUrl = tab.url;

      const response = await chrome.tabs.sendMessage(tab.id, { type: 'GET_ARTICLE_TEXT' });
      if (!response || !response.text) {
        this.showError('Could not extract article text from this page.');
        return;
      }

      this.currentText = response.text;
      const summaryType = document.getElementById('summary-type').value;
      const summaryLength = document.getElementById('summary-length').value;

      const summary = await this.getGeminiSummary(this.currentText, summaryType, summaryLength);
      this.currentSummary = summary;

      this.displaySummary(summary);
      this.saveToHistory(summary, tab.url, tab.title);
      this.enableButtons();
      
      const readingTime = this.calculateReadingTime(summary);
      const topic = this.classifyTopic(this.currentText);
      this.updateResultHeader(readingTime, topic);

          } catch (error) {
      this.showError(`Error: ${error.message || 'Failed to generate summary.'}`);
    }
  }

  async resolveBestModel(apiKey, forceRefresh = false) {
    try {
      // Use cached model if fresh
      const cacheKey = 'gemini_model_cache';
      const cached = await new Promise((resolve) => {
        chrome.storage.local.get([cacheKey], (res) => resolve(res[cacheKey]));
      });
      const now = Date.now();
      if (!forceRefresh && cached && cached.model && cached.expiresAt && cached.expiresAt > now) {
        this.resolvedModel = cached.model;
        return cached.model;
      }

      const listUrl = (typeof CONFIG !== 'undefined' && CONFIG.GEMINI_MODELS_LIST_URL)
        ? CONFIG.GEMINI_MODELS_LIST_URL
        : 'https://generativelanguage.googleapis.com/v1/models';
      const res = await fetch(`${listUrl}?key=${apiKey}`);
      if (!res.ok) throw new Error('Failed to list models');
      const data = await res.json();
      const models = Array.isArray(data.models) ? data.models.map(m => m.name) : [];

      const preferences = (typeof CONFIG !== 'undefined' && Array.isArray(CONFIG.GEMINI_MODEL_PREFERENCE))
        ? CONFIG.GEMINI_MODEL_PREFERENCE
        : ['models/gemini-1.5-flash','models/gemini-1.5-pro','models/gemini-1.0-pro','models/gemini-pro'];

      // Find first preferred model that exists and supports generateContent
      const chosen = preferences.find(pref => models.includes(pref) || models.some(m => m.startsWith(pref)));
      const finalModel = chosen || models.find(m => /gemini/i.test(m)) || 'models/gemini-pro';

      this.resolvedModel = finalModel;
      const ttl = (typeof CONFIG !== 'undefined' && CONFIG.GEMINI_MODEL_CACHE_TTL_MS) ? CONFIG.GEMINI_MODEL_CACHE_TTL_MS : (24*60*60*1000);
      await chrome.storage.local.set({ [cacheKey]: { model: finalModel, expiresAt: now + ttl } });
      return finalModel;
    } catch (_) {
      // Fallback to a safe default
      this.resolvedModel = 'models/gemini-pro';
      return this.resolvedModel;
    }
  }

  async getGeminiSummary(text, summaryType, length) {
    const maxLength = 20000;
    const truncatedText = text.length > maxLength ? text.substring(0, maxLength) + '...' : text;

    // Enforce clearer targets for length/bullet counts
    const wordTargets = {
      '1': { label: 'short', min: 120, max: 180 },
      '2': { label: 'medium', min: 250, max: 400 },
      '3': { label: 'long', min: 600, max: 900 }
    };

    const bulletTargets = {
      '1': { min: 5, max: 7 },
      '2': { min: 10, max: 15 },
      '3': { min: 20, max: 25 }
    };

  let prompt;
  switch (summaryType) {
      case 'brief':
        {
          const t = wordTargets[length] || wordTargets['2'];
          prompt = `Summarize the article in ${t.label} form with ${t.min}-${t.max} words.
Include all key points, subpoints, important details, causes/effects, numbers, names, and clear takeaways.
Write in cohesive paragraphs (no bullets). Do not add prefaces or conclusions. Do not omit critical nuances.
If content is dense, expand to meet the word range without fabricating details.

Article:
${truncatedText}`;
        }
      break;
      case 'detailed':
        {
          const t = wordTargets[length] || wordTargets['2'];
          prompt = `Write a comprehensive ${t.label} summary of ${t.min}-${t.max} words.
Cover: (1) core thesis, (2) all major sections, (3) key arguments and evidence, (4) important numbers/names/dates, (5) implications and limitations.
Organize into 2-4 cohesive paragraphs. No intro/outro phrases. No fabrication. Preserve key terminology.

Article:
${truncatedText}`;
        }
      break;
      case 'bullets':
        {
          const bt = bulletTargets[length] || bulletTargets['2'];
          prompt = `Summarize the article as ${bt.min}-${bt.max} bullet points.
Rules:
- Each bullet MUST start with "- " (dash + space) and be one concise sentence.
- Cover all key points, subpoints, important details, numbers, names, and cause-effect links.
- Group related subpoints across multiple bullets if needed to reach the count.
- No preface or closing line; output ONLY the bullets.
- Do NOT fabricate details.

Article:
${truncatedText}`;
        }
      break;
    default:
        {
          const t = wordTargets[length] || wordTargets['2'];
          prompt = `Provide a ${t.label} summary (${t.min}-${t.max} words) covering key points, subpoints, and important details.
No preface or conclusion.

Article:
${truncatedText}`;
        }
    }

    const data = await this._callGeminiAPI(prompt, 0.2);
    return data || 'No summary available.';
  }

  displaySummary(summary) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<div id="summary-content">${this.formatSummary(summary)}</div>`;
    this.vocabEnabled = false;
  }

  formatSummary(summary) {
    return summary
      .replace(/^- /gm, '• ')
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  }

  updateResultHeader(readingTime, topic) {
    const resultContainer = document.querySelector('.result-container');
    let header = resultContainer.querySelector('.result-header');
    
    if (!header) {
      header = document.createElement('div');
      header.className = 'result-header';
      resultContainer.insertBefore(header, resultContainer.firstChild);
    }
    
    header.innerHTML = `
      <div class="result-stats">
        <span>📖 ${readingTime} min read</span> • 
        <span>🏷️ ${topic}</span>
      </div>
      <div class="result-actions">
        <button class="btn btn-small btn-secondary" onclick="summarizer.highlightOriginalText()">
          <span>🎯</span> Highlight
        </button>
      </div>
    `;
  }

  calculateReadingTime(text) {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  classifyTopic(text) {
    const topics = {
      'technology': ['tech', 'software', 'ai', 'computer', 'digital', 'internet', 'app', 'code'],
      'politics': ['government', 'election', 'policy', 'political', 'democracy', 'vote'],
      'health': ['health', 'medical', 'doctor', 'medicine', 'treatment', 'disease', 'healthcare'],
      'business': ['business', 'company', 'market', 'economy', 'finance', 'investment', 'stock'],
      'science': ['research', 'study', 'scientific', 'experiment', 'discovery', 'university'],
      'sports': ['sport', 'game', 'team', 'player', 'match', 'championship', 'league'],
      'entertainment': ['movie', 'music', 'celebrity', 'film', 'show', 'entertainment', 'actor']
    };

    const lowerText = text.toLowerCase();
    for (const [topic, keywords] of Object.entries(topics)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return topic.charAt(0).toUpperCase() + topic.slice(1);
      }
    }
    return 'General';
  }

  async rephraseSummary() {
    if (!this.currentSummary) return;

    const style = document.getElementById('rephrase-style').value;
    if (style === 'original') {
      this.displaySummary(this.currentSummary);
      return;
    }

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<div class="loading"><div class="loader"></div><p>Rephrasing summary...</p></div>';

    try {
      const stylePrompts = {
        'formal': 'in a formal, professional tone',
        'casual': 'in a casual, conversational tone',
        'simplified': 'in simple, easy-to-understand language'
      };

      const prompt = `Rephrase the following summary ${stylePrompts[style]}:\n\n${this.currentSummary}`;

      const data = await this._callGeminiAPI(prompt, 0.3);
      const rephrasedSummary = data || this.currentSummary;
      this.currentSummary = rephrasedSummary;
      this.displaySummary(rephrasedSummary);

    } catch (error) {
      this.showError('Failed to rephrase summary. Please try again.');
    }
  }

  async _callGeminiAPI(prompt, temperature) {
    const cacheKey = 'gemini_model_cache';
    const attemptFetch = async (forceRefresh = false) => {
      const model = await this.resolveBestModel(this.settings.geminiApiKey, forceRefresh);
      const apiUrl = `https://generativelanguage.googleapis.com/v1/${model}:generateContent`;

      const response = await fetch(
        `${apiUrl}?key=${this.settings.geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature }
          })
        }
      );

      return { response, model };
    };

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const forceRefresh = attempt > 1; // refresh model cache on retries
        const { response } = await attemptFetch(forceRefresh);

        if (!response.ok) {
          let message = `API request failed (status ${response.status})`;
          let errorBody;
          try {
            errorBody = await response.json();
            message = errorBody.error?.message || message;
          } catch (e) {
            try {
              const text = await response.text();
              if (text) message += `: ${text}`;
            } catch (_) {}
          }

          // If model is invalid/not supported, invalidate cache and retry once
          if (response.status === 404 || /not found|not supported/i.test(message)) {
            await new Promise((resolve) => chrome.storage.local.remove([cacheKey], () => resolve()));
            if (attempt < 3) {
              await sleep(300);
              continue;
            }
          }

          // Retry on transient errors
          if ((response.status >= 500 || response.status === 429) && attempt < 3) {
            await sleep(400 * attempt);
            continue;
          }

          throw new Error(message);
        }

        const data = await response.json();
        return data?.candidates?.[0]?.content?.parts?.[0]?.text;
      } catch (err) {
        if (attempt < 3) {
          await sleep(300 * attempt);
          continue;
        }
        throw err;
      }
    }
  }

  async checkGrammar() {
    if (!this.currentSummary) return;

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<div class="loading"><div class="loader"></div><p>Checking grammar...</p></div>';

    try {
      const response = await fetch('https://api.languagetool.org/v2/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `text=${encodeURIComponent(this.currentSummary)}&language=en-US`
      });

      if (!response.ok) {
        throw new Error('Grammar check service unavailable');
      }

      const data = await response.json();
      let correctedText = this.currentSummary;

      if (data.matches && data.matches.length > 0) {
        data.matches.forEach(match => {
          if (match.replacements && match.replacements.length > 0) {
            const replacement = match.replacements[0].value;
            correctedText = correctedText.replace(match.context.text, replacement);
          }
        });
      }

      this.currentSummary = correctedText;
      this.displaySummary(correctedText);

      if (data.matches && data.matches.length > 0) {
        this.showSuccess(`Grammar check complete. Found and corrected ${data.matches.length} issues.`);
      } else {
        this.showSuccess('Grammar check complete. No issues found!');
      }

    } catch (error) {
      this.showError('Grammar check failed. Please try again.');
    }
  }

  highlightKeywords() {
    if (!this.currentSummary) return;

    const summaryContent = document.getElementById('summary-content');
    if (!summaryContent) return;

    let text = summaryContent.innerHTML;
    
    // Extract meaningful keywords from the summary text
    const words = this.currentSummary.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3); // Only words longer than 3 characters
    
    // Count word frequency
    const wordCount = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    // Get most frequent words (excluding common words)
    const commonWords = new Set([
      'this', 'that', 'with', 'from', 'they', 'have', 'been', 'were', 'said', 'each', 'which', 'their', 'time', 'will', 'about', 'there', 'could', 'other', 'after', 'first', 'well', 'also', 'where', 'much', 'some', 'very', 'when', 'into', 'over', 'think', 'back', 'use', 'two', 'how', 'our', 'work', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us', 'make', 'like', 'just', 'know', 'take', 'people', 'year', 'good', 'them', 'see', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'think', 'back', 'use', 'two', 'how', 'our', 'work', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us', 'here', 'there', 'where', 'what', 'who', 'why', 'how', 'when', 'which', 'would', 'should', 'could', 'might', 'may', 'can', 'must', 'shall', 'will', 'shall', 'being', 'having', 'doing', 'going', 'coming', 'getting', 'making', 'taking', 'giving', 'seeing', 'knowing', 'thinking', 'looking', 'working', 'using', 'trying', 'helping', 'showing', 'telling', 'asking', 'saying', 'going', 'coming', 'getting', 'making', 'taking', 'giving', 'seeing', 'knowing', 'thinking', 'looking', 'working', 'using', 'trying', 'helping', 'showing', 'telling', 'asking', 'saying'
    ]);
    
    // Get top keywords (excluding common words)
    const keywords = Object.entries(wordCount)
      .filter(([word, count]) => count > 1 && !commonWords.has(word) && word.length > 3)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10) // Top 10 keywords
      .map(([word]) => word);
    
    // Also include some important action/descriptive words
    const importantWords = ['important', 'key', 'main', 'primary', 'significant', 'critical', 'essential', 'major', 'notable', 'remarkable', 'develop', 'create', 'build', 'improve', 'increase', 'decrease', 'change', 'result', 'effect', 'impact', 'benefit', 'advantage', 'disadvantage', 'problem', 'solution', 'method', 'approach', 'strategy', 'process', 'system', 'technology', 'innovation', 'research', 'study', 'analysis', 'finding', 'conclusion', 'recommendation'];
    
    const allKeywords = [...keywords, ...importantWords];
    
    // Highlight keywords in the text
    allKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
      text = text.replace(regex, `<strong style="background-color: #ffeb3b; padding: 1px 2px; border-radius: 2px;">$1</strong>`);
    });

    summaryContent.innerHTML = text;
    this.showSuccess(`Keywords highlighted successfully! Found ${keywords.length} key terms.`);
  }

  toggleVoiceRead() {
    if (!this.currentSummary) return;

    if (this.currentUtterance && this.speechSynthesis.speaking) {
      this.speechSynthesis.cancel();
      document.getElementById('voice-read').innerHTML = '<span>🔊</span> Read Aloud';
      return;
    }

    const utterance = new SpeechSynthesisUtterance(this.currentSummary);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onstart = () => {
      document.getElementById('voice-read').innerHTML = '<span>⏸️</span> Stop';
    };

    utterance.onend = () => {
      document.getElementById('voice-read').innerHTML = '<span>🔊</span> Read Aloud';
    };

    this.currentUtterance = utterance;
    this.speechSynthesis.speak(utterance);
  }

  async copySummary() {
    if (!this.currentSummary) return;

    try {
      await navigator.clipboard.writeText(this.currentSummary);
      const copyBtn = document.getElementById('copy-btn');
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = '<span>✅</span> Copied!';
      setTimeout(() => {
        copyBtn.innerHTML = originalText;
      }, 2000);
    } catch (error) {
      this.showError('Failed to copy to clipboard');
    }
  }

  exportSummary(format) {
    if (!this.currentSummary) return;

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `summary_${timestamp}.${format}`;

    switch (format) {
      case 'pdf':
        ExportUtils.exportToPDF(this.currentSummary, filename);
        break;
      case 'txt':
        ExportUtils.exportToTXT(this.currentSummary, filename);
        break;
    }

    this.showSuccess(`Summary exported as ${format.toUpperCase()}`);
  }

  shareSummary(platform) {
    if (!this.currentSummary) return;

    const text = this.currentSummary.length > 200 
      ? this.currentSummary.substring(0, 200) + '...' 
      : this.currentSummary;

    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(this.currentUrl)}&summary=${encodeURIComponent(text)}`,
      whatsapp: `https://web.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + this.currentUrl)}`
    };

    chrome.tabs.create({ url: urls[platform] });
  }

  async checkPlagiarism() {
    if (!this.currentSummary) return;

    const searchQuery = this.currentSummary.substring(0, 100);
    const googleSearchUrl = `https://www.google.com/search?q="${encodeURIComponent(searchQuery)}"`;
    
    chrome.tabs.create({ url: googleSearchUrl });
    this.showSuccess('Opened plagiarism check in new tab');
  }

  showHistory() {
    if (this.history.length === 0) {
      this.showError('No summary history found');
      return;
    }

    const resultDiv = document.getElementById('result');
    const container = document.createElement('div');
    container.className = 'history-container';

    // Use a stable copy to avoid mutating original order
    const items = [...this.history];
    items.slice().reverse().forEach((item, reversedIndex) => {
      const originalIndex = items.length - 1 - reversedIndex;
      const card = document.createElement('div');
      card.className = 'history-item';

      const title = document.createElement('h4');
      title.textContent = item.title || 'Untitled';

      const meta = document.createElement('p');
      meta.textContent = `${item.timestamp} • ${item.url}`;

      const preview = document.createElement('div');
      preview.className = 'preview';
      preview.textContent = `${item.summary.substring(0, 100)}...`;

      card.appendChild(title);
      card.appendChild(meta);
      card.appendChild(preview);

      card.addEventListener('click', () => {
        this.loadFromHistory(originalIndex);
      });

      container.appendChild(card);
    });

    resultDiv.innerHTML = '';
    resultDiv.appendChild(container);
  }

  loadFromHistory(index) {
    const item = this.history[index];
    this.currentSummary = item.summary;
    this.currentUrl = item.url;
    this.displaySummary(item.summary);
    this.enableButtons();
  }

  async toggleDarkMode() {
    this.settings.darkMode = !this.settings.darkMode;
    document.body.classList.toggle('dark-mode', this.settings.darkMode);
    
    const toggleBtn = document.getElementById('toggle-dark');
    toggleBtn.innerHTML = this.settings.darkMode 
      ? '<span>☀️</span> Light Mode' 
      : '<span>🌙</span> Dark Mode';

    chrome.storage.sync.set({ darkMode: this.settings.darkMode });
  }

  openOptions() {
    chrome.runtime.openOptionsPage();
  }

  async highlightOriginalText() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      await chrome.tabs.sendMessage(tab.id, { 
        type: 'HIGHLIGHT_ORIGINAL_TEXT', 
        summary: this.currentSummary 
      });
      this.showSuccess('Original text highlighted on page');
    } catch (error) {
      this.showError('Failed to highlight original text');
    }
  }

  saveToHistory(summary, url, title) {
    const historyItem = {
      summary,
      url,
      title: title || 'Untitled',
      timestamp: new Date().toLocaleString(),
      id: Date.now()
    };
    
    this.history.push(historyItem);
    this.saveHistory();
  }

  enableButtons() {
    const buttons = [
      'rephrase', 'grammar-check', 'highlight-keywords', 'voice-read', 'vocab-helper', 'copy-btn',
      'export-pdf', 'export-txt',
      'share-twitter', 'share-linkedin', 'share-whatsapp', 'plagiarism-check'
    ];
    
    buttons.forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.disabled = false;
    });
  }

  // Vocabulary helper: highlight uncommon words and show synonyms on hover
  toggleVocabularyHelper() {
    this.vocabEnabled = !this.vocabEnabled;
    const btn = document.getElementById('vocab-helper');
    if (btn) btn.innerHTML = this.vocabEnabled ? '<span>🧠</span> Vocab On' : '<span>🧠</span> Vocabulary';

    const container = document.getElementById('summary-content');
    if (!container) return;

    if (!this.vocabEnabled) {
      container.innerHTML = this.formatSummary(this.currentSummary);
      return;
    }

    const simpleWordList = new Set([
      'the','be','to','of','and','a','in','that','have','i','it','for','not','on','with','he','as','you','do','at','this','but','his','by','from','they','we','say','her','she','or','an','will','my','one','all','would','there','their','what','so','up','out','if','about','who','get','which','go','me','when','make','can','like','time','no','just','him','know','take','people','into','year','your','good','some','could','them','see','other','than','then','now','look','only','come','its','over','think','also','back','after','use','two','how','our','work','first','well','way','even','new','want','because','any','these','give','day','most','us'
    ]);

    const html = container.innerHTML;
    const wrapped = html.replace(/([A-Za-z][A-Za-z\-']{3,})/g, (m) => {
      const w = m.toLowerCase();
      if (simpleWordList.has(w)) return m;
      return `<span class="highlighted-word" data-word="${m}">${m}</span>`;
    });
    container.innerHTML = wrapped;

    container.querySelectorAll('.highlighted-word').forEach((el) => {
      el.addEventListener('mouseenter', async () => {
        const word = el.getAttribute('data-word');
        if (!word) return;
        const synonyms = await this.fetchSynonyms(word);
        const popup = document.createElement('div');
        popup.className = 'synonym-popup';
        popup.textContent = synonyms.length ? `Synonyms: ${synonyms.slice(0,5).join(', ')}` : 'No simple synonyms found';
        el.appendChild(popup);
        popup.style.display = 'block';
        popup.style.top = '-28px';
        popup.style.left = '0px';
      });
      el.addEventListener('mouseleave', () => {
        const popup = el.querySelector('.synonym-popup');
        if (popup) popup.remove();
      });
    });
  }

  async fetchSynonyms(word) {
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
      if (!res.ok) return [];
    const data = await res.json();
      const syns = [];
      (data || []).forEach(entry => {
        (entry.meanings || []).forEach(meaning => {
          (meaning.definitions || []).forEach(def => {
            if (def.synonyms) syns.push(...def.synonyms);
          });
        });
      });
      const unique = Array.from(new Set(syns)).filter(s => s && s.length <= Math.max(4, Math.floor(word.length)));
      return unique;
    } catch (_) {
      return [];
    }
  }

  showError(message) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<div class="error">${message}</div>`;
  }

  showSuccess(message) {
    const resultDiv = document.getElementById('result');
    const successDiv = document.createElement('div');
    successDiv.className = 'success';
    successDiv.textContent = message;
    resultDiv.insertBefore(successDiv, resultDiv.firstChild);
    
    setTimeout(() => {
      successDiv.remove();
    }, 3000);
  }
}

// Initialize the application
let summarizer;
document.addEventListener('DOMContentLoaded', () => {
  summarizer = new ArticleSummarizerPro();
});