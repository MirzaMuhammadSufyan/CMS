// CMS Magic Content Script - Full Functionality Restored
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
    // Check if we should exclude functionality on this page
    const url = window.location.href;
    const excludedUrls = [
        'https://cms.punjabpolice.gov.pk/complaint-listings',
        'https://cms.punjabpolice.gov.pk/Account/Login?ReturnUrl=%2Fcomplaint-listings'
    ];
    
    // Check for FileComplaint pages with id and record parameters
    const isFileComplaintPageExclusion = url.includes('/Complaint/FileComplaint?id=') && url.includes('&record=');
    
    // Check if current URL matches any excluded URL
    const isExcluded = excludedUrls.some(excludedUrl => {
        return url === excludedUrl || url.startsWith(excludedUrl);
    }) || isFileComplaintPageExclusion;
    
    if (isExcluded) {
        console.log('CMS Magic: Test indicator excluded for this page:', url);
        return; // Exit early, no indicator will be shown
    }
    
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
    
    // Check if we should exclude functionality on this page
    const url = window.location.href;
    const excludedUrls = [
        'https://cms.punjabpolice.gov.pk/complaint-listings',
        'https://cms.punjabpolice.gov.pk/Account/Login?ReturnUrl=%2Fcomplaint-listings'
    ];
    
    // Check for FileComplaint pages with id and record parameters
    const isFileComplaintPageExclusion = url.includes('/Complaint/FileComplaint?id=') && url.includes('&record=');
    
    // Check if current URL matches any excluded URL
    const isExcluded = excludedUrls.some(excludedUrl => {
        return url === excludedUrl || url.startsWith(excludedUrl);
    }) || isFileComplaintPageExclusion;
    
    if (isExcluded) {
        console.log('CMS Magic: Page is excluded from functionality:', url);
        return; // Exit early, no functions will be applied
    }
    
    // Wait for page to be ready
    await waitForPageReady();
    
    // Wait a bit more for dynamic content
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create test indicator
    createTestIndicator();
    
    // Detect page type
    const is15EditPage = url.includes('/Complaint/edit?id='); // Capital C - 15 edit page
    const isOrdinaryEditPage = url.includes('/complaint/edit/'); // Lowercase c - ordinary edit page
    const isFileComplaintPageType = url.includes('/Complaint/FileComplaint?id=') && url.includes('&record='); // FileComplaint page
    const isAddNewComplaintPage = url.includes('/add-new-complaint'); // Add new complaint page
    const isEditPage = is15EditPage || isOrdinaryEditPage;
    
    console.log('CMS Magic: Page type detected -', 
        is15EditPage ? '15 Edit Page (Complaint/edit?id=)' : 
        isOrdinaryEditPage ? 'Ordinary Edit Page (complaint/edit/)' : 
        isFileComplaintPageType ? 'FileComplaint Page (excluded)' :
        isAddNewComplaintPage ? 'Add New Complaint Page' :
        'Other Page');
    
    // Apply logic based on page type
    if (is15EditPage) {
        console.log('CMS Magic: Applying 15 edit page logic (auto-fill enabled)...');
        setOffenceToFight();
        copyAddressToPlaceOfOccurrence();
    } else if (isOrdinaryEditPage) {
        console.log('CMS Magic: Applying ordinary edit page logic (auto-fill disabled)...');
        // Don't auto-fill on ordinary edit pages
    } else if (isFileComplaintPageType) {
        console.log('CMS Magic: FileComplaint page detected - no functionality applied');
        // No functionality for FileComplaint pages
    } else if (isAddNewComplaintPage) {
        console.log('CMS Magic: Applying add-new-complaint page logic...');
        // Remove any existing CMS Magic dropdowns and add our officer dropdown
        removeAllExistingDropdowns();
        // Apply specific auto-fill for add-new-complaint page
        setSourceComplaintToInPerson();
    } else {
        console.log('CMS Magic: Applying other page logic...');
        setSourceComplaintToInPerson();
    }
    
    // Apply common auto-fill logic based on page type
    if (is15EditPage) {
        // Apply all auto-fill logic for 15 edit pages (except officer dropdowns)
        applyCommonAutoFillFor15EditPage();
        // Add single officer dropdown specifically for 15 edit pages
        addOfficerDropdownsFor15EditPage();
    } else if (isOrdinaryEditPage) {
        // Don't apply auto-fill for ordinary edit pages, but add officer dropdown
        console.log('CMS Magic: Skipping auto-fill for ordinary edit page');
        // Add officer dropdown for ordinary edit pages (same as 15 edit pages)
        addOfficerDropdownsFor15EditPage();
    } else if (isFileComplaintPageType) {
        // Don't apply auto-fill for FileComplaint pages
        console.log('CMS Magic: Skipping auto-fill for FileComplaint page');
    } else if (isAddNewComplaintPage) {
        // Apply specific auto-fill for add-new-complaint pages
        console.log('CMS Magic: Applying auto-fill for add-new-complaint page');
        // Add applicant dropdown and officer dropdown for add-new-complaint pages
        addApplicantDropdownForAddNewComplaint();
        addOfficerDropdownsFor15EditPage();
    } else {
        // Apply auto-fill for other pages (like Pucar15)
        applyCommonAutoFill();
    }
    
    // Check if Open All Etags button should be shown
    checkOpenAllEtagsSetting();
    
    console.log('CMS Magic: Initialization complete');
}

