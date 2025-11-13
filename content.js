// Enhanced content script for AI Article Summarizer Pro
// Supports text extraction, highlighting, and synonym detection

class ContentScript {
  constructor() {
    this.originalText = '';
    this.highlightedElements = [];
    this.setupMessageListener();
  }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      switch (request.type) {
        case 'GET_ARTICLE_TEXT':
          this.extractArticleText(sendResponse);
          break;
        case 'HIGHLIGHT_ORIGINAL_TEXT':
          this.highlightOriginalText(request.summary);
          sendResponse({ success: true });
          break;
        case 'CLEAR_HIGHLIGHTS':
          this.clearHighlights();
          sendResponse({ success: true });
          break;
        default:
          sendResponse({ error: 'Unknown message type' });
      }
      return true; // Keep message channel open for async response
    });
  }

  extractArticleText(sendResponse) {
    const text = this.getArticleText();
    this.originalText = text;
    sendResponse({ text });
  }

  getArticleText() {
    // Try multiple selectors to find article content
    const selectors = [
      'article',
      '[role="main"]',
      'main',
      '.post-content',
      '.article-content',
      '.entry-content',
      '.content',
      '.post-body',
      '.article-body'
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element && this.isValidContent(element)) {
        return this.cleanText(element.innerText);
      }
    }

    // Fallback: get all paragraphs
    const paragraphs = Array.from(document.querySelectorAll('p'));
    const text = paragraphs
      .filter(p => this.isValidParagraph(p))
      .map(p => p.innerText)
      .join('\n');

    return this.cleanText(text);
  }

  isValidContent(element) {
    const text = element.innerText;
    return text.length > 200 && text.split(' ').length > 50;
  }

  isValidParagraph(paragraph) {
    const text = paragraph.innerText;
    return text.length > 20 && 
           !text.includes('cookie') && 
           !text.includes('privacy') &&
           !text.includes('subscribe') &&
           !text.includes('newsletter');
  }

  cleanText(text) {
    return text
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .trim();
  }

  highlightOriginalText(summary) {
    this.clearHighlights();
    
    // Extract key sentences from summary
    const summarySentences = this.extractKeySentences(summary);
    
    // Find and highlight matching sentences in the original text
    summarySentences.forEach(sentence => {
      this.highlightMatchingText(sentence);
    });
  }

  extractKeySentences(summary) {
    // Remove bullet points and clean up
    const cleanSummary = summary
      .replace(/^[-•]\s*/gm, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1');

    // Split into sentences
    const sentences = cleanSummary
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 20);

    return sentences.slice(0, 5); // Limit to 5 key sentences
  }

  highlightMatchingText(targetSentence) {
    const words = targetSentence.toLowerCase().split(/\s+/);
    const minWords = Math.max(3, Math.floor(words.length * 0.6)); // At least 60% word match

    // Search through all text nodes
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const text = node.textContent.trim();
          return text.length > 20 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      }
    );

    let node;
    while (node = walker.nextNode()) {
      const text = node.textContent;
      const nodeWords = text.toLowerCase().split(/\s+/);
      
      // Check for word overlap
      const matchingWords = words.filter(word => 
        nodeWords.some(nodeWord => 
          nodeWord.includes(word) || word.includes(nodeWord)
        )
      );

      if (matchingWords.length >= minWords) {
        this.highlightTextNode(node, text);
        break; // Only highlight the first good match
      }
    }
  }

  highlightTextNode(textNode, text) {
    const parent = textNode.parentNode;
    if (!parent || parent.classList.contains('ai-highlight')) return;

    const highlightSpan = document.createElement('span');
    highlightSpan.className = 'ai-highlight';
    highlightSpan.style.cssText = `
      background-color: #fff3cd;
      border: 2px solid #ffc107;
      border-radius: 3px;
      padding: 2px 4px;
      margin: 1px;
      position: relative;
      cursor: help;
    `;

    // Add tooltip
    highlightSpan.title = 'Highlighted by AI Article Summarizer Pro';
    
    // Add hover effect
    highlightSpan.addEventListener('mouseenter', () => {
      highlightSpan.style.backgroundColor = '#ffeaa7';
    });
    
    highlightSpan.addEventListener('mouseleave', () => {
      highlightSpan.style.backgroundColor = '#fff3cd';
    });

    parent.replaceChild(highlightSpan, textNode);
    highlightSpan.appendChild(textNode);
    
    this.highlightedElements.push(highlightSpan);
  }

  clearHighlights() {
    this.highlightedElements.forEach(element => {
      const parent = element.parentNode;
      if (parent) {
        parent.replaceChild(element.firstChild, element);
        parent.normalize();
      }
    });
    this.highlightedElements = [];
  }
}

// Initialize content script
const contentScript = new ContentScript();