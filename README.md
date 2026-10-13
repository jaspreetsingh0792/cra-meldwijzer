# CRA Meldwijzer

**CRA Article 14 reporting guide for makers and sellers of software and connected products in the Netherlands. Bilingual (NL/EN), offline, open source.**

**Use the app:** https://jaspreetsingh0792.github.io/cra-meldwijzer/ (works offline after the first visit)  
**Read the runbook:** [English](content/runbook/en/00-overview.md) · [Nederlands](content/runbook/nl/00-overview.md)  
**Report templates:** [English](templates/en/README.md) · [Nederlands](templates/nl/README.md)

> ⚠️ **Not legally reviewed. Not legal advice.** This is a free aid, provided as is, without any
> warranty. You remain responsible for your own reporting decisions: always check the official
> [NCSC guidance](https://www.ncsc.nl/wet-en-regelgeving/cyber-resilience-act-cra/melden). Known open
> points are in [OPEN-QUESTIONS.md](OPEN-QUESTIONS.md); see [DISCLAIMER.md](DISCLAIMER.md).

Since **11 September 2026**, manufacturers of products with digital elements must report actively
exploited vulnerabilities and severe incidents under Article 14 of the Cyber Resilience Act
(Regulation (EU) 2024/2847): an early warning within 24 hours, a notification within 72 hours and a
final report.

**Do you sell software, an app, firmware or a connected device in the EU? Then you are probably a
"manufacturer" under the CRA.** Importers, distributors, component suppliers and open-source stewards
have their own chapter in the runbook.

CRA Meldwijzer helps a Dutch manufacturer answer three questions fast:

1. **Do we have to report?** A decision tree that checks both triggers (actively exploited
   vulnerability, severe incident) independently, and never turns "unsure" into "no".
2. **By when?** A deadline engine with separate clocks per track, anchored to awareness, and
   conservative when the law is ambiguous.
3. **Where and what?** The Dutch route (NCSC via MijnNCSC or the CRA reporting form), plus
   prompts for the separate Cyberbeveiligingswet and GDPR assessments.

## Nederlands

Sinds **11 september 2026** moeten fabrikanten van producten met digitale elementen actief
uitgebuite kwetsbaarheden en ernstige incidenten melden onder artikel 14 van de Cyber Resilience
Act. CRA Meldwijzer helpt je snel bepalen óf je moet melden, wanneer, en waar (bij het NCSC via
MijnNCSC of het CRA-meldformulier). Geen juridisch advies; zie [DISCLAIMER.md](DISCLAIMER.md).

## Status

| Part | State |
|---|---|
| Source registry (`content/sources.yaml`) | ✅ v0.1, 2 sources still `todo` |
| Decision tree (`content/tree.yaml`, `src/core/tree.js`) | ✅ v0.1, exhaustively tested |
| Deadline engine (`src/core/clock.js`) | ✅ v0.1, tested incl. DST and month ends |
| YAML -> JSON build and content checks | ✅ |
| Runbook (`content/runbook/`): preparation, roles, timeline, informing users, evidence, Cbw/GDPR, other roles, drill | ✅ v0.1, NL + EN |
| Report templates (`content/templates.yaml` -> `templates/`): 6 reports + user advisory, NCSC form sections, Art. 14 content | ✅ v0.1, NL + EN (character limits not yet verified) |
| Web app (`app/`): assessment, case with deadlines and .ics export, templates with per-field copy, runbook and print view, offline (service worker), NL/EN | ✅ v0.1 |
| Legal review | Not done; see [OPEN-QUESTIONS.md](OPEN-QUESTIONS.md) |

## How it is built

```
content/          source of truth: editable without touching code
  sources.yaml    every citation: type, binding or not, URL, last verified
  tree.yaml       decision tree (language-neutral) + outcome citations
  i18n/nl.yaml    Dutch wording
  i18n/en.yaml    English wording
  runbook/nl, en  the runbook chapters; cite sources as [src:id]
  templates.yaml  report templates (language-neutral)
templates/        generated blank templates (npm run templates), committed
app/              static web app (no framework, no dependencies)
src/core/         pure functions, no DOM, no network (shared by app, build and tests)
  tree.js         walk the tree, derive outcomes
  clock.js        Article 14 deadlines
  templates.js    render report templates
  markdown.js     safe Markdown -> HTML for the runbook
  ics.js          calendar export
scripts/          build (YAML -> JSON) and content checks
tests/            node:test suites
```

Four kinds of authority are kept apart, and every outcome shows which one it rests on: **the
law** (binding), **Commission guidance**, **NCSC/ENISA practice** (non-binding) and **our own
interpretation**.

### Deadlines

| Track | Early warning | Notification | Final report |
|---|---|---|---|
| Actively exploited vulnerability | 24h after awareness | 72h after awareness | 14 days after a corrective or mitigating measure is available |
| Severe incident | 24h after awareness | 72h after awareness | 1 month after the notification was submitted |

A late early warning never moves the 72h deadline. Where the law's time computation is unclear
(Regulation 1182/71), the engine shows the **earlier** reading; see OPEN-QUESTIONS.md Q2.

## Develop

Requires Node.js 22 or later.

```bash
npm install
npm test          # tree + deadline tests (including every possible answer path)
npm run check     # content integrity: sources, reachability, NL/EN parity, runbook citations and links
npm run templates # regenerate templates/ after changing content (CI checks they are current)
npm run build     # build the site into dist/
npm start         # serve dist/ on http://localhost:8787/
```

## Contributing

Corrections to legal content are the most valuable contribution. Change the YAML or Markdown, cite a source in
`content/sources.yaml` (with `last_verified`), update or add a test, and explain the change in the
pull request. **Never include real vulnerability or incident details**; see [SECURITY.md](SECURITY.md).

## Keeping it current

A weekly GitHub Action checks the NCSC, ENISA and Commission pages and EUR-Lex (corrigenda and
amendments to the CRA) and opens an issue when something changes. The app shows when each source was
last checked, and warns users automatically when the oldest check is more than four months old. See
[MAINTAINING.md](MAINTAINING.md) and [CHANGELOG.md](CHANGELOG.md).

## No individual advice

The maintainers do not advise on individual cases. Issues and discussions are for improving the
project, not for questions like "do we have to report this?". For those, contact the
[NCSC](https://www.ncsc.nl/wet-en-regelgeving/cyber-resilience-act-cra/melden) or your own legal
adviser.

## Non-commercial

CRA Meldwijzer is a free, non-commercial project. It is not sold, carries no advertising and is not
linked to any paid service.

## Related projects

- [Hour Zero](https://github.com/Sisuthros/hour-zero): static CRA Art. 14 deadline clock (MIT)
- [CRA Article 14 Reporting Kit](https://github.com/stavenor-hq/cra-article-14-reporting-kit): SRP field list (CC BY 4.0)
- [OpenChain CRA Compliance](https://github.com/OpenChain-Project/CRA-Compliance)

## Licence

Code: [MIT](LICENSE). Content in `content/`: [CC BY 4.0](LICENSE-content).
