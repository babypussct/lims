# LIMS Naming & Prefix Splitting Conventions

This document records the global LIMS sample coding convention and report generation logic. Apply these rules to all future SOP implementations and result templates.

---

## 1. Naming & Prefix Rules
- **First character is a letter**: Represents a prefix (e.g., `U0102` belongs to prefix `U`).
- **First character is a digit**: Represents no prefix (e.g., `0102`).

---

## 2. Prefix-Based Report Splitting Logic
- **Independent PDF/Docs Generation**: During report creation or printing, samples from the same run must be grouped and split into separate document versions based on their prefix (plus a default group `__DEFAULT__` for samples without a prefix).
- **QC Samples**: Special control samples (like `Blank` and `Spike` in SOP-03) must be prepended to the payload of *each* independent report generated.

---

## 3. UI/UX Guidelines
- **Grid Filters**: Provide tabs or filters at the top of input grids to let users select and view samples by prefix group.
- **Dynamic Links**: In list views, render independent action links (PDF, Docs) for each prefix group found in the analysis result's report history map.

---

## 4. Documentation & Changelog Guidelines
- **User-Centric Language**: Write all system documentation, release notes, user manuals, and changelogs in clear, friendly Vietnamese tailored for end-users (Lab Technicians, Analysts, and Lab Managers).
- **Zero Technical Jargon**: Strictly avoid code/developer terminology (e.g., CSS classes `backdrop-blur-md`, `70vh`, internal variable names `panelPos`, animation curves `cubic-bezier`, `fa-shake`, or service class names).
- **Focus on Operational Value**: Explain changes in terms of practical lab workflow benefits, visual convenience, and operational time-savings for lab personnel rather than code implementation details.
