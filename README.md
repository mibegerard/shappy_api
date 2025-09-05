
# shappy_api
> **Analyse complète du projet `shappy_api`**

## 📦 Fichiers principaux

- **`index.html`**  
    SPA React classique, point d’entrée `<div id="root"></div>`, chargement de `/src/index.jsx`, favicon, meta tags SEO/responsive.

- **`package.json`**  
    Projet React moderne, riche en dépendances :
    - **UI** : MUI, Emotion, Framer Motion, ApexCharts, React-Quill, Material UI Carousel
    - **State** : Redux Toolkit, React Redux, Formik, React Hook Form
    - **Routing** : React Router
    - **Paiement** : Stripe
    - **Utilitaires** : Axios, Device Detect, Toastify, etc.
    - **Tests** : Testing Library
    - **Build** : Vite, plugins, env-cmd
    - **Fonts** : Inter, Poppins, Roboto

- **`vite.config.mjs`**  
    Build/dev server avec Vite, plugins React, jsconfig paths, static copy. HTTPS local (mkcert), port 3000, ouverture auto du navigateur, alias/base configurables.

- **`README.md`**  
    Instructions classiques Create React App (`npm start`, `test`, `build`, `eject`). Documentation et liens vers React, CRA, code splitting, etc.

## 📁 Dossiers

- **`src/`**  
    Composants principaux (`App.jsx`, `index.jsx`, `reportWebVitals.js`). Organisation modulaire : `api`, `assets`, `context`, `hooks`, `layout`, `menu-items`, `routes`, `store`, `themes`, `ui-component`, `utils`, `views`, `yup`.

- **`public/`**  
    Fichiers statiques : favicon, index.html, logos, manifest, robots.txt.

- **`build/`**  
    Résultat du build : manifest, index.html, assets, static (css/js/media).

- **`dist/`**  
    Dossier de distribution (similaire à build, pour Vite).

- **`node_modules/`**  
    Dépendances installées.

## ⚙️ Autres fichiers

- **Config** : `jsconfig.json`, `tsconfig.node.json` (JS/TS, chemins)
- **Clés locales** : `localhost-key.pem`, `localhost.pem` (HTTPS local)
- **_redirects** : gestion des redirections (Netlify)
- **`yarn.lock`** : gestion des dépendances

---

## 📝 Synthèse

`shappy_api` est une application React moderne, bien structurée, orientée production, avec Vite pour le build/dev server.  
Elle intègre de nombreux outils pour l’UI, la gestion d’état, la validation, le paiement, la navigation et le testing.  
La structure du code est modulaire et adaptée à une application évolutive.  
La configuration permet un développement local sécurisé (HTTPS), des redirections et une gestion fine des dépendances.

> Pour une analyse détaillée d’un dossier ou fichier spécifique, ou des liens entre modules, précise ta demande !
