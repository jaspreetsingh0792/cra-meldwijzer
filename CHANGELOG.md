# Changelog

Content changes that affect what users are told: decision logic, deadlines, reporting routes,
runbook and templates. Newest first. Dates are when the change was published.

## 2026-10-13: rules version 0.3.0 (third external review)

- **Awareness timing is now asked per track.** The single "before or after 11 September 2026"
  question applied to both the vulnerability and the incident. A vulnerability known before that
  date could hide an incident discovered after it, and the other way round. Each question is only
  asked for a track that may be triggered.
- No retroactive report for a vulnerability now still prompts a check on affected users, instead
  of dropping the user-information reminder.
- A security advisory on your website is now "recommended in most cases", not "always": Article
  14(8) requires informing affected users, not a public page in every case.
- The "scope or role unsure" caveat now gives cautious advice instead of stating that the deadlines
  run regardless.
- Runbook chapter 3 explains how the NCSC channels relate to ENISA's single reporting platform, and
  what to do when a channel is unavailable (ENISA FAQ 25).
- Component suppliers: the help text says to assess a separately sold component as its own product.
- Case view: a time that does not exist in Amsterdam (summer-time gap) is refused instead of
  silently moved; a repeated time (winter-time change) is flagged; awareness in the future is
  flagged; deadlines are labelled as outer limits; status changes are announced to screen readers.
- Imports are fully validated before they replace the open case. The assessment keeps keyboard and
  screen-reader focus on the next question. A notice appears when a new version is available.
- Privacy wording narrowed: case data is not transmitted; loading the site still makes normal
  requests to GitHub Pages.
- Source watcher: an unreachable source opens an issue and fails the run; Delegated Regulation
  2026/881, Regulation 1182/71 and the GDPR are watched for corrigenda and amendments; official EU
  texts are fetched over HTTPS only.

## 2026-10-13: rules version 0.2.0 (second external review)

- **Severe incidents and awareness before 11 September 2026:** the tool said there was no
  retroactive duty. ENISA's FAQ (question 13) only covers actively exploited vulnerabilities, so
  incidents now stay "potentially reportable" with a caveat, and their deadlines keep running in the
  case view. Vulnerabilities are unchanged; ENISA FAQ question 13 is now verified (open point Q5
  resolved).
- **Report templates now match the NCSC form field by field**, read from the form's own definition:
  title, manufacturer or steward, EUVD number (required by the form), three incident timestamps,
  incident status, and where Article 14 content without its own form field should go. The form
  has no character limits.
- **Cyberbeveiligingswet:** sources completed (NCSC reporting page, government announcement);
  runbook chapters 1 and 6 now give the Cbw route (central reporting point on MijnNCSC), deadlines,
  sector thresholds and exceptions.
- Decision-tree help text clarifies dual roles (steward and manufacturer, white-label, components)
  and that products no longer sold still count.
- The source watcher also watches the NCSC form's field definitions and the Cbw pages.

## 2026-10-13: EUR-Lex corrigenda checked

- Checked all corrigenda to Regulation (EU) 2024/2847 against the official texts:
  - **2 July 2025 (all languages):** Art. 64(10) now refers to "paragraphs 2 to 9". Micro and small
    enterprises are not fined for missing the 24-hour early warning deadline. Resolves open point Q1.
    Runbook chapter 3 now mentions the fines and this derogation.
  - 5 December 2024 (EN, title typo) and 17 October 2025 (all languages, numbering in Art. 67): no
    effect on this project.
  - 3 October 2025 (FR, HU), 23 February 2026 (SK), 25 March 2026 (FR), 6 August 2026 (DE) and
    9 October 2026 (SL): other language versions only; no effect on the Dutch and English texts.
- Regulation (EU) 2025/327 (European Health Data Space) amends CRA Art. 13(4), 31(3) and adds 32(5a):
  no effect on Article 14 reporting.
- Re-read CRA Art. 14, 64 and 69 in the official English text: content unchanged.

## 2026-10-13: rules version 0.1.0

- First public version: decision tree, deadline engine, runbook (NL/EN), report templates, web app.
- Sources checked on 2026-10-13. Not legally reviewed; see `OPEN-QUESTIONS.md`.
- Source watcher added. Baseline snapshots taken on 2026-10-13.
