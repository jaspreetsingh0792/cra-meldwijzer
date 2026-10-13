# 2. Roles

In a small company one person may hold several roles. What matters is that every role has a
**named deputy** who can act on a Saturday night.

| Role | Responsible for |
|---|---|
| **Incident lead** | Owns the case and the clocks. Opens the case, keeps the timeline, escalates, makes sure every deadline is met. |
| **Technical lead (PSIRT)** | Assessment: is the vulnerability in our product, which versions, is the exploitation evidence reliable, what is the impact, which fix or workaround. |
| **Legal / compliance** | Reportability decision, check against Cbw and GDPR, review of report wording. Does **not** block an early warning when time runs out. |
| **Submitter** | Submits the reports to the NCSC (or other CSIRT), keeps the reference numbers, answers follow-up questions. |
| **Communications** | Informing users, advisories, public statements, customer questions [src:cra_art14_8]. |
| **Management** | Informed from the start. Approves major decisions (product withdrawal, public statements). |
| **Scribe** | Keeps the case log: every decision with time, person and reason. Often the incident lead in small teams. |

## Decision rights, agreed in advance

| Decision | Who decides | Fallback if unavailable |
|---|---|---|
| "We are aware" (clock starts) | Incident lead + technical lead | Incident lead alone |
| Send the early warning | Incident lead | Any trained deputy |
| Content of notification and final report | Incident lead, reviewed by legal | Incident lead |
| Public advisory / user information | Communications + incident lead | Incident lead |
| Cbw / GDPR reports | Legal / compliance | Incident lead, after consulting the playbook for that regime |

Write the names into your own copy of this table.
