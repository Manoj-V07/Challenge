# Architecture

## Overview
MV3 Chrome extension with a service worker, a side panel UI, and context menus. Messages flow from the background to the panel to trigger AI tasks.

## Components
- `src/background.js`: Registers context menus and routes clicks to the side panel.
- `src/sidepanel.html`: UI entry with tabs, controls, and Prism highlighting.
- `src/sidepanel.js`: Handles messages, AI session lifecycle, OCR, voice, caching, and actions.

## Messaging
- Background opens the side panel and sends messages with types like `EXPLAIN_SELECTION`, `CONVERT_SELECTION`, `REFACTOR_SELECTION`, `ANALYZE_IMAGE`.
- Panel processes and displays outputs using Marked + Prism.

## Privacy & Hybrid
- Default: on-device AI only. Optional hybrid toggle stored in `chrome.storage.local` for future cloud paths.