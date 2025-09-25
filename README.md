## Workflow Editor (Next.js + React Flow + Tailwind)

An Apple‑inspired, minimal workflow editor built with Next.js 15, React 19, TypeScript, TailwindCSS 4, and React Flow. Includes draggable/connectable nodes, inline rich text editing, context menus (canvas and node), a retractable sidebar, dark mode, and local persistence.

### Features
- React Flow canvas with Background, Controls, MiniMap
- Add nodes from sidebar or by right‑clicking the canvas
- Node shapes: rectangle, circle, diamond
- Inline editing for H1/H2/Paragraph blocks (double‑click)
- Right‑click node menu: edit content, change colors, delete
- Auto‑contrast text with user override
- Save/Load to localStorage, Export/Copy JSON
- Dark/Light theme toggle, Fullscreen

### Getting Started

1. Install dependencies
```bash
npm install
```

2. Run the dev server
```bash
npm run dev
```

3. Open the app
```
http://localhost:3000
```

### Scripts
- `npm run dev` – start Next.js in dev mode (Turbopack)
- `npm run build` – build for production
- `npm run start` – run the production server
- `npm run lint` – run ESLint

### Project Structure
- `app/page.tsx` – Apple‑style landing page
- `app/workflow/page.tsx` – Workflow editor (React Flow)
- `components/ui/*` – UI components
- `lib/*` – utilities

### Usage Tips
- Sidebar → Add Node to create a node; use defaults for BG/Text color
- Right‑click canvas → Add Node at cursor
- Right‑click node → Edit content/colors, Delete
- Double‑click text → Edit; Enter to save (Shift+Enter for newline in paragraphs)
- Save/Load in sidebar uses localStorage; Export/Copy for JSON

### Customization
- Tweak Apple‑like styles in `app/workflow/page.tsx` (Tailwind classes and global styles near the bottom)
- Extend node data model to add new block types or behaviors

### Tech
- Next.js 15, React 19, TypeScript
- TailwindCSS 4
- React Flow

### License
MIT

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
