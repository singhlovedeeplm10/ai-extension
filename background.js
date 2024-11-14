chrome.runtime.onInstalled.addListener(() => {
    console.log("Background service worker");
});

if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
    chrome.sidePanel
        .setPanelBehavior({ openPanelOnActionClick: true })
        .catch((error) => console.error("Side Panel Error:", error));
} else {
    console.warn("chrome.sidePanel API is not available");
}