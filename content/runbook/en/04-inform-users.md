# 4. Informing users

Reporting to the NCSC is not enough. After becoming aware, you must inform **impacted users**,
and where appropriate **all users**, about the actively exploited vulnerability or severe incident,
and about the mitigating or corrective measures they can take. Where appropriate, do this in a
structured, machine-readable format that is easy to process automatically [src:cra_art14_8].

If you do not inform users in time, the CSIRT may do it for you [src:cra_art14_8].

## What to tell them

- [ ] Which products and versions are affected, and how users can check whether they are
- [ ] What the risk is, in plain language
- [ ] What they should do **now**: workaround, configuration change, disconnecting, monitoring
- [ ] Whether an update is available, where to get it and how to verify it
- [ ] How to reach you with questions
- [ ] When you will update them next

## How

| Channel | When |
|---|---|
| Security advisory on your website | Always. This is the reference point for everything else. |
| Machine-readable advisory (for example CSAF) | Where appropriate, especially for business customers who process advisories automatically |
| Direct email or customer portal | For known impacted customers |
| In-product notice or update message | When users cannot easily be reached otherwise |

## Timing and sensitivity

- Inform users **as soon as** you can give useful advice. Do not wait for the final report.
- Be careful about technical detail before a fix is available: describe the risk and the measures,
  not a recipe for attackers.
- Keep what you tell users consistent with what you report to the NCSC.
- The CSIRT may, in certain circumstances, inform the public itself or require you to do so [src:cra_art17].
