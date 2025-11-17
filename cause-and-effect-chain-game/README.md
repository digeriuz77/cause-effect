# Cause & Effect Chain Game 🎓

An interactive educational app for EAL students to develop relational thinking skills through cause-and-effect connections using SOLO Taxonomy.

## Features

✨ **SOLO Taxonomy Integration**: Real-time feedback showing cognitive complexity levels (Unistructural → Multistructural → Relational → Extended Abstract)

🇲🇾 **Bahasa Melayu Support**: Hover tooltips with L1 translations to reduce cognitive load for EAL learners

📝 **Scaffolded Paragraph Builder**: Guided 5-step writing process to demonstrate relational knowledge

📊 **Visual Progress Tracking**: See thinking level advancement with badges and progress bars

🎮 **5 Complete Levels**: Storm Formation, Circuits, Math Logic, Cell Division, Literature Analysis

## Run Locally

**Prerequisites:** Node.js (v18+)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   ```
   http://localhost:3000
   ```

## Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

## Deploy to Vercel

This app is configured for easy Vercel deployment:

1. **Connect your GitHub repository to Vercel**

2. **Configure build settings:**
   - Framework Preset: **Vite**
   - Root Directory: `cause-and-effect-chain-game`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Deploy!** No environment variables needed.

The included `vercel.json` handles SPA routing automatically.

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling (via CDN)

## How Students Use It

### Stage 1: Watch & Learn
Watch educational videos and answer comprehension questions (80% to pass).

### Stage 2: Build the Chain
- Select causes and effects to make connections
- Receive immediate SOLO level feedback
- Track thinking level progression
- Hover over UI elements for Bahasa Melayu translations

### Stage 3: Analyze the Text
Highlight causes and effects within provided stories.

### Stage 4: Write Your Paragraph
- Follow 5 scaffolded prompts
- Build multi-sentence paragraphs
- Get SOLO feedback on each sentence
- Demonstrate relational thinking in writing

## SOLO Taxonomy Levels

- 🔵 **Unistructural**: Simple connection (1 cause → 1 effect)
- 🟣 **Multistructural**: Multiple causes identified
- 🟢 **Relational**: Understanding how causes work together as a system
- ⭐ **Extended Abstract**: Applying patterns to new contexts

## Project Structure

```
cause-and-effect-chain-game/
├── components/          # React components
├── hooks/              # Custom React hooks
├── constants/          # Level data & game content
├── translations/       # Bahasa Melayu dictionary
├── utils/              # SOLO taxonomy logic
├── types.ts            # TypeScript definitions
├── App.tsx             # Main app component
└── index.tsx           # Entry point
```

## License

Educational use - developed for EAL student learning

## Contributing

This project helps students develop critical thinking skills through SOLO taxonomy. Contributions that enhance educational value are welcome!