// Remove all existing CMS Magic dropdowns from the page
function removeAllExistingDropdowns() {
    console.log('CMS Magic: Removing existing CMS Magic dropdowns...');
    
    // Remove only CMS Magic dropdowns (our own dropdowns)
    const cmsMagicDropdowns = document.querySelectorAll('.cms-magic-officer-dropdown');
    cmsMagicDropdowns.forEach(dropdown => {
        console.log('CMS Magic: Removing CMS Magic dropdown:', dropdown.id || 'unnamed');
        dropdown.remove();
    });
    
    console.log(`CMS Magic: Removed ${cmsMagicDropdowns.length} existing CMS Magic dropdowns`);
    if (cmsMagicDropdowns.length > 0) {
        showNotification(`Removed ${cmsMagicDropdowns.length} existing CMS Magic dropdowns`, 'info');
    }
}

// Add applicant dropdown for add-new-complaint page
function addApplicantDropdownForAddNewComplaint() {
    console.log('CMS Magic: Adding applicant dropdown for add-new-complaint page...');
    
    // Load applicants from storage
    chrome.storage.local.get(['applicants'], (result) => {
        const applicants = result.applicants || [];
        if (applicants.length === 0) {
            console.log('CMS Magic: No applicants found in storage');
            return;
        }
        
        // Remove any existing applicant dropdowns first
        const existingDropdowns = document.querySelectorAll('.cms-magic-applicant-dropdown');
        existingDropdowns.forEach(dropdown => dropdown.remove());
        
        // Create the dropdown
        const dropdown = document.createElement('select');
        dropdown.id = 'cms-magic-applicant-dropdown';
        dropdown.className = 'form-control cms-magic-applicant-dropdown';
        dropdown.innerHTML = '<option value="">Select Applicant (Name, Father, CNIC & Contact)</option>';
        
        // Add applicants to dropdown
        applicants.forEach(applicant => {
            const option = document.createElement('option');
            option.value = JSON.stringify(applicant);
            option.textContent = `${applicant.name} - ${applicant.fatherName} - ${applicant.cnic}`;
            dropdown.appendChild(option);
        });
        
        // Add change event listener
        dropdown.addEventListener('change', (e) => {
            if (e.target.value) {
                const applicant = JSON.parse(e.target.value);
                fillApplicantFieldsForAddNewComplaint(applicant);
            }
        });
        
        // Style the dropdown
        dropdown.style.cssText = `
            margin: 0 !important;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            color: white !important;
            border: none !important;
            border-radius: 4px !important;
            padding: 8px 12px !important;
            font-weight: bold !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
            font-size: 14px !important;
            width: 100% !important;
            height: 34px !important;
            line-height: 1.42857143 !important;
            cursor: pointer !important;
            display: block !important;
        `;
        
        // Add hover effect
        dropdown.addEventListener('mouseenter', () => {
            dropdown.style.transform = 'translateY(-1px)';
            dropdown.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
        });
        
        dropdown.addEventListener('mouseleave', () => {
            dropdown.style.transform = 'translateY(0)';
            dropdown.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        });
        
        // Position the dropdown in the CNIC row after the scan button
        const scanButton = document.querySelector('#barcodeBtn');
        if (scanButton) {
            // Find the CNIC row
            const cnicRow = scanButton.closest('.row');
            if (cnicRow) {
                // Create a new column for the dropdown
                const newColumn = document.createElement('div');
                newColumn.className = 'col-lg-3 col-md-3 col-sm-3';
                newColumn.style.marginTop = '10px'; // Add some space
                
                // Add a label for the dropdown
                const label = document.createElement('div');
                label.textContent = 'Quick Select';
                label.style.cssText = `
                    color: #666 !important;
                    font-size: 12px !important;
                    margin-bottom: 5px !important;
                    font-weight: bold !important;
                `;
                
                newColumn.appendChild(label);
                newColumn.appendChild(dropdown);
                cnicRow.appendChild(newColumn);
                
                console.log('CMS Magic: Applicant dropdown added to CNIC row');
            } else {
                // Fallback: insert after scan button
                scanButton.parentNode.insertBefore(dropdown, scanButton.nextSibling);
                console.log('CMS Magic: Applicant dropdown added after scan button');
            }
        } else {
            console.log('CMS Magic: Scan button not found, cannot position applicant dropdown');
        }
    });
}

// Fill applicant fields for add-new-complaint page
function fillApplicantFieldsForAddNewComplaint(applicant) {
    console.log('CMS Magic: Filling applicant fields for add-new-complaint page:', applicant.name);
    
    // Add a small delay to ensure fields are loaded
    setTimeout(() => {
        // Fill CNIC
        const cnicField = document.querySelector('#Person_CNIC');
        if (cnicField) {
            cnicField.value = applicant.cnic;
            cnicField.dispatchEvent(new Event('input', { bubbles: true }));
            cnicField.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('CMS Magic: Filled CNIC:', applicant.cnic);
        }
        
        // Fill Name
        const nameField = document.querySelector('#PersonName');
        if (nameField) {
            nameField.value = applicant.name;
            nameField.dispatchEvent(new Event('input', { bubbles: true }));
            nameField.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('CMS Magic: Filled Name:', applicant.name);
        }
        
        // Fill Father Name
        const fatherNameField = document.querySelector('#FatherName');
        if (fatherNameField) {
            fatherNameField.value = applicant.fatherName;
            fatherNameField.dispatchEvent(new Event('input', { bubbles: true }));
            fatherNameField.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('CMS Magic: Filled Father Name:', applicant.fatherName);
        }
        
        // Fill Contact Number
        const contactField = document.querySelector('#PersonContact');
        if (contactField) {
            contactField.value = applicant.contactNumber;
            contactField.dispatchEvent(new Event('input', { bubbles: true }));
            contactField.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('CMS Magic: Filled Contact Number:', applicant.contactNumber);
        }
        
        // Fill Permanent Address
        const addressField = document.querySelector('#Person_Address');
        if (addressField) {
            addressField.value = applicant.permanentAddress;
            addressField.dispatchEvent(new Event('input', { bubbles: true }));
            addressField.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('CMS Magic: Filled Permanent Address:', applicant.permanentAddress);
        }
        
        showNotification(`Applicant ${applicant.name} selected and fields filled!`, 'success');
    }, 100);
}

