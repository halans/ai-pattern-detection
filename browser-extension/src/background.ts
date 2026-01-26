chrome.runtime.onInstalled.addListener(async () => {
  try {
    await chrome.sidePanel.setOptions({ path: 'sidepanel.html', enabled: true });
  } catch (error) {
    console.error('Failed to configure side panel on install', error);
  }
});

const ensureSidePanel = async (tabId: number) => {
  try {
    await chrome.sidePanel.setOptions({ tabId, path: 'sidepanel.html' });
    await chrome.sidePanel.open({ tabId });
  } catch (error) {
    console.error('Failed to open side panel', error);
  }
};

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id !== undefined) {
    await ensureSidePanel(tab.id);
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
