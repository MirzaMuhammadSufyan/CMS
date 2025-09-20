// CMS Magic Content Script - Simple and Reliable Version
console.log('CMS Magic: Content script loaded');

// Wait for page to be fully loaded
function waitForPageLoad() {
    return new Promise((resolve) => {
        if (document.readyState === 'complete') {
            resolve();
        } else {
            window.addEventListener('load', resolve);
        }
    });
}

// Main function that runs everything
async function initializeCMSMagic() {
    console.log('CMS Magic: Initializing...');
    
    // Wait for page to be fully loaded
    await waitForPageLoad();
    
    // Wait a bit more for dynamic content
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Detect page type
    const url = window.location.href;
    const isEditPage = url.includes('/Complaint/edit?id=');
    
    console.log('CMS Magic: Page type detected -', isEditPage ? 'Edit Page' : 'Other Page');
    console.log('CMS Magic: Current URL:', url);
    
    // Apply the appropriate logic
    if (isEditPage) {
        console.log('CMS Magic: Applying edit page logic...');
        setOffenceToFight();
    } else {
        console.log('CMS Magic: Applying other page logic...');
        setSourceComplaintToInPerson();
    }
    
    console.log('CMS Magic: Initialization complete');
}

// Set offence to "fight" for edit pages
function setOffenceToFight() {
    console.log('CMS Magic: Setting offence to fight...');
    
    // Try multiple selectors for offence field
    const offenceSelectors = [
        'select[name*="offence"]',
        'select[id*="offence"]',
        'select[name*="Offence"]',
        'select[id*="Offence"]',
        'select[name*="crime"]',
        'select[id*="crime"]'
    ];
    
    let offenceSelect = null;
    for (const selector of offenceSelectors) {
        offenceSelect = document.querySelector(selector);
        if (offenceSelect) {
            console.log('CMS Magic: Found offence field with selector:', selector);
            break;
        }
    }
    
    if (offenceSelect) {
        // Look for "fight" option
        const options = Array.from(offenceSelect.options);
        const fightOption = options.find(option => 
            option.text.toLowerCase().includes('fight') ||
            option.value.toLowerCase().includes('fight')
        );
        
        if (fightOption) {
            offenceSelect.value = fightOption.value;
            offenceSelect.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('CMS Magic: Offence set to fight');
            
            // Try to set offence subcategory after a delay
            setTimeout(() => setOffenceSubcategoryToFight(), 1000);
        } else {
            console.log('CMS Magic: Fight option not found in offence dropdown');
            console.log('CMS Magic: Available options:', options.map(opt => opt.text));
        }
    } else {
        console.log('CMS Magic: Offence field not found');
    }
}

// Set offence subcategory to "fight"
function setOffenceSubcategoryToFight() {
    console.log('CMS Magic: Setting offence subcategory to fight...');
    
    const subcategorySelectors = [
        'select[name*="subcategory"]',
        'select[id*="subcategory"]',
        'select[name*="Subcategory"]',
        'select[id*="Subcategory"]',
        'select[name*="sub-category"]',
        'select[id*="sub-category"]'
    ];
    
    let subcategorySelect = null;
    for (const selector of subcategorySelectors) {
        subcategorySelect = document.querySelector(selector);
        if (subcategorySelect) {
            console.log('CMS Magic: Found subcategory field with selector:', selector);
            break;
        }
    }
    
    if (subcategorySelect) {
        const options = Array.from(subcategorySelect.options);
        const fightOption = options.find(option => 
            option.text.toLowerCase().includes('fight') ||
            option.value.toLowerCase().includes('fight')
        );
        
        if (fightOption) {
            subcategorySelect.value = fightOption.value;
            subcategorySelect.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('CMS Magic: Offence subcategory set to fight');
        } else {
            console.log('CMS Magic: Fight option not found in subcategory dropdown');
        }
    } else {
        console.log('CMS Magic: Offence subcategory field not found');
    }
}

