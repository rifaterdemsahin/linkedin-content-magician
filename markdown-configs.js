/**
 * Markdown file configurations for each section
 */
const MarkdownConfigs = {
    'real': [
        'journey.md',
        'keyresults.md',
        'objectives.md',
        'README.md',
        'todo.md'
    ],
    
    'environment': [
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
    ],
    
    'formula': [
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
    ],
    
    'semblance': [
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
    ],
    
    'testing': [
        'README.md',
        'demo_migration_summary.md',
        'manual_testing_checklist.md',
        'rag_demo_documentation.md'
    ],
    
    'sample_docs': [
        'ai_tools.md',
        'analytics_metrics.md',
        'linkedin_strategy.md',
        'personal_branding.md',
        'video_production.md'
    ]
};

// Auto-detect section and initialize carousel
function initializeCarousel() {
    const path = window.location.pathname;
    let sectionKey = '';
    let carouselId = '';

    // Detect section from path
    if (path.includes('/1_Real/')) {
        sectionKey = 'real';
        carouselId = 'realCarousel';
    } else if (path.includes('/2_Environment/')) {
        sectionKey = 'environment';
        carouselId = 'environmentCarousel';
    } else if (path.includes('/4_Formula/')) {
        sectionKey = 'formula';
        carouselId = 'formulaCarousel';
    } else if (path.includes('/6_Semblance/')) {
        sectionKey = 'semblance';
        carouselId = 'semblanceCarousel';
    } else if (path.includes('/7_Testing/')) {
        sectionKey = 'testing';
        carouselId = 'testingCarousel';
    } else if (path.includes('/sample_docs/')) {
        sectionKey = 'sample_docs';
        carouselId = 'sampleCarousel';
    }

    // Initialize carousel if section is detected
    if (sectionKey && MarkdownConfigs[sectionKey]) {
        MarkdownCarouselRenderer.create({
            markdownFiles: MarkdownConfigs[sectionKey],
            carouselId: carouselId,
            onReady: () => {
                console.log(`${sectionKey} carousel initialized with ${MarkdownConfigs[sectionKey].length} files`);
            }
        });
    } else {
        console.warn('Section not detected or no configuration found for:', path);
    }
}

// Auto-initialize when script loads
document.addEventListener('DOMContentLoaded', initializeCarousel);

// Export for manual use
window.MarkdownConfigs = MarkdownConfigs;
window.initializeCarousel = initializeCarousel;