// Add officer dropdowns specifically for 15 edit pages
function addOfficerDropdownsFor15EditPage() {
    console.log('CMS Magic: Adding officer dropdowns for 15 edit page...');
    
    chrome.storage.local.get(['officers'], (result) => {
        const officers = result.officers || [];
        if (officers.length === 0) {
            console.log('CMS Magic: No officers found in storage');
            return;
        }
        
        // Add single dropdown for all officer fields
        addSingleOfficerDropdown(officers);
    });
}

// Add single dropdown for all officer fields
function addSingleOfficerDropdown(officers) {
    console.log('CMS Magic: Adding single officer dropdown...');
    
    // Remove any existing officer dropdowns first
    const existingDropdowns = document.querySelectorAll('.cms-magic-officer-dropdown');
    existingDropdowns.forEach(dropdown => dropdown.remove());
    
    // Look for the search button to position the dropdown near it
    let searchButton = document.querySelector('#officerSearchCnicBtn');
    let targetContainer = null;
    
    // If search button not found, look for other positioning options
    if (!searchButton) {
        console.log('CMS Magic: Search button not found, looking for alternative positioning...');
        
        // Try to find officer-related fields to position near them
        const officerCnicField = document.querySelector('#OfficerCnic');
        if (officerCnicField) {
            targetContainer = officerCnicField.closest('div.row') || officerCnicField.parentElement;
            console.log('CMS Magic: Found officer CNIC field for positioning');
        } else {
            // Look for any form container
            const formContainer = document.querySelector('form') || document.querySelector('.panel-body') || document.body;
            targetContainer = formContainer;
            console.log('CMS Magic: Using form container for positioning');
        }
    } else {
        targetContainer = searchButton.parentElement;
    }
    
    if (!targetContainer) {
        console.log('CMS Magic: No suitable container found for dropdown');
        return;
    }
    
    // Create the dropdown
    const dropdown = document.createElement('select');
    dropdown.id = 'cms-magic-single-officer-dropdown';
    dropdown.className = 'form-control cms-magic-officer-dropdown';
    dropdown.innerHTML = '<option value="">Select Officer (Name, Contact & CNIC)</option>';
    
    officers.forEach(officer => {
        const option = document.createElement('option');
        option.value = JSON.stringify(officer);
        option.textContent = `${officer.name} (${officer.rank}) - ${officer.mobileNumber}`;
        dropdown.appendChild(option);
    });
    
    dropdown.addEventListener('change', (e) => {
        if (e.target.value) {
            const officer = JSON.parse(e.target.value);
            fillAllOfficerFields(officer);
        }
    });
    
    dropdown.style.cssText = `
        margin: 0 !important;
        background: #ffffff !important;
        color: #333333 !important;
        border: 1px solid #ccc !important;
        border-radius: 4px !important;
        padding: 8px 12px !important;
        font-size: 14px !important;
        font-weight: normal !important;
        font-family: inherit !important;
        box-shadow: inset 0 1px 1px rgba(0,0,0,0.075) !important;
        width: 100% !important;
        height: 34px !important;
        line-height: 1.42857143 !important;
        transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s !important;
        cursor: pointer !important;
        display: block !important;
    `;
    
    // Add hover effect
    dropdown.addEventListener('mouseenter', () => {
        dropdown.style.borderColor = '#66afe9';
        dropdown.style.boxShadow = 'inset 0 1px 1px rgba(0,0,0,0.075), 0 0 8px rgba(102,175,233,0.6)';
    });
    
    dropdown.addEventListener('mouseleave', () => {
        dropdown.style.borderColor = '#ccc';
        dropdown.style.boxShadow = 'inset 0 1px 1px rgba(0,0,0,0.075)';
    });
    
    // Add focus effect
    dropdown.addEventListener('focus', () => {
        dropdown.style.borderColor = '#66afe9';
        dropdown.style.outline = 'none';
        dropdown.style.boxShadow = 'inset 0 1px 1px rgba(0,0,0,0.075), 0 0 8px rgba(102,175,233,0.6)';
    });
    
    dropdown.addEventListener('blur', () => {
        dropdown.style.borderColor = '#ccc';
        dropdown.style.boxShadow = 'inset 0 1px 1px rgba(0,0,0,0.075)';
    });
    
    // Position the dropdown in the target container
    if (searchButton) {
        // If we have a search button, position near it (original logic)
        const cnicInput = document.querySelector('#OfficerCnic');
        if (cnicInput) {
            // Find the parent row
            const cnicRow = cnicInput.closest('div.row');
            if (cnicRow) {
                // Find the third column in that row
                const columns = cnicRow.querySelectorAll('div.col-lg-3');
                if (columns.length >= 3) {
                    const thirdColumn = columns[2]; // Third column (index 2)
                    // Clear the third column and add our dropdown + search button
                    thirdColumn.innerHTML = '';
                    thirdColumn.appendChild(dropdown);
                    thirdColumn.appendChild(searchButton);
                    console.log('CMS Magic: Dropdown and search button positioned in Search by CNIC row');
                } else {
                    // Fallback: insert before search button
                    searchButton.parentNode.insertBefore(dropdown, searchButton);
                }
            } else {
                // Fallback: insert before search button
                searchButton.parentNode.insertBefore(dropdown, searchButton);
            }
        } else {
            // Fallback: insert before search button
            searchButton.parentNode.insertBefore(dropdown, searchButton);
        }
    } else {
        // No search button, position in the target container
        const officerCnicField = document.querySelector('#OfficerCnic');
        if (officerCnicField) {
            // Try to find a good position near the officer CNIC field
            const cnicRow = officerCnicField.closest('div.row');
            if (cnicRow) {
                // Find the next column or add a new one
                const columns = cnicRow.querySelectorAll('div.col-lg-3, div.col-md-3, div.col-sm-3');
                if (columns.length >= 2) {
                    // Use the next available column
                    const nextColumn = columns[columns.length - 1];
                    nextColumn.appendChild(dropdown);
                    console.log('CMS Magic: Dropdown positioned in next column near officer CNIC field');
                } else {
                    // Add a new column
                    const newColumn = document.createElement('div');
                    newColumn.className = 'col-lg-3 col-md-3 col-sm-3';
                    newColumn.appendChild(dropdown);
                    cnicRow.appendChild(newColumn);
                    console.log('CMS Magic: Dropdown positioned in new column near officer CNIC field');
                }
            } else {
                // Fallback: insert after the CNIC field
                officerCnicField.parentNode.insertBefore(dropdown, officerCnicField.nextSibling);
                console.log('CMS Magic: Dropdown positioned after officer CNIC field');
            }
        } else {
            // No officer fields found, add to the top of the target container
            targetContainer.insertBefore(dropdown, targetContainer.firstChild);
            console.log('CMS Magic: Dropdown positioned at top of target container');
        }
    }
    console.log('CMS Magic: Single officer dropdown added');
}

