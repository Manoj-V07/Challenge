// Placeholder background service worker (MV3)
chrome.runtime.onInstalled.addListener(() => {
  console.log('[Background] Installed Gemini Helper placeholder');

  chrome.contextMenus.create({
    id: 'gemini-helper',
    title: 'Gemini Helper',
    contexts: ['selection']
  });
  chrome.contextMenus.create({
    id: 'gh-explain',
    parentId: 'gemini-helper',
    title: 'Explain Selection',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'gh-explain') {
    const text = info.selectionText || '';
    console.log('[Background] Explain selection:', text);
    try {
      if (chrome.sidePanel?.setOptions) {
        await chrome.sidePanel.setOptions({ tabId: tab.id, enabled: true, path: 'src/sidepanel.html' });
      }
      if (chrome.sidePanel?.open) {
        await chrome.sidePanel.open({ tabId: tab.id });
      }
    } catch (e) {
      console.warn('[Background] Side panel open warning:', e);
    }
    chrome.runtime.sendMessage({ type: 'EXPLAIN_SELECTION', tabId: tab.id, text });
  }
});