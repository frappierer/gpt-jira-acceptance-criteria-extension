document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("get-text-button").addEventListener("click", function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { type: "get-text" }, function(response) {
        if (response && response.success) { // added check for response
          generateTextCases(response.text);
        } else {
          document.getElementById("output-text").value = "No valid Jira ticket found on the page";
        }
      });
    });
  });
});

async function generateTextCases(inputText) {
  // Disable the textarea and show "Waiting for Response..."
document.getElementById("output-text").disabled = true;
document.getElementById("output-text").value = "Waiting for Response. This can take a while...";

  chrome.storage.sync.get({
    apiKey: ''
  }, async function(items) {
    const apiKey = items.apiKey;
    if (!apiKey) {
    document.getElementById("output-text").value = "Please set an API Key in the options. Right click on the Extension Icon. Select Options and set the API Key in the popup.";
    return;
  }
    const jira_prompt = `Write acceptance criteria based on the following Requirements:\n\n ${inputText}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      "model": "gpt-3.5-turbo",
      "messages": [
        { "role": "user", "content": jira_prompt }
      ],
      "temperature": 0.5,
      "max_tokens": 1024
    })
  });

  if (response.ok) {
    const json = await response.json();
    document.getElementById("output-text").value = json.choices[0].message.content;
  } else {
    document.getElementById("output-text").value = "An error occurred while calling the OpenAI API.";
    }
  }); // <-- add closing bracket here
}