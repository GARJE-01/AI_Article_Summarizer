// Configuration file for AI Article Summarizer Pro
// Contains API endpoints, default settings, and feature flags

const CONFIG = {
  // API Configuration
  GEMINI_API_BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
  LANGUAGETOOL_API_URL: 'https://api.languagetool.org/v2/check',
  
  // Default Settings
  DEFAULT_SETTINGS: {
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
  },
  
  // Text Processing
  MAX_TEXT_LENGTH: 20000,
  MIN_TEXT_LENGTH: 200,
  READING_SPEED_WPM: 200,
  
  // History Management
  MAX_HISTORY_ITEMS: 10,
  HISTORY_EXPIRY_MS: 5 * 60 * 1000, // 5 minutes
  
  // UI Configuration
  POPUP_DIMENSIONS: {
    width: 450,
    height: 600
  },
  
  // Feature Flags
  FEATURES: {
    EXPORT_PDF: true,
    EXPORT_DOCX: true,
    EXPORT_TXT: true,
    EXPORT_MARKDOWN: true,
    VOICE_READ: true,
    GRAMMAR_CHECK: true,
    PLAGIARISM_CHECK: true,
    TOPIC_CLASSIFICATION: true,
    AUTO_SUMMARIZE: true,
    DARK_MODE: true,
    FONT_CONTROLS: true,
    SUMMARY_HISTORY: true,
    SOCIAL_SHARING: true
  },
  
  // Topic Classification Keywords
  TOPIC_KEYWORDS: {
    technology: ['tech', 'software', 'ai', 'computer', 'digital', 'internet', 'app', 'code', 'programming', 'development'],
    politics: ['government', 'election', 'policy', 'political', 'democracy', 'vote', 'parliament', 'congress'],
    health: ['health', 'medical', 'doctor', 'medicine', 'treatment', 'disease', 'healthcare', 'hospital', 'patient'],
    business: ['business', 'company', 'market', 'economy', 'finance', 'investment', 'stock', 'corporate', 'revenue'],
    science: ['research', 'study', 'scientific', 'experiment', 'discovery', 'university', 'laboratory', 'hypothesis'],
    sports: ['sport', 'game', 'team', 'player', 'match', 'championship', 'league', 'tournament', 'athlete'],
    entertainment: ['movie', 'music', 'celebrity', 'film', 'show', 'entertainment', 'actor', 'director', 'album']
  },
  
  // Export Configuration
  EXPORT_FORMATS: {
    PDF: { extension: 'pdf', mimeType: 'application/pdf' },
    TXT: { extension: 'txt', mimeType: 'text/plain' },
    MD: { extension: 'md', mimeType: 'text/markdown' },
    DOCX: { extension: 'docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
  },
  
  // Social Media Sharing URLs
  SOCIAL_URLS: {
    twitter: 'https://twitter.com/intent/tweet',
    linkedin: 'https://www.linkedin.com/sharing/share-offsite/',
    whatsapp: 'https://web.whatsapp.com/send'
  },
  
  // Error Messages
  ERROR_MESSAGES: {
    NO_API_KEY: 'API key not found. Please set your Gemini API key in settings.',
    EXTRACTION_FAILED: 'Could not extract article text from this page.',
    API_ERROR: 'Failed to generate summary. Please try again later.',
    GRAMMAR_ERROR: 'Grammar check failed. Please try again.',
    NETWORK_ERROR: 'Network error. Please check your internet connection.',
    NO_HISTORY: 'No summary history found',
    EXPORT_ERROR: 'Failed to export summary. Please try again.',
    VOICE_ERROR: 'Voice read-aloud is not supported in this browser.'
  },
  
  // Success Messages
  SUCCESS_MESSAGES: {
    SETTINGS_SAVED: 'Settings saved successfully!',
    SUMMARY_COPIED: 'Summary copied to clipboard!',
    EXPORT_SUCCESS: 'Summary exported successfully!',
    GRAMMAR_SUCCESS: 'Grammar check complete. No issues found!',
    GRAMMAR_FIXED: 'Grammar check complete. Found and corrected issues.',
    KEYWORDS_HIGHLIGHTED: 'Keywords highlighted successfully!',
    HISTORY_LOADED: 'Summary loaded from history!',
    API_TEST_SUCCESS: 'API connection successful!'
  }
};

// Make CONFIG available globally
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
