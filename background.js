// Enhanced background script for AI Article Summarizer Pro
// Handles auto-summarize functionality and extension lifecycle

class BackgroundManager {
  constructor() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Extension installation/update
    chrome.runtime.onInstalled.addListener(() => {
      this.handleInstallation();
    });

    // Tab updates for auto-summarize
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete' && tab.url) {
        this.handleTabUpdate(tab);
      }
    });

    // Message handling
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse);
      return true; // Keep message channel open
    });
  }

  async handleInstallation() {
    // Check if API key exists
    const result = await chrome.storage.sync.get(['geminiApiKey']);
    if (!result.geminiApiKey) {
      // Open options page for first-time setup
      chrome.tabs.create({ url: 'options.html' });
    }

    // Set default settings if not exists
    const defaultSettings = {
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

    const currentSettings = await chrome.storage.sync.get(Object.keys(defaultSettings));
    const settingsToSet = {};

    Object.keys(defaultSettings).forEach(key => {
      if (currentSettings[key] === undefined) {
        settingsToSet[key] = defaultSettings[key];
      }
    });

    if (Object.keys(settingsToSet).length > 0) {
      await chrome.storage.sync.set(settingsToSet);
    }
  }

  async handleTabUpdate(tab) {
    // Check if auto-summarize is enabled
    const settings = await chrome.storage.sync.get(['autoSummarize', 'geminiApiKey']);
    
    if (settings.autoSummarize && settings.geminiApiKey) {
      // Check if this is an article page
      if (this.isArticlePage(tab.url)) {
        // Add a small delay to ensure page is fully loaded
        setTimeout(() => {
          this.triggerAutoSummarize(tab.id);
        }, 2000);
      }
    }
  }

  isArticlePage(url) {
    // Simple heuristics to determine if a page is likely an article
    const articleIndicators = [
      '/article/', '/post/', '/news/', '/blog/', '/story/',
      'medium.com', 'dev.to', 'hackernews', 'reddit.com'
    ];

    return articleIndicators.some(indicator => url.includes(indicator));
  }

  async triggerAutoSummarize(tabId) {
    try {
      // Send message to content script to extract text
      const response = await chrome.tabs.sendMessage(tabId, { type: 'GET_ARTICLE_TEXT' });
      
      if (response && response.text && response.text.length > 200) {
        // Store the extracted text for when user opens popup
        await chrome.storage.local.set({
          [`autoExtractedText_${tabId}`]: {
            text: response.text,
            timestamp: Date.now(),
            url: (await chrome.tabs.get(tabId)).url
          }
        });
      }
    } catch (error) {
      // Content script might not be ready yet, ignore
      console.log('Auto-extract failed:', error.message);
    }
  }

  async handleMessage(request, sender, sendResponse) {
    switch (request.type) {
      case 'GET_AUTO_EXTRACTED_TEXT':
        const tabId = sender.tab?.id;
        if (tabId) {
          const data = await chrome.storage.local.get([`autoExtractedText_${tabId}`]);
          const extractedData = data[`autoExtractedText_${tabId}`];
          
          if (extractedData && (Date.now() - extractedData.timestamp) < 300000) { // 5 minutes
            sendResponse({ text: extractedData.text, url: extractedData.url });
          } else {
            sendResponse({ text: null });
          }
        } else {
          sendResponse({ text: null });
        }
        break;

      case 'CLEAR_AUTO_EXTRACTED_TEXT':
        const clearTabId = sender.tab?.id;
        if (clearTabId) {
          await chrome.storage.local.remove([`autoExtractedText_${clearTabId}`]);
          sendResponse({ success: true });
        } else {
          sendResponse({ success: false });
        }
        break;

      default:
        sendResponse({ error: 'Unknown message type' });
    }
  }
}

// Initialize background manager
new BackgroundManager();