# Demo Instructions

This guide helps you run a live demo of the side panel UI and context menu flows.

## Local Preview (UI only)
- Serve the folder: `python -m http.server 8000` from `gemini-code-helper/`.
- Open `http://localhost:8000/src/sidepanel.html` to preview the UI.
- Note: Standalone preview guards are in place; Chrome APIs are inactive outside extension context.

## Extension Demo
1. Open Chrome → More Tools → Extensions → enable Developer mode.
2. Click "Load unpacked" and select the `gemini-code-helper` folder.
3. Visit any webpage with code, highlight text, right-click → "Gemini Code Helper" → choose an action.
4. The side panel opens and displays AI output.

## Image Analysis
- Right-click an image and select "Analyze Code Screenshot" or use the panel OCR button.