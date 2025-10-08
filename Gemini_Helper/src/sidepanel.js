// Placeholder side panel script
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btn-test');
  const input = document.getElementById('input-test');
  btn?.addEventListener('click', () => {
    const val = input?.value?.trim() || '(empty)';
    console.log('[SidePanel] Test clicked with:', val);
    alert(`SidePanel placeholder: ${val}`);
  });
});