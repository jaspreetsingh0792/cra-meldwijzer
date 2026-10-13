# 3. Tijdlijn: uur 0 tot eindrapport

Alle termijnen tellen vanaf het **op de hoogte raken**, ook in weekenden en op feestdagen. De
termijn voor de melding binnen 72 uur schuift **niet** op als de vroegtijdige waarschuwing te laat
was [src:cra_art14_1_2] [src:cra_art14_3_5].

## Uur 0: eerste signaal

- [ ] **Open een zaak.** Zaaknummer, tijdstip van detectie (UTC en Nederlandse tijd), wie het
      meldde, wat het signaal was.
- [ ] Waarschuw de incidentleider en de technisch leider.
- [ ] **Bewaar bewijs.** Wis geen logs en bouw geen systemen opnieuw op voordat er kopieën zijn
      veiliggesteld. Zie de [checklist bewijs](05-evidence.md).

## Uur 0 tot 1 (en zo snel mogelijk): eerste beoordeling

Doorloop de beslisboom van de Meldwijzer, of beantwoord deze vragen:

**Spoor A: actief uitgebuite kwetsbaarheid** [src:cra_art3]
- Zit de kwetsbaarheid in ons product? Welke producten en versies? Controleer de SBOM's.
- Is er **betrouwbaar bewijs** dat een kwaadwillende haar heeft uitgebuit? Op zichzelf niet genoeg:
  een hoge CVSS-score, een openbare proof of concept, een melding van een onderzoeker of een
  bevinding uit je eigen tests [src:ncsc_melden].

**Spoor B: ernstig incident** [src:cra_art14_3_5]. Controleer dit altijd ook.
- Heeft een incident de beveiliging van het product geraakt? (Bijvoorbeeld: buildpipeline,
  updateserver, signeersleutels, ontwikkelomgeving.)
- Tast het (mogelijk) het vermogen van het product aan om de beschikbaarheid, authenticiteit,
  integriteit of vertrouwelijkheid van gevoelige of belangrijke gegevens of functies te beschermen?
- Heeft het geleid (of kan het leiden) tot het binnenbrengen of uitvoeren van kwaadaardige code in
  het product of op systemen van gebruikers?

**Tegelijk:** Cyberbeveiligingswet? Persoonsgegevens? Zie [hoofdstuk 6](06-other-regimes.md).

## Het moment van op de hoogte raken

- [ ] Zodra de eerste beoordeling een **redelijke mate van zekerheid** geeft, ben je op de hoogte
      [src:ec_cra_reporting]. Leg het tijdstip vast **en de reden**.
- [ ] Twijfel je? Neem het **vroegst denkbare** moment.
- [ ] Elk spoor kan een eigen moment hebben. Leg ze apart vast.
- [ ] Zet alle termijnen in de agenda van iedereen met een rol.

## Binnen 24 uur: vroegtijdige waarschuwing

Verstuur deze **zonder onnodige vertraging**, en in elk geval binnen 24 uur. Wacht niet op
volledige informatie; de latere meldingen vullen de details aan.

| Kwetsbaarheid [src:cra_art14_1_2] | Ernstig incident [src:cra_art14_3_5] |
|---|---|
| Dat er een actief uitgebuite kwetsbaarheid in product X zit | Dat er een ernstig incident is dat product X raakt |
| Waar van toepassing: de lidstaten waar het product beschikbaar is | Of je onrechtmatige of kwaadwillige handelingen vermoedt |
| | Waar van toepassing: de lidstaten waar het product beschikbaar is |

- [ ] **Waar:** MijnNCSC (aanbevolen) of het CRA-meldformulier [src:ncsc_melden]. Hoofdvestiging
      elders? Het coördinerende CSIRT van die lidstaat [src:cra_art14_7].
- [ ] **Meld dezelfde zaak niet ook bij ENISA.** Het NCSC stuurt hem door [src:ncsc_melden].
      Achtergrond: de CRA schrijft voor dat je meldt via het centrale meldplatform van ENISA, via het
      elektronische meldpunt van je coördinerende CSIRT [src:cra_art14_7]. Voor Nederland verwijst
      het NCSC fabrikanten naar MijnNCSC of het CRA-meldformulier en stuurt het de melding door naar
      ENISA en andere CSIRT's [src:ncsc_melden].
