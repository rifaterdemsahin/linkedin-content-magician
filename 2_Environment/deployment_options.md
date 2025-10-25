
# Deployment Options

This document provides an overview of the different deployment options for the LinkedIn Content Magician application. Each option has its own setup process and feature support.

---

## 1. GitHub Pages

*   **Description:** A simple option for deploying the frontend as a static site directly from your GitHub repository.
*   **Feature Support:** This method only supports the frontend application. The RAG API (and any other backend functionality) will not be available.
*   **Guide:** [GitHub Pages Deployment Guide](./github-pages-deployment.md)

---

## 2. Vercel

*   **Description:** A robust platform for deploying modern web applications. It supports both static frontends and serverless functions, allowing for the deployment of the full application, including the RAG API.
*   **Feature Support:** Full support for the frontend and the Python-based RAG API via Vercel Serverless Functions.
*   **Guide:** [Vercel Deployment Guide](../4_Formula/formula_vercel_deployment.md)

---

## 3. Netlify (Vercel Alternative)

*   **Description:** A popular alternative to Vercel that also offers a comprehensive platform for deploying web applications with serverless functions.
*   **Feature Support:** Full support for the frontend and the Python-based RAG API via Netlify Functions.
*   **Guide:** [Netlify Deployment Guide](../4_Formula/formula_netlify_deployment.md)
