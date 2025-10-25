// Delivery Pilot Menu - Reusable Navigation Component
class DeliveryPilotMenu {
    constructor(currentFolder = '') {
        this.currentFolder = currentFolder;
        this.menuItems = [
            { name: 'Dashboard', emoji: '🚀', folder: '' },
            { name: 'Real', emoji: '🎯', folder: '1_Real' },
            { name: 'UI', emoji: '🎨', folder: '3_UI' },
            { name: 'Formula', emoji: '⚗️', folder: '4_Formula' },
            { name: 'Semblance', emoji: '🔧', folder: '6_Semblance' },
            { name: 'Testing', emoji: '🧪', folder: '7_Testing' },
            { name: 'Sample Docs', emoji: '📚', folder: 'sample_docs' }
        ];
        this.init();
    }

    getRelativePath(targetFolder) {
        // If targeting dashboard (empty folder)
        if (!targetFolder) {
            return this.currentFolder ? '../dashboard.html' : './dashboard.html';
        }
        // If we're in the root directory or no current folder specified
        if (!this.currentFolder) {
            return `./${targetFolder}/index.html`;
        }
        // If we're in a subfolder, go up one level then to target
        return `../${targetFolder}/index.html`;
    }

    init() {
        this.createMenuHTML();
        this.attachEventListeners();
    }

    createMenuHTML() {
        const menuHTML = `
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
                <div class="container-fluid">
                    <a class="navbar-brand fw-bold" href="#">
                        🚀 Delivery Pilot
                    </a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#deliveryPilotNav" aria-controls="deliveryPilotNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="deliveryPilotNav">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            ${this.menuItems.map(item => `
                                <li class="nav-item">
                                    <a class="nav-link" href="${this.getRelativePath(item.folder)}">
                                        ${item.emoji} ${item.name}
                                    </a>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            </nav>
        `;

        // Insert menu at the beginning of body
        document.body.insertAdjacentHTML('afterbegin', menuHTML);
        
        // Add top padding to body to account for fixed navbar
        document.body.style.paddingTop = '70px';
        
        // Auto-highlight current page
        setTimeout(() => this.autoHighlightCurrentPage(), 100);
    }

    attachEventListeners() {
        // Add smooth scrolling and active state management if needed
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                // Add active class to clicked link
                e.target.classList.add('active');
            });
        });
    }

    // Method to highlight current page in menu
    setActivePage(pageName) {
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.textContent.trim().includes(pageName)) {
                link.classList.add('active');
            }
        });
    }

    // Auto-highlight current page based on folder
    autoHighlightCurrentPage() {
        if (this.currentFolder) {
            const folderToPageName = {
                '': 'Dashboard',
                '1_Real': 'Real',
                '3_UI': 'UI', 
                '4_Formula': 'Formula',
                '6_Semblance': 'Semblance',
                '7_Testing': 'Testing',
                'sample_docs': 'Sample Docs'
            };
            const pageName = folderToPageName[this.currentFolder];
            if (pageName) {
                this.setActivePage(pageName);
            }
        }
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Try to detect current folder from URL path
    const path = window.location.pathname;
    let currentFolder = '';
    
    if (path.includes('/1_Real/')) currentFolder = '1_Real';
    else if (path.includes('/3_UI/')) currentFolder = '3_UI';
    else if (path.includes('/4_Formula/')) currentFolder = '4_Formula';
    else if (path.includes('/6_Semblance/')) currentFolder = '6_Semblance';
    else if (path.includes('/7_Testing/')) currentFolder = '7_Testing';
    else if (path.includes('/sample_docs/')) currentFolder = 'sample_docs';
    
    window.deliveryPilot = new DeliveryPilotMenu(currentFolder);
});

// Export for manual initialization if needed
window.DeliveryPilotMenu = DeliveryPilotMenu;