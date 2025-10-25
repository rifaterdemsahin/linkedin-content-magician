# Project Journey

This file documents the development journey of the LinkedIn Content Magician project, starting from the initial commit.

## Commit History

```
commit 4ef145e08fa76c9c310018c9f2c52db89d9d9818
Author: rifaterdemsahin <rifaterdemsahin@gmail.com>
Date:   Sat Oct 25 11:43:49 2025 +0100

    Refactor code structure for improved readability and maintainability
```

## Prompts for Project Recreation

If you wanted to recreate this project from scratch, you could use the following series of prompts:

### 1. Initial Project Setup

"Set up a new project with a unique seven-folder structure. The folders should be named `1_Real`, `2_Environment`, `3_UI`, `4_Formula`, `5_Symbols`, `6_Semblance`, and `7_Testing`. Each folder should contain a `README.md` file that explains its purpose. Also, create a main `README.md` file in the root directory that explains the purpose of the entire project and the seven-folder structure."

### 2. Create the Vite + React Application

"Inside the `5_Symbols` directory, create a new Vite + React application. This will be the core of the project. Make sure to include the necessary configuration files, such as `package.json`, `vite.config.js`, and a basic `src` directory with a sample component."

### 3. Add Root Files

"In the root of the project, add the following files:
- `.gitignore`: A standard gitignore file for a Node.js project.
- `LICENSE`: An MIT license file.
- `index.html`: A simple HTML file that redirects to the main application in `/5_Symbols/dist/index.html`.
- `robots.txt`: A simple robots.txt file to allow all user agents."

### 4. Populate Documentation

"Populate the `README.md` files in each of the seven directories with a more detailed explanation of their purpose. Also, create the following files in the `1_Real` directory:
- `objectives.md`: To define the project's high-level objectives.
- `keyresults.md`: To define the key results that will measure the project's success."

### 5. Set up GitHub Pages Deployment

"Create a GitHub Actions workflow file in `.github/workflows/static.yml` to deploy the entire repository as a static site to GitHub Pages. The workflow should not include a build step, as the site is already built and the output is in the `5_Symbols/dist` directory."
