// CMS Magic Content Script - Clean Version (No Classes)
console.log('CMS Magic: Content script loaded on:', window.location.href);

// Prevent multiple initializations
if (window.cmsMagicInitialized) {
    console.log('CMS Magic: Already initialized, skipping...');
} else {
    window.cmsMagicInitialized = true;
    
    // Start initialization
    initializeCMSMagic();
}

// Create a visible indicator that the script is running
function createTestIndicator() {
    // Remove any existing indicator
    const existing = document.getElementById('cms-magic-test-indicator');
    if (existing) existing.remove();
    
    // Create new indicator
    const indicator = document.createElement('div');
    indicator.id = 'cms-magic-test-indicator';
    indicator.innerHTML = 'CMS Magic: ACTIVE';
    indicator.style.cssText = `
        position: fixed !important;
        top: 10px !important;
        right: 10px !important;
        background: #28a745 !important;
        color: white !important;
        padding: 10px 15px !important;
        border-radius: 5px !important;
        font-family: Arial, sans-serif !important;
        font-size: 14px !important;
        font-weight: bold !important;
        z-index: 999999 !important;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3) !important;
    `;
    
    document.body.appendChild(indicator);
    console.log('CMS Magic: Test indicator created');
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (indicator.parentNode) {
            indicator.remove();
        }
    }, 5000);
}

// Wait for page to be ready
function waitForPageReady() {
    return new Promise((resolve) => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', resolve);
        } else {
            resolve();
        }
    });
}

// Main initialization
async function initializeCMSMagic() {
    console.log('CMS Magic: Starting initialization...');
    
    // Wait for page to be ready
    await waitForPageReady();
    
    // Wait a bit more for dynamic content
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create test indicator
    createTestIndicator();
    
    // Detect page type
    const url = window.location.href;
    const isEditPage = url.includes('/Complaint/edit?id=');
    
    console.log('CMS Magic: Page type detected -', isEditPage ? 'Edit Page' : 'Other Page');
    
    // Try to find and log form elements
    console.log('CMS Magic: Looking for form elements...');
    
    // Look for all select elements
    const selects = document.querySelectorAll('select');
    console.log('CMS Magic: Found', selects.length, 'select elements');
    
    selects.forEach((select, index) => {
        console.log(`CMS Magic: Select ${index + 1}:`, {
            name: select.name,
            id: select.id,
            className: select.className,
            options: Array.from(select.options).map(opt => ({ text: opt.text, value: opt.value }))
        });
    });
    
    // Look for all input elements
    const inputs = document.querySelectorAll('input');
    console.log('CMS Magic: Found', inputs.length, 'input elements');
    
    // Look for specific fields
    const offenceFields = document.querySelectorAll('select[name*="offence"], select[id*="offence"], select[name*="Offence"], select[id*="Offence"]');
    console.log('CMS Magic: Found', offenceFields.length, 'offence fields');
    
    const sourceFields = document.querySelectorAll('select[name*="source"], select[id*="source"], select[name*="Source"], select[id*="Source"]');
    console.log('CMS Magic: Found', sourceFields.length, 'source fields');
    
    // Apply logic based on page type
    if (isEditPage) {
        console.log('CMS Magic: Applying edit page logic...');
        trySetOffenceToFight();
    } else {
        console.log('CMS Magic: Applying other page logic...');
        trySetSourceToInPerson();
    }
    
    console.log('CMS Magic: Initialization complete');
}

// Try to set offence to fight
function trySetOffenceToFight() {
    console.log('CMS Magic: Attempting to set offence to fight...');
    
    const selectors = [
        'select[name*="offence"]',
        'select[id*="offence"]',
        'select[name*="Offence"]',
        'select[id*="Offense"]',
        'select[name*="OffenseId"]',
        'select[id*="OffenseId"]',
        'select[id*="OffenseList"]',
        'select[name*="OffenseList"]',
        'select[name*="crime"]',
        'select[id*="crime"]'
    ];
    
    for (const selector of selectors) {
        const select = document.querySelector(selector);
        if (select) {
            console.log('CMS Magic: Found offence field with selector:', selector);
            
            const options = Array.from(select.options);
            console.log('CMS Magic: Available options:', options.map(opt => ({ text: opt.text, value: opt.value })));
            
            // For offence field, show first 10 options to see what's available
            if (select.id === 'OffenseList' || select.name === 'OffenseId') {
                console.log('CMS Magic: First 10 offence options:', options.slice(0, 10).map(opt => ({ text: opt.text, value: opt.value })));
            }
            
            // Try multiple variations for "fight"
            const fightOption = options.find(option => {
                const text = option.text.toLowerCase();
                const value = option.value.toLowerCase();
                return text.includes('fight') ||
                       text.includes('fighting') ||
                       text.includes('quarrel') ||
                       text.includes('dispute') ||
                       text.includes('conflict') ||
                       text.includes('altercation') ||
                       value.includes('fight') ||
                       value.includes('fighting') ||
                       value.includes('quarrel') ||
                       value.includes('dispute') ||
                       value.includes('conflict');
            });
            
            if (fightOption) {
                select.value = fightOption.value;
                select.dispatchEvent(new Event('change', { bubbles: true }));
                console.log('CMS Magic: Successfully set offence to fight');
                
                // Show success notification
                showNotification('Offence set to fight!', 'success');
                return;
            } else {
                console.log('CMS Magic: Fight option not found');
            }
        }
    }
    
    console.log('CMS Magic: Could not find or set offence field');
    showNotification('Could not find offence field', 'warning');
    
    // Show all available options for debugging
    const allSelects = document.querySelectorAll('select');
    console.log('CMS Magic: All select elements and their options:');
    allSelects.forEach((select, index) => {
        const options = Array.from(select.options);
        console.log(`Select ${index + 1} (${select.name || select.id || 'unnamed'}):`, options.map(opt => ({ text: opt.text, value: opt.value })));
    });
}

