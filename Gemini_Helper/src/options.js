// Placeholder options script
document.addEventListener('DOMContentLoaded', async () => {
  const opt = document.getElementById('opt-cloud');
  const val = (await chrome.storage?.local?.get?.('enableCloud'))?.enableCloud || false;
  opt.checked = !!val;
  opt.addEventListener('change', async () => {
    await chrome.storage?.local?.set?.({ enableCloud: opt.checked });
    console.log('[Options] enableCloud:', opt.checked);
  });
});