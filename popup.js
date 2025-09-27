// CMS Magic Popup - Clean Modern JavaScript
class CMSMagicPopup {
    constructor() {
        this.currentTab = null;
        this.activeTab = 'dashboard';
        this.settings = {
            darkModePreference: 'auto'
        };
        this.editingOfficer = null;
        this.editingApplicant = null;
    }

    async init() {
        await this.loadSettings();
        await this.getCurrentTab();
        this.setupEventListeners();
        this.setupTabs();
        this.updateStatus();
        this.loadPageInfo();
        this.loadOfficers();
        this.loadApplicants();
    }

    async getCurrentTab() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            this.currentTab = tab;
        } catch (error) {
            console.error('Error getting current tab:', error);
        }
    }

    async loadSettings() {
        try {
            const result = await chrome.storage.sync.get(['darkModePreference', 'openAllEtagsEnabled', 'defaultPlaceText']);
            this.settings = { ...this.settings, ...result };
            
            // Update UI
            const darkModeSelect = document.getElementById('dark-mode-preference');
            if (darkModeSelect) darkModeSelect.value = this.settings.darkModePreference;
            
            const openAllEtagsToggle = document.getElementById('open-all-etags-toggle');
            const openAllEtagsStatus = document.getElementById('open-all-etags-status');
            if (openAllEtagsToggle && openAllEtagsStatus) {
                openAllEtagsToggle.checked = this.settings.openAllEtagsEnabled || false;
                openAllEtagsStatus.textContent = openAllEtagsToggle.checked ? 'Enabled' : 'Disabled';
            }
            
            const defaultPlaceText = document.getElementById('default-place-text');
            if (defaultPlaceText) {
                defaultPlaceText.value = this.settings.defaultPlaceText || 'فاروق آباد';
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    async saveSettings() {
        try {
            await chrome.storage.sync.set(this.settings);
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    async toggleOpenAllEtags() {
        const toggle = document.getElementById('open-all-etags-toggle');
        const status = document.getElementById('open-all-etags-status');
        
        if (toggle && status) {
            this.settings.openAllEtagsEnabled = toggle.checked;
            status.textContent = toggle.checked ? 'Enabled' : 'Disabled';
            await this.saveSettings();
            
            // Send message to content script to show/hide the button
            this.executeAction('toggleOpenAllEtagsButton', { enabled: toggle.checked });
        }
    }

    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab');
        const tabPanels = document.querySelectorAll('.tab-panel');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                this.switchTab(tabId);
            });
        });
    }

    switchTab(tabId) {
        // Update active tab button
        document.querySelectorAll('.tab').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

        // Update active tab content
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');

        this.activeTab = tabId;

        // Load data for specific tabs
        if (tabId === 'officers') {
            this.loadOfficers();
        } else if (tabId === 'applicants') {
            this.loadApplicants();
        }
    }

    setupEventListeners() {
        // Dark mode button
        const darkModeBtn = document.getElementById('toggle-dark-mode');
        if (darkModeBtn) {
            darkModeBtn.addEventListener('click', () => {
                this.executeAction('toggleDarkMode');
            });
        }

        // Auto-fill button
        const autoFillBtn = document.getElementById('auto-fill-form');
        if (autoFillBtn) {
            autoFillBtn.addEventListener('click', () => {
                this.executeAction('autoFillCurrent');
            });
        }

        // Open all etags toggle
        const openAllEtagsToggle = document.getElementById('open-all-etags-toggle');
        if (openAllEtagsToggle) {
            openAllEtagsToggle.addEventListener('change', () => {
                this.toggleOpenAllEtags();
            });
        }

        // Default place text input
        const defaultPlaceText = document.getElementById('default-place-text');
        if (defaultPlaceText) {
            defaultPlaceText.addEventListener('input', () => {
                this.settings.defaultPlaceText = defaultPlaceText.value;
                this.saveSettings();
            });
        }

        // Officers management
        const addOfficerBtn = document.getElementById('add-officer');
        if (addOfficerBtn) {
            addOfficerBtn.addEventListener('click', () => {
                this.addOfficer();
            });
        }

        const cancelEditBtn = document.getElementById('cancel-edit');
        if (cancelEditBtn) {
            cancelEditBtn.addEventListener('click', () => {
                this.clearForm();
            });
        }

        // Applicants management
        const addApplicantBtn = document.getElementById('add-applicant');
        if (addApplicantBtn) {
            addApplicantBtn.addEventListener('click', () => {
                this.addApplicant();
            });
        }

        const cancelApplicantEditBtn = document.getElementById('cancel-applicant-edit');
        if (cancelApplicantEditBtn) {
            cancelApplicantEditBtn.addEventListener('click', () => {
                this.clearApplicantForm();
            });
        }

        const refreshApplicantsBtn = document.getElementById('refresh-applicants');
        if (refreshApplicantsBtn) {
            refreshApplicantsBtn.addEventListener('click', () => {
                this.loadApplicants();
            });
        }

        // Refresh officers button
        const refreshOfficersBtn = document.getElementById('refresh-officers');
        if (refreshOfficersBtn) {
            refreshOfficersBtn.addEventListener('click', () => {
                this.loadOfficers();
            });
        }

        // Settings
        const darkModeSelect = document.getElementById('dark-mode-preference');
        if (darkModeSelect) {
            darkModeSelect.addEventListener('change', (e) => {
                this.settings.darkModePreference = e.target.value;
                this.saveSettings();
            });
        }

        // Export/Import buttons
        const exportOfficersBtn = document.getElementById('export-officers');
        if (exportOfficersBtn) {
            exportOfficersBtn.addEventListener('click', () => {
                this.exportOfficers();
            });
        }

        const importOfficersBtn = document.getElementById('import-officers');
        if (importOfficersBtn) {
            importOfficersBtn.addEventListener('click', () => {
                this.importOfficers();
            });
        }

        const exportApplicantsBtn = document.getElementById('export-applicants');
        if (exportApplicantsBtn) {
            exportApplicantsBtn.addEventListener('click', () => {
                this.exportApplicants();
            });
        }

        const importApplicantsBtn = document.getElementById('import-applicants');
        if (importApplicantsBtn) {
            importApplicantsBtn.addEventListener('click', () => {
                this.importApplicants();
            });
        }

        // Help and reset buttons
        const helpBtn = document.getElementById('help-btn');
        if (helpBtn) {
            helpBtn.addEventListener('click', () => {
                this.showHelp();
            });
        }

        const resetBtn = document.getElementById('reset-settings');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetSettings();
            });
        }
    }

    async executeAction(action) {
        if (!this.currentTab || !this.isCMSPage()) {
            this.showMessage('This extension only works on CMS pages', 'warning');
            return;
        }

        try {
            await chrome.tabs.sendMessage(this.currentTab.id, {
                action: action,
                settings: this.settings
            });
            
            // Update status after action
            setTimeout(() => this.updateStatus(), 500);
        } catch (error) {
            console.error('Error executing action:', error);
            this.showMessage('Error executing action. Please refresh the page and try again.', 'error');
        }
    }

    isCMSPage() {
        return this.currentTab && this.currentTab.url && 
               this.currentTab.url.includes('cms.punjabpolice.gov.pk');
    }

    async loadPageInfo() {
        if (!this.isCMSPage()) {
            const currentPageEl = document.getElementById('current-page');
            if (currentPageEl) currentPageEl.textContent = 'Not a CMS page';
            return;
        }

        try {
            const response = await chrome.tabs.sendMessage(this.currentTab.id, {
                action: 'getPageInfo'
            });

            if (response) {
                const currentPageEl = document.getElementById('current-page');
                const notificationCountEl = document.getElementById('notification-count');

                if (currentPageEl) currentPageEl.textContent = response.pageTitle || 'CMS Page';
                if (notificationCountEl) notificationCountEl.textContent = response.notificationCount || '0';
            }
        } catch (error) {
            console.error('Error loading page info:', error);
            const currentPageEl = document.getElementById('current-page');
            if (currentPageEl) currentPageEl.textContent = 'CMS Page';
        }
    }

    async updateStatus() {
        await this.loadPageInfo();
    }

    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());

        // Create new message element
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.textContent = message;

        const colors = {
            success: '#28a745',
            error: '#dc3545',
            info: '#17a2b8',
            warning: '#ffc107'
        };

        messageEl.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(messageEl);

        setTimeout(() => {
            messageEl.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => messageEl.remove(), 300);
        }, 3000);
    }

    showHelp() {
        const helpContent = `CMS Magic v2.0.0 Help

Dashboard Tab:
• View current page status and notifications
• Quick access to dark mode and auto-fill
• Keyboard shortcuts reference

Officers Tab:
• Add, edit, and delete police officers
• Export/import officer data
• Select officers for form auto-fill

Settings Tab:
• Configure dark mode preferences
• Export/import data
• Reset settings

Keyboard Shortcuts:
• Ctrl+Shift+D: Toggle Dark Mode

For support, visit the extension page.`;

        alert(helpContent);
    }

    // Officers Management Methods
    async loadOfficers() {
        try {
            const result = await chrome.storage.local.get(['officers']);
            const officers = result.officers || [];
            this.renderOfficersTable(officers);
            this.updateOfficerCount(officers.length);
            // Only attach event listeners once
            if (!this.officerEventListenersAttached) {
                this.attachOfficerEventListeners(officers);
                this.officerEventListenersAttached = true;
            }
        } catch (error) {
            console.error('Error loading officers:', error);
        }
    }

    updateOfficerCount(count) {
        const countEl = document.getElementById('officer-count');
        if (countEl) {
            countEl.textContent = `${count} officer${count !== 1 ? 's' : ''}`;
        }
    }

    async saveOfficers(officers) {
        try {
            await chrome.storage.local.set({ officers: officers });
        } catch (error) {
            console.error('Error saving officers:', error);
        }
    }

    addOfficer() {
        const name = document.getElementById('officer-name').value.trim();
        const rank = document.getElementById('officer-rank').value.trim();
        const mobile = document.getElementById('officer-mobile').value.trim();
        const cnic = document.getElementById('officer-cnic').value.trim();

        if (!name || !rank || !mobile || !cnic) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        // Validate CNIC format (basic validation)
        if (cnic.length !== 13 || !/^\d+$/.test(cnic)) {
            this.showMessage('Please enter a valid 13-digit CNIC', 'error');
            return;
        }

        // Validate mobile number
        if (mobile.length !== 11 || !/^\d+$/.test(mobile)) {
            this.showMessage('Please enter a valid 11-digit mobile number', 'error');
            return;
        }

        // Load existing officers
        chrome.storage.local.get(['officers'], (result) => {
            const officers = result.officers || [];
            
            // Check for duplicate CNIC (exclude current officer if editing)
            const duplicateOfficer = officers.find(officer => 
                officer.cnic === cnic && (!this.editingOfficer || officer.id !== this.editingOfficer.id)
            );
            
            if (duplicateOfficer) {
                this.showMessage('Officer with this CNIC already exists', 'error');
                return;
            }

            if (this.editingOfficer) {
                // Update existing officer
                const officerIndex = officers.findIndex(o => o.id === this.editingOfficer.id);
                if (officerIndex !== -1) {
                    officers[officerIndex] = {
                        ...this.editingOfficer,
                        name: name,
                        rank: rank,
                        mobileNumber: mobile,
                        cnic: cnic
                    };
                    this.showMessage('Officer updated successfully', 'success');
                }
            } else {
                // Add new officer
                const newOfficer = {
                    id: Date.now(),
                    name: name,
                    rank: rank,
                    mobileNumber: mobile,
                    cnic: cnic
                };
                officers.push(newOfficer);
                this.showMessage('Officer added successfully', 'success');
            }

            this.saveOfficers(officers);
            this.renderOfficersTable(officers);
            this.updateOfficerCount(officers.length);

            // Clear form and reset editing state
            this.clearForm();
        });
    }

    editOfficer(officer) {
        console.log('CMS Magic Popup: editOfficer called with:', officer);
        this.editingOfficer = officer;
        
        // Fill form with officer data
        const nameField = document.getElementById('officer-name');
        const rankField = document.getElementById('officer-rank');
        const mobileField = document.getElementById('officer-mobile');
        const cnicField = document.getElementById('officer-cnic');
        
        if (nameField) {
            nameField.value = officer.name;
            console.log('CMS Magic Popup: Filled name field:', officer.name);
        } else {
            console.error('CMS Magic Popup: Name field not found');
        }
        
        if (rankField) {
            rankField.value = officer.rank;
            console.log('CMS Magic Popup: Filled rank field:', officer.rank);
        } else {
            console.error('CMS Magic Popup: Rank field not found');
        }
        
        if (mobileField) {
            mobileField.value = officer.mobileNumber;
            console.log('CMS Magic Popup: Filled mobile field:', officer.mobileNumber);
        } else {
            console.error('CMS Magic Popup: Mobile field not found');
        }
        
        if (cnicField) {
            cnicField.value = officer.cnic;
            console.log('CMS Magic Popup: Filled CNIC field:', officer.cnic);
        } else {
            console.error('CMS Magic Popup: CNIC field not found');
        }
        
        // Update button text and show cancel button
        const addButton = document.getElementById('add-officer');
        const cancelButton = document.getElementById('cancel-edit');
        const buttonText = addButton ? addButton.querySelector('.btn-text') : null;
        
        if (buttonText) {
            buttonText.textContent = 'Update Officer';
            console.log('CMS Magic Popup: Updated button text to Update Officer');
        } else {
            console.error('CMS Magic Popup: Button text element not found');
        }
        
        if (cancelButton) {
            cancelButton.style.display = 'flex';
            console.log('CMS Magic Popup: Showed cancel button');
        } else {
            console.error('CMS Magic Popup: Cancel button not found');
        }
        
        // Scroll to form
        const formElement = document.querySelector('.add-officer-form');
        if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth' });
            console.log('CMS Magic Popup: Scrolled to form');
        } else {
            console.error('CMS Magic Popup: Form element not found');
        }
        
        this.showMessage(`Editing officer: ${officer.name}`, 'info');
        console.log('CMS Magic Popup: Edit officer completed');
    }

    clearForm() {
        document.getElementById('officer-name').value = '';
        document.getElementById('officer-rank').value = '';
        document.getElementById('officer-mobile').value = '';
        document.getElementById('officer-cnic').value = '';
        
        // Reset button text and hide cancel button
        const addButton = document.getElementById('add-officer');
        const cancelButton = document.getElementById('cancel-edit');
        const buttonText = addButton.querySelector('.btn-text');
        
        if (buttonText) {
            buttonText.textContent = 'Add Officer';
        }
        
        if (cancelButton) {
            cancelButton.style.display = 'none';
        }
        
        this.editingOfficer = null;
    }

    deleteOfficer(id) {
        console.log('CMS Magic Popup: deleteOfficer called with ID:', id, 'Type:', typeof id);
        
        chrome.storage.local.get(['officers'], (result) => {
            const officers = result.officers || [];
            console.log('CMS Magic Popup: All officers before deletion:', officers.map(o => ({ id: o.id, type: typeof o.id })));
            
            // Use loose comparison to handle both string and number IDs
            const updatedOfficers = officers.filter(officer => officer.id != id);
            
            console.log('CMS Magic Popup: Officers after deletion:', updatedOfficers.length);
            console.log('CMS Magic Popup: Deleted officer ID:', id);
            
            this.saveOfficers(updatedOfficers);
            this.renderOfficersTable(updatedOfficers);
            this.updateOfficerCount(updatedOfficers.length);
            this.showMessage('Officer deleted successfully', 'success');
        });
    }

    selectOfficer(officer) {
        if (!this.currentTab || !this.isCMSPage()) {
            this.showMessage('This extension only works on CMS pages', 'warning');
            return;
        }

        // Send officer data to content script
        chrome.tabs.sendMessage(this.currentTab.id, {
            action: 'selectOfficer',
            officer: officer
        });

        this.showMessage(`Officer ${officer.name} selected`, 'success');
    }

    renderOfficersTable(officers) {
        const tbody = document.getElementById('officers-tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (officers.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="5" style="text-align: center; color: #6c757d; padding: 20px;">
                    No officers found. Add your first officer above.
                </td>
            `;
            tbody.appendChild(row);
            return;
        }

        officers.forEach(officer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td title="${officer.name}">${officer.name}</td>
                <td>${officer.rank}</td>
                <td>${officer.mobileNumber}</td>
                <td>${officer.cnic}</td>
                <td>
                    <div class="officer-actions">
                        <button class="edit-btn" data-officer-id="${officer.id}" title="Edit Officer">Edit</button>
                        <button class="delete-btn" data-officer-id="${officer.id}" title="Delete Officer">Delete</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    attachOfficerEventListeners(officers) {
        // Remove existing event listeners to prevent duplicates
        const selectButtons = document.querySelectorAll('.select-btn');
        const editButtons = document.querySelectorAll('.edit-btn');
        const deleteButtons = document.querySelectorAll('.delete-btn');

        console.log('CMS Magic Popup: Attaching event listeners...');
        console.log('CMS Magic Popup: Found buttons - Edit:', editButtons.length, 'Delete:', deleteButtons.length);
        console.log('CMS Magic Popup: Officers array:', officers);

        // Use event delegation instead of individual listeners to avoid duplicates
        const tbody = document.getElementById('officers-tbody');
        if (tbody) {
            // Remove existing listeners
            tbody.removeEventListener('click', this.handleOfficerAction);
            
            // Add single delegated listener
            this.handleOfficerAction = (e) => {
                const target = e.target;
                const officerId = target.dataset.officerId;
                
                console.log('CMS Magic Popup: Button clicked, Officer ID from dataset:', officerId);
                console.log('CMS Magic Popup: Officer ID type:', typeof officerId);
                
                // Get fresh officers data from storage
                chrome.storage.local.get(['officers'], (result) => {
                    const currentOfficers = result.officers || [];
                    console.log('CMS Magic Popup: Current officers:', currentOfficers);
                    
                    // Try both string and number comparison
                    let officer = currentOfficers.find(o => o.id == officerId || o.id === officerId);
                    
                    if (target.classList.contains('edit-btn')) {
                        console.log('CMS Magic Popup: Edit button clicked');
                        e.preventDefault();
                        e.stopPropagation();
                        
                        console.log('CMS Magic Popup: Looking for officer with ID:', officerId);
                        console.log('CMS Magic Popup: Found officer:', officer);
                        
                        if (officer) {
                            this.editOfficer(officer);
                        } else {
                            console.error('CMS Magic Popup: Officer not found for ID:', officerId);
                            console.error('CMS Magic Popup: Available officer IDs:', currentOfficers.map(o => ({ id: o.id, type: typeof o.id })));
                            this.showMessage('Officer not found', 'error');
                        }
                    } else if (target.classList.contains('delete-btn')) {
                        console.log('CMS Magic Popup: Delete button clicked');
                        if (confirm('Are you sure you want to delete this officer?')) {
                            this.deleteOfficer(officerId);
                        }
                    }
                });
            };
            
            tbody.addEventListener('click', this.handleOfficerAction);
        }
    }

    // Export/Import functionality
    exportOfficers() {
        chrome.storage.local.get(['officers'], (result) => {
            const officers = result.officers || [];
            if (officers.length === 0) {
                this.showMessage('No officers to export', 'warning');
                return;
            }

            const dataStr = JSON.stringify(officers, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `cms-magic-officers-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            URL.revokeObjectURL(url);
            this.showMessage('Officers exported successfully', 'success');
        });
    }

    importOfficers() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedOfficers = JSON.parse(e.target.result);
                    
                    if (!Array.isArray(importedOfficers)) {
                        this.showMessage('Invalid file format', 'error');
                        return;
                    }

                    // Validate officer data structure
                    const validOfficers = importedOfficers.filter(officer => 
                        officer.name && officer.rank && officer.mobileNumber && officer.cnic
                    );

                    if (validOfficers.length === 0) {
                        this.showMessage('No valid officers found in file', 'error');
                        return;
                    }

                    // Load existing officers and merge
                    chrome.storage.local.get(['officers'], (result) => {
                        const existingOfficers = result.officers || [];
                        const mergedOfficers = [...existingOfficers];
                        
                        validOfficers.forEach(importedOfficer => {
                            // Check for duplicates by CNIC
                            if (!mergedOfficers.some(existing => existing.cnic === importedOfficer.cnic)) {
                                mergedOfficers.push({
                                    ...importedOfficer,
                                    id: Date.now() + Math.random() // Ensure unique ID
                                });
                            }
                        });

                        this.saveOfficers(mergedOfficers);
                        this.renderOfficersTable(mergedOfficers);
                        this.updateOfficerCount(mergedOfficers.length);
                        this.showMessage(`Imported ${validOfficers.length} officers successfully`, 'success');
                    });

                } catch (error) {
                    this.showMessage('Error reading file. Please check the file format.', 'error');
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    }

    exportApplicants() {
        chrome.storage.local.get(['applicants'], (result) => {
            const applicants = result.applicants || [];
            if (applicants.length === 0) {
                this.showMessage('No complainants to export', 'warning');
                return;
            }

            const dataStr = JSON.stringify(applicants, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `cms-magic-complainants-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            URL.revokeObjectURL(url);
            this.showMessage('Complainants exported successfully', 'success');
        });
    }

    importApplicants() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedApplicants = JSON.parse(e.target.result);
                    
                    if (!Array.isArray(importedApplicants)) {
                        this.showMessage('Invalid file format. Expected an array of complainants.', 'error');
                        return;
                    }

                    // Validate applicant structure
                    const validApplicants = importedApplicants.filter(applicant => {
                        return applicant.name && applicant.fatherName && applicant.cnic && applicant.contactNumber && applicant.permanentAddress;
                    });

                    if (validApplicants.length === 0) {
                        this.showMessage('No valid complainants found in file', 'error');
                        return;
                    }

                    // Merge with existing applicants, avoiding duplicates by CNIC
                    chrome.storage.local.get(['applicants'], (result) => {
                        const existingApplicants = result.applicants || [];
                        const existingCnicSet = new Set(existingApplicants.map(a => a.cnic));
                        
                        const newApplicants = validApplicants.filter(applicant => !existingCnicSet.has(applicant.cnic));
                        const updatedApplicants = [...existingApplicants, ...newApplicants];
                        
                        chrome.storage.local.set({ applicants: updatedApplicants }, () => {
                            this.loadApplicants();
                            this.showMessage(`Complainants imported successfully. Added ${newApplicants.length} new complainants.`, 'success');
                        });
                    });
                } catch (error) {
                    console.error('Import error:', error);
                    this.showMessage('Error importing complainants. Please check file format.', 'error');
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    }

    resetSettings() {
        if (!confirm('Are you sure you want to reset all settings? This will clear all officers and preferences.')) {
            return;
        }

        chrome.storage.local.clear();
        chrome.storage.sync.clear();
        
        this.settings = {
            darkModePreference: 'auto'
        };
        
        this.loadSettings();
        this.loadOfficers();
        this.loadApplicants();
        this.showMessage('Settings reset successfully', 'success');
    }

    // Applicants Management Methods
    async loadApplicants() {
        try {
            const result = await chrome.storage.local.get(['applicants']);
            let applicants = result.applicants || [];
            
            // If no applicants in storage, load from JSON file
            if (applicants.length === 0) {
                applicants = await this.loadApplicantsFromJSON();
                if (applicants.length > 0) {
                    await chrome.storage.local.set({ applicants: applicants });
                }
            }
            
            this.renderApplicantsTable(applicants);
            this.updateApplicantCount(applicants.length);
        } catch (error) {
            console.error('Error loading applicants:', error);
        }
    }

    async loadApplicantsFromJSON() {
        try {
            const response = await fetch(chrome.runtime.getURL('applicants.json'));
            const data = await response.json();
            return data.applicants || [];
        } catch (error) {
            console.error('Error loading applicants from JSON:', error);
            return [];
        }
    }

    updateApplicantCount(count) {
        const countEl = document.getElementById('applicant-count');
        if (countEl) {
            countEl.textContent = `${count} applicant${count !== 1 ? 's' : ''}`;
        }
    }

    async saveApplicants(applicants) {
        try {
            await chrome.storage.local.set({ applicants: applicants });
        } catch (error) {
            console.error('Error saving applicants:', error);
        }
    }

    addApplicant() {
        const name = document.getElementById('applicant-name').value.trim();
        const fatherName = document.getElementById('applicant-father').value.trim();
        const relation = document.getElementById('applicant-relation').value;
        const cnic = document.getElementById('applicant-cnic').value.trim();
        const contactNumber = document.getElementById('applicant-contact').value.trim();
        const permanentAddress = document.getElementById('applicant-address').value.trim();

        if (!name || !fatherName || !cnic || !contactNumber || !permanentAddress) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        // Validate CNIC format (basic validation)
        if (cnic.length !== 13 || !/^\d+$/.test(cnic)) {
            this.showMessage('Please enter a valid 13-digit CNIC', 'error');
            return;
        }

        // Validate contact number
        if (contactNumber.length !== 11 || !/^\d+$/.test(contactNumber)) {
            this.showMessage('Please enter a valid 11-digit contact number', 'error');
            return;
        }

        // Load existing applicants
        chrome.storage.local.get(['applicants'], (result) => {
            const applicants = result.applicants || [];
            
            // Check for duplicate CNIC (exclude current applicant if editing)
            const duplicateApplicant = applicants.find(applicant => 
                applicant.cnic === cnic && (!this.editingApplicant || applicant.id !== this.editingApplicant.id)
            );
            
            if (duplicateApplicant) {
                this.showMessage('Applicant with this CNIC already exists', 'error');
                return;
            }

            if (this.editingApplicant) {
                // Update existing applicant
                const applicantIndex = applicants.findIndex(a => a.id === this.editingApplicant.id);
                if (applicantIndex !== -1) {
                    applicants[applicantIndex] = {
                        ...this.editingApplicant,
                        name: name,
                        fatherName: fatherName,
                        relation: relation,
                        cnic: cnic,
                        contactNumber: contactNumber,
                        permanentAddress: permanentAddress
                    };
                    this.showMessage('Applicant updated successfully', 'success');
                }
            } else {
                // Add new applicant
                const newApplicant = {
                    id: Date.now(),
                    name: name,
                    fatherName: fatherName,
                    relation: relation,
                    cnic: cnic,
                    contactNumber: contactNumber,
                    permanentAddress: permanentAddress
                };
                applicants.push(newApplicant);
                this.showMessage('Applicant added successfully', 'success');
            }

            this.saveApplicants(applicants);
            this.renderApplicantsTable(applicants);
            this.updateApplicantCount(applicants.length);

            // Clear form and reset editing state
            this.clearApplicantForm();
        });
    }

    editApplicant(applicant) {
        this.editingApplicant = applicant;
        
        // Fill form with applicant data
        document.getElementById('applicant-name').value = applicant.name;
        document.getElementById('applicant-father').value = applicant.fatherName;
        document.getElementById('applicant-relation').value = applicant.relation || '1';
        document.getElementById('applicant-cnic').value = applicant.cnic;
        document.getElementById('applicant-contact').value = applicant.contactNumber;
        document.getElementById('applicant-address').value = applicant.permanentAddress;
        
        // Update button text and show cancel button
        const addButton = document.getElementById('add-applicant');
        const cancelButton = document.getElementById('cancel-applicant-edit');
        const buttonText = addButton.querySelector('.btn-text');
        
        if (buttonText) {
            buttonText.textContent = 'Update Complainant';
        }
        
        if (cancelButton) {
            cancelButton.style.display = 'flex';
        }
        
        // Scroll to form
        document.querySelector('.add-applicant-form').scrollIntoView({ behavior: 'smooth' });
        
        this.showMessage(`Editing complainant: ${applicant.name}`, 'info');
    }

    clearApplicantForm() {
        document.getElementById('applicant-name').value = '';
        document.getElementById('applicant-father').value = '';
        document.getElementById('applicant-relation').value = '1';
        document.getElementById('applicant-cnic').value = '';
        document.getElementById('applicant-contact').value = '';
        document.getElementById('applicant-address').value = '';
        
        // Reset button text and hide cancel button
        const addButton = document.getElementById('add-applicant');
        const cancelButton = document.getElementById('cancel-applicant-edit');
        const buttonText = addButton.querySelector('.btn-text');
        
        if (buttonText) {
            buttonText.textContent = 'Add Complainant';
        }
        
        if (cancelButton) {
            cancelButton.style.display = 'none';
        }
        
        this.editingApplicant = null;
    }

    deleteApplicant(id) {
        if (!confirm('Are you sure you want to delete this complainant?')) {
            return;
        }

        chrome.storage.local.get(['applicants'], (result) => {
            const applicants = result.applicants || [];
            const updatedApplicants = applicants.filter(applicant => applicant.id !== id);
            this.saveApplicants(updatedApplicants);
            this.renderApplicantsTable(updatedApplicants);
            this.updateApplicantCount(updatedApplicants.length);
            this.showMessage('Applicant deleted successfully', 'success');
        });
    }

    selectApplicant(applicant) {
        if (!this.currentTab || !this.isCMSPage()) {
            this.showMessage('This extension only works on CMS pages', 'warning');
            return;
        }

        // Send applicant data to content script
        chrome.tabs.sendMessage(this.currentTab.id, {
            action: 'selectApplicant',
            applicant: applicant
        });

        this.showMessage(`Complainant ${applicant.name} selected`, 'success');
    }

    renderApplicantsTable(applicants) {
        const tbody = document.getElementById('applicants-tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (applicants.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="6" style="text-align: center; color: #6c757d; padding: 20px;">
                    No complainants found. Add your first complainant above.
                </td>
            `;
            tbody.appendChild(row);
            return;
        }

        applicants.forEach(applicant => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td title="${applicant.name}">${applicant.name}</td>
                <td title="${applicant.fatherName}">${applicant.fatherName}</td>
                <td>${applicant.cnic}</td>
                <td>${applicant.contactNumber}</td>
                <td title="${applicant.permanentAddress}">${applicant.permanentAddress.length > 30 ? applicant.permanentAddress.substring(0, 30) + '...' : applicant.permanentAddress}</td>
                <td>
                    <div class="applicant-actions">
                        <button class="select-applicant-btn" data-applicant-id="${applicant.id}" title="Select Complainant">Select</button>
                        <button class="edit-applicant-btn" data-applicant-id="${applicant.id}" title="Edit Complainant">Edit</button>
                        <button class="delete-applicant-btn" data-applicant-id="${applicant.id}" title="Delete Complainant">Delete</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Add event listeners to the buttons
        this.attachApplicantEventListeners(applicants);
    }

    attachApplicantEventListeners(applicants) {
        const selectButtons = document.querySelectorAll('.select-applicant-btn');
        const editButtons = document.querySelectorAll('.edit-applicant-btn');
        const deleteButtons = document.querySelectorAll('.delete-applicant-btn');

        selectButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const applicantId = parseInt(e.target.dataset.applicantId);
                const applicant = applicants.find(a => a.id === applicantId);
                if (applicant) {
                    this.selectApplicant(applicant);
                }
            });
        });

        editButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const applicantId = parseInt(e.target.dataset.applicantId);
                const applicant = applicants.find(a => a.id === applicantId);
                if (applicant) {
                    this.editApplicant(applicant);
                }
            });
        });

        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const applicantId = parseInt(e.target.dataset.applicantId);
                this.deleteApplicant(applicantId);
            });
        });
    }
}

// Initialize popup when DOM is loaded
let popup;
document.addEventListener('DOMContentLoaded', function() {
    popup = new CMSMagicPopup();
    popup.init();
});