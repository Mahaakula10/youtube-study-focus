(() => {
  const STYLE_ID = "youtube-study-focus-style";
  const DEFAULT_SETTINGS = { focusMode: true };

  let focusMode = DEFAULT_SETTINGS.focusMode;
  let observer = null;

  // These CSS rules hide distracting sections without removing the video player.
  const FOCUS_CSS = `
    /* Comments below the video */
    ytd-comments,

    /* Recommended videos beside the currently playing video */
    #related,

    /* Shorts shelves and Shorts-specific sections */
    ytd-reel-shelf-renderer,
    ytd-rich-shelf-renderer[is-shorts],

    /* Shorts links in navigation and video grids */
    a[href^="/shorts/"] {
      display: none !important;
    }

    /* Remove the recommended video grid from YouTube's landing page only */
    ytd-browse[page-subtype="home"] ytd-rich-grid-renderer {
      display: none !important;
    }
  `;

  function applyFocusMode() {
    let style = document.getElementById(STYLE_ID);

    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      (document.head || document.documentElement).appendChild(style);
    }

    style.textContent = focusMode ? FOCUS_CSS : "";
  }

  function startObserver() {
    if (observer || !document.documentElement) return;

    // YouTube is a dynamic single-page app. This observer restores our style
    // if the page replaces the document head or removes the style element.
    observer = new MutationObserver(() => {
      if (!document.getElementById(STYLE_ID)) {
        applyFocusMode();
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  // Read the user's saved setting when the YouTube page loads.
  chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
    if (chrome.runtime.lastError) {
      console.error("YouTube Study Focus:", chrome.runtime.lastError.message);
      return;
    }

    focusMode = settings.focusMode;
    applyFocusMode();
    startObserver();
  });

  // Update the page immediately when the user changes the popup toggle.
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "sync" && changes.focusMode) {
      focusMode = changes.focusMode.newValue;
      applyFocusMode();
    }
  });
})();