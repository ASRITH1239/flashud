# Intern Onboarding Guide: Flashud Fashion Ecommerce

Welcome to the Flashud development team! This guide will help you set up the project and understand how to contribute to our premium fashion ecommerce platform.

## 1. Project Overview
The project consists of two separate React applications built with Vite and Tailwind CSS:
- **`admin`**: The administrative dashboard for managing inventory, orders, and customers.
- **`user`**: The customer-facing storefront.

### Tech Stack
- **Frontend**: React 19
- **Styling**: Tailwind CSS (Premium Dark Theme)
- **Routing**: React Router Dom
- **Build Tool**: Vite

## 2. Local Setup

### Prerequisites
- Node.js (v18+)
- npm

### Installation
From the root directory (`flashud/`), run the following for both projects:

**For Admin:**
```bash
cd admin
npm install
```

**For User:**
```bash
cd user
npm install
```

### Running the Development Servers
Open two terminal windows:

**Terminal 1 (Admin - Port 5173):**
```bash
cd admin
npm run dev
```

**Terminal 2 (User - Port 5178):**
```bash
cd user
npm run dev
```

## 3. Design System & Aesthetics
We follow a strict **Premium Dark Theme** for both applications:
- **Background**: Very Deep Black (`#0a0a0a`)
- **Primary Accent**: Premium Orange (`#ff6600`)
- **Rules**:
    - **NO SHADOWS**: Use flat borders or high-contrast backgrounds instead.
    - **NO GRADIENTS**: Use solid colors or low-opacity overlays.
    - **Formal Typography**: High tracking (letter-spacing) for headers and uppercase labels.

Tailwind classes to use:
- `bg-fashion-black` (custom)
- `text-fashion-orange` (custom)
- `border-fashion-orange`

## 4. How to Make Changes

### Adding a New Page
1. Create a new component in `src/pages/YourPage.jsx`.
2. Wrap it with the standard layout container:
   ```jsx
   const YourPage = () => (
     <div className="max-w-7xl mx-auto">
       <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-8">Title</h2>
       {/* Content */}
     </div>
   );
   ```
3. Add the route in `App.jsx`.
4. Add a `Link` to the new route in `components/Header.jsx`.

### Modifying Styles
Edit `tailwind.config.js` in the respective folder to change global colors or spacing.

## 5. Pushing to GitHub

Once you have made your changes, follow these steps to push to the repository:

1. **Initialize Git (if not done):**
   ```bash
   git init
   git remote add origin https://github.com/ASRITH1239/flashud.git
   ```

2. **Stage and Commit:**
   ```bash
   git add .
   git commit -m "Brief description of your changes"
   ```

3. **Push to Main:**
   ```bash
   git branch -M main
   git push -u origin main
   ```

---
**Note:** Always ensure build success with `npm run build` before pushing.
