# CRA Meldwijzer runbook

What to do when one of your products is being exploited or your product security is hit by an
incident, under Article 14 of the Cyber Resilience Act (CRA). Written for companies established in
the Netherlands. Not legal advice, and not reviewed by a lawyer; see the disclaimer. You remain
responsible for your own reporting decisions.

## Is this for you?

**Do you sell software, an app, firmware or a connected device in the EU? Then you are probably a
"manufacturer" under the CRA, and this runbook is for you.** That includes software companies, app
developers, IoT and firmware makers, and SaaS providers whose service comes with an app or device.
A two-person studio selling an app counts too [src:cra_art2] [src:cra_art3].

You also count as the manufacturer if you sell someone else's product **under your own name or
trademark**, or **substantially modify** it [src:cra_art21_22]. White-label resellers often fall
into this group without realising it.

Importer, distributor, component supplier, open-source steward or business customer? Read
[Other roles](07-other-roles.md) first.

## The duty in one table

Since 11 September 2026 [src:cra_art71_2], manufacturers must report two kinds of events. This
also applies to products that were on the market before that date, however old [src:cra_art69_3].

| | Actively exploited vulnerability | Severe incident |
|---|---|---|
| What | Reliable evidence that a malicious actor exploited a vulnerability in your product [src:cra_art3] | An incident that affects your product's security, meeting the test in Art. 14(5) [src:cra_art14_3_5] |
| Early warning | Within 24 hours of becoming aware | Within 24 hours of becoming aware |
| Notification | Within 72 hours of becoming aware | Within 72 hours of becoming aware |
| Final report | No later than 14 days after a corrective or mitigating measure is available | Within one month after submitting the notification |

In the Netherlands you report to the **NCSC**, through MijnNCSC or the CRA reporting form. The NCSC
forwards your report to ENISA and to other Member States. You do not report twice
[src:ncsc_melden].

You must also **inform affected users** [src:cra_art14_8]. See [Informing users](04-inform-users.md).

## Chapters

1. [Prepare before an incident](01-prepare.md)
2. [Roles](02-roles.md)
3. [Timeline: hour 0 to final report](03-timeline.md)
4. [Informing users](04-inform-users.md)
5. [Evidence checklist](05-evidence.md)
6. [Cyberbeveiligingswet and GDPR](06-other-regimes.md)
7. [Other roles](07-other-roles.md)
8. [Tabletop drill](08-drill.md)

## Three rules that prevent most mistakes

1. **The clock starts when you become aware, not when you finish investigating.** Write down when
   you first detected the issue, when you became aware, and why at that moment.
2. **Check both triggers separately.** "Not exploited" does not mean "no severe incident", and the
   other way round. One event can need two reports.
3. **When unsure, send the early warning.** A short early warning that later turns out unnecessary
   costs little. A missed deadline is hard to repair.
