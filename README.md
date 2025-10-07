Gemini Code Helper: Your On-Device AI Coding Assistant

Gemini Code Helper is a high-impact, privacy-first Chrome Extension designed to be a developer's integrated coding assistant. Its core purpose is to leverage Chrome's built-in AI (Gemini Nano) to provide instant, contextual code intelligence directly within the browser. This eliminates the need to copy and paste code into external chat windows, creating a seamless, secure, and efficient workflow.

✨ Core Features

The extension is built around three powerful, high-value features accessible via a simple right-click.

1. Explain Code

Instantly provides a clear, concise, natural-language breakdown of any highlighted code snippet.
Demonstrates the core text-in/text-out power of the Prompt API.

2. Convert to JavaScript

Translates highlighted code from another language (e.g., Python, C#) into a functional JavaScript equivalent.

Showcases the generative and cross-language capabilities of the AI.

3. Suggest Optimization/Refactor

Analyzes selected code and outputs an improved, optimized solution for better performance or readability, presenting it in a clear "Original vs. Optimized" view.
A high-effort feature demonstrating complex AI reasoning over code structure, using a JSON schema for robust, structured output.

🚀 Live Demo
Here's a quick look at the Gemini Code Helper in action:

🛠️ Technology Stack
This project utilizes a minimal, client-side stack optimized for speed, security, and the challenge's focus on on-device processing.


Frontend (UI/Aesthetics)

HTML5 & Tailwind CSS

Defines the Side Panel structure (sidepanel.html) and ensures a clean, modern, and responsive user interface with rich animations and transitions.


Marked.js

A JavaScript library used for cleanly rendering the AI's complex Markdown output, including formatted text and code blocks.

Backend / Logic (Processing)

Chrome Built-in AI (Gemini Nano)

The on-device AI engine powering all features via the chrome.ai API. This ensures zero cloud cost and maximum data privacy (the main USP).


Vanilla JavaScript (ES6+)

Handles all extension logic: Service Worker control, prompt engineering, streaming AI output, and the JSON Schema logic for the refactor feature.

Chrome Extension APIs (Manifest V3)

chrome.contextMenus for the right-click trigger, chrome.sidePanel to manage the UI display, and chrome.storage.session for high-speed, in-memory data transfer.

🔒 A Privacy-First Approach

The core principle of the Gemini Code Helper is privacy. By using the chrome.ai API to run the Gemini Nano model directly on the user's device, we guarantee that:

1.Your code never leaves your machine.
2.There are no server-side logs or data collection.
3.The extension works completely offline once the model is downloaded.

This on-device architecture makes it a trusted tool for developers working with proprietary or sensitive code.

📂 Project Structure
The project maintains a simple and scalable structure for easy development and maintenance.

gemini-code-helper/
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── background.js       # Service worker for context menus & AI logic
├── manifest.json       # The core extension configuration file
├── sidepanel.html      # The HTML structure for the UI panel
├── sidepanel.js        # The JavaScript logic for the UI panel
└── README.md           # Project documentation (this file)

⚙️ Installation & Setup

To run the extension locally for development:

1.Download the Project: Get a local copy of all the project files.
2.Open Chrome Extensions: Navigate to chrome://extensions in your Chrome browser.
3.Enable Developer Mode: Click the toggle switch in the top-right corner to enable "Developer mode".
4.Load Unpacked: Click the "Load unpacked" button that appears on the top-left.
5.Select the Project Folder: In the file dialog, select the entire gemini-code-helper directory.
6.The extension icon should now appear in your Chrome toolbar, and it is ready for use.

📖 How to Use
Navigate to any webpage that contains a code snippet (e.g., GitHub, Stack Overflow, a blog post).

1.Highlight the code you want to analyze.
2.Right-click on the highlighted code.
3.In the context menu, navigate to "Gemini Code Helper" and select an option:
4.Explain Code
5.Convert to JavaScript
6.Suggest Optimization/Refactor
7.The extension's side panel will automatically open with the beautifully formatted, AI-generated response.