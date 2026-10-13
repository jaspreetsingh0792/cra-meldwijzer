# 8. Tabletopoefening

Ongeveer 90 minuten. Een begeleider leest de injects voor. Het team besluit wat het doet en
**schrijft tijden op**. Alles hieronder is fictief.

## Scenario: het weekendbotnet

Je maakt een thuisrouter, de "HR-200", sinds 2021 verkocht in Nederland, België en Duitsland.

| Inject | Tijd | Wat er gebeurt |
|---|---|---|
| 1 | Vrijdag 17:40 | De klantenservice krijgt een e-mail: "mijn router zit volgens mijn provider in een botnet". De medewerker gaat het weekend in. |
| 2 | Zaterdag 09:15 | Een beveiligingsonderzoeker meldt dat een kwetsbaarheid in een webserverbibliotheek die in veel routers zit, actief wordt misbruikt. De firmware van je HR-200 gebruikt die bibliotheek. |
| 3 | Zaterdag 13:00 | Je engineer van dienst vindt in je telemetrie aanvalspogingen op de HR-200, en minstens één geslaagde. |
| 4 | Zaterdag 20:00 | De incidentleider is onbereikbaar (zit in het vliegtuig). |
| 5 | Maandag 10:00 | Tijdens het onderzoek blijkt dat iemand twee weken geleden met een gestolen account op je firmwarebuildserver heeft ingelogd. |
| 6 | Donderdag 16:00 | Er komt een gepatchte firmwareversie uit. |

## Vragen per inject

1. Is dit een signaal? Wie had het moeten krijgen? Is de klok gaan lopen?
2. Zit de kwetsbaarheid in ons product, en in welke versies? Is er al betrouwbaar bewijs van
   misbruik?
3. Wanneer ben je op de hoogte? Wat zijn de termijnen (schrijf ze op, met datum en tijd)?
4. Wie stuurt de vroegtijdige waarschuwing? Weet het team hoe het in MijnNCSC inlogt?
5. Is dit een tweede spoor (ernstig incident)? Wat is daar het moment van op de hoogte raken, en
   wat zijn de termijnen? Verandert het de inhoud van de melding over de kwetsbaarheid?
6. Welke termijn start de patch? Wat vertel je gebruikers, en hoe?

## Punten voor de nabespreking

- Inject 1 is een signaal, maar waarschijnlijk nog geen moment van op de hoogte raken. Had het in
  het weekend bij het securityteam moeten komen?
- Het moment van op de hoogte raken voor de kwetsbaarheid ligt rond inject 3: de vroegtijdige
  waarschuwing moet binnen 24 uur daarna weg, op een zondag.
- Inject 4 test de vervangers en de vooraf afgesproken beslisbevoegdheden.
- Inject 5 opent een **aparte** beoordeling als ernstig incident (buildomgeving, mogelijk
  kwaadaardige code), met een eigen klok.
- Inject 6 start de termijn van 14 dagen voor het eindrapport over de kwetsbaarheid.
- Steeds: worden gebruikers geïnformeerd, en is het zaaklogboek compleet?
- Spelen de Cbw of de AVG mee? (Gegevens van klanten van de provider? Je eigen diensten?)

Daarna: noteer drie verbeteringen, wijs eigenaren aan en plan de volgende oefening.