// Try to set source to in person
function trySetSourceToInPerson() {
    console.log('CMS Magic: Attempting to set source to in person...');
    
    const selectors = [
        'select[name*="source"]',
        'select[id*="source"]',
        'select[name*="Source"]',
        'select[id*="Source"]',
        'select[name*="ComplaintSource"]',
        'select[id*="ComplaintSource"]',
        'select[name*="complaint"]',
        'select[id*="complaint"]'
    ];
    
    for (const selector of selectors) {
        const select = document.querySelector(selector);
        if (select) {
            console.log('CMS Magic: Found source field with selector:', selector);
            
            const options = Array.from(select.options);
            console.log('CMS Magic: Available options:', options.map(opt => ({ text: opt.text, value: opt.value })));
            
            // Try multiple variations for "in person"
            const inPersonOption = options.find(option => {
                const text = option.text.toLowerCase();
                const value = option.value.toLowerCase();
                return text.includes('in person') ||
                       text.includes('in-person') ||
                       text.includes('inperson') ||
                       text.includes('personal') ||
                       text.includes('direct') ||
                       text.includes('physical') ||
                       text.includes('face to face') ||
                       text.includes('f2f') ||
                       value.includes('inperson') ||
                       value.includes('personal') ||
                       value.includes('direct') ||
                       value.includes('physical') ||
                       value.includes('f2f');
            });
            
            if (inPersonOption) {
                select.value = inPersonOption.value;
                select.dispatchEvent(new Event('change', { bubbles: true }));
                console.log('CMS Magic: Successfully set source to in person');
                
                // Show success notification
                showNotification('Source set to in person!', 'success');
                return;
            } else {
                console.log('CMS Magic: In person option not found');
            }
        }
    }
    
    console.log('CMS Magic: Could not find or set source field');
    showNotification('Could not find source field', 'warning');
    
    // Show all available options for debugging
    const allSelects = document.querySelectorAll('select');
    console.log('CMS Magic: All select elements and their options:');
    allSelects.forEach((select, index) => {
        const options = Array.from(select.options);
        console.log(`Select ${index + 1} (${select.name || select.id || 'unnamed'}):`, options.map(opt => ({ text: opt.text, value: opt.value })));
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.innerHTML = message;
    notification.style.cssText = `
        position: fixed !important;
        top: 60px !important;
        right: 10px !important;
        background: ${type === 'success' ? '#28a745' : type === 'warning' ? '#ffc107' : '#17a2b8'} !important;
        color: white !important;
        padding: 10px 15px !important;
        border-radius: 5px !important;
        font-family: Arial, sans-serif !important;
        font-size: 14px !important;
        font-weight: bold !important;
        z-index: 999999 !important;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3) !important;
        max-width: 300px !important;
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('CMS Magic: Received message:', request);
    
    switch (request.action) {
        case 'getPageInfo':
            const pageInfo = {
                pageTitle: document.title,
                url: window.location.href,
                notificationCount: 0,
                autoRefreshEnabled: false
            };
            sendResponse({ success: true, data: pageInfo });
            break;
            
        case 'toggleDarkMode':
            document.body.classList.toggle('cms-magic-dark-mode');
            const isDark = document.body.classList.contains('cms-magic-dark-mode');
            console.log('CMS Magic: Dark mode', isDark ? 'enabled' : 'disabled');
            showNotification(`Dark mode ${isDark ? 'enabled' : 'disabled'}`, 'info');
            sendResponse({ success: true });
            break;
            
        case 'autoFillCurrent':
            initializeCMSMagic();
            sendResponse({ success: true });
            break;
            
        default:
            sendResponse({ success: false, message: 'Unknown action' });
    }
    
    return true;
});

// Listen for window messages (from background script)
window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    
    switch (event.data.type) {
        case 'CMS_MAGIC_TOGGLE_DARK_MODE':
            document.body.classList.toggle('cms-magic-dark-mode');
            break;
        case 'CMS_MAGIC_AUTO_FILL_CURRENT':
            initializeCMSMagic();
            break;
    }
});

// Initialization is handled above in the initialization guard