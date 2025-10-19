chrome.runtime.onInstalled.addListener(async () => {
  try {
    await chrome.sidePanel.setOptions({ path: 'sidepanel.html', enabled: true });

    // Enable automatic side panel opening when the toolbar icon is clicked (Chrome 116+).
    if (typeof chrome.sidePanel.setPanelBehavior === 'function') {
      await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
    } else {
      console.warn('chrome.sidePanel.setPanelBehavior is unavailable; requires Chrome 116 or later.');
    }
  } catch (error) {
    console.error('Failed to configure side panel behavior on install', error);
  }
});

const configureSidePanelForTab = async (tabId: number) => {
  await chrome.sidePanel.setOptions({ tabId, path: 'sidepanel.html', enabled: true });

  if (typeof chrome.sidePanel.setPanelBehavior !== 'function') {
    await chrome.sidePanel.open({ tabId });
  }
};

const hasTabAccess = async (tabId: number): Promise<boolean> => {
  try {
    const [result] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => true,
    });

    return Boolean(result?.result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    // Ignore expected restricted contexts (e.g., chrome://, Chrome Web Store).
    if (
      message.includes('Cannot access contents of the page') ||
      message.includes('is a Chrome URL') ||
      message.includes('the same origin as the context script')
    ) {
      return false;
    }

    console.warn('Unable to verify tab access', error);
    return false;
  }
};

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id === undefined) {
    return;
  }

  try {
    // Ensure the side panel is configured for the clicked tab so the extension
    // receives the temporary activeTab permission for content capture.
    await configureSidePanelForTab(tab.id);

    const hasAccess = await hasTabAccess(tab.id);
    if (!hasAccess) {
      await chrome.sidePanel.open({ tabId: tab.id });
    }
  } catch (error) {
    console.error('Failed to prepare side panel for tab', error);
  }
});

const collectContent = () => {
  const sanitize = (value: string): string => value.replace(/\s+/g, ' ').trim();

  const selection = window.getSelection()?.toString() ?? '';
  const selectionText = sanitize(selection);

  let pageText = '';
  if (document?.body) {
    const clone = document.body.cloneNode(true) as HTMLElement;
    const elementsToRemove = clone.querySelectorAll('script, style, noscript');
    elementsToRemove.forEach((el) => el.remove());
    pageText = sanitize(clone.innerText || '');
  }

  return {
    selectionText,
    pageText,
    selectionLength: selectionText.length,
    pageLength: pageText.length,
  };
};

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === 'REQUEST_CAPTURE') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (!activeTab?.id) {
        sendResponse({ error: 'NO_ACTIVE_TAB' });
        return;
      }

      // const url = activeTab.url ?? '';
      // if (!url.startsWith('http')) {
      //   sendResponse({ error: 'UNSUPPORTED_URL' });
      //   return;
      // }

      chrome.scripting
        .executeScript({
          target: { tabId: activeTab.id },
          func: collectContent,
        })
        .then((results) => {
          const [first] = results;
          if (!first?.result) {
            sendResponse({ error: 'NO_RESPONSE' });
            return;
          }
          sendResponse({ data: first.result });
        })
        .catch((error) => {
          sendResponse({ error: error.message });
        });
    });
    return true;
  }
  return false;
});
