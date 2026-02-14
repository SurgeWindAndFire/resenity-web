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

> The Straightfoward insight for the future of competitive gaming.

**Live Website**: [resenity-web.vercel.app](https://resenity-web.vercel.app/) 

## What is Resenity?

Resenity helps competitive gamers make smarter pre-game decisions by turning complex match data into clear, explainable win predictions. 
The website provides their services to professional gamers who use their platform to choose which games they should play.

**The Key Problem**: Players are often left wondering and confused before matches due to stats being scattered everywhere, unclear matchups, and polarizing decisions.

**The Solution**: Combine everything necessary tool together to produce an easy-to-read service, providing predictions before your next match starts with detailed
reasoning (Plans for multiple competitive titles are coming soon in the future).
---

## Features

### Core Features
- **Live Game Detection** — Enter your Player ID and the service automatically detects 10 players in lobby in real-time
- **Win Probability** — Quick, dependable match outcome predictions based on our algorithm and verifiable data
- **Explainable Insights** — Understand exactly why one team is more likely to win (win rate, rank, champion mastery)
- **Prediction History** — Save your predictions and track your accuracy of your own or other's matches over time
- **Stats Dashboard** — View your prediction accuracy with easy-to-read and trustworthy details

### Deep Analysis
- **Champion-Specific Win Rates** — Fetch recent ranked matches to calculate win rates on specific champions in ranked matches
- **One-Trick Detection** — Identify which players acheived high levels of mastery on their champions (or only play that champion)
- **Key Factors** — Visual indicators and important details influencing the decision of the prediction

### Community
- **Suggestions System** — Submit feature requests, report issues and bugs within the service, and upvote community ideas
- **User Profiles** — Customize your username and unlock the ability to track member history

---

## Technologies Used

**Frontend**:
- React 19 (Vite)
- React Router (For navigation purposes)
- CSS3 (Custom design system)
- Component-based architecture (Contains reusable UI components)

**Backend**:
- Firebase Authentication - User accounts with email/password setup
- Cloud Firestore - Storage for predictions, user profiles, and suggestions/feedback
- Riot Game API - Live game data, summoner info, champion mastery, match history

**Deployment**:
- Vercel (CI/CD)

**Coming Soon**:
- Firebase Auth (user accounts)
- Firestore (prediction storage)
- Prediction algorithms (weighted Elo scoring)

---

## Project Structure
```
resenity/
├── api/riot/                 # Vercel serverless functions
│   ├── summoner.js           # Player lookup
│   ├── live-game.js          # Active game detection
│   ├── champion-mastery.js   # Mastery data
│   └── match-history.js      # Deep analysis data
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── auth/             # Protected routes
│   │   ├── home/             # Landing page sections
│   │   ├── layout/           # Navbar, Footer
│   │   ├── match/            # Team builder, champion select
│   │   ├── prediction/       # Outcome selector
│   │   └── ui/               # Spinner, Toast, Skeleton
│   ├── contexts/             # React contexts (Auth, User, Toast)
│   ├── hooks/                # Custom hooks
│   ├── pages/                # Route pages
│   ├── services/             # API service functions
│   ├── styles/               # Page-specific CSS
│   └── utils/                # Prediction algorithm
├── public/                   # Static assets
└── package.json
```
---

## Getting Started

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

## Roadmap

### PLANNED

- Multi-Region Support (EUW, EUNE, KR, etc.)
- Team Composition Analysis
- Track Performance Trends over time
- A Standalone Desktop App that makes accessing the service easier
- A Mobile App Version (Low Priority)

## Contact

**Project Link**: [github.com/SurgeWindAndFire/Resenity](https://github.com/SurgeWindAndFire/Resenity)

---

## License

MIT License

---

**Built with focus on clean code, UX, and scalability.** 

---

## Disclaimer

Resenity isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.

