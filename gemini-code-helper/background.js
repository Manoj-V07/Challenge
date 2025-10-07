// --- Service Worker for Gemini Code Helper (Upgraded with Nested Menu) ---

// 1. Context Menu Creation
chrome.runtime.onInstalled.addListener(() => {
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
});


// 2. Listener for Context Menu Clicks (This part is for Member 1 to complete)
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  // Member 1 will update this logic to handle the new dynamic menu items
  // For example, if info.menuItemId starts with 'convert-to-', they will
  // extract the language and use it in the prompt for the AI.
  
  // Placeholder to show the logic is working
  console.log(`Menu item clicked: ${info.menuItemId}`);
});