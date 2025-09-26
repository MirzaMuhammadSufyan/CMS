// CMS Magic Background Script - Full Functionality Restored
console.log('CMS Magic: Background script loaded');

chrome.runtime.onInstalled.addListener((details) => {
    console.log('CMS Magic extension installed');
    
    if (details.reason === 'install') {
        // Set default settings
        chrome.storage.sync.set({
            autoRefreshInterval: 30,
            darkModePreference: 'auto'
        });
        
        // Open welcome page
        chrome.tabs.create({
            url: chrome.runtime.getURL('welcome.html')
        });
    }
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case 'getPageInfo':
            handleGetPageInfo(sender, sendResponse);
            break;
        case 'toggleDarkMode':
            handleToggleDarkMode(sender, sendResponse);
            break;
        case 'selectOfficer':
            handleSelectOfficer(sender, sendResponse, request);
            break;
        case 'selectApplicant':
            handleSelectApplicant(sender, sendResponse, request);
            break;
        case 'autoFillCurrent':
            handleAutoFillCurrent(sender, sendResponse);
            break;
        case 'openAllPending':
            handleOpenAllPending(sender, sendResponse);
            break;
        case 'toggleOpenAllEtagsButton':
            handleToggleOpenAllEtagsButton(sender, sendResponse, request);
            break;
        default:
            sendResponse({ success: false, message: 'Unknown action' });
    }
    
    return true; // Keep message channel open for async response
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

        // Try to get notification count from the page
        try {
            const result = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => {
                    const notificationCount = document.querySelector('#notificationCount');
                    return notificationCount ? parseInt(notificationCount.textContent) || 0 : 0;
                }
            });
            pageInfo.notificationCount = result[0].result;
        } catch (error) {
            console.log('Could not get notification count:', error);
        }

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
                // This will be handled by the content script
                window.postMessage({ type: 'CMS_MAGIC_TOGGLE_DARK_MODE' }, '*');
            }
        });

        sendResponse({ success: true, message: 'Dark mode toggled' });
    } catch (error) {
        sendResponse({ success: false, message: error.message });
    }
}

// Handle select officer
async function handleSelectOfficer(sender, sendResponse, request) {
    try {
        const tab = sender.tab;
        
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: (officer) => {
                // This will be handled by the content script
                window.postMessage({ 
                    type: 'CMS_MAGIC_SELECT_OFFICER', 
                    officer: officer 
                }, '*');
            },
            args: [request.officer]
        });

        sendResponse({ success: true, message: 'Officer selection sent to content script' });
    } catch (error) {
        sendResponse({ success: false, message: error.message });
    }
}

// Handle select applicant
async function handleSelectApplicant(sender, sendResponse, request) {
    try {
        const tab = sender.tab;
        
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: (applicant) => {
                // This will be handled by the content script
                window.postMessage({ 
                    type: 'CMS_MAGIC_SELECT_APPLICANT', 
                    applicant: applicant 
                }, '*');
            },
            args: [request.applicant]
        });

        sendResponse({ success: true, message: 'Applicant selection sent to content script' });
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
                // This will be handled by the content script
                window.postMessage({ 
                    type: 'CMS_MAGIC_AUTO_FILL_CURRENT' 
                }, '*');
            }
        });

        sendResponse({ success: true, message: 'Auto-fill command sent to content script' });
    } catch (error) {
        sendResponse({ success: false, message: error.message });
    }
}

// Handle open all pending tags
async function handleOpenAllPending(sender, sendResponse) {
    try {
        const tab = sender.tab;
        
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                // This will be handled by the content script
                window.postMessage({ 
                    type: 'CMS_MAGIC_OPEN_ALL_PENDING' 
                }, '*');
            }
        });

        sendResponse({ success: true, message: 'Open all pending command sent to content script' });
    } catch (error) {
        sendResponse({ success: false, message: error.message });
    }
}

// Handle toggle open all etags button
async function handleToggleOpenAllEtagsButton(sender, sendResponse, request) {
    try {
        const tab = sender.tab;
        
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: (enabled) => {
                // This will be handled by the content script
                window.postMessage({ 
                    type: 'CMS_MAGIC_TOGGLE_OPEN_ALL_ETAGS_BUTTON',
                    enabled: enabled
                }, '*');
            },
            args: [request.enabled]
        });

        sendResponse({ success: true, message: 'Toggle open all etags button command sent to content script' });
    } catch (error) {
        sendResponse({ success: false, message: error.message });
    }
}

// Handle tab updates to inject content script if needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes('cms.punjabpolice.gov.pk')) {
        // Ensure content script is injected
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
        }).catch(error => {
            console.log('Content script already injected or error:', error);
        });
    }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
    if (tab.url && tab.url.includes('cms.punjabpolice.gov.pk')) {
        // Open popup (this is handled by the manifest action)
        return;
    } else {
        // If not on CMS page, show message
        chrome.tabs.create({
            url: 'https://cms.punjabpolice.gov.pk/'
        });
    }
});