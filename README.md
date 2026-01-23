# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Resenity

> Calm insight for competitive gaming

**Live Demo**: [resenity-web.vercel.app](https://resenity-web.vercel.app/) 🚀

## 🎯 What is Resenity?

Resenity helps competitive gamers make smarter pre-game decisions by turning complex match data into clear, explainable win predictions.

**The Problem**: Players face information overload before matches — scattered stats, unclear matchups, and gut-feel decisions.

**Our Solution**: Simple, data-driven predictions with clear "why" explanations, designed for League of Legends (with multi-game support planned).

---

## ✨ Features

- **Win Probability** — Fast, reliable match outcome predictions
- **Explainable Insights** — Understand exactly why one team has an edge
- **Match History** — Save predictions and learn patterns over time
- **No Login Required** — Try the demo instantly, save results later

---

## 🛠️ Tech Stack

**Frontend**:
- React 19 (Vite)
- CSS3 (Custom design system)
- Component-based architecture

**Deployment**:
- Vercel (CI/CD)

**Coming Soon**:
- Firebase Auth (user accounts)
- Firestore (prediction storage)
- Prediction algorithms (weighted Elo scoring)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ and npm

### Installation
```bash
# Clone the repo
git clone https://github.com/SurgeWindAndFire/Resenity.git
cd resenity

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build for Production
```bash
npm run build
npm run preview
```

---

## 📂 Project Structure
```
resenity/
├── src/
│   ├── components/
│   │   ├── home/          # Homepage sections
│   │   └── layout/        # Reusable layout components
│   ├── pages/             # Route pages
│   ├── styles/            # CSS modules
│   └── App.jsx
├── public/
└── index.html
```

---

## 🎯 Roadmap

### ✅ Phase 1: Homepage MVP
- [x] Landing page design
- [x] Demo preview section
- [x] Responsive layout
- [x] Deployed to Vercel

### 🔜 Phase 2: Authentication
- [ ] Firebase Auth integration
- [ ] Login/signup pages
- [ ] Protected routes

### ⏳ Phase 3: Core Features
- [ ] Create match flow
- [ ] Prediction algorithm
- [ ] Match history & saving

### 🌟 Phase 4: Advanced
- [ ] Riot API integration
- [ ] Multi-game support
- [ ] Public leaderboards

---

## 📧 Contact

**Project Link**: [github.com/SurgeWindAndFire/Resenity](https://github.com/SurgeWindAndFire/Resenity)

---

## 📄 License

MIT License

---

**Built with focus on clean code, UX, and scalability.** 🚀