// Set source of complaint to "in person" for non-edit pages
function setSourceComplaintToInPerson() {
    console.log('CMS Magic: Setting source of complaint to in person...');
    
    const sourceSelectors = [
        'select[name*="source"]',
        'select[id*="source"]',
        'select[name*="Source"]',
        'select[id*="Source"]',
        'select[name*="complaint"]',
        'select[id*="complaint"]'
    ];
    
    let sourceSelect = null;
    for (const selector of sourceSelectors) {
        sourceSelect = document.querySelector(selector);
        if (sourceSelect) {
            console.log('CMS Magic: Found source field with selector:', selector);
            break;
        }
    }
    
    if (sourceSelect) {
        const options = Array.from(sourceSelect.options);
        const inPersonOption = options.find(option => 
            option.text.toLowerCase().includes('in person') ||
            option.text.toLowerCase().includes('in-person') ||
            option.value.toLowerCase().includes('inperson') ||
            option.text.toLowerCase().includes('personal') ||
            option.value.toLowerCase().includes('personal')
        );
        
        if (inPersonOption) {
            sourceSelect.value = inPersonOption.value;
            sourceSelect.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('CMS Magic: Source of complaint set to in person');
        } else {
            console.log('CMS Magic: In person option not found in source dropdown');
            console.log('CMS Magic: Available options:', options.map(opt => opt.text));
        }
    } else {
        console.log('CMS Magic: Source of complaint field not found');
    }
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
            sendResponse({ success: true });
            break;
            
        case 'selectOfficer':
            if (request.officer) {
                fillOfficerFields(request.officer);
                sendResponse({ success: true });
            }
            break;
            
        case 'selectApplicant':
            if (request.applicant) {
                fillApplicantFields(request.applicant);
                sendResponse({ success: true });
            }
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

// Fill officer fields
function fillOfficerFields(officer) {
    console.log('CMS Magic: Filling officer fields for:', officer.name);
    
    const fields = [
        { label: 'Officer Name', value: officer.name },
        { label: 'Officer Rank', value: officer.rank },
        { label: 'Officer Mobile', value: officer.mobileNumber },
        { label: 'Officer CNIC', value: officer.cnic }
    ];
    
    fields.forEach(field => {
        const element = findFieldByLabel(field.label);
        if (element) {
            element.value = field.value;
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
            console.log(`CMS Magic: Filled ${field.label} with ${field.value}`);
        }
    });
}

// Fill applicant fields
function fillApplicantFields(applicant) {
    console.log('CMS Magic: Filling applicant fields for:', applicant.name);
    
    const fields = [
        { label: 'Applicant Name', value: applicant.name },
        { label: 'Father Name', value: applicant.fatherName },
        { label: 'CNIC', value: applicant.cnic },
        { label: 'Contact Number', value: applicant.contactNumber },
        { label: 'Address', value: applicant.permanentAddress }
    ];
    
    fields.forEach(field => {
        const element = findFieldByLabel(field.label);
        if (element) {
            element.value = field.value;
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
            console.log(`CMS Magic: Filled ${field.label} with ${field.value}`);
        }
    });
}

// Find field by label text
function findFieldByLabel(labelText) {
    // Try to find by label
    const labels = Array.from(document.querySelectorAll('label'));
    const label = labels.find(l => l.textContent.toLowerCase().includes(labelText.toLowerCase()));
    
    if (label) {
        const forAttr = label.getAttribute('for');
        if (forAttr) {
            return document.getElementById(forAttr);
        }
        
        const input = label.querySelector('input, select, textarea');
        if (input) {
            return input;
        }
    }
    
    // Try to find by name or id
    const nameSelectors = [
        `input[name*="${labelText.toLowerCase().replace(/\s+/g, '')}"]`,
        `select[name*="${labelText.toLowerCase().replace(/\s+/g, '')}"]`,
        `textarea[name*="${labelText.toLowerCase().replace(/\s+/g, '')}"]`,
        `input[id*="${labelText.toLowerCase().replace(/\s+/g, '')}"]`,
        `select[id*="${labelText.toLowerCase().replace(/\s+/g, '')}"]`,
        `textarea[id*="${labelText.toLowerCase().replace(/\s+/g, '')}"]`
    ];
    
    for (const selector of nameSelectors) {
        const element = document.querySelector(selector);
        if (element) return element;
    }
    
    return null;
}

// Listen for window messages (from background script)
window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    
    switch (event.data.type) {
        case 'CMS_MAGIC_TOGGLE_DARK_MODE':
            document.body.classList.toggle('cms-magic-dark-mode');
            break;
        case 'CMS_MAGIC_SELECT_OFFICER':
            if (event.data.officer) {
                fillOfficerFields(event.data.officer);
            }
            break;
        case 'CMS_MAGIC_SELECT_APPLICANT':
            if (event.data.applicant) {
                fillApplicantFields(event.data.applicant);
            }
            break;
        case 'CMS_MAGIC_AUTO_FILL_CURRENT':
            initializeCMSMagic();
            break;
    }
});

// Start the initialization
initializeCMSMagic();