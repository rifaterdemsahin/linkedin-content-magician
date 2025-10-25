
document.addEventListener('DOMContentLoaded', () => {
    const markdownFiles = [
        'BOOTSTRAP_INTEGRATION_COMPLETE.md',
        'BOOTSTRAP_README.md',
        'DEBUG_OUTPUT_IMPLEMENTATION.md',
        'formula_build_commit_changes.md',
        'formula_building_vite_app.md',
        'formula_channel_niche.md',
        'formula_channel_pivot.md',
        'formula_git_fixes.md',
        'formula_github_actions_deployment.md',
        'formula_github_actions_static_deployment_complete.md',
        'formula_github_actions_static_deployment.md',
        'formula_github_pages_routing.md',
        'formula_google_flow.md',
        'formula_jsx_explanation.md',
        'formula_last_commit_changes.md',
        'formula_post_processing_implementation.md',
        'formula_post_processing_visual_guide.md',
        'formula_post_processing_workflow.md',
        'formula_rag_api_retrieval.md',
        'formula_vercel_deployment.md',
        'formula_vercel_dist_directory_explanation.md',
        'formula_video_production_references.md',
        'formula_visual_enhancements.md',
        'formula_vscode_settings.md',
        'formula_why_user_vercel.md',
        'formula_youtube_voice_over.md',
        'formula-estimate-delivery.md',
        'N8N_SETUP_UPDATES.md'
    ];

    const carouselInner = document.querySelector('.carousel-inner');
    const carouselIndicators = document.querySelector('.carousel-indicators');

    markdownFiles.forEach((file, index) => {
        // Create indicator
        const indicator = document.createElement('button');
        indicator.type = 'button';
        indicator.dataset.bsTarget = '#formulaCarousel';
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
