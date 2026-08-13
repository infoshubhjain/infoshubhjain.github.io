# Shubh Jain — Portfolio

An interactive, F1-themed portfolio website showcasing AI systems, research, and engineering projects. Built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Three.js, and Framer Motion.

- **Live Site**: https://infoshubhjain.github.io — racing-themed experience with telemetry HUD, timing tower, circuit map and a Grid Run minigame

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server (localhost:3000)
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 16 (App Router) with React 19
- **Styling**: Tailwind CSS v4 with custom theme system
- **UI Components**: shadcn/ui (Radix UI primitives)
- **3D Graphics**: Three.js, React Three Fiber, Drei
- **Animations**: Framer Motion, Lenis smooth scroll
- **Fonts**: Geist Sans, Geist Mono, Space Grotesk (via next/font/google)
- **Icons**: Lucide React

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with fonts, SEO, themes
│   ├── page.tsx           # The homepage
│   └── globals.css        # Global styles and theme tokens
├── components/
│   ├── site/prototype/    # Every component on the page
│   └── ui/                # shadcn/ui primitives
└── lib/
    ├── prototype-data.ts  # Single source of truth for all content
    ├── hooks/             # Custom React hooks
    └── utils.ts           # Utility functions
```

### Content Management
All portfolio content is centralized in `src/lib/prototype-data.ts`. This includes:
- Profile information
- Projects and research
- Work experience
- Skills and technologies
- Leadership roles
- Achievements

**⚠️ Important**: Edit content in `prototype-data.ts`, not in individual components. The `prototype-` prefix is historical — the F1 design began as a prototype, replaced the original site, and kept its filenames.

## 🎨 Theming

### Team Liveries
The F1 theme ships two selectable liveries (Ferrari / Red Bull), defined as `PALETTES` in `src/lib/prototype-theme.ts` and exposed as `--pt-*` CSS variables.

### Theme Tokens
Colors use OKLCH color space for perceptual uniformity:
- Primary accents: Emerald (165°), Cyan (200°), Violet (300°)
- Dark mode: Deep canvas with luminous accents
- Light mode: Clean paper-like canvas with high contrast

Custom CSS variables defined in `src/app/globals.css` for consistent theming.

## 🚢 Deployment

### GitHub Pages
The site is deployed as a static export to GitHub Pages:

```bash
# Build for GitHub Pages
GH_PAGES=1 npx next build

# Output directory: ./out
```

**CI/CD**: Pushing to the `source` branch triggers `.github/workflows/deploy.yml`, which builds and publishes to GitHub Pages.

### Environment Variables
- `GH_PAGES=1`: Enables static export mode for GitHub Pages
- No runtime environment variables required for the static site

## 🧪 Testing

Currently, the project uses manual testing via:
- Development server: `npm run dev`
- Build verification: `npm run build`
- Linting: `npm run lint`

**Future**: Add automated testing with Jest/Vitest and Playwright.

## 📦 Performance Optimizations

- Lazy-loaded 3D scenes with Suspense
- DPR capped at 1.8 for integrated GPUs
- Particle count tuned for performance
- Telemetry HUD throttled when not scrolling
- Ambient particles pause when tab hidden
- Reduced motion support throughout

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support (1-9 keys for sections, Cmd+K for command palette)
- Focus management and visible focus rings
- `prefers-reduced-motion` support on all animations
- Screen reader compatibility

## 🔧 Development Guidelines

### Code Style
- TypeScript with strict mode (working toward full strictness)
- ESLint for code quality (currently permissive, incrementally enabling rules)
- Prettier for formatting (recommended but not enforced)
- Conventional commits for git messages

### Component Patterns
- Functional components with hooks
- Props interfaces explicitly typed
- Custom hooks for reusable logic
- Framer Motion for animations
- CSS-in-JS via Tailwind classes

### Adding New Content
1. Update `src/lib/prototype-data.ts` with new content
2. Components automatically reflect changes
3. Test both themes if applicable
4. Update timestamps and relevant sections

## 🐛 Troubleshooting

### Build Issues
- Clear cache: `rm -rf .next out`
- Reinstall dependencies: `rm -rf node_modules package-lock.json && npm install`
- Check Node version: Required Node.js 18+

### 3D Model Issues
- Ensure `public/draco/` contains Draco decoder files
- Check model paths in component code
- Verify browser supports WebGL 2.0

### Styling Issues
- Clear browser cache
- Check Tailwind CSS v4 compatibility
- Verify CSS custom properties are defined

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

This is a personal portfolio, but contributions are welcome! Please see CONTRIBUTING.md for guidelines.

## 📞 Contact

- Email: shubhj3@illinois.edu
- GitHub: https://github.com/infoshubhjain
- LinkedIn: https://www.linkedin.com/in/infoshubhjain/

---

Built with ❤️ using Next.js, React, and Three.js.