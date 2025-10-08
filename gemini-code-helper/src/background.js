// --- Service Worker for Gemini Code Helper (Upgraded with Nested Menu) ---

// 1. Context Menu Creation
chrome.runtime.onInstalled.addListener(async () => {
  try {
    // Ensure the side panel is enabled and opens on action click (if used)
    if (chrome.sidePanel?.setPanelBehavior) {
      await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
    }
    if (chrome.sidePanel?.setOptions) {
      // Globally enable the side panel and ensure default path
      await chrome.sidePanel.setOptions({ enabled: true, path: 'src/sidepanel.html' });
    }
  } catch (e) {
    console.warn('Side panel setup warning:', e);
  }
  // --- Main Parent Menu ---
  chrome.contextMenus.create({
    id: 'gemini-code-helper',
    title: 'Gemini Code Helper',
    contexts: ['selection']
  });

  // --- Child Menu Items ---
  chrome.contextMenus.create({
    id: 'explain-code',
    title: 'Explain Code',
    parentId: 'gemini-code-helper',
    contexts: ['selection']
  });

  // --- NEW: Parent Menu for Language Conversion ---
  chrome.contextMenus.create({
    id: 'convert-parent',
    title: 'Convert Code To...',
    parentId: 'gemini-code-helper',
    contexts: ['selection']
  });

  // --- NEW: Language Options (Children of the new parent) ---
  const languages = ['JavaScript', 'Python', 'Java', 'C#', 'C++', 'Go', 'Rust', 'TypeScript'];
  languages.forEach(lang => {
    chrome.contextMenus.create({
      id: `convert-to-${lang.toLowerCase().replace('#', 'sharp')}`, // Sanitize ID
      title: lang,
      parentId: 'convert-parent',
      contexts: ['selection']
    });
  });
  
  chrome.contextMenus.create({
    id: 'refactor-code',
    title: 'Suggest Optimization/Refactor',
    parentId: 'gemini-code-helper',
    contexts: ['selection']
  });

  // NEW: Analyze image (for screenshots of code or diagrams)
  chrome.contextMenus.create({
    id: 'analyze-image',
    title: 'Analyze Code Screenshot',
    contexts: ['image']
  });
});


// 2. Listener for Context Menu Clicks (This part is for Member 1 to complete)
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  try {
    if (!tab?.id) return;
    const tabId = tab.id;

    // Ensure side panel opens for this tab
    try {
      if (chrome.sidePanel?.setOptions) {
        await chrome.sidePanel.setOptions({ tabId, enabled: true, path: 'src/sidepanel.html' });
      }
      if (chrome.sidePanel?.open) {
        await chrome.sidePanel.open({ tabId });
      }
    } catch (e) {
      console.warn('Side panel open warning:', e);
    }

    // Route based on menu id
    if (info.menuItemId === 'explain-code') {
      chrome.runtime.sendMessage({
        type: 'EXPLAIN_SELECTION',
        tabId,
        text: info.selectionText || ''
      });
    } else if (String(info.menuItemId).startsWith('convert-to-')) {
      const lang = String(info.menuItemId).replace('convert-to-', '').replace('sharp', '#');
      chrome.runtime.sendMessage({
        type: 'CONVERT_SELECTION',
        tabId,
        text: info.selectionText || '',
        lang
      });
    } else if (info.menuItemId === 'refactor-code') {
      chrome.runtime.sendMessage({
        type: 'REFACTOR_SELECTION',
        tabId,
        text: info.selectionText || ''
      });
    } else if (info.menuItemId === 'analyze-image') {
      chrome.runtime.sendMessage({
        type: 'ANALYZE_IMAGE',
        tabId,
        srcUrl: info.srcUrl
      });
    }
  } catch (e) {
    console.error('Context menu routing error', e);
  }
});