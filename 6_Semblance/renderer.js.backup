document.addEventListener('DOMContentLoaded', () => {
    const markdownFiles = [
        'README.md',
        'build_error_nav_link_2025_10_25.md',
        'chrome_extension_csp_error.md',
        'css_error.md',
        'debugging_guide.md',
        'deploy_failure_node_version.md',
        'error_tailwind.md',
        'error_tailwind_exports.md',
        'github_pages_404_asset_error_analysis.md',
        'github_pages_asset_error_resolved.md',
        'github_pages_vite_base_path_error.md',
        'n8n_fixes.md',
        'netlify_centering_fix_deployed.md',
        'netlify_page_centering_fix.md',
        'npm_error_enoent.md',
        'npm_package_json_enoent_2025_10_25_11_01.md',
        'npm_package_json_enoent_detailed.md',
        'rag_faiss_score_display_enhancement.md',
        'tailwind-color-fix.md',
        'vercel_deployment_error_analysis.md',
        'vercel_oom_error_resolution_complete.md',
        'vercel_oom_memory_error_solution.md'
    ];

    const carouselInner = document.querySelector('.carousel-inner');
    const carouselIndicators = document.querySelector('.carousel-indicators');

    markdownFiles.forEach((file, index) => {
        // Create indicator
        const indicator = document.createElement('button');
        indicator.type = 'button';
        indicator.dataset.bsTarget = '#semblanceCarousel';
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