// Fill all officer fields and trigger search
function fillAllOfficerFields(officer) {
    console.log('CMS Magic: Filling all officer fields for:', officer.name);
    
    // Add a small delay to ensure fields are loaded
    setTimeout(() => {
        // Fill Officer Name - using exact field name from HTML
        const officerNameField = document.querySelector('#RelevantPoliceOfficer');
        if (officerNameField) {
            officerNameField.value = officer.name;
            officerNameField.dispatchEvent(new Event('input', { bubbles: true }));
            officerNameField.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('CMS Magic: Filled Officer Name:', officer.name);
        } else {
            console.log('CMS Magic: Officer Name field (#RelevantPoliceOfficer) not found');
        }
        
        // Fill Officer Contact - using exact field name from HTML
        const officerContactField = document.querySelector('#OfficerMobileNo');
        if (officerContactField) {
            officerContactField.value = officer.mobileNumber;
            officerContactField.dispatchEvent(new Event('input', { bubbles: true }));
            officerContactField.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('CMS Magic: Filled Officer Contact:', officer.mobileNumber);
        } else {
            console.log('CMS Magic: Officer Contact field (#OfficerMobileNo) not found');
        }
        
        // Fill CNIC - using exact field name from HTML
        const officerCNICField = document.querySelector('#OfficerCnic');
        if (officerCNICField) {
            const formattedCNIC = formatCNIC(officer.cnic);
            officerCNICField.value = formattedCNIC;
            officerCNICField.dispatchEvent(new Event('input', { bubbles: true }));
            officerCNICField.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('CMS Magic: Filled Officer CNIC:', formattedCNIC);
        } else {
            console.log('CMS Magic: Officer CNIC field (#OfficerCnic) not found');
        }
        
        // Wait a moment then click the search button
        setTimeout(() => {
            const searchButton = document.querySelector('#officerSearchCnicBtn');
            if (searchButton) {
                searchButton.click();
                console.log('CMS Magic: Clicked search button');
                showNotification(`Officer ${officer.name} selected and search triggered!`, 'success');
            } else {
                console.log('CMS Magic: Search button not found');
                showNotification(`Officer ${officer.name} selected!`, 'success');
            }
        }, 500); // Small delay to ensure fields are filled
    }, 100); // Initial delay to ensure fields are loaded
}

// Format CNIC number to 00000-0000000-0 format
function formatCNIC(cnic) {
    if (!cnic) return '';
    
    // Remove any existing dashes or spaces
    const cleanCNIC = cnic.toString().replace(/[-\s]/g, '');
    
    // Check if it's a valid 13-digit CNIC
    if (cleanCNIC.length === 13 && /^\d{13}$/.test(cleanCNIC)) {
        // Format as 00000-0000000-0
        return `${cleanCNIC.substring(0, 5)}-${cleanCNIC.substring(5, 12)}-${cleanCNIC.substring(12)}`;
    }
    
    // If not 13 digits, return as is
    return cnic;
}


// Set offence to "fight" for edit pages
function setOffenceToFight() {
    console.log('CMS Magic: Setting offence to fight...');
    
    // Try multiple selectors for offence field
    const offenceSelectors = [
        'select[name="OffenseId"]',
        'select[id="OffenseList"]',
        'select[name*="offence"]',
        'select[id*="offence"]',
        'select[name*="Offence"]',
        'select[id*="Offense"]',
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
        console.log('CMS Magic: Available offence options:', options.slice(0, 10).map(opt => ({ text: opt.text, value: opt.value })));
        
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
            offenceSelect.value = fightOption.value;
            offenceSelect.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('CMS Magic: Offence set to fight');
            showNotification('Offence set to fight!', 'success');
            
            // Try to set offence subcategory to "fight" if available
            setTimeout(() => setOffenceSubcategoryToFight(), 1000);
        } else {
            console.log('CMS Magic: Fight option not found in offence dropdown');
            showNotification('Fight option not found in offence dropdown', 'warning');
        }
    } else {
        console.log('CMS Magic: Offence field not found');
        showNotification('Offence field not found', 'warning');
    }
}

