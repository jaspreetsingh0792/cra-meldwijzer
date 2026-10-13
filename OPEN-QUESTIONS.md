# Known open points

**This project has not been reviewed by a lawyer.** The points below are known to be uncertain.
The code does not treat them as settled law and takes the cautious reading where it can. This list
is not complete: other content may also be wrong. See [DISCLAIMER.md](DISCLAIMER.md).

| # | Question | What the code does now | Status |
|---|---|---|---|
| Q1 | **Art. 64(10) cross-reference.** Commission and NCSC guidance say micro and small enterprises are not fined for missing the 24h early-warning deadline, and stewards are not fined at all. Art. 64(10) referred to derogations from paragraphs 3-9, while the fines for Art. 14 are in paragraph 2. Does the exemption apply as the guidance says? | Runbook chapter 3 mentions the fines and the derogation, citing the corrigendum. | **Resolved 2026-10-13:** the corrigendum of 2 July 2025 (OJ L 2025/90555, all language versions) replaces "paragraphs 3 to 9" with "paragraphs 2 to 9". The derogation covers the Art. 14 fines. Source: `cra_corrigendum_2025_07_02`. |
| Q2 | **Regulation 1182/71 and Art. 14 deadlines.** Does Art. 3 of Reg. 1182/71 apply? If so: the hour/day of the event is not counted, periods end at the end of a day, and day/month periods ending on a weekend or public holiday roll to the next working day. Which time zone defines "a day"? Which public holidays? | Shows the **conservative** deadline (elapsed time; calendar days/months, earliest of UTC and Amsterdam). The Reg. 1182/71 reading is computed alongside for comparison only. It never makes a deadline later. Public holidays are not modelled. | Open |
| Q3 | **Formal Dutch designation of RDI** as market surveillance authority under the Uitvoeringswet CRA (dossier 36 875). Is it enacted, and from when? | Not referenced in outcomes. The runbook may say RDI is the *intended* authority. | Open |
| Q4 | **Start of applicability at 00:00 on 11 Sep 2026: which time zone?** | Uses 00:00 Europe/Amsterdam (= 2026-09-10T22:00Z). | Open |
| Q5 | **ENISA FAQ: no retroactive reporting** for exploitation known before 11 Sep 2026. Verify the current FAQ wording. | Outcome `no_retroactive_duty`, labelled as guidance. | Needs verification against the FAQ text |

When a point is resolved: record the answer, the source and the date here, then update the code,
the tests and `content/sources.yaml` in the same pull request.
