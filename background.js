// CMS Magic Background Script - Simple Test Version
console.log('CMS Magic: Background script loaded');

chrome.runtime.onInstalled.addListener((details) => {
    console.log('CMS Magic extension installed');
    
    if (details.reason === 'install') {
        chrome.storage.sync.set({
            autoRefreshInterval: 30,
            darkModePreference: 'auto'
        });
    }
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('CMS Magic: Background received message:', request);
    
    switch (request.action) {
        case 'getPageInfo':
            handleGetPageInfo(sender, sendResponse);
            return true;
        case 'toggleDarkMode':
            handleToggleDarkMode(sender, sendResponse);
            return true;
        case 'autoFillCurrent':
            handleAutoFillCurrent(sender, sendResponse);
            return true;
        default:
            sendResponse({ success: false, message: 'Unknown action' });
    }
});

// Handle getting page information
async function handleGetPageInfo(sender, sendResponse) {
    try {
        const tab = sender.tab;
        const pageInfo = {
            pageTitle: tab.title,
            url: tab.url,
            notificationCount: 0,
            autoRefreshEnabled: false
        };

        sendResponse({ success: true, data: pageInfo });
    } catch (error) {
        sendResponse({ success: false, message: error.message });
    }
}

// Handle toggle dark mode
async function handleToggleDarkMode(sender, sendResponse) {
    try {
        const tab = sender.tab;
        
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                window.postMessage({ type: 'CMS_MAGIC_TOGGLE_DARK_MODE' }, '*');
            }
        });

        sendResponse({ success: true, message: 'Dark mode toggled' });
    } catch (error) {
        sendResponse({ success: false, message: error.message });
    }
}

// Handle auto-fill current form
async function handleAutoFillCurrent(sender, sendResponse) {
    try {
        const tab = sender.tab;
        
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                window.postMessage({ type: 'CMS_MAGIC_AUTO_FILL_CURRENT' }, '*');
            }
        });

        sendResponse({ success: true, message: 'Auto-fill command sent to content script' });
    } catch (error) {
        sendResponse({ success: false, message: error.message });
    }
}

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes('cms.punjabpolice.gov.pk')) {
        console.log('CMS Magic: Page loaded:', tab.url);
    }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
    if (tab.url && tab.url.includes('cms.punjabpolice.gov.pk')) {
        return;
    } else {
        chrome.tabs.create({
            url: 'https://cms.punjabpolice.gov.pk/'
        });
    }
});