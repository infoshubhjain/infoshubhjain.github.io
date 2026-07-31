# Contributing to Shubh Jain's Portfolio

Thank you for your interest in contributing to this portfolio project! This document provides guidelines for development, testing, and submission.

## Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/infoshubhjain.github.io.git
   cd infoshubhjain.github.io
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The site will be available at `http://localhost:3000`

4. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Guidelines

### Code Style

- **TypeScript**: Use TypeScript with strict mode enabled
- **ESLint**: The project uses ESLint with Next.js and TypeScript rules
- **Formatting**: Consider using Prettier for consistent formatting (not currently enforced)
- **Naming**: Use descriptive variable and function names
- **Comments**: Add comments for complex logic, but prefer self-documenting code

### Component Guidelines

- Use functional components with hooks
- Explicitly type all props with interfaces
- Keep components focused and single-purpose
- Use custom hooks for reusable logic
- Follow the existing component structure in `src/components/`

### Content Updates

All portfolio content is centralized in `src/lib/portfolio-data.ts`:

1. **Add new projects**: Update the `projects` array
2. **Update experience**: Modify the `experience` array
3. **Add skills**: Update the `skills` object
4. **Leadership roles**: Update the `leadership` array

**Important**: Edit content in `portfolio-data.ts`, not in individual components. Components automatically reflect changes.

### Theme Guidelines

The project has two themes:
- **Classic Theme** (`/prototype`): Premium dark theme
- **F1 Theme** (`/`): Racing-themed design

When making changes:
- Test both themes if your changes affect shared components
- Follow the existing color token system in `src/app/globals.css`
- Use CSS custom properties for theming

### Performance Considerations

- Lazy-load 3D scenes with Suspense
- Use `useMemo` and `useCallback` for expensive computations
- Optimize images with Next.js Image component
- Test performance on lower-end devices
- Profile animations and reduce unnecessary re-renders

### Accessibility

- Use semantic HTML elements
- Add ARIA labels to interactive elements
- Ensure keyboard navigation works
- Test with screen readers
- Support `prefers-reduced-motion`
- Maintain color contrast ratios

## Testing

Currently, the project uses manual testing:

```bash
# Run development server
npm run dev

# Build verification
npm run build

# Linting
npm run lint
```

### Manual Testing Checklist

- [ ] Both themes render correctly
- [ ] All navigation links work
- [ ] Forms submit properly
- [ ] 3D scenes load without errors
- [ ] Responsive design on mobile/tablet/desktop
- [ ] Keyboard navigation works
- [ ] Reduced motion preferences are respected
- [ ] Contact form opens email client

## Build and Deployment

### Local Build

```bash
npm run build
```

### GitHub Pages Build

```bash
GH_PAGES=1 npx next build
```

The build outputs to `./out/` for GitHub Pages deployment.

## Git Workflow

### Commit Messages

Use conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(hero): add 3D car model with animations
fix(contact): resolve mailto link encoding issue
docs(readme): update setup instructions
```

### Pull Request Process

1. Update documentation if needed
2. Ensure all tests pass
3. Update the README if new features are added
4. Create a pull request with a clear description
5. Link related issues

### Code Review Focus Areas

- Code quality and maintainability
- Performance implications
- Accessibility compliance
- Cross-browser compatibility
- Mobile responsiveness
- Security considerations

## Issue Reporting

When reporting issues, please include:

- **Description**: Clear description of the problem
- **Steps to reproduce**: Detailed reproduction steps
- **Expected behavior**: What you expected to happen
- **Actual behavior**: What actually happened
- **Environment**: Browser, OS, device information
- **Screenshots**: If applicable, include screenshots

## Security Considerations

- Never commit secrets or API keys
- Use environment variables for sensitive data
- Validate all user inputs
- Keep dependencies updated
- Follow OWASP guidelines for web security

## Questions or Feedback?

For questions or feedback:
- Open an issue on GitHub
- Contact: shubhj3@illinois.edu
- LinkedIn: https://www.linkedin.com/in/infoshubhjain/

## License

By contributing, you agree that your contributions will be licensed under the MIT License.