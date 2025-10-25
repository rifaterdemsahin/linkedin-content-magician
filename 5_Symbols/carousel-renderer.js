/**
 * Reusable Markdown Carousel Renderer
 * Renders markdown files in a Bootstrap carousel with indicators
 */
class MarkdownCarouselRenderer {
    constructor(config) {
        this.markdownFiles = config.markdownFiles || [];
        this.carouselId = config.carouselId || 'defaultCarousel';
        this.carouselInnerSelector = config.carouselInnerSelector || '.carousel-inner';
        this.carouselIndicatorsSelector = config.carouselIndicatorsSelector || '.carousel-indicators';
        this.errorHandler = config.errorHandler || this.defaultErrorHandler;
        this.onReady = config.onReady || (() => {});
        
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.render());
        } else {
            this.render();
        }
    }

    render() {
        const carouselInner = document.querySelector(this.carouselInnerSelector);
        const carouselIndicators = document.querySelector(this.carouselIndicatorsSelector);

        if (!carouselInner || !carouselIndicators) {
            console.error('Carousel elements not found. Make sure the HTML contains the required carousel structure.');
            return;
        }

        // Clear existing content
        carouselInner.innerHTML = '';
        carouselIndicators.innerHTML = '';

        this.markdownFiles.forEach((file, index) => {
            this.createCarouselSlide(file, index, carouselInner, carouselIndicators);
        });

        // Call onReady callback
        this.onReady();
    }

    createCarouselSlide(file, index, carouselInner, carouselIndicators) {
        // Create indicator
        const indicator = this.createIndicator(index);
        carouselIndicators.appendChild(indicator);

        // Create carousel item
        const carouselItem = this.createCarouselItem(index);
        const contentWrapper = this.createContentWrapper();
        const subtitle = this.createSubtitle(file);
        const contentDiv = this.createContentDiv();

        // Assemble the slide
        contentWrapper.appendChild(subtitle);
        contentWrapper.appendChild(contentDiv);
        carouselItem.appendChild(contentWrapper);
        carouselInner.appendChild(carouselItem);

        // Fetch and render markdown
        this.fetchAndRenderMarkdown(file, contentDiv);
    }

    createIndicator(index) {
        const indicator = document.createElement('button');
        indicator.type = 'button';
        indicator.dataset.bsTarget = `#${this.carouselId}`;
        indicator.dataset.bsSlideTo = index;
        
        if (index === 0) {
            indicator.classList.add('active');
            indicator.setAttribute('aria-current', 'true');
        }
        
        indicator.setAttribute('aria-label', `Slide ${index + 1}`);
        return indicator;
    }

    createCarouselItem(index) {
        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');
        
        if (index === 0) {
            carouselItem.classList.add('active');
        }
        
        return carouselItem;
    }

    createContentWrapper() {
        const contentWrapper = document.createElement('div');
        contentWrapper.classList.add('markdown-content');
        return contentWrapper;
    }

    createSubtitle(filename) {
        const subtitle = document.createElement('h5');
        subtitle.classList.add('text-muted', 'mb-3');
        subtitle.textContent = filename;
        return subtitle;
    }

    createContentDiv() {
        const contentDiv = document.createElement('div');
        return contentDiv;
    }

    fetchAndRenderMarkdown(file, contentDiv) {
        // Construct proper path for GitHub Pages
        let filePath = file;
        const currentPath = window.location.pathname;
        
        // If we're on GitHub Pages, construct absolute path
        if (window.location.hostname.includes('github.io')) {
            if (currentPath.includes('/1_Real/')) {
                filePath = '/linkedin-content-magician/1_Real/' + file;
            } else if (currentPath.includes('/2_Environment/')) {
                filePath = '/linkedin-content-magician/2_Environment/' + file;
            } else if (currentPath.includes('/4_Formula/')) {
                filePath = '/linkedin-content-magician/4_Formula/' + file;
            } else if (currentPath.includes('/6_Semblance/')) {
                filePath = '/linkedin-content-magician/6_Semblance/' + file;
            } else if (currentPath.includes('/7_Testing/')) {
                filePath = '/linkedin-content-magician/7_Testing/' + file;
            } else if (currentPath.includes('/sample_docs/')) {
                filePath = '/linkedin-content-magician/3_UI/sample_docs/' + file;
            }
        }
        
        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                return response.text();
            })
            .then(text => {
                if (typeof marked !== 'undefined') {
                    contentDiv.innerHTML = marked.parse(text);
                } else {
                    console.warn('Marked.js not loaded, displaying raw markdown');
                    contentDiv.innerHTML = `<pre>${this.escapeHtml(text)}</pre>`;
                }
            })
            .catch(err => {
                this.errorHandler(err, file, contentDiv);
            });
    }

    defaultErrorHandler(error, filename, contentDiv) {
        console.error(`Failed to fetch ${filename}:`, error);
        contentDiv.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <h6>Failed to load content</h6>
                <p><strong>File:</strong> ${filename}</p>
                <p><strong>Error:</strong> ${error.message}</p>
            </div>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Static method for quick initialization
    static create(config) {
        return new MarkdownCarouselRenderer(config);
    }
}

// Export for use in other scripts
window.MarkdownCarouselRenderer = MarkdownCarouselRenderer;