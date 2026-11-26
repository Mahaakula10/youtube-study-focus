const focusToggle = document.getElementById("focusToggle");
const statusText = document.getElementById("statusText");
const message = document.getElementById("message");

function updatePopup(enabled) {
  focusToggle.checked = enabled;
  statusText.textContent = enabled ? "Focus mode is ON" : "Focus mode is OFF";
}

// Load the saved setting when the popup opens.
chrome.storage.sync.get({ focusMode: true }, (settings) => {
  if (chrome.runtime.lastError) {
    message.textContent = "Could not load your setting. Try reloading the extension.";
    return;
  }

  updatePopup(settings.focusMode);
});

// Save the new setting. The content script listens for this storage change.
focusToggle.addEventListener("change", () => {
  const enabled = focusToggle.checked;

  chrome.storage.sync.set({ focusMode: enabled }, () => {
    if (chrome.runtime.lastError) {
      message.textContent = "Could not save the setting. Please try again.";
      return;
    }

    message.textContent = "";
    updatePopup(enabled);
  });
});