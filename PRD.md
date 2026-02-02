# Product Requirements Document: SRT Converter

## Overview

**Product Name:** SRT Converter
**Version:** 2.0
**Last Updated:** February 2026

### Problem Statement

Video editors and content creators who work with Adobe Premiere frequently need to convert SRT (SubRip) subtitle files into other formats for different use cases:
- **VTT** for web video players
- **TXT** for readable transcripts
- **PDF** for sharing, printing, or archival

Existing solutions often require uploading files to third-party servers, which raises privacy concerns for sensitive content. There is no simple, privacy-focused tool that handles all three conversions in one place.

### Solution

A browser-based web application that converts SRT files to VTT, TXT, and PDF formats entirely client-side. No data leaves the user's browser, ensuring complete privacy.

---

## Target Users

- **Video Editors** using Adobe Premiere or similar NLEs
- **Content Creators** who need transcripts from their captions
- **Accessibility Teams** converting subtitle formats for different platforms
- **Anyone** who needs quick, private subtitle file conversion

---

## Functional Requirements

### FR-1: File Input

| ID | Requirement | Status |
|----|-------------|--------|
| FR-1.1 | Accept .srt files via drag-and-drop | Implemented |
| FR-1.2 | Accept .srt files via file browser dialog | Implemented |
| FR-1.3 | Support multiple file selection (batch upload) | Implemented |
| FR-1.4 | Validate that only .srt files are accepted | Implemented |

### FR-2: SRT to VTT Conversion

| ID | Requirement | Status |
|----|-------------|--------|
| FR-2.1 | Convert SRT timecode format (comma) to VTT format (period) | Implemented |
| FR-2.2 | Add `WEBVTT` header to output | Implemented |
| FR-2.3 | Preserve subtitle text content | Implemented |
| FR-2.4 | Handle both Windows (CRLF) and Unix (LF) line endings | Implemented |

### FR-3: SRT to TXT Conversion

| ID | Requirement | Status |
|----|-------------|--------|
| FR-3.1 | Extract plain text from SRT, removing timecodes | Implemented |
| FR-3.2 | Strip HTML/styling tags from subtitle text | Implemented |
| FR-3.3 | Smart paragraph grouping based on timing gaps (>2 seconds) | Implemented |
| FR-3.4 | Smart paragraph breaks at sentence endings (after ~10 seconds) | Implemented |
| FR-3.5 | Handle common abbreviations to avoid false sentence breaks | Implemented |

### FR-4: SRT to PDF Conversion

| ID | Requirement | Status |
|----|-------------|--------|
| FR-4.1 | Generate PDF from smart-formatted TXT content | Implemented |
| FR-4.2 | Use input filename as PDF document title | Implemented |
| FR-4.3 | Apply consistent formatting (Helvetica, 11pt body, 16pt title) | Implemented |
| FR-4.4 | Handle page breaks for long transcripts | Implemented |
| FR-4.5 | Maintain proper margins (20px) | Implemented |

### FR-5: Download Options

| ID | Requirement | Status |
|----|-------------|--------|
| FR-5.1 | Individual download buttons for each format (SRT, VTT, TXT, PDF) | Implemented |
| FR-5.2 | "Download ZIP" button for all files from all uploads | Implemented |
| FR-5.3 | ZIP includes original SRT + all converted formats | Implemented |
| FR-5.4 | ZIP filename: `converted_subtitles.zip` | Implemented |

### FR-6: User Interface

| ID | Requirement | Status |
|----|-------------|--------|
| FR-6.1 | Display processing status messages | Implemented |
| FR-6.2 | Show list of processed files with download options | Implemented |
| FR-6.3 | "Reset" button to clear results and start over | Implemented |
| FR-6.4 | Expandable "How It Works" info section | Implemented |
| FR-6.5 | Scrollable results list for many files | Implemented |
| FR-6.6 | Responsive design (mobile-friendly) | Implemented |

---

## Non-Functional Requirements

### NFR-1: Privacy & Security

| ID | Requirement | Status |
|----|-------------|--------|
| NFR-1.1 | All processing must happen client-side (no server uploads) | Implemented |
| NFR-1.2 | No analytics or tracking that captures file content | Implemented |
| NFR-1.3 | Display privacy assurance to users | Implemented |

### NFR-2: Performance

| ID | Requirement | Status |
|----|-------------|--------|
| NFR-2.1 | Process files asynchronously to avoid UI blocking | Implemented |
| NFR-2.2 | Support batch processing of multiple files | Implemented |
| NFR-2.3 | Sort results alphabetically by filename | Implemented |

### NFR-3: Compatibility

| ID | Requirement | Status |
|----|-------------|--------|
| NFR-3.1 | Support modern browsers (Chrome, Firefox, Safari, Edge) | Implemented |
| NFR-3.2 | Handle SRT files from Adobe Premiere | Implemented |
| NFR-3.3 | Handle various SRT formatting variations | Implemented |

---

## Technical Architecture

### Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4
- **PDF Generation:** jsPDF
- **ZIP Creation:** JSZip

### Component Structure

```
src/
├── App.jsx                 # Main app state and layout
├── components/
│   ├── FileUpload.jsx      # Drag-and-drop file input
│   ├── ResultItem.jsx      # Individual file result with downloads
│   ├── InfoSection.jsx     # Expandable help content
│   └── CodeAccordion.jsx   # Source code viewer (hidden)
└── utils/
    ├── srtConverter.js     # Core conversion logic
    └── zipDownload.js      # ZIP archive creation
```

### Data Flow

```
User drops .srt file(s)
        ↓
FileUpload component captures files
        ↓
App.jsx calls processFile() for each file
        ↓
srtConverter.js generates VTT, TXT, PDF
        ↓
Results stored in state, displayed via ResultItem
        ↓
User downloads individual files or ZIP
```

---

## Current Limitations

1. **Input format:** Only .srt files are supported
2. **Styling:** HTML/styling tags are stripped from TXT and PDF output
3. **PDF customization:** No options for font, size, or layout
4. **Language:** No special handling for RTL languages or non-Latin scripts

---

## Future Enhancements (Backlog)

### High Priority

| ID | Feature | Description |
|----|---------|-------------|
| FE-1 | Additional input formats | Support VTT, ASS, SSA as input |
| FE-2 | Preview pane | Show converted content before download |
| FE-3 | Dark mode | Theme toggle for dark/light modes |

### Medium Priority

| ID | Feature | Description |
|----|---------|-------------|
| FE-4 | PDF customization | Font selection, size, margins |
| FE-5 | Timestamp preservation option | Keep timecodes in TXT output |
| FE-6 | Search/filter results | Find specific files in large batches |

### Low Priority

| ID | Feature | Description |
|----|---------|-------------|
| FE-7 | Export to Word (.docx) | Additional output format |
| FE-8 | Subtitle editing | Basic text editing before conversion |
| FE-9 | Cloud storage integration | Save directly to Google Drive, Dropbox |

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Page load time | < 2 seconds |
| File processing time | < 1 second per file |
| Successful conversion rate | 100% for valid SRT files |
| Browser compatibility | All modern browsers (last 2 versions) |

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | Feb 2026 | Added InfoSection, retro UI theme, batch processing |
| 1.0 | Initial | Basic SRT to VTT/TXT/PDF conversion |
