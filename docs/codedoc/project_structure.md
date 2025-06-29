frontend/
│
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
│       ├── images/
│       └── icons/
│
├── src/
│   ├── styles/
│   │   ├── global.css
│   │   ├── color.css
│   │   └── ... (other global or modular styles)
│   │
│   ├── js/
│   │   ├── app.js
│   │   ├── bewerten.js
│   │   ├── calculations.js
│   │   ├── reset.js
│   │   └── ... (other JS modules)
│   │
│   ├── components/
│   │   ├── Button.js
│   │   ├── FormSection.js
│   │   └── ... (if you use component-based UI, even with vanilla JS)
│   │
│   ├── features/
│   │   └── auth/
│   │        └── ... (auth feature modules)
│   │
│   ├── utils/
│   │   ├── format.js
│   │   └── ... (utility/helper functions)
│   │
│   └── main.js      # main entrypoint for Vite or build tool
│
├── .env
├── package.json
├── vite.config.js
└── README.md
