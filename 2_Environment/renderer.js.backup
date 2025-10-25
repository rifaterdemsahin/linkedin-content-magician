document.addEventListener('DOMContentLoaded', () => {
    const markdownFiles = [
        'ai-assistant-configuration.md',
        'deployment_options.md',
        'environment-configuration-guide.md',
        'github-pages-deployment.md',
        'local-development.md',
        'production-url.md',
        'proxmox-n8n-architecture.md',
        'README.md',
        'vercel-deployment-guide.md',
        'vercel-implementation-complete.md',
        'vercel-implementation.md',
        'vercel-production-deployment.md'
    ];

    const carouselInner = document.querySelector('.carousel-inner');
    const carouselIndicators = document.querySelector('.carousel-indicators');

    markdownFiles.forEach((file, index) => {
        // Create indicator
        const indicator = document.createElement('button');
        indicator.type = 'button';
        indicator.dataset.bsTarget = '#environmentCarousel';
        indicator.dataset.bsSlideTo = index;
        if (index === 0) {
            indicator.classList.add('active');
            indicator.setAttribute('aria-current', 'true');
        }
        indicator.setAttribute('aria-label', `Slide ${index + 1}`);
        carouselIndicators.appendChild(indicator);

        // Create carousel item
        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');
        if (index === 0) {
            carouselItem.classList.add('active');
        }

        const contentWrapper = document.createElement('div');
        contentWrapper.classList.add('markdown-content');

        const subtitle = document.createElement('h5');
        subtitle.classList.add('text-muted', 'mb-3');
        subtitle.textContent = file;

        const contentDiv = document.createElement('div');

        contentWrapper.appendChild(subtitle);
        contentWrapper.appendChild(contentDiv);
        carouselItem.appendChild(contentWrapper);
        carouselInner.appendChild(carouselItem);

        // Fetch and render markdown
        fetch(file)
            .then(response => response.text())
            .then(text => {
                contentDiv.innerHTML = marked.parse(text);
            })
            .catch(err => {
                console.error(`Failed to fetch ${file}:`, err);
                contentDiv.innerHTML = `<p class="text-danger">Failed to load content for ${file}</p>`;
            });
    });
});