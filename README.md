6# AI Article Summarizer Pro (Free Edition)

A comprehensive Chrome extension that provides advanced AI-powered article summarization with extensive text enhancement tools, export options, and smart features. Built with Manifest V3 and designed for productivity and accessibility.

## ✨ Features

### Core Functionality
- **AI-Powered Summarization**: Generate summaries using Google Gemini API (free tier)
- **Multiple Summary Formats**: Brief, Detailed, and Bullet Points
- **Smart Text Extraction**: Automatically extracts article content from web pages
- **Copy to Clipboard**: One-click copying of summaries

### Text & Language Tools
- **Rephrase Summary**: Change style to Formal, Casual, or Simplified
- **Grammar Check**: Basic grammar correction using LanguageTool API (free tier)
- **Keyword Highlighting**: Automatically bold important terms and phrases

### Content Enhancement
- **Reading Time Estimator**: Display estimated reading time for both original and summary
- **Summary Length Slider**: Adjust summary length (Short, Medium, Long)
- **Summary History**: Store last 10 summaries locally with timestamps
- **One-Click Share**: Share to Twitter, LinkedIn, and WhatsApp Web

### Export Options
- **Multiple Formats**: Export as PDF, TXT, Markdown, and DOCX
- **Local Libraries**: Uses bundled libraries (no CDN dependencies)
- **Offline Mode**: Export previously generated summaries when offline

### Personalization & UI
- **Dark Mode**: Toggle between light and dark themes
- **Font Controls**: Adjust font size and family
- **Original Text Highlighting**: Highlight sentences used in summary on the webpage
- **Responsive Design**: Modern, user-friendly interface

### Smart Features
- **Topic Classification**: Automatically detect article topics (Tech, Politics, Health, etc.)
- **Voice Read-Aloud**: Read summaries using Web Speech API
- **Basic Plagiarism Check**: Search text chunks on Google (opens in new tab)
- **Auto-Summarize**: Option to automatically summarize on page load

## 🚀 Installation

### Method 1: Load as Unpacked Extension (Development)

1. **Download the Extension**
   ```bash
   git clone <repository-url>
   cd AI_Article_Summarizer
   ```

2. **Open Chrome Extensions Page**
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)

3. **Load the Extension**
   - Click "Load unpacked"
   - Select the extension folder
   - The extension should now appear in your extensions list

4. **Pin the Extension**
   - Click the puzzle piece icon in Chrome toolbar
   - Pin "AI Article Summarizer Pro" for easy access

## ⚙️ Setup & Configuration

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure the Extension

1. **Open Extension Settings**
   - Click the extension icon in your toolbar
   - Click the "Settings" button (⚙️)

2. **Enter API Key**
   - Paste your Gemini API key in the "API Configuration" section
   - Click "Test API Connection" to verify

3. **Customize Settings**
   - Adjust display preferences (font size, dark mode)
   - Set default summary length and style
   - Enable/disable advanced features
   - Configure auto-summarize behavior

4. **Save Settings**
   - Click "Save Settings" to apply changes

## 📖 Usage Guide

### Basic Summarization

1. **Navigate to an Article**
   - Open any article or blog post in your browser

2. **Open the Extension**
   - Click the extension icon in your toolbar

3. **Generate Summary**
   - Select summary format (Brief, Detailed, Bullet Points)
   - Adjust summary length if needed
   - Click "Summarize" button

4. **Use the Summary**
   - Copy to clipboard
   - Export in various formats
   - Share on social media

### Advanced Features

#### Text Enhancement
- **Rephrase**: Click "Rephrase" to change the writing style
- **Grammar Check**: Click "Grammar" to check and correct grammar
- **Keyword Highlight**: Click "Keywords" to highlight important terms
- **Voice Read**: Click "Read Aloud" to hear the summary

#### Export & Share
- **Export**: Use PDF, TXT, MD, or DOCX buttons to download
- **Share**: Use Twitter, LinkedIn, or WhatsApp buttons to share
- **History**: Click "View History" to access previous summaries

#### Original Text Highlighting
- After generating a summary, click "Highlight" in the result header
- The extension will highlight matching sentences on the original webpage

## 🔧 Technical Details

### Architecture
- **Manifest V3**: Latest Chrome extension standard
- **Modular JavaScript**: Separate files for popup, content, background, and options
- **Local Libraries**: Bundled jsPDF and docx libraries (no CDN dependencies)
- **Chrome Storage**: Uses `chrome.storage.sync` for settings and `chrome.storage.local` for history

### API Usage
- **Google Gemini API**: Free tier includes 15 requests/minute, 1M tokens/day
- **LanguageTool API**: Free tier for grammar checking
- **Web Speech API**: Built-in browser API for text-to-speech

### File Structure
```
AI_Article_Summarizer/
├── manifest.json          # Extension configuration
├── popup.html             # Main extension interface
├── popup.js               # Popup functionality
├── content.js             # Content script for text extraction
├── background.js          # Background service worker
├── options.html           # Settings page
├── options.js             # Settings functionality
├── libs/
│   └── export-utils.js    # Export functionality
├── icon.png               # Extension icon
└── README.md              # This file
```

## 🔒 Privacy & Security

### Data Handling
- **No Data Collection**: Extension doesn't collect personal information
- **Local Storage**: All data stored locally in your browser
- **API Keys**: Stored securely in Chrome's sync storage
- **No Tracking**: No analytics or tracking scripts

### Permissions
- **activeTab**: Access current tab for text extraction
- **storage**: Save settings and history
- **scripting**: Inject content scripts
- **tabs**: Handle tab updates for auto-summarize

## 🐛 Troubleshooting

### Common Issues

#### "API key not found" Error
- **Solution**: Go to extension settings and enter your Gemini API key
- **Verification**: Use "Test API Connection" button

#### "Could not extract article text" Error
- **Solution**: Try refreshing the page and clicking summarize again
- **Alternative**: The page might not contain readable article content

#### Grammar Check Not Working
- **Solution**: Check your internet connection
- **Alternative**: LanguageTool API might be temporarily unavailable

#### Voice Read-Aloud Not Working
- **Solution**: Ensure your browser supports Web Speech API
- **Alternative**: Try a different browser or check browser permissions

## 📝 API Limits & Costs

### Google Gemini API (Free Tier)
- **Rate Limit**: 15 requests per minute
- **Token Limit**: 1 million tokens per day
- **Cost**: Free for the specified limits

### LanguageTool API (Free Tier)
- **Rate Limit**: 20 requests per minute
- **Character Limit**: 20,000 characters per request
- **Cost**: Free for basic usage

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Development Guidelines
- Follow existing code style
- Add comments for complex functionality
- Test on multiple websites
- Ensure Manifest V3 compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini API** for AI summarization capabilities
- **LanguageTool** for grammar checking services
- **Chrome Extensions Team** for the excellent platform
- **Open Source Community** for inspiration and tools

---

**AI Article Summarizer Pro (Free Edition)** - Making information consumption faster and more efficient with the power of AI.

<h2>📬 Contact</h2>
<hr>
<p>
  <a href="https://www.linkedin.com/in/mayurgarjeofficial" target="_blank">
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" style="width: 10%;" alt="LinkedIn">
  </a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://github.com/GARJE-01" target="_blank">
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" style="width: 10%;" alt="GitHub">
  </a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://www.facebook.com/gaming.mayur.5" target="_blank">
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg" style="width: 10%;" alt="Facebook">
  </a>
</p>
