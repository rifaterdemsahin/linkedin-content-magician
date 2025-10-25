# 🛠️ Local Development Environment

## 📋 Prerequisites

Before running the LinkedIn Content Magician locally, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Git** (for version control)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/rifaterdemsahin/linkedin-content-magician.git
cd linkedin-content-magician
```

### 2. Navigate to the Application Directory

```bash
cd 5_Symbols
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

### 5. View the Application

Open your browser and navigate to:

```text
http://localhost:5173
```

The application will automatically reload when you make changes to the source code.

## 📁 Project Structure

```text
5_Symbols/
├── src/                    # Source code
│   ├── App.jsx            # Main React component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles with Tailwind
├── public/                # Static assets
├── dist/                  # Build output (generated)
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── postcss.config.js      # PostCSS configuration
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

## 🎨 Technology Stack

- **Frontend Framework**: React 19.2.0
- **Build Tool**: Vite 7.1.12
- **Styling**: Tailwind CSS 4.1.16
- **Icons**: Lucide React
- **Language**: JavaScript (JSX)

## 🔍 Development Features

### Hot Module Replacement (HMR)

- Changes to React components update instantly
- CSS changes apply without page refresh
- Fast development feedback loop

### Tailwind CSS

- Utility-first CSS framework
- Built-in responsive design
- Optimized for production builds

### React DevTools

Install the React Developer Tools browser extension for enhanced debugging:

- [Chrome Extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Firefox Extension](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

## 🐛 Troubleshooting

### Port Already in Use

If port 5173 is occupied:

```bash
npm run dev -- --port 3000
```

### Clear Node Modules

If experiencing dependency issues:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Issues

For build-related problems:

```bash
npm run build
npm run preview
```

## 📝 Development Workflow

1. **Start Development**: `npm run dev`
2. **Make Changes**: Edit files in `src/` directory
3. **View Changes**: Browser auto-refreshes
4. **Test Build**: `npm run build` before committing
5. **Commit Changes**: Use Git for version control

## 🔒 Environment Variables

Currently, no environment variables are required for local development. If needed in the future, create a `.env` file in the `5_Symbols/` directory.

## 📊 Performance Tips

- Use React DevTools Profiler for performance analysis
- Monitor bundle size with `npm run build`
- Utilize Vite's fast refresh for optimal development experience

---

**Last Updated**: October 25, 2025  
**Vite Version**: 7.1.12  
**React Version**: 19.2.0