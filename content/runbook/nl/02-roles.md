# 2. Rollen

In een klein bedrijf kan één persoon meerdere rollen hebben. Waar het om gaat: elke rol heeft een
**vervanger op naam** die op zaterdagavond kan handelen.

| Rol | Verantwoordelijk voor |
|---|---|
| **Incidentleider** | Eigenaar van de zaak en de klokken. Opent de zaak, houdt de tijdlijn bij, schaalt op, zorgt dat elke termijn wordt gehaald. |
| **Technisch leider (PSIRT)** | Beoordeling: zit de kwetsbaarheid in ons product, welke versies, is het bewijs van misbruik betrouwbaar, wat is de impact, welke fix of workaround. |
| **Juridisch / compliance** | Besluit over de meldplicht, toets aan Cbw en AVG, review van de tekst van meldingen. Blokkeert een vroegtijdige waarschuwing **niet** als de tijd opraakt. |
| **Indiener** | Dient de meldingen in bij het NCSC (of een ander CSIRT), bewaart de referentienummers, beantwoordt vervolgvragen. |
| **Communicatie** | Gebruikers informeren, advisories, publieke verklaringen, vragen van klanten [src:cra_art14_8]. |
| **Directie** | Vanaf het begin geïnformeerd. Keurt grote beslissingen goed (product uit de handel nemen, publieke verklaringen). |
| **Notulist** | Houdt het zaaklogboek bij: elke beslissing met tijd, persoon en reden. In kleine teams vaak de incidentleider. |

## Beslisbevoegdheden, vooraf afgesproken

| Beslissing | Wie beslist | Vervanger als die niet bereikbaar is |
|---|---|---|
| "We zijn op de hoogte" (klok start) | Incidentleider + technisch leider | Incidentleider alleen |
| Vroegtijdige waarschuwing versturen | Incidentleider | Elke getrainde vervanger |
| Inhoud van melding en eindrapport | Incidentleider, gereviewd door juridisch | Incidentleider |
| Publieke advisory / informatie aan gebruikers | Communicatie + incidentleider | Incidentleider |
| Meldingen onder Cbw / AVG | Juridisch / compliance | Incidentleider, na raadplegen van het draaiboek voor die regeling |

Vul de namen in je eigen kopie van deze tabel in.
