# 5. Checklist bewijs

Twee doelen: de gebeurtenis onderzoeken, en later kunnen laten zien dat je correct en op tijd hebt
gemeld.

## Het beslisspoor (wordt het vaakst vergeten)

- [ ] Tijdstip van de eerste detectie, en wat het signaal was
- [ ] Moment van op de hoogte raken per spoor, en **waarom** dat moment
- [ ] De antwoorden in de beslisboom, en wie ze gaf
- [ ] Elk besluit over de meldplicht: wie, wanneer, op basis van welke informatie
- [ ] Tijdstip van indienen en referentienummer van elke melding
- [ ] Wat gebruikers is verteld, wanneer en via welk kanaal
- [ ] Wanneer een corrigerende of mitigerende maatregel beschikbaar kwam. Dit start de termijn van
      14 dagen voor het eindrapport over de kwetsbaarheid [src:cra_art14_1_2].

## Technisch bewijs

- [ ] Logs (applicatie, server, netwerk, authenticatie), gekopieerd vóór rotatie of herinstallatie
- [ ] Indicators of compromise: IP-adressen, domeinen, hashes, payloads
- [ ] Getroffen productversies, SBOM's en buildgegevens
- [ ] Bij een incident in je eigen omgeving: images of snapshots van getroffen systemen,
      toegangslogs van build-, update- en signeeromgeving
- [ ] Externe bronnen: advisory, vermelding als bekend uitgebuit, melding van een CSIRT, melding
      van een klant (bewaar het originele bericht met tijdstempel)

## Omgang

- Bewaar bewijs op een plek met beperkte toegang, en leg vast wie erbij is geweest.
- Zet zaakgegevens of bewijs **niet** in openbare tickets of repositories.
- Gebruik UTC-tijdstempels, en noteer de tijdzone bij elke tijd die je met de hand vastlegt.
