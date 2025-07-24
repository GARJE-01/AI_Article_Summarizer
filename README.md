<h1>AI_Article_Summarizer</h1>
<hr><p>📘 Project Details
AI Article Summarizer is a Chrome extension designed to help users quickly understand long articles by generating AI-based summaries using Google Gemini. The extension seamlessly integrates into the browser and allows users to extract readable content from any webpage and summarize it in one of three formats:</p>
<p>1.Brief Summary (2–3 lines)</p>
<p>2.Detailed Summary (paragraph form)</p>
<p>3.Bullet Point Summary (key highlights)</p>
<p>The project combines Chrome Extension APIs, frontend development, and cloud-based AI integration to offer a tool that is simple, responsive, and highly practical for students, professionals, and researchers.</p><h2>General Information</h2>
<hr><ul>
<li>General Info About the Project <br>
AI Article Summarizer is a Chrome extension that uses Google Gemini AI to automatically summarize articles from any webpage. Users can choose from brief, detailed, or bullet-point summaries — all within a simple, user-friendly popup.</li>
</ul>
<p>This project was developed using Manifest V3, JavaScript, Chrome Extension APIs, and Gemini's RESTful AI service.</p><ul>
<li>What Problem Does It Solve? <br>
With the increasing amount of content on the internet, reading full-length articles can be time-consuming — especially for busy users, students, and researchers.</li>
</ul>
<p>This extension solves that problem by:</p>
<ol>
<li>
<p>Quickly extracting the core ideas from articles</p>
</li>
<li>
<p>Presenting the content in a summarized form</p>
</li>
<li>
<p>Saving users time without losing key insights</p>
</li>
</ol>
<p>It’s like having an AI-powered reader assistant built right into your browser.</p><ul>
<li>Purpose of the Project
The main goal of this project is to:</li>
</ul>
<ol>
<li>
<p>Help users digest long-form content quickly and effectively</p>
</li>
<li>
<p>Practice real-world integration of AI APIs in a browser-based tool</p>
</li>
<li>
<p>Learn and apply Chrome extension development skills</p>
</li>
<li>
<p>Explore frontend/backend interaction, API handling, and secure storage</p>
</li>
</ol>
<p>It also serves as a portfolio-ready demonstration of your ability to build and deploy a fully functional Chrome extension using modern web technologies.</p><h2>Technologies Used</h2>
<hr><ul>
<li>HTML</li>
</ul><ul>
<li>CSS</li>
</ul><ul>
<li>JavaScript</li>
</ul><ul>
<li>React</li>
</ul><h2>Features</h2>
<hr><ul>
<li>Brief Summary – Quickly understand the article in just 2–3 sentences</li>
</ul><ul>
<li>Detailed Summary – Get a full explanation with deeper insights</li>
</ul><ul>
<li>Bullet Points – View 5–7 clear, concise highlights of the article</li>
</ul><ul>
<li>Copy to Clipboard – Easily copy the generated summary with one click</li>
</ul><ul>
<li>Gemini API Integration – Uses Google’s powerful AI to generate smart, context-aware summaries</li>
</ul><ul>
<li>Secure API Key Storage – API keys are saved using Chrome’s secure storage, not exposed in the code</li>
</ul><ul>
<li>User-Friendly Interface – Clean and responsive popup for quick interaction</li>
</ul><ul>
<li>Automatic Article Detection – Automatically extracts readable content using content scripts</li>
</ul><h2>Setup</h2>
<hr><p>⚙️ Setup Info <br>
🔹 What Are the Project Requirements/Dependencies?
This project is a Chrome Extension, so it doesn’t require installing any external dependencies or package managers like npm. All the functionality is built using:</p>
<p>HTML/CSS/JavaScript</p>
<p>Chrome Extension APIs (Manifest V3)</p>
<p>Google Gemini AI API (requires a valid API key)</p>
<p>The only external requirement is a Gemini API key, which can be generated for free from Google AI Studio.</p>
<p>🔹 Where Are They Listed?
Since this is a front-end Chrome extension:</p>
<p>There is no package.json file (unlike Node.js projects)</p>
<p>All files and logic are listed in the manifest.json file:</p>
<p>Permissions</p>
<p>Scripts (popup, content, background)</p>
<p>Options page</p>
<p>Host permissions (&lt;all_urls&gt;)</p>
<p>The user’s API key is entered manually in the options.html page and stored using the chrome.storage.sync API.</p><h5>Steps</h5><ul>
<li>
  <h1>Setup and Usage Instructions</h1>

  <p><strong>Step 1:</strong> Clone or Download the Repository</p>
  <p>You can either clone the repo using Git or download it as a ZIP and extract it.</p>
  <pre><code>git clone https://github.com/garje-01/AI_Article_Summarizer.git
