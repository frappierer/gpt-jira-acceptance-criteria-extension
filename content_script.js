chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === "get-text") {
    var userContentBlock = document.querySelector(".user-content-block");
    if (userContentBlock) {
      sendResponse({ success: true, text: userContentBlock.innerText });
    } else {
      sendResponse({ success: false });
    }
  }
});