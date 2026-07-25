# 📋 Billora Changelog

All notable changes to Billora will be documented in this file.

This project follows semantic versioning.

---

# Version Format

Major.Minor.Patch

Example:

1.0.0

---

# Types of Changes

Added

Changed

Improved

Fixed

Removed

Security

Performance

Refactored

Documentation

---

# Upcoming

## Merged

- Combined two divergent working branches into one:
  - Landing page redesign branch: sticky stacked-panel scroll sequence
    (`StackedPanel`), redesigned `StatsStrip` (icon cards + heading), new
    `CasesSection`, `HeroInvoiceMockup`, and `PageLoader`.
  - Login page 3D branch: replaced the CSS-only phone mockup with a real
    3D model (`Phone3D`, `public/models/iphone-17-pro-max.glb`) rendered
    via `@react-three/fiber`, with the Billora dashboard swapped onto the
    screen texture (`public/screens/dashboard-screen.png`).
- Added `@react-three/fiber`, `@react-three/drei`, `three`, and
  `@types/three` to `package.json` to support the 3D phone mockup.
- Adopted `defaultTheme="light"` in `ThemeProvider` (from the 3D branch)
  so first-time visitors see Billora's light theme by default, with
  `enableSystem` kept as an opt-in toggle option.

## Added

- Initial project documentation
- Design system
- Motion system
- Development rules
- Component guide
- Roadmap

---

# v0.1.0

## Added

- Initial project setup
- Next.js App Router
- Tailwind CSS
- Prisma ORM
- Authentication
- Landing Page
- Navbar
- Hero Section
- Features Section
- Pricing Section
- About Section
- Contact Section
- Footer

## Improved

- Responsive layout
- Animation system
- Project structure

## Fixed

- Build issues
- Package conflicts

---

# Changelog Rules

Every update should include:

## Added

New features.

## Changed

Modified functionality.

## Improved

UX/UI improvements.

## Fixed

Bug fixes.

## Removed

Deleted functionality.

## Performance

Optimization work.

## Security

Security improvements.

## Documentation

Documentation updates.

---

# Example

## v0.2.0

### Added

- Dashboard
- Invoice Builder
- Customer Module

### Improved

- Hero animation
- Navigation
- Mobile responsiveness

### Fixed

- Button alignment
- Hydration warning

### Performance

- Reduced bundle size
- Lazy loaded charts

---

# Release Checklist

Before creating a new version:

- Build passes
- TypeScript passes
- Responsive verified
- Accessibility verified
- Performance checked
- Documentation updated

---

# Notes

Never delete previous entries.

Always append new releases at the top of the version history.

Keep changelog concise, accurate, and chronological.