cd AI_Article_Summarizer</code></pre>

  <p><strong>Step 2:</strong> Open Chrome Extensions Page</p>
  <ul>
    <li>Open Google Chrome.</li>
    <li>Go to <code>chrome://extensions/</code> in the address bar.</li>
    <li>Enable Developer mode by toggling the switch in the top-right corner.</li>
  </ul>

  <p><strong>Step 3:</strong> Load the Unpacked Extension</p>
  <ul>
    <li>Click on the <strong>Load unpacked</strong> button.</li>
    <li>Select the folder where you cloned or extracted the repository (<code>AI_Article_Summarizer</code>).</li>
  </ul>

  <p><strong>Step 4:</strong> Configure Your Gemini API Key</p>
  <ul>
    <li>Click the extension icon in the Chrome toolbar.</li>
    <li>Open the <strong>Options page</strong> (from the popup or right-click menu).</li>
    <li>Enter your <strong>Gemini API key</strong>. (You can obtain this from
      <a href="https://makersuite.google.com/app/apikey" target="_blank">Google AI Studio</a>)
    </li>
    <li>Click <strong>Save Settings</strong> to store your key securely.</li>
  </ul>

  <p><strong>Step 5:</strong> Use the Extension to Summarize Articles</p>
  <ul>
    <li>Navigate to any article page you want to summarize.</li>
    <li>Click the extension icon to open the popup.</li>
    <li>Choose one of the summary options:
      <ul>
        <li>Brief Summary</li>
        <li>Detailed Summary</li>
        <li>Bullet Point Summary</li>
      </ul>
    </li>
    <li>The AI-generated summary will appear in the popup for you to read or copy.</li>
  </ul>
</li>

</ul><h2>Usage</h2>
<hr><p>🔹 Step-by-Step Usage: <br>
<strong>1. Navigate to an Article Page</strong> <br>
Open any webpage that contains a readable article (e.g., a blog post, news site, or documentation page).</p>
<p><strong>2.Click the Extension Icon</strong> <br>
Click the AI Article Summarizer icon in your Chrome toolbar to open the popup interface.</p>
<p><strong>3.Choose a Summary Type</strong> <br>
In the popup, select one of the following options from the dropdown:</p>
<p>• Brief – A short 2–3 sentence summary</p>
<p>• Detailed – A comprehensive explanation</p>
<p>• Bullet Points – Key points extracted from the content</p>
<p><strong>4.Click “Summarize This Page”</strong> <br>
The extension will:</p>
<p>• Extract the article content from the page</p>
<p>• Send it to Gemini AI along with a custom prompt</p>
<p>• Display the summary inside the popup</p>
<p><strong>5.Copy the Summary (Optional)</strong> <br>
Click “Copy Summary” to copy the AI response to your clipboard for use elsewhere.</p><h2>Project Status</h2>
<hr><p>Status: ✅ Completed, with future enhancements planned</p>
<p>The core functionality of the AI Article Summarizer Chrome extension is fully implemented and working as intended:</p>
<p>• It can extract article content from any webpage</p>
<p>• Uses Google Gemini AI to generate summaries in three formats</p>
<p>• Includes a clean popup UI and secure API key storage</p>
<p>At this point, the extension is stable and usable. However, I plan to continue improving it by adding features such as:</p>
<p>• Custom prompt creation</p>
<p>• Summary download/export</p>
<p>• Better article detection using semantic analysis</p>
<p>This project is also being used to showcase my skills in Chrome Extension development, API integration, and frontend design.</p><h2>Improvements</h2>
<hr><ul>
<li>Allow users to write and save their own prompts for more personalized summaries. This will give users more control over how content is summarized (e.g., summaries for children, SEO, technical, etc.).</li>
</ul><ul>
<li>Add a button to download summaries as .txt or .md files, making it easier for users to save and organize summaries for offline reading or future reference.</li>
</ul><ul>
<li>Add support for toggling between dark and light modes to improve accessibility and match the user’s browser preferences.</li>
</ul><h2>Features that can be added</h2>
<hr><ul>
<li><strong>Feature to be added 1:</strong>  Custom Prompt Input
Allow users to define their own custom prompt for Gemini (e.g., “Summarize for a 10-year-old” or “Extract only pros and cons”). This gives more flexibility for various use cases like education, research, or SEO.</li>
</ul><ul>
<li><strong>Feature to be added 2:</strong> History of Summaries
Add a section (maybe on a new page or popup tab) where users can see a history of their previously generated summaries — useful for research, revisiting articles, or offline review.</li>
</ul><ul>
<li><strong>Feature to be added 3:</strong> Export Summary as File
Let users download the summary as a .txt, .pdf, or .md file with one click. This is helpful for saving notes or sharing summaries with others.</li>
</ul><h2>Contact</h2>
<hr><p><span style="margin-right: 30px;"></span><a href="https://www.linkedin.com/in/mayurgarjeofficial"><img target="_blank" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" style="width: 10%;"></a><span style="margin-right: 30px;"></span><a href="https://github.com/GARJE-01"><img target="_blank" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" style="width: 10%;"></a></p>