- [ ] **Kanaal niet beschikbaar?** Werkt MijnNCSC niet, gebruik dan het CRA-meldformulier, en
      andersom [src:ncsc_melden]. Volgens de FAQ van ENISA dien je, als het centrale meldplatform
      tijdelijk niet beschikbaar is, de melding in zodra het weer beschikbaar is. Is direct contact
      eerder nodig, dan mag je je coördinerende CSIRT (in Nederland het NCSC) rechtstreeks benaderen,
      maar je moet de melding **daarna alsnog via het platform indienen** zodra het weer werkt
      [src:enisa_srp_faq]. Leg de storing (tijden, foutmeldingen, schermafbeeldingen) en eventueel
      direct contact vast in het zaaklogboek.
- [ ] Markeer de melding als **gevoelig** als details aanvallers kunnen helpen [src:ncsc_melden].
- [ ] Leg het tijdstip van indienen en het referentienummer vast in het zaaklogboek.
- [ ] Beide sporen geraakt? Dan is voor elk spoor een melding nodig.

De 24 uur gemist? Dien **nu** alsnog in, en leg vast waarom het te laat was. Overtreding van
artikel 14 kan worden beboet met maximaal € 15 miljoen of 2,5% van de wereldwijde jaaromzet. Micro- en
kleine ondernemingen krijgen geen boete voor het missen van de termijn van 24 uur voor de vroegtijdige
waarschuwing, maar de meldplicht en de andere termijnen blijven gelden [src:cra_art64]
[src:cra_corrigendum_2025_07_02].

## Binnen 72 uur (vanaf op de hoogte raken): melding

Verstuur deze, tenzij de informatie al in de vroegtijdige waarschuwing stond.

| Kwetsbaarheid [src:cra_art14_1_2] | Ernstig incident [src:cra_art14_3_5] |
|---|---|
| Algemene informatie over het betrokken product | De aard van het incident |
| Algemene aard van het misbruik en van de kwetsbaarheid | Een eerste beoordeling |
| Genomen corrigerende of mitigerende maatregelen, en maatregelen die gebruikers kunnen nemen | Genomen corrigerende of mitigerende maatregelen, en maatregelen die gebruikers kunnen nemen |
| Hoe gevoelig je de informatie vindt | Hoe gevoelig je de informatie vindt |

- [ ] Start of actualiseer tegelijk de [informatie aan gebruikers](04-inform-users.md).

## Het eindrapport

| Kwetsbaarheid [src:cra_art14_1_2] | Ernstig incident [src:cra_art14_3_5] |
|---|---|
| **Termijn:** uiterlijk 14 dagen nadat een corrigerende of mitigerende maatregel beschikbaar is | **Termijn:** binnen één maand nadat je de melding hebt ingediend |
| Beschrijving van de kwetsbaarheid, inclusief ernst en impact | Gedetailleerde beschrijving, inclusief ernst en impact |
| Waar beschikbaar: informatie over de kwaadwillende actor | Het soort dreiging of de grondoorzaak die het waarschijnlijk veroorzaakte |
| Details van de beveiligingsupdate of andere corrigerende maatregelen | Toegepaste en lopende mitigerende maatregelen |

- [ ] Het CSIRT kan op elk moment om een **tussenrapport** over de voortgang vragen
      [src:cra_art14_3_5].

## De zaak afsluiten

- [ ] Alle meldingen ingediend, referentienummers vastgelegd
- [ ] Gebruikers geïnformeerd, advisory gepubliceerd
- [ ] Lessen: wat hield je op? Werk dit draaiboek en je voorbereiding bij.
- [ ] Bewaar het zaaklogboek en het bewijs volgens je bewaarbeleid.

## Veelgemaakte fouten

- De 72 uur tellen vanaf de vroegtijdige waarschuwing in plaats van vanaf het op de hoogte raken
- "Geen misbruik" als einde van de beoordeling zien, zonder te controleren op een ernstig incident
- Wachten op het volledige forensische beeld voordat je de vroegtijdige waarschuwing stuurt
- Dezelfde zaak zowel bij het NCSC als bij ENISA melden
- Producten vergeten die jaren geleden zijn verkocht maar nog in gebruik zijn [src:cra_art69_3]
- Maar één product noemen terwijl de kwetsbare component in meerdere zit
