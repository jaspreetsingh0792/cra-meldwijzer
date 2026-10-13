# CRA Meldwijzer: draaiboek

Wat je doet als een van je producten actief wordt misbruikt, of als een incident de beveiliging van
je product raakt, onder artikel 14 van de Cyber Resilience Act (CRA). Geschreven voor bedrijven die
in Nederland gevestigd zijn. Geen juridisch advies, en niet juridisch getoetst; zie de vrijwaring.
Je blijft zelf verantwoordelijk voor je meldbesluiten.

## Is dit voor jou?

**Verkoop je software, een app, firmware of een verbonden apparaat in de EU? Dan ben je
waarschijnlijk "fabrikant" onder de CRA, en is dit draaiboek voor jou.** Dat geldt ook voor
softwarebedrijven, appontwikkelaars, IoT- en firmwaremakers, en SaaS-aanbieders van wie de dienst
bij een app of apparaat hoort. Ook een studio van twee mensen die een app verkoopt valt eronder
[src:cra_art2] [src:cra_art3].

Je geldt ook als fabrikant als je het product van een ander verkoopt **onder je eigen naam of
merk**, of het **ingrijpend wijzigt** [src:cra_art21_22]. White-labelverkopers vallen hier vaak
onder zonder het te weten.

Ben je importeur, distributeur, componentleverancier, opensourcebeheerder of zakelijke klant? Lees
dan eerst [Andere rollen](07-other-roles.md).

## De plicht in één tabel

Sinds 11 september 2026 [src:cra_art71_2] moeten fabrikanten twee soorten gebeurtenissen melden.
Dat geldt ook voor producten die al vóór die datum op de markt waren, hoe oud ook
[src:cra_art69_3].

| | Actief uitgebuite kwetsbaarheid | Ernstig incident |
|---|---|---|
| Wat | Betrouwbaar bewijs dat een kwaadwillende een kwetsbaarheid in je product heeft uitgebuit [src:cra_art3] | Een incident dat de beveiliging van je product raakt en voldoet aan de toets van art. 14(5) [src:cra_art14_3_5] |
| Vroegtijdige waarschuwing | Binnen 24 uur na het op de hoogte raken | Binnen 24 uur na het op de hoogte raken |
| Melding | Binnen 72 uur na het op de hoogte raken | Binnen 72 uur na het op de hoogte raken |
| Eindrapport | Uiterlijk 14 dagen nadat een corrigerende of mitigerende maatregel beschikbaar is | Binnen één maand na het indienen van de melding |

In Nederland meld je bij het **NCSC**, via MijnNCSC of het CRA-meldformulier. Het NCSC stuurt je
melding door naar ENISA en naar andere lidstaten. Je meldt dus niet twee keer [src:ncsc_melden].

Je moet ook **getroffen gebruikers informeren** [src:cra_art14_8]. Zie
[Gebruikers informeren](04-inform-users.md).

## Hoofdstukken

1. [Voorbereiden vóór een incident](01-prepare.md)
2. [Rollen](02-roles.md)
3. [Tijdlijn: uur 0 tot eindrapport](03-timeline.md)
4. [Gebruikers informeren](04-inform-users.md)
5. [Checklist bewijs](05-evidence.md)
6. [Cyberbeveiligingswet en AVG](06-other-regimes.md)
7. [Andere rollen](07-other-roles.md)
8. [Tabletopoefening](08-drill.md)

## Drie regels die de meeste fouten voorkomen

1. **De klok start als je op de hoogte raakt, niet als je klaar bent met onderzoeken.** Schrijf op
   wanneer je het probleem voor het eerst zag, wanneer je op de hoogte raakte, en waarom op dat
   moment.
2. **Controleer beide triggers apart.** "Niet uitgebuit" betekent niet "geen ernstig incident", en
   andersom. Eén gebeurtenis kan twee meldingen nodig hebben.
3. **Twijfel je, stuur dan de vroegtijdige waarschuwing.** Een korte waarschuwing die achteraf niet
   nodig was kost weinig. Een gemiste termijn is lastig te herstellen.
