---
name: openan-member-join-news
description: Generate or refresh "organization joins OpenAN" news pages for the project-openan.github.io website with the unified structure — title area (Announcement + Ecosystem + org tags), dual-logo cover image directly under the title, announcement lede, "About <Org>" intro, and "What This Means for OpenAN" impact section — plus synced news.html list card, DCO sign-off commit and local preview. Use when the user announces a new organization/participant joining OpenAN, asks to refresh or unify existing join news, or wants marketing-style ecosystem announcements.
---

# OpenAN Member-Join News

Generate or refresh a news page announcing that an organization has joined OpenAN, following the project's unified "join news" template.

## Inputs to collect first

- Organization short name and official full name (e.g. "Inspur" / "Inspur Communication Information Systems Co. Ltd.")
- Join date (used in the filename `news/YYYY-MM-DD-<org>-joins-openan.html` and the subtitle)
- Cover image: check whether `src/images/news/covers/<org>-join.(png|jpg)` already exists. If not, compose one from the base template `src/images/news/covers/join-template.png` (OpenAN logo + "+" on the left, the joining org's logo on the right, same canvas size and background). Ask the user for the org's logo asset if unavailable.

## Page structure (unified, in this exact order)

Base the file on `news/template.html`. After the breadcrumb:

1. **Title area** (`.page-head`)
   - `<h1>`: `<Org> <em>Joins OpenAN</em> ...` (wrap the key phrase in `<em>` for the gradient emphasis)
   - Subtitle: `News · <Month DD, YYYY> · by OpenAN`
   - Pills — always exactly: `<span class="category-pill announcement">Announcement</span>`, then `<span class="news-tag">Ecosystem</span>`, then `<span class="news-tag"><Org></span>`
2. **Cover image** directly under the title area:
   `<img class="arch-image" src="../src/images/news/covers/<org>-join.(png|jpg)" alt="OpenAN and <Org> logos">`
3. **Announcement lede** — one `.section` with no `h2`, 1–2 sentences: "The OpenAN community is pleased to announce that <Org> has joined …", plus one clause on why it matters.
4. **`About <Org>`** (`.section` with `h2`) — 2–3 sentences introducing the organization: positioning, scale, strengths, and its angle for OpenAN.
5. **`What This Means for OpenAN`** (`.section` with `h2`) — short impact summary, then a closing paragraph linking the [GitHub org](https://github.com/project-openan) and the [project website](https://project-openan.github.io).

## Content rules

- Differentiate each org with one memorable angle (e.g. Zain = first Middle East operator / regional footprint; Inspur = AI & compute infrastructure foundation; China Unicom = massive-scale operator validation).
- Target ~150–200 words of body copy — roughly 2× a minimal stub, marketing-flavored but factual.
- Factual red lines: only use well-established public positioning; never fabricate executive quotes, subscriber numbers, revenue, or "first/largest" claims unless publicly verifiable.
- SEO: `<title>` follows `News — <headline> | OpenAN`; write a one-sentence meta description; breadcrumb text must match the `h1` exactly.

## news.html sync

Insert the card at the top of the list in `news.html` (newest first): cover image, date block, `category-pill announcement` ("Announcement"), author "by OpenAN", and tags exactly `Ecosystem` + `<Org>` — matching the detail page pills.

## Git & preview

- Serve the site locally (e.g. `python -m http.server 8080`) and have the user verify the page before committing; stop the server afterwards.
- Commit with DCO sign-off: `git commit -s`, message style `feat(news): ...` — never mention organizations that are not part of this change.
- Ask the user whether to commit on a feature branch or directly on `main` before pushing.