// Set offence subcategory to "fight"
function setOffenceSubcategoryToFight() {
    console.log('CMS Magic: Setting offence subcategory to fight...');
    
    const subcategorySelectors = [
        'select[name="OffenseSubId"]',
        'select[id="SubOffense"]',
        'select[name*="subcategory"]',
        'select[id*="subcategory"]',
        'select[name*="Subcategory"]',
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
        const fightOption = options.find(option => {
            const text = option.text.toLowerCase();
            const value = option.value.toLowerCase();
            return text.includes('fight') ||
                   text.includes('fighting') ||
                   text.includes('quarrel') ||
                   text.includes('dispute') ||
                   text.includes('conflict') ||
                   value.includes('fight') ||
                   value.includes('fighting') ||
                   value.includes('quarrel') ||
                   value.includes('dispute') ||
                   value.includes('conflict');
        });
        
        if (fightOption) {
            subcategorySelect.value = fightOption.value;
            subcategorySelect.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('CMS Magic: Offence subcategory set to fight');
            showNotification('Offence subcategory set to fight!', 'success');
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
    
    // Find and set Source of Complaint to "in person" for non-edit pages
    const sourceComplaintSelectors = [
        'select[name="ComplaintSource"]',
        'select[id="ComplaintSource"]',
        'select[name*="source"]',
        'select[id*="source"]',
        'select[name*="Source"]',
        'select[id*="Source"]',
        'select[name*="complaint"]',
        'select[id*="complaint"]'
    ];
    
    let sourceComplaintSelect = null;
    for (const selector of sourceComplaintSelectors) {
        sourceComplaintSelect = document.querySelector(selector);
        if (sourceComplaintSelect) {
            console.log('CMS Magic: Found source field with selector:', selector);
            break;
        }
    }
    
    if (sourceComplaintSelect) {
        const options = Array.from(sourceComplaintSelect.options);
        console.log('CMS Magic: Available source options:', options.map(opt => ({ text: opt.text, value: opt.value })));
        
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
            sourceComplaintSelect.value = inPersonOption.value;
            sourceComplaintSelect.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('CMS Magic: Source of Complaint set to "in person"');
            showNotification('Source set to in person!', 'success');
        } else {
            console.log('CMS Magic: In person option not found in source dropdown');
            showNotification('In person option not found in source dropdown', 'warning');
        }
    } else {
        console.log('CMS Magic: Source of complaint field not found');
        showNotification('Source of complaint field not found', 'warning');
    }
}

// Create Open All Etags button on the page
function createOpenAllEtagsButton() {
    // Only create on Pucar15 page
    const url = window.location.href;
    if (!url.includes('/complaint/Pucar15')) {
        return;
    }
    
    // Remove existing button if any
    const existingButton = document.getElementById('cms-magic-open-all-etags-btn');
    if (existingButton) {
        existingButton.remove();
    }
    
    // Find the filter button area
    const filterButton = document.querySelector('a[href="#FiltersArea"]');
    if (!filterButton) {
        console.log('CMS Magic: Filter button not found');
        return;
    }
    
    // Create the button
    const button = document.createElement('button');
    button.id = 'cms-magic-open-all-etags-btn';
    button.className = 'btn btn-success margin_b margin_t25px';
    button.innerHTML = '<span class="glyphicon glyphicon-plus"></span> Open All Etags';
    button.style.cssText = `
        background: linear-gradient(135deg, #28a745 0%, #20c997 100%) !important;
        border: none !important;
        color: white !important;
        padding: 8px 15px !important;
        border-radius: 4px !important;
        font-weight: bold !important;
        box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3) !important;
        cursor: pointer !important;
        transition: all 0.3s ease !important;
        font-size: 14px !important;
        margin-left: 10px !important;
        display: inline-block !important;
    `;
    
    // Add hover effect
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-1px)';
        button.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.4)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = '0 2px 8px rgba(40, 167, 69, 0.3)';
    });
    
    // Add click event
    button.addEventListener('click', () => {
        openAllPendingTags();
    });
    
    // Insert the button right after the filter button
    filterButton.parentNode.insertBefore(button, filterButton.nextSibling);
    
    console.log('CMS Magic: Open All Etags button created in page content');
}

// Check Open All Etags setting on page load
function checkOpenAllEtagsSetting() {
    // Only show on Pucar15 page
    const url = window.location.href;
    if (!url.includes('/complaint/Pucar15')) {
        return;
    }
    
    chrome.storage.sync.get(['openAllEtagsEnabled'], (result) => {
        const enabled = result.openAllEtagsEnabled || false;
        if (enabled) {
            createOpenAllEtagsButton();
        }
    });
}

// Toggle Open All Etags button visibility
function toggleOpenAllEtagsButton(enabled) {
    // Only work on Pucar15 page
    const url = window.location.href;
    if (!url.includes('/complaint/Pucar15')) {
        console.log('CMS Magic: Not on Pucar15 page, ignoring toggle');
        return;
    }
    
    const button = document.getElementById('cms-magic-open-all-etags-btn');
    
    if (enabled) {
        if (!button) {
            createOpenAllEtagsButton();
        } else {
            button.style.display = 'inline-block';
        }
        console.log('CMS Magic: Open All Etags button enabled');
    } else {
        if (button) {
            button.style.display = 'none';
        }
        console.log('CMS Magic: Open All Etags button disabled');
    }
}

