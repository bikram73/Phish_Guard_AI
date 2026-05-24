
# Phish Guard AI 🛡️🤖

Phish_Guard_AI is a lightweight phishing/spam detector that runs locally in the browser. It uses a Vite + React + TypeScript frontend, an offline analyzer, and an optional trained model generated from the Kaggle SMS Spam Collection dataset.

**Key Features**
- **🧠 Offline Message Analysis:** the browser analyzes text locally with no Supabase or external API calls.
- **⚡ Real-time UI:** fast interactive interface built with Vite + React.
- **📊 Analytics & Threat Meter:** visual components to show threat levels and historical metrics.
- **🧪 Trainable Model:** optionally train a local Naive Bayes model from the Kaggle SMS Spam dataset.
- **🔒 Privacy Friendly:** messages stay on the local device unless you add your own backend.

**Repository Structure**

```
.
├─ eslint.config.js
├─ index.html
├─ package.json
├─ postcss.config.js
├─ tailwind.config.js
├─ tsconfig.json
├─ vite.config.ts
├─ src/
│  ├─ App.tsx
│  ├─ main.tsx
│  ├─ index.css
│  ├─ api/
│  │  └─ analyze.ts
│  ├─ components/
│  │  ├─ AnalyticsBar.tsx
│  │  ├─ ChatInterface.tsx
│  │  ├─ Navbar.tsx
│  │  └─ ThreatMeter.tsx
│  ├─ lib/
│  │  ├─ cookies.ts
│  │  ├─ offlineAnalyzer.ts
│  │  └─ storage.ts
│  └─ pages/
│     ├─ HomePage.tsx
│     └─ AboutPage.tsx
├─ scripts/
│  └─ train-spam-model.mjs
└─ README.md
```

**Important Files**
- Frontend entry: [src/main.tsx](src/main.tsx#L1)
- App component: [src/App.tsx](src/App.tsx#L1)
- Offline analyzer: [src/lib/offlineAnalyzer.ts](src/lib/offlineAnalyzer.ts#L1)
- Client API route: [src/api/analyze.ts](src/api/analyze.ts#L1)
- Training script: [scripts/train-spam-model.mjs](scripts/train-spam-model.mjs#L1)
- Chat UI: [src/components/ChatInterface.tsx](src/components/ChatInterface.tsx#L1)

Getting Started 🚀

Prerequisites
- Node.js 18+ (or LTS)
- npm or yarn
- (Optional) `kaggle` CLI for dataset download

Install dependencies

```bash
npm install
# or
yarn
```

Running locally

```bash
npm run dev
# or
yarn dev
```

Build for production

```bash
npm run build
```

Offline training with the Kaggle dataset 📥

Download the dataset from Kaggle:

Dataset: https://www.kaggle.com/datasets/uciml/sms-spam-collection-dataset

```bash
kaggle datasets download -d uciml/sms-spam-collection-dataset -p data --unzip
```

This creates a file named `data/SMSSpamCollection`. Then train the local model and write it to `public/spam-model.json`:

```bash
npm run train:model
```

The dataset provides a single tab-separated file `SMSSpamCollection` with the fields `label` and `message`. The training script builds a simple Naive Bayes model and the app loads it locally from `/spam-model.json` if the file exists.

Example workflow:

1. Create `data/` and place `SMSSpamCollection` there.
2. Run `npm run train:model` to generate `public/spam-model.json`.
3. Start the app with `npm run dev`.

Quick local workflow

```bash
npm install
npm run train:model
npm run dev
```

If `public/spam-model.json` is missing, the app still works using the built-in local heuristic analyzer.

Security & Privacy 🔐
- Messages stay on your machine when you use the offline mode.
- If you train with personal data, ensure consent and anonymization.

Usage

1. Open the app in the browser via `npm run dev`.
2. Enter or paste a message in the chat interface and submit.
3. The UI displays a threat score and suggested actions.

Contributing 🤝
- Feel free to open issues or PRs. Typical ways to contribute:
	- Improve model training and add notebooks/scripts in `scripts/` or `ml/`.
	- Add end-to-end tests for the analysis API.
	- Improve UI/UX and accessibility.

License
- This project is provided as-is. Add a LICENSE file to specify terms.

Questions or next steps?
- I updated `README.md` with the offline workflow and dataset training steps. Would you like me to add a small test command that confirms `public/spam-model.json` is loading correctly? 

