# 3. Timeline: hour 0 to final report

All deadlines count from **becoming aware**, also on weekends and public holidays. The deadline
for the 72-hour notification does **not** move if the early warning was late
[src:cra_art14_1_2] [src:cra_art14_3_5].

## Hour 0: first signal

- [ ] **Open a case.** Case number, time of detection (UTC and Amsterdam time), who reported it,
      what the signal was.
- [ ] Alert the incident lead and technical lead.
- [ ] **Preserve evidence.** Do not wipe logs or rebuild systems before copies are secured. See the
      [evidence checklist](05-evidence.md).

## Hours 0 to 1 (and as fast as possible): initial assessment

Run the Meldwijzer decision tree, or answer these questions:

**Track A: actively exploited vulnerability** [src:cra_art3]
- Is the vulnerability present in our product? Which products and versions? Check the SBOMs.
- Is there **reliable evidence** that a malicious actor exploited it? On their own, a high CVSS
  score, a public proof of concept, a researcher report or your own test finding are not enough
  [src:ncsc_melden].

**Track B: severe incident** [src:cra_art14_3_5]. Always check this as well.
- Has an incident affected the security of the product? (For example: build pipeline, update
  server, signing keys, development environment.)
- Does it (or can it) harm the product's ability to protect the availability, authenticity,
  integrity or confidentiality of sensitive or important data or functions?
- Has it led (or can it lead) to malicious code being introduced or executed in the product or on
  users' systems?

**In parallel:** Cyberbeveiligingswet? Personal data? See [chapter 6](06-other-regimes.md).

## The awareness moment

- [ ] When the initial assessment gives a **reasonable degree of certainty**, you are aware
      [src:ec_cra_reporting]. Record the time **and the reason**.
- [ ] Unsure? Take the **earliest plausible** moment.
- [ ] Each track can have its own awareness moment. Record them separately.
- [ ] Put all deadlines in the calendar of everyone with a role.

## Within 24 hours: early warning

Send it **without undue delay**, and in any case within 24 hours. Do not wait for complete
information; the later reports fill in the details.

| Vulnerability [src:cra_art14_1_2] | Severe incident [src:cra_art14_3_5] |
|---|---|
| That there is an actively exploited vulnerability in product X | That there is a severe incident affecting product X |
| Where applicable, the Member States where the product is available | Whether you suspect unlawful or malicious acts |
| | Where applicable, the Member States where the product is available |

- [ ] **Where:** MijnNCSC (recommended) or the CRA reporting form [src:ncsc_melden]. Main
      establishment elsewhere? That Member State's coordinating CSIRT [src:cra_art14_7].
- [ ] **Do not also report the same case to ENISA.** The NCSC forwards it [src:ncsc_melden].
      Background: the CRA requires notifications through ENISA's single reporting platform, using
      the electronic end-point of your coordinating CSIRT [src:cra_art14_7]. For the Netherlands,
      the NCSC directs manufacturers to MijnNCSC or its CRA reporting form and forwards the report
      to ENISA and other CSIRTs [src:ncsc_melden].
- [ ] **Channel unavailable?** If MijnNCSC does not work, use the CRA reporting form, and the other
      way round [src:ncsc_melden]. ENISA's FAQ says that if the single reporting platform is
      temporarily unavailable, you submit as soon as it is available again. If immediate
      communication is necessary before then, you may contact your coordinating CSIRT (in the
      Netherlands the NCSC) directly, but you must **still submit the notification through the
      platform** once it is back [src:enisa_srp_faq]. Record the outage (times, error messages,
      screenshots) and any direct contact in the case log.
- [ ] Mark the report as **sensitive** if details could help attackers [src:ncsc_melden].
- [ ] Record the submission time and the reference number in the case log.
- [ ] Both tracks triggered? Then you need a report for each.

Missed the 24 hours? Submit **now** anyway, and record why it was late. Breaching Article 14 can be
fined up to €15 million or 2.5% of worldwide annual turnover. Micro and small enterprises cannot be
fined for missing the 24-hour early warning deadline, but the duty to report and the other deadlines
still apply [src:cra_art64] [src:cra_corrigendum_2025_07_02].

## Within 72 hours (from awareness): notification

Send this unless the information was already provided in the early warning.

| Vulnerability [src:cra_art14_1_2] | Severe incident [src:cra_art14_3_5] |
|---|---|
| General information about the product concerned | The nature of the incident |
| General nature of the exploit and of the vulnerability | An initial assessment |
| Corrective or mitigating measures taken, and measures users can take | Corrective or mitigating measures taken, and measures users can take |
| How sensitive you consider the information | How sensitive you consider the information |

- [ ] Start or update the [user information](04-inform-users.md) in parallel.

## The final report

| Vulnerability [src:cra_art14_1_2] | Severe incident [src:cra_art14_3_5] |
|---|---|
| **Deadline:** no later than 14 days after a corrective or mitigating measure is available | **Deadline:** within one month after you submitted the notification |
| Description of the vulnerability, including severity and impact | Detailed description, including severity and impact |
| Where available, information about the malicious actor | The type of threat or root cause that likely triggered it |
| Details of the security update or other corrective measures | Applied and ongoing mitigation measures |

- [ ] The CSIRT may ask for an **intermediate report** on progress at any time
      [src:cra_art14_3_5].

## Close the case

- [ ] All reports submitted, reference numbers recorded
- [ ] Users informed, advisory published
- [ ] Lessons learned: what slowed you down? Update this runbook and your preparation.
- [ ] Keep the case log and evidence according to your retention policy.

## Common mistakes

- Counting 72 hours from the early warning instead of from awareness
- Treating "no exploitation" as the end of the assessment, without checking for a severe incident
- Waiting for the full forensic picture before sending the early warning
- Reporting the same case to both the NCSC and ENISA
- Forgetting products that were sold years ago but are still in use [src:cra_art69_3]
- Listing only one product when the vulnerable component is in several
