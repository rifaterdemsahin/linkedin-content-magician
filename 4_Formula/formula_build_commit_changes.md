# Formula for Running the Vite Application

This document explains how to run the Vite application and why simply opening the `dist/index.html` file in a browser will not work.

## The Problem: Blank Page

When you open the `dist/index.html` file directly in your browser (e.g., using a `file://` URL or a simple HTTP server like the Live Server extension), you will likely see a blank page. This is because Vite builds the application with the assumption that it will be served from the root of a domain. The paths to the JavaScript and CSS assets in the `index.html` file are absolute (e.g., `/assets/index-D0wh4GYu.js`), and they cannot be found when the file is opened directly.

## The Solution: Development Server

To run the application correctly, you need to use the Vite development server. This server is designed to handle the complexities of a modern web application, including routing and asset serving.

### Steps to Run the Application

1.  **Add a `dev` script to `package.json`:**

    ```json
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "build": "vite build",
      "dev": "vite"
    },
    ```

2.  **Run the development server:**

    Open your terminal in the `/Users/rifaterdemsahin/projects/linkedin-content-magician/5_Symbols/` directory and run the following command:

    ```bash
    npm run dev
    ```

    You should see an output similar to this:

    ```bash
    > linkedin-content-magician@1.0.0 dev
    > vite


      VITE v7.1.12  ready in 148 ms

      ➜  Local:   http://localhost:5173/
      ➜  Network: use --host to expose
      ➜  press h + enter to show help
    ```

3.  **Open the application in your browser:**

    The terminal will display a URL (usually `http://localhost:5173`). Open this URL in your browser to see your application running.

## Development Workflow Diagram

Here is a Mermaid diagram illustrating the development workflow:

```mermaid
graph TD
    A[Start] --> B{Run 'npm run dev'};
    B --> C[Vite starts development server];
    C --> D[Provides a URL (e.g., http://localhost:5173)];
    D --> E{Open URL in browser};
    E --> F[Application runs successfully];
```

