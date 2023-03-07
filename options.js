function saveOptions() {
  var apiKeyInput = document.getElementById('api-key');
  var apiKey = apiKeyInput.value;

  chrome.storage.sync.set({
    apiKey: apiKey
  }, function() {
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function restoreOptions() {
  chrome.storage.sync.get({
    apiKey: ''
  }, function(items) {
    var apiKeyInput = document.getElementById('api-key');
    apiKeyInput.value = items.apiKey;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save-button').addEventListener('click', saveOptions);
