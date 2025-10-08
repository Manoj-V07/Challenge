# API Usage

## Chrome Extension APIs
- `contextMenus`: Create actions for selected text and images.
- `sidePanel`: Open a dedicated side panel UI.
- `storage`: Persist settings and cached outputs.
- `scripting` + `activeTab`: Read selections from pages when needed.

## Chrome Built-in AI
- Create a text session with `window.ai.createTextSession({ systemPrompt, temperature })`.
- Send prompts via `session.prompt(promptText)`.
- Templates map to features: summarizer, proofreader, translator, writer, rewriter, convert, refactor.

## OCR
- Dynamically import Tesseract.js: `import('https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js')`.
- Recognize text from `srcUrl`, then pass to AI for summary or analysis.

## Voice
- Use Web Speech API for commands and Speech Synthesis for confirmations.