// Open all edit tags (Etags)
function openAllPendingTags() {
    console.log('CMS Magic: Opening all edit tags (Etags)...');
    
    // Use a Set to store unique URLs to prevent duplicates
    const uniqueUrls = new Set();
    const editLinks = [];
    
    // Find all links with edit URLs
    const allLinks = document.querySelectorAll('a');
    allLinks.forEach(link => {
        if (link.href && link.href.includes('/Complaint/edit?id=')) {
            // Use URL as key to prevent duplicates
            if (!uniqueUrls.has(link.href)) {
                uniqueUrls.add(link.href);
                editLinks.push(link);
            }
        }
    });
    
    console.log(`CMS Magic: Found ${editLinks.length} unique edit links`);
    console.log('CMS Magic: URLs to open:', Array.from(uniqueUrls));
    
    if (editLinks.length === 0) {
        showNotification('No edit tags found', 'warning');
        return;
    }
    
    // Open all edit links using Ctrl+Click simulation
    let openedCount = 0;
    editLinks.forEach((link, index) => {
        setTimeout(() => {
            try {
                // Simulate Ctrl+Click to open in new tab while staying on current page
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    ctrlKey: true,
                    metaKey: true, // For Mac users
                    button: 0
                });
                
                // Dispatch the event on the link
                link.dispatchEvent(clickEvent);
                openedCount++;
                console.log(`CMS Magic: Opened edit link ${index + 1}: ${link.href}`);
            } catch (error) {
                console.log(`CMS Magic: Error opening link ${index + 1}:`, error);
            }
        }, index * 300); // Increased delay to prevent browser issues
    });
    
    // Show success notification
    setTimeout(() => {
        showNotification(`Opened ${openedCount} edit tags`, 'success');
    }, editLinks.length * 300 + 500);
}

// Apply common auto-fill logic for all pages
function applyCommonAutoFill() {
    console.log('CMS Magic: Applying common auto-fill logic...');
    
    // 1. Fill CNIC with zeros
    fillCNICWithZeros();
    
    // 2. Append '15' to names
    append15ToNames();
    
    // 3. Fill father name with '..'
    fillFatherNameWithDots();
    
    // 4. Copy permanent address to place of occurrence
    copyAddressToPlaceOfOccurrence();
    
    // 5. Set category to 'reporting of crime'
    setCategoryToReportingOfCrime();
    
    // 6. Add officer dropdowns
    addOfficerDropdowns();
}

// Apply common auto-fill logic for 15 edit pages (without old officer dropdowns)
function applyCommonAutoFillFor15EditPage() {
    console.log('CMS Magic: Applying common auto-fill logic for 15 edit page...');
    
    // 1. Fill CNIC with zeros (excluding officer CNIC)
    fillCNICWithZeros();
    
    // 2. Handle name fields (append 15 or set to Unknown 15 caller)
    handleNameFields();
    
    // 3. Fill father name with '..'
    fillFatherNameWithDots();
    
    // 4. Copy address to place of occurrence
    copyAddressToPlaceOfOccurrence();
    
    // 5. Fill incident date with current date and time
    fillIncidentDate();
    
    // 6. Set category to 'reporting of crime'
    setCategoryToReportingOfCrime();
    
    // Note: Officer dropdowns are handled separately for 15 edit pages
}

// Fill incident date with current date and time
function fillIncidentDate() {
    console.log('CMS Magic: Filling incident date with current date and time...');
    
    const incidentDateField = document.querySelector('#IncidentDate');
    if (incidentDateField) {
        // Get current date and time
        const now = new Date();
        
        // Format: YYYY/MM/DD HH:MM
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        const formattedDateTime = `${year}/${month}/${day} ${hours}:${minutes}`;
        
        // Fill the field
        incidentDateField.value = formattedDateTime;
        incidentDateField.dispatchEvent(new Event('input', { bubbles: true }));
        incidentDateField.dispatchEvent(new Event('change', { bubbles: true }));
        
        console.log('CMS Magic: Filled incident date with:', formattedDateTime);
        showNotification('Incident date filled with current date and time!', 'success');
    } else {
        console.log('CMS Magic: Incident date field not found');
    }
}

// Fill CNIC with zeros (but exclude officer CNIC field)
function fillCNICWithZeros() {
    console.log('CMS Magic: Filling CNIC with zeros...');
    
    const cnicSelectors = [
        'input[name*="cnic"]',
        'input[id*="cnic"]',
        'input[name*="CNIC"]',
        'input[id*="CNIC"]',
        'input[name*="Cnic"]',
        'input[id*="Cnic"]'
    ];
    
    cnicSelectors.forEach(selector => {
        const cnicField = document.querySelector(selector);
        if (cnicField && !cnicField.value) {
            cnicField.value = '0000000000000';
            cnicField.dispatchEvent(new Event('input', { bubbles: true }));
            cnicField.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('CMS Magic: Filled CNIC with zeros');
        }
    });
}

// Handle name fields for 15 edit page
function handleNameFields() {
    console.log('CMS Magic: Handling name fields for 15 edit page...');
    
    // Target the specific PersonName field
    const personNameField = document.querySelector('#PersonName');
    if (personNameField) {
        if (!personNameField.value || personNameField.value.trim() === '') {
            // If field is empty, fill with "Unknown 15 caller"
            personNameField.value = 'Unknown 15 caller';
            personNameField.dispatchEvent(new Event('input', { bubbles: true }));
            personNameField.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('CMS Magic: Filled empty PersonName field with "Unknown 15 caller"');
        } else if (!personNameField.value.includes('15 caller')) {
            // If field has content but doesn't contain "15 caller", append "15 caller"
            personNameField.value = personNameField.value + ' 15 caller';
            personNameField.dispatchEvent(new Event('input', { bubbles: true }));
            personNameField.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('CMS Magic: Appended "15 caller" to PersonName:', personNameField.value);
        }
    } else {
        console.log('CMS Magic: PersonName field not found');
    }
}

// Append '15' to names
function append15ToNames() {
    console.log('CMS Magic: Appending 15 to names...');
    
    const nameSelectors = [
        'input[name*="name"]',
        'input[id*="name"]',
        'input[name*="Name"]',
        'input[id*="Name"]',
        'input[name*="person"]',
        'input[id*="person"]'
    ];
    
    nameSelectors.forEach(selector => {
        const nameField = document.querySelector(selector);
        if (nameField && nameField.value && !nameField.value.includes('15')) {
            nameField.value = nameField.value + '15';
            nameField.dispatchEvent(new Event('input', { bubbles: true }));
            nameField.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('CMS Magic: Appended 15 to name:', nameField.value);
        }
    });
}

// Fill father name with '..'
function fillFatherNameWithDots() {
    console.log('CMS Magic: Filling father name with dots...');
    
    const fatherNameSelectors = [
        'input[name*="father"]',
        'input[id*="father"]',
        'input[name*="Father"]',
        'input[id*="Father"]',
        'input[name*="parent"]',
        'input[id*="parent"]'
    ];
    
    fatherNameSelectors.forEach(selector => {
        const fatherField = document.querySelector(selector);
        if (fatherField && !fatherField.value) {
            fatherField.value = '..';
            fatherField.dispatchEvent(new Event('input', { bubbles: true }));
            fatherField.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('CMS Magic: Filled father name with dots');
        }
    });
}

// Copy permanent address to place of occurrence
function copyAddressToPlaceOfOccurrence() {
    console.log('CMS Magic: Copying permanent address to place of occurrence...');
    
    
    const addressSelectors = [
        '#Person_Address', 'input[name="Person_Address"]', 'textarea[name="Person_Address"]',
        'input[name*="permanentAddress"]', 'input[id*="permanentAddress"]',
        'input[name*="PermanentAddress"]', 'input[id*="PermanentAddress"]',
        'textarea[name*="permanentAddress"]', 'textarea[id*="permanentAddress"]',
        'textarea[name*="PermanentAddress"]', 'textarea[id*="PermanentAddress"]',
        'input[name*="address"]', 'input[id*="address"]',
        'input[name*="Address"]', 'input[id*="Address"]',
        'textarea[name*="address"]', 'textarea[id*="address"]',
        'input[placeholder*="address"]', 'input[placeholder*="Address"]',
        'textarea[placeholder*="address"]', 'textarea[placeholder*="Address"]'
    ];
    
    const placeOfOccurrenceSelectors = [
        '#PlaceOfOccurance', 'input[name="PlaceOfOccurance"]',
        'input[name*="occurrence"]',
        'input[id*="occurrence"]',
        'input[name*="place"]',
        'input[id*="place"]',
        'input[name*="location"]',
        'input[id*="location"]',
        'textarea[name*="occurrence"]',
        'textarea[id*="occurrence"]',
        'textarea[name*="place"]',
        'textarea[id*="place"]'
    ];
    
    
    let addressField = null;
    let addressValue = '';
    
    // Find permanent address field with better debugging
    for (const selector of addressSelectors) {
        const field = document.querySelector(selector);
        if (field && field.value && field.value.trim()) {
            addressField = field;
            addressValue = field.value.trim();
            console.log('CMS Magic: Found permanent address field:', selector, 'Value:', addressValue);
            break;
        }
    }
    
    if (addressField && addressValue) {
        // Find place of occurrence field
        for (const selector of placeOfOccurrenceSelectors) {
            const placeField = document.querySelector(selector);
            if (placeField) {
                placeField.value = addressValue;
                placeField.dispatchEvent(new Event('input', { bubbles: true }));
                placeField.dispatchEvent(new Event('change', { bubbles: true }));
                console.log('CMS Magic: Copied address to place of occurrence field:', selector);
                showNotification('Place of occurrence filled with permanent address!', 'success');
                return;
            }
        }
        console.log('CMS Magic: Place of occurrence field not found');
    } else {
        console.log('CMS Magic: Permanent address field not found or empty');
    }
}

// Set category to 'reporting of crime'
function setCategoryToReportingOfCrime() {
    console.log('CMS Magic: Setting category to reporting of crime...');
    
    const categorySelectors = [
        'select[name*="category"]',
        'select[id*="category"]',
        'select[name*="Category"]',
        'select[id*="Category"]',
        'select[name*="ComplaintCategory"]',
        'select[id*="ComplaintCategory"]'
    ];
    
    categorySelectors.forEach(selector => {
        const categorySelect = document.querySelector(selector);
        if (categorySelect) {
            const options = Array.from(categorySelect.options);
            const reportingOption = options.find(option => {
                const text = option.text.toLowerCase();
                return text.includes('reporting') && text.includes('crime') ||
                       text.includes('reporting of crime') ||
                       text.includes('crime reporting');
            });
            
            if (reportingOption) {
                categorySelect.value = reportingOption.value;
                categorySelect.dispatchEvent(new Event('change', { bubbles: true }));
                console.log('CMS Magic: Set category to reporting of crime');
            }
        }
    });
}

// Add officer dropdowns in both sections
function addOfficerDropdowns() {
    console.log('CMS Magic: Adding officer dropdowns...');
    
    // Load officers from storage
    chrome.storage.local.get(['officers'], (result) => {
        const officers = result.officers || [];
        if (officers.length === 0) {
            console.log('CMS Magic: No officers found in storage');
            return;
        }
        
        // Add dropdown to Officer Information section
        addOfficerDropdownToSection('Officer Information', officers);
        
        // Add dropdown to Complaint Section
        addOfficerDropdownToSection('Complaint Section', officers);
    });
}

