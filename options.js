// Enhanced options script for AI Article Summarizer Pro
class OptionsManager {
  constructor() {
    this.settings = {
      geminiApiKey: '',
      darkMode: false,
      fontSize: '13px',
      fontFamily: 'Segoe UI',
      autoSummarize: false,
      summaryLength: 2,
      rephraseStyle: 'original',
      enableGrammarCheck: true,
      enableVoiceRead: true,
      enableKeywordHighlight: true,
      enableTopicClassification: true
    };
    
    this.init();
  }

  async init() {
    await this.loadSettings();
    this.setupEventListeners();
    this.updateUI();
  }

  async loadSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get([
        'geminiApiKey', 'darkMode', 'fontSize', 'fontFamily', 
        'autoSummarize', 'summaryLength', 'rephraseStyle',
        'enableGrammarCheck', 'enableVoiceRead', 'enableKeywordHighlight', 'enableTopicClassification'
      ], (result) => {
        this.settings = {
          geminiApiKey: result.geminiApiKey || '',
          darkMode: result.darkMode || false,
          fontSize: result.fontSize || '13px',
          fontFamily: result.fontFamily || 'Segoe UI',
          autoSummarize: result.autoSummarize || false,
          summaryLength: result.summaryLength || 2,
          rephraseStyle: result.rephraseStyle || 'original',
          enableGrammarCheck: result.enableGrammarCheck !== false,
          enableVoiceRead: result.enableVoiceRead !== false,
          enableKeywordHighlight: result.enableKeywordHighlight !== false,
          enableTopicClassification: result.enableTopicClassification !== false
        };
        resolve();
      });
    });
  }

  setupEventListeners() {
    // Save settings
    document.getElementById('save-settings').addEventListener('click', () => this.saveSettings());
    
    // Reset settings
    document.getElementById('reset-settings').addEventListener('click', () => this.resetSettings());
    
    // Test API
    document.getElementById('test-api').addEventListener('click', () => this.testApiConnection());
    
    // Range slider for summary length
    document.getElementById('default-summary-length').addEventListener('input', (e) => {
      const values = ['Short', 'Medium', 'Long'];
      document.getElementById('length-display').textContent = values[e.target.value - 1];
    });

    // Dark mode toggle
    document.getElementById('dark-mode').addEventListener('change', (e) => {
      document.body.classList.toggle('dark-mode', e.target.checked);
    });
  }

  updateUI() {
    // Populate form fields
    document.getElementById('gemini-api-key').value = this.settings.geminiApiKey;
    document.getElementById('font-size').value = this.settings.fontSize;
    document.getElementById('font-family').value = this.settings.fontFamily;
    document.getElementById('dark-mode').checked = this.settings.darkMode;
    document.getElementById('default-summary-length').value = this.settings.summaryLength;
    document.getElementById('default-rephrase-style').value = this.settings.rephraseStyle;
    document.getElementById('auto-summarize').checked = this.settings.autoSummarize;
    document.getElementById('enable-grammar-check').checked = this.settings.enableGrammarCheck;
    document.getElementById('enable-voice-read').checked = this.settings.enableVoiceRead;
    document.getElementById('enable-keyword-highlight').checked = this.settings.enableKeywordHighlight;
    document.getElementById('enable-topic-classification').checked = this.settings.enableTopicClassification;

    // Update range display
    const values = ['Short', 'Medium', 'Long'];
    document.getElementById('length-display').textContent = values[this.settings.summaryLength - 1];

    // Apply dark mode
    if (this.settings.darkMode) {
      document.body.classList.add('dark-mode');
    }
  }

  async saveSettings() {
    const newSettings = {
      geminiApiKey: document.getElementById('gemini-api-key').value.trim(),
      darkMode: document.getElementById('dark-mode').checked,
      fontSize: document.getElementById('font-size').value,
      fontFamily: document.getElementById('font-family').value,
      autoSummarize: document.getElementById('auto-summarize').checked,
      summaryLength: parseInt(document.getElementById('default-summary-length').value),
      rephraseStyle: document.getElementById('default-rephrase-style').value,
      enableGrammarCheck: document.getElementById('enable-grammar-check').checked,
      enableVoiceRead: document.getElementById('enable-voice-read').checked,
      enableKeywordHighlight: document.getElementById('enable-keyword-highlight').checked,
      enableTopicClassification: document.getElementById('enable-topic-classification').checked
    };

    try {
      await chrome.storage.sync.set(newSettings);
      this.settings = newSettings;
      this.showMessage('Settings saved successfully!', 'success');
      
      // Close tab after delay
        setTimeout(() => {
          window.close();
      }, 1500);
    } catch (error) {
      this.showMessage('Failed to save settings. Please try again.', 'error');
    }
  }

  async resetSettings() {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      const defaultSettings = {
        geminiApiKey: '',
        darkMode: false,
        fontSize: '13px',
        fontFamily: 'Segoe UI',
        autoSummarize: false,
        summaryLength: 2,
        rephraseStyle: 'original',
        enableGrammarCheck: true,
        enableVoiceRead: true,
        enableKeywordHighlight: true,
        enableTopicClassification: true
      };

      try {
        await chrome.storage.sync.set(defaultSettings);
        this.settings = defaultSettings;
        this.updateUI();
        this.showMessage('Settings reset to defaults!', 'success');
      } catch (error) {
        this.showMessage('Failed to reset settings. Please try again.', 'error');
      }
    }
  }

  async testApiConnection() {
    const apiKey = document.getElementById('gemini-api-key').value.trim();
    
    if (!apiKey) {
      this.showMessage('Please enter your Gemini API key first.', 'error');
      return;
    }

    this.showMessage('Testing API connection...', 'success');

    try {
      // Discover model dynamically to future-proof
      const listUrl = (typeof CONFIG !== 'undefined' && CONFIG.GEMINI_MODELS_LIST_URL)
        ? CONFIG.GEMINI_MODELS_LIST_URL
        : 'https://generativelanguage.googleapis.com/v1/models';
      const resList = await fetch(`${listUrl}?key=${apiKey}`);
      if (!resList.ok) throw new Error('Failed to list models');
      const listData = await resList.json();
      const models = Array.isArray(listData.models) ? listData.models.map(m => m.name) : [];
      const preferences = (typeof CONFIG !== 'undefined' && Array.isArray(CONFIG.GEMINI_MODEL_PREFERENCE))
        ? CONFIG.GEMINI_MODEL_PREFERENCE
        : ['models/gemini-1.5-flash','models/gemini-1.5-pro','models/gemini-1.0-pro','models/gemini-pro'];
      const chosen = preferences.find(pref => models.includes(pref) || models.some(m => m.startsWith(pref)))
        || models.find(m => /gemini/i.test(m))
        || 'models/gemini-pro';

      const base = 'https://generativelanguage.googleapis.com/v1';
      const endpoint = `${base}/${chosen}:generateContent`;
      const response = await fetch(
        `${endpoint}?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Test connection' }] }],
            generationConfig: { temperature: 0.1 }
          })
        }
      );

      if (response.ok) {
        this.showMessage('✅ API connection successful! Your key is working properly.', 'success');
      } else {
        const errorData = await response.json();
        this.showMessage(`❌ API connection failed: ${errorData.error?.message || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      this.showMessage('❌ API connection failed: Network error. Please check your internet connection.', 'error');
    }
  }

  showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';

    setTimeout(() => {
      messageDiv.style.display = 'none';
    }, 5000);
  }
}

// Initialize options manager
document.addEventListener('DOMContentLoaded', () => {
  new OptionsManager();
});