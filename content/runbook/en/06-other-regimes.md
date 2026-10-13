# 6. Cyberbeveiligingswet and GDPR

One event can trigger up to three separate duties. Each has its **own test, its own awareness
moment and its own report**. A CRA report does not replace either of the others.

| | CRA Art. 14 | Cyberbeveiligingswet (NIS2) | GDPR |
|---|---|---|---|
| Who | Manufacturers of products with digital elements | Essential and important entities | Controllers of personal data |
| About | Your **product** | Your **organisation's** services | **Personal data** |
| Trigger | Actively exploited vulnerability, or severe incident affecting product security | Significant incident (thresholds per sector) | Personal data breach, unless unlikely to result in a risk to individuals |
| Deadlines | 24h / 72h / final report | 24h / 72h / final report within one month of the notification | 72h after awareness |
| Where | NCSC (MijnNCSC / CRA reporting form) | Central reporting point on MijnNCSC (reaches sector CSIRT and supervisor) | Autoriteit Persoonsgegevens |
| Source | [src:cra_art14_1_2] | [src:cbw] [src:ncsc_cbw_meldplicht] | [src:gdpr_art33_34] |

## Cyberbeveiligingswet

The Dutch NIS2 law has applied since 15 August 2026 [src:cbw] [src:cbw_besluit]. If your organisation is an
essential or important entity, assess separately whether the event is a **significant incident**
for your services. A product vulnerability may not be one, and an incident in your organisation may
not meet the CRA triggers.

- **Significant:** the incident seriously disrupts your services, causes financial damage, or can
  cause serious damage to other organisations. Thresholds differ per sector and are set in
  ministerial regulations [src:ncsc_cbw_meldplicht].
- **Where:** the central reporting point on MijnNCSC. One report reaches your sector CSIRT and your
  supervisor [src:ncsc_cbw_meldplicht].
- **When:** early warning within 24 hours of becoming aware (including whether the incident is
  suspected to be malicious and whether it has cross-border effects), notification within 72 hours,
  final report within one month of the notification. Still ongoing after a month? Send a progress
  report, and the final report within one month after the incident is handled
  [src:ncsc_cbw_meldplicht].
- **Exceptions:** if you provide a **trust service** and the incident affects it, the
  notification is due within **24 hours instead of 72** (the early warning stays at 24 hours).
  Organisations under a sector law with its own reporting rules (for example DORA, or the network
  code on cybersecurity for electricity) may have to report through that route instead, sometimes
  with shorter deadlines. Ask your supervisor if unsure [src:ncsc_cbw_meldplicht].

## GDPR

- As **controller**: notify the Autoriteit Persoonsgegevens within 72 hours of becoming aware of a
  personal data breach, unless it is unlikely to result in a risk to the rights and freedoms of
  individuals [src:gdpr_art33_34].
- If the risk is **high**, also inform the affected individuals without undue delay
  [src:gdpr_art33_34].
- As **processor**: inform the controller without undue delay [src:gdpr_art33_34].
- Document every breach, including the ones you do not report [src:gdpr_art33_34].

## Coordinating

- Give each regime an owner, but keep **one** case log.
- Keep facts consistent across reports; differences will be noticed.
- Record a separate awareness moment and decision for each regime.