// Add officer dropdown to a specific section
function addOfficerDropdownToSection(sectionName, officers) {
    console.log(`CMS Magic: Adding officer dropdown to ${sectionName}...`);
    
    // Find the section
    const section = findSectionByName(sectionName);
    if (!section) {
        console.log(`CMS Magic: Section '${sectionName}' not found`);
        return;
    }
    
    // Create dropdown
    const dropdown = document.createElement('select');
    dropdown.id = `cms-officer-dropdown-${sectionName.toLowerCase().replace(/\s+/g, '-')}`;
    dropdown.className = 'form-control cms-magic-officer-dropdown';
    dropdown.innerHTML = '<option value="">Select Officer</option>';
    
    // Add officers to dropdown
    officers.forEach(officer => {
        const option = document.createElement('option');
        option.value = JSON.stringify(officer);
        option.textContent = `${officer.name} (${officer.rank})`;
        dropdown.appendChild(option);
    });
    
    // Add change event listener
    dropdown.addEventListener('change', (e) => {
        if (e.target.value) {
            const officer = JSON.parse(e.target.value);
            fillOfficerFields(officer);
        }
    });
    
    // Style the dropdown
    dropdown.style.cssText = `
        margin: 10px 0 !important;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        color: white !important;
        border: none !important;
        border-radius: 4px !important;
        padding: 8px 12px !important;
        font-weight: bold !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
    `;
    
    // Insert dropdown at the beginning of the section
    section.insertBefore(dropdown, section.firstChild);
    
    console.log(`CMS Magic: Added officer dropdown to ${sectionName}`);
}

// Find section by name
function findSectionByName(sectionName) {
    // Try to find by heading text
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, .section-title, .panel-title'));
    const heading = headings.find(h => h.textContent.toLowerCase().includes(sectionName.toLowerCase()));
    
    if (heading) {
        // Find the parent container
        let container = heading.parentElement;
        while (container && !container.classList.contains('panel') && !container.classList.contains('section') && !container.classList.contains('form-group')) {
            container = container.parentElement;
        }
        return container || heading.parentElement;
    }
    
    // Try to find by class or ID
    const sectionSelectors = [
        `.${sectionName.toLowerCase().replace(/\s+/g, '-')}`,
        `#${sectionName.toLowerCase().replace(/\s+/g, '-')}`,
        `[class*="${sectionName.toLowerCase().replace(/\s+/g, '')}"]`
    ];
    
    for (const selector of sectionSelectors) {
        const element = document.querySelector(selector);
        if (element) return element;
    }
    
    return null;
}

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
    
    showNotification(`Officer ${officer.name} selected`, 'success');
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
    
    showNotification(`Applicant ${applicant.name} selected`, 'success');
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

// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('cms-magic-dark-mode');
    const isDark = document.body.classList.contains('cms-magic-dark-mode');
    console.log('CMS Magic: Dark mode', isDark ? 'enabled' : 'disabled');
    showNotification(`Dark mode ${isDark ? 'enabled' : 'disabled'}`, 'info');
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.cms-magic-notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `cms-magic-notification cms-magic-notification-${type}`;
    notification.textContent = message;

    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '6px',
        color: 'white',
        fontSize: '14px',
        fontWeight: '500',
        zIndex: '10000',
        maxWidth: '300px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        animation: 'cms-magic-slideIn 0.3s ease-out'
    });

    // Set background color based on type
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        info: '#17a2b8',
        warning: '#ffc107'
    };
    notification.style.backgroundColor = colors[type] || colors.info;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'cms-magic-slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('CMS Magic: Received message:', request);
    
    // Check if we should exclude functionality on this page
    const url = window.location.href;
    const excludedUrls = [
        'https://cms.punjabpolice.gov.pk/complaint-listings',
        'https://cms.punjabpolice.gov.pk/Account/Login?ReturnUrl=%2Fcomplaint-listings'
    ];
    
    // Check for FileComplaint pages with id and record parameters
    const isFileComplaintPageExclusion = url.includes('/Complaint/FileComplaint?id=') && url.includes('&record=');
    
    // Check if current URL matches any excluded URL
    const isExcluded = excludedUrls.some(excludedUrl => {
        return url === excludedUrl || url.startsWith(excludedUrl);
    }) || isFileComplaintPageExclusion;
    
    if (isExcluded) {
        console.log('CMS Magic: Message handling excluded for this page:', url);
        sendResponse({ success: false, message: 'Functionality disabled on this page' });
        return true;
    }
    
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
            toggleDarkMode();
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
            
        case 'openAllPending':
            openAllPendingTags();
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
    
    // Check if we should exclude functionality on this page
    const url = window.location.href;
    const excludedUrls = [
        'https://cms.punjabpolice.gov.pk/complaint-listings',
        'https://cms.punjabpolice.gov.pk/Account/Login?ReturnUrl=%2Fcomplaint-listings'
    ];
    
    // Check for FileComplaint pages with id and record parameters
    const isFileComplaintPageExclusion = url.includes('/Complaint/FileComplaint?id=') && url.includes('&record=');
    
    // Check if current URL matches any excluded URL
    const isExcluded = excludedUrls.some(excludedUrl => {
        return url === excludedUrl || url.startsWith(excludedUrl);
    }) || isFileComplaintPageExclusion;
    
    if (isExcluded) {
        console.log('CMS Magic: Window message handling excluded for this page:', url);
        return;
    }
    
    switch (event.data.type) {
        case 'CMS_MAGIC_TOGGLE_DARK_MODE':
            toggleDarkMode();
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
        case 'CMS_MAGIC_OPEN_ALL_PENDING':
            openAllPendingTags();
            break;
        case 'CMS_MAGIC_TOGGLE_OPEN_ALL_ETAGS_BUTTON':
            toggleOpenAllEtagsButton(event.data.enabled);
            break;
    }
});

// Setup keyboard shortcuts
document.addEventListener('keydown', (event) => {
    // Ctrl+Shift+D for dark mode toggle
    if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        event.preventDefault();
        toggleDarkMode();
    }
});