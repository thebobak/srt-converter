# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SRT Converter - a React 19 app that converts subtitle files (.srt) to VTT, TXT, and PDF formats. All processing happens client-side in the browser.

## Commands

- `npm run dev` - Start development server (http://localhost:5173)
- `npm run build` - Build for production (outputs to `dist/`)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Architecture

**App State** (`src/App.jsx`): Manages file processing state, coordinates upload → process → display results flow.

**Components** (`src/components/`):
- `FileUpload.jsx` - Drag-and-drop file input for .srt files
- `ResultItem.jsx` - Displays individual file with SRT/VTT/TXT/PDF download buttons
- `InfoSection.jsx` - Expandable "How It Works" accordion with output format descriptions, tips, and limitations
- `CodeAccordion.jsx` - Expandable "View Source Logic" section (currently hidden)

**Utilities** (`src/utils/`):
- `srtConverter.js` - Core conversion logic: SRT→VTT (timecode format), SRT→TXT (smart paragraph grouping), PDF generation via jsPDF
- `zipDownload.js` - Creates ZIP archive of all converted files via JSZip

## Styling

Uses Tailwind CSS v4 with CSS custom properties for the "Vintage Paperback" retro theme. Design tokens defined in `src/index.css` (colors, shadows, border radius). Interactive button styles use `.retro-press` and `.retro-shadow` utility classes.

## Accessibility

The app follows WCAG guidelines for keyboard navigation and screen reader support:

**Keyboard Navigation:**
- All interactive elements are focusable via Tab key
- Visible focus indicators using `focus-visible` (3px orange outline matching theme)
- File upload shows focus ring via `focus-within` on parent wrapper
- Accordions toggle with Enter/Space keys

**Screen Reader Support:**
- Status messages use `aria-live="polite"` for announcements
- Decorative icons have `aria-hidden="true"`
- Download buttons have descriptive `aria-label` (e.g., "Download video1 as PDF")
- Semantic HTML: `<main>`, `<section>`, `<ul>`/`<li>` for proper structure
- Button groups use `role="group"` with `aria-label`

**Focus Styles** (`src/index.css`):
- `:focus-visible` - Global focus ring
- `.retro-press:focus-visible` - Interactive button focus
- `summary:focus-visible` - Accordion trigger focus

## Documentation

- `README.md` - Project overview, features, tech stack, and vibe coding background
- `PRD.md` - Product Requirements Document with:
  - Functional requirements (FR-1 through FR-6) with implementation status
  - Non-functional requirements (privacy, performance, compatibility)
  - Technical architecture and data flow
  - Current limitations
  - Future enhancements backlog (prioritized)
  - Use PRD.md as the baseline when planning new features

## Project Background

This was a "vibe coding" experiment—built using Gemini and Claude Code to explore AI-assisted development. The app solves a real workflow need: converting SRT caption files from Adobe Premiere into PDFs and VTTs.
