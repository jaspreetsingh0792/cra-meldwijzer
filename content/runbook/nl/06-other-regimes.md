# 6. Cyberbeveiligingswet en AVG

Eén gebeurtenis kan tot drie aparte plichten leiden. Elke plicht heeft een **eigen toets, een
eigen moment van op de hoogte raken en een eigen melding**. Een CRA-melding vervangt geen van de
andere.

| | CRA art. 14 | Cyberbeveiligingswet (NIS2) | AVG |
|---|---|---|---|
| Wie | Fabrikanten van producten met digitale elementen | Essentiële en belangrijke entiteiten | Verwerkingsverantwoordelijken |
| Over | Je **product** | De diensten van je **organisatie** | **Persoonsgegevens** |
| Trigger | Actief uitgebuite kwetsbaarheid, of ernstig incident dat de productbeveiliging raakt | Significant incident (drempelwaarden per sector) | Datalek, tenzij het waarschijnlijk geen risico voor personen oplevert |
| Termijnen | 24 uur / 72 uur / eindrapport | 24 uur / 72 uur / eindverslag binnen één maand na de melding | 72 uur na het op de hoogte raken |
| Waar | NCSC (MijnNCSC / CRA-meldformulier) | Centraal meldpunt op MijnNCSC (bereikt sectorale CSIRT en toezichthouder) | Autoriteit Persoonsgegevens |
| Bron | [src:cra_art14_1_2] | [src:cbw] [src:ncsc_cbw_meldplicht] | [src:gdpr_art33_34] |

## Cyberbeveiligingswet

De Nederlandse NIS2-wet geldt sinds 15 augustus 2026 [src:cbw]. Is je organisatie een essentiële
of belangrijke entiteit, beoordeel dan apart of de gebeurtenis een **significant incident** is voor
je diensten. Een kwetsbaarheid in je product hoeft dat niet te zijn, en een incident in je
organisatie hoeft niet aan de CRA-triggers te voldoen.

- **Significant:** het incident verstoort je dienstverlening ernstig, veroorzaakt financiële schade
  of kan grote schade bij andere organisaties aanrichten. De drempelwaarden verschillen per sector
  en staan in ministeriële regelingen [src:ncsc_cbw_meldplicht].
- **Waar:** het centrale meldpunt op MijnNCSC. Met één melding bereik je je sectorale CSIRT en je
  toezichthouder [src:ncsc_cbw_meldplicht].
- **Wanneer:** vroegtijdige waarschuwing binnen 24 uur na het op de hoogte raken (inclusief of het
  incident vermoedelijk kwaadwillig is en of er gevolgen over de grens zijn), melding binnen 72 uur,
  eindverslag binnen één maand na de melding. Loopt het incident na een maand nog? Stuur dan een
  voortgangsverslag, en het eindverslag binnen één maand nadat het incident is afgehandeld
  [src:ncsc_cbw_meldplicht].
- **Uitzonderingen:** verleners van vertrouwensdiensten melden sneller, en organisaties onder een
  sectorwet met eigen meldregels (bijvoorbeeld DORA) melden mogelijk via die route. Twijfel je, vraag
  het je toezichthouder [src:ncsc_cbw_meldplicht].

## AVG

- Als **verwerkingsverantwoordelijke**: meld een datalek binnen 72 uur na het op de hoogte raken
  bij de Autoriteit Persoonsgegevens, tenzij het waarschijnlijk geen risico oplevert voor de
  rechten en vrijheden van personen [src:gdpr_art33_34].
- Is het risico **hoog**, informeer dan ook de betrokkenen zonder onnodige vertraging
  [src:gdpr_art33_34].
- Als **verwerker**: informeer de verwerkingsverantwoordelijke zonder onnodige vertraging
  [src:gdpr_art33_34].
- Documenteer elk datalek, ook de lekken die je niet meldt [src:gdpr_art33_34].

## Afstemmen

- Geef elke regeling een eigenaar, maar houd **één** zaaklogboek bij.
- Houd de feiten in alle meldingen consistent; verschillen vallen op.
- Leg per regeling een apart moment van op de hoogte raken en een apart besluit vast.
