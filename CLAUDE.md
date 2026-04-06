# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Vite HMR)
npm run build      # Type-check + production build (tsc -b && vite build)
npm run lint       # ESLint
npm run preview    # Preview production build
```

## Architecture

This is a React 19 + TypeScript SPA — an interactive canvas that visualizes an "Agentic Design System" pipeline (Figma → React component library → app). No backend; all data is hardcoded.

### Navigation Modes

The app has three modes managed by Zustand (`src/store/useAppStore.ts`):

- `overview` — full canvas showing all 5 cards
- `zoom` — focused view on a single card's internals
- `workflow` — step-by-step walkthrough highlighting active cards/connections

Hash-based routing (`#zoom-cardId`, `#workflow-workflowId`) makes views deep-linkable.

### Data Layer

All content lives in `src/data/`:
- `schema.ts` — TypeScript types: `Card`, `SubBlock`, `Connection`, `Workflow`, `WorkflowStep`
- `db.ts` — hardcoded arrays: `CARDS[]` (5 nodes), `CONNECTIONS[]` (~14 edges), `WORKFLOWS[]`

Connection types: `native | mcp | npm | cli | weak | warning` — each renders differently in `ConnectionEdge.tsx`.

### Component Tree

```
App.tsx                     ← screen transitions (Intro → SpatialScrolly)
├── IntroScreen.tsx          ← animated welcome
└── SpatialScrolly.tsx       ← main interactive canvas
    ├── CanvasRenderer.tsx   ← places cards + edges, handles mode animations
    │   ├── CardNode.tsx     ← individual card with expandable SubBlocks
    │   └── ConnectionEdge.tsx ← animated SVG edges
    ├── NarrativePanel.tsx   ← text panel for selected element
    ├── ControlPanel.tsx     ← nav controls
    └── FloatingNav.tsx      ← floating action menu
```

### Styling

- CSS custom properties defined in `src/index.css` (colors, shadows, spacing)
- Inline styles using typed `Record<string, CSSProperties>` objects — no CSS modules or Tailwind
- Custom fonts: "Graphik LCG" (sans) and "Canela Deck" (serif), loaded from `src/assets/`
- Framer Motion handles all animations

### State

`useAppStore` (Zustand) tracks: `mode`, `activeCardId`, `activeWorkflowId`, `currentStepIndex`. Wheel events on `App.tsx` manage screen-level transitions; pan/zoom within `SpatialScrolly` are local state.
