# 1. Prepare before an incident

You cannot set this up during the first 24 hours. Do it now.

## Reporting access

- [ ] **Set up MijnNCSC** for your organisation. You log in with eHerkenning or SSOnRijk. It keeps
      the early warning, notification and final report together in one case [src:ncsc_melden].
- [ ] Know the fallback: the **CRA reporting form** on ncsc.nl needs no account. You get a reference
      number by email; keep it for follow-up reports [src:ncsc_form].
- [ ] The CRA itself has no registration duty [src:ncsc_melden]. Set up access anyway, so a login
      problem does not cost you hours.
- [ ] Main establishment outside the Netherlands? Find out which CSIRT coordinates for that Member
      State and what its reporting route is [src:cra_art14_7].
- [ ] Give at least two people (including a weekend deputy) access.

## Know your products

For each product with digital elements, record:

- [ ] Product name, versions and the **legal entity** that is the manufacturer
- [ ] When each version was placed on the market, and whether it is still sold
- [ ] **Member States where it is available**. The early warning asks for this.
- [ ] Support period and end-of-support date
- [ ] White-label or OEM arrangements: who sells it under whose name
- [ ] A software bill of materials (SBOM) per version, so you can answer "is the vulnerable
      component in this product?" in minutes, not days

## Intake: how you will hear about it

- [ ] A published security contact (`security.txt`) and a coordinated vulnerability disclosure
      policy
- [ ] Monitoring of known-exploited-vulnerability lists and advisories for the components you use
- [ ] A path from customer support to the security team: "a customer says their device is in a
      botnet" must reach the right person within the hour
- [ ] Monitoring of your own build, update and signing infrastructure. A compromise there can be a
      severe incident [src:cra_art14_3_5].

## People and decisions

- [ ] Assign the [roles](02-roles.md) with named deputies, including evenings and weekends
- [ ] **Agree in advance:** when in doubt, the early warning is sent. Legal sign-off must not block
      a deadline.
- [ ] Decide who may submit reports on behalf of the company

## Communication

- [ ] A place to publish security advisories (a web page, ideally also machine-readable)
- [ ] A way to reach affected customers: mailing list, customer portal, in-product notice
      [src:cra_art14_8]

## Contacts list

Keep this list offline as well (printed, or in your incident channel):

| Who | Why |
|---|---|
| NCSC | CRA reports (MijnNCSC / CRA reporting form) [src:ncsc_melden] |
| RDI | Questions about CRA scope and supervision; the NCSC is not the supervisor [src:ncsc_melden] |
| Your sector CSIRT / supervisor | If your organisation falls under the Cyberbeveiligingswet [src:cbw] |
| Autoriteit Persoonsgegevens | If personal data may be involved [src:gdpr_art33_34] |
| Legal counsel | Reportability decisions |
| Key upstream suppliers | Vulnerabilities in their components |

## Practise

- [ ] Run the [tabletop drill](08-drill.md) at least once a year, and after major changes
- [ ] Log times in UTC in your systems, so timelines line up
