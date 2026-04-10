chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId !== 0) return;

  chrome.storage.local.get(["enabled", "sites", "blockedCount"], (data) => {
    const enabled = data.enabled;
    const sites = data.sites || [];
    let count = data.blockedCount || 0;

    if (!enabled) return;

    const url = details.url;

    const isBlocked = sites.some(site => url.includes(site));

    if (isBlocked) {
      count++;
      chrome.storage.local.set({ blockedCount: count });

      const domain = new URL(url).hostname;

      chrome.tabs.update(details.tabId, {
        url: chrome.runtime.getURL(`blocked.html?site=${domain}`)
      });
    }
  });
});