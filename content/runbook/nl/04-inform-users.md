# 4. Gebruikers informeren

Melden bij het NCSC is niet genoeg. Nadat je op de hoogte bent geraakt, moet je **getroffen
gebruikers** informeren, en waar passend **alle gebruikers**, over de actief uitgebuite
kwetsbaarheid of het ernstige incident, en over de mitigerende of corrigerende maatregelen die zij
kunnen nemen. Doe dat waar passend in een gestructureerd, machineleesbaar formaat dat makkelijk
automatisch te verwerken is [src:cra_art14_8].

Informeer je gebruikers niet op tijd, dan kan het CSIRT dat voor je doen [src:cra_art14_8].

## Wat je vertelt

- [ ] Welke producten en versies geraakt zijn, en hoe gebruikers kunnen nagaan of dat bij hen zo is
- [ ] Wat het risico is, in gewone taal
- [ ] Wat ze **nu** moeten doen: workaround, configuratiewijziging, loskoppelen, monitoren
- [ ] Of er een update is, waar die te krijgen is en hoe ze die kunnen controleren
- [ ] Hoe ze je kunnen bereiken met vragen
- [ ] Wanneer je ze opnieuw informeert

## Hoe

| Kanaal | Wanneer |
|---|---|
| Security advisory op je website | Altijd. Dit is het referentiepunt voor al het andere. |
| Machineleesbare advisory (bijvoorbeeld CSAF) | Waar passend, vooral voor zakelijke klanten die advisories automatisch verwerken |
| Directe e-mail of klantportaal | Voor bekende getroffen klanten |
| Melding in het product of bij een update | Als gebruikers anders moeilijk te bereiken zijn |

## Timing en gevoeligheid

- Informeer gebruikers **zodra** je bruikbaar advies kunt geven. Wacht niet op het eindrapport.
- Wees voorzichtig met technische details zolang er geen fix is: beschrijf het risico en de
  maatregelen, geen recept voor aanvallers.
- Houd wat je gebruikers vertelt in lijn met wat je aan het NCSC meldt.
- Het CSIRT kan in bepaalde omstandigheden zelf het publiek informeren, of jou verplichten dat te
  doen [src:cra_art17].
