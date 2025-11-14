# Project README

## Overview
This React project contains a set of modern, animated UI components built with Tailwind CSS and a canvas-based visual.



## Features
- React + Tailwind CSS
- Responsive layout and accessible markup
- Smooth hover animations
- Canvas animations for wireframe visuals
- Modular components for easy reuse

---

## Folder Structure
```
src/
├── components/
│   ├── About.jsx
│   ├── Contact.jsx
│   ├── DroneShowcase.jsx
│   ├── FeatureGrid.jsx
│   ├── FloatingHeadline.jsx
│   ├── Hero.jsx
│   ├── Highlights.jsx
│   ├── Nav.jsx
│   ├── ParallaxSection.jsx
│   ├── ParticlesBackground.jsx
│   ├── PlaneWireframe.jsx
│   ├── PlaneWireframeAlt.jsx
│   └── WireframeTunnel.jsx
├── hooks/
│   └── useScrollReveal.jsx
├── App.js
├── index.js
├── index.css
└── tailwind.config.js
```

---

## 🛠️ Installation
Ensure Node.js and npm/yarn are installed:

```bash
npm install
# or
yarn install
```

Install Tailwind (if not already):

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## ▶️ Development
Start the dev server:

```bash
npm run dev
# or (CRA)
npm start
```

Build for production:

```bash
npm run build
```

---

## Tailwind configuration
Place this in `tailwind.config.js` at project root. It configures the content scanning paths, extends theme colors, and adds custom fonts.

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: "#1e1e1e",
        orange: "#ff7b00",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
};
```

Notes:
- Make sure you have the fonts loaded (via Google Fonts import in `index.html` or a CSS `@import`).
- `content` paths must match where your JSX/TSX files live so Tailwind purges unused styles correctly.

---

## 🎨 `index.css`
This file should be located at `src/index.css`. It includes Tailwind directives and several utility classes/styles used by the components.



---

## ✅ Tips & Troubleshooting
- If `bg-charcoal` or other custom classes don't apply, ensure Tailwind is processing `index.css` and that `tailwind.config.js` `content` paths include your files.
- To change the accent orange globally, update the `orange` color in `tailwind.config.js`.
- If you see missing fonts, add a link to Google Fonts in `public/index.html` or import in `index.css`.

Happy Coding :)
Make India Proud

---

