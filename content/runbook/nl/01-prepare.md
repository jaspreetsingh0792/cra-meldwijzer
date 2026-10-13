# 1. Voorbereiden vóór een incident

Dit regel je niet in de eerste 24 uur. Doe het nu.

## Toegang tot het melden

- [ ] **Richt MijnNCSC in** voor je organisatie. Je logt in met eHerkenning of SSOnRijk. De
      vroegtijdige waarschuwing, melding en het eindrapport blijven daar bij elkaar in één zaak
      [src:ncsc_melden].
- [ ] Ken het alternatief: het **CRA-meldformulier** op ncsc.nl werkt zonder account. Je krijgt
      per e-mail een referentienummer; bewaar dat voor vervolgmeldingen [src:ncsc_form].
- [ ] De CRA zelf kent geen registratieplicht [src:ncsc_melden]. Regel de toegang toch vooraf,
      zodat een inlogprobleem je geen uren kost.
- [ ] Hoofdvestiging buiten Nederland? Zoek uit welk CSIRT voor die lidstaat coördineert en wat
      de meldroute is [src:cra_art14_7].
- [ ] Geef minstens twee mensen toegang, onder wie een vervanger voor het weekend.

## Ken je producten

Leg per product met digitale elementen vast:

- [ ] Productnaam, versies en de **juridische entiteit** die de fabrikant is
- [ ] Wanneer elke versie in de handel is gebracht, en of die nog wordt verkocht
- [ ] **Lidstaten waar het product beschikbaar is.** De vroegtijdige waarschuwing vraagt hierom.
- [ ] Ondersteuningsperiode en einddatum van de ondersteuning
- [ ] White-label- of OEM-afspraken: wie verkoopt het onder wiens naam
- [ ] Een software bill of materials (SBOM) per versie, zodat je "zit de kwetsbare component in
      dit product?" in minuten beantwoordt, niet in dagen

## Binnenkomst: hoe je ervan hoort

- [ ] Een gepubliceerd beveiligingscontact (`security.txt`) en een beleid voor coordinated
      vulnerability disclosure
- [ ] Monitoring van lijsten met bekend uitgebuite kwetsbaarheden en van advisories voor de
      componenten die je gebruikt
- [ ] Een route van klantenservice naar het securityteam: "een klant zegt dat zijn apparaat in een
      botnet zit" moet binnen het uur bij de juiste persoon zijn
- [ ] Monitoring van je eigen build-, update- en signeeromgeving. Een compromittering daar kan een
      ernstig incident zijn [src:cra_art14_3_5].

## Mensen en beslissingen

- [ ] Wijs de [rollen](02-roles.md) toe met vervangers op naam, ook voor avonden en weekenden
- [ ] **Spreek vooraf af:** bij twijfel gaat de vroegtijdige waarschuwing de deur uit. Juridische
      goedkeuring mag een termijn niet blokkeren.
- [ ] Bepaal wie namens het bedrijf meldingen mag indienen

## Communicatie

- [ ] Een plek om security advisories te publiceren (een webpagina, liefst ook machineleesbaar)
- [ ] Een manier om getroffen klanten te bereiken: mailinglijst, klantportaal, melding in het
      product [src:cra_art14_8]

## Contactenlijst

Bewaar deze lijst ook offline (geprint, of in je incidentkanaal):

| Wie | Waarvoor |
|---|---|
| NCSC | CRA-meldingen (MijnNCSC / CRA-meldformulier) [src:ncsc_melden] |
| RDI | Vragen over de reikwijdte van de CRA en toezicht; het NCSC is geen toezichthouder [src:ncsc_melden] |
| MijnNCSC (centraal meldpunt Cbw) | Als je organisatie onder de Cyberbeveiligingswet valt; bereikt je sectorale CSIRT en toezichthouder [src:cbw] [src:ncsc_cbw_meldplicht] |
| Autoriteit Persoonsgegevens | Als persoonsgegevens geraakt kunnen zijn [src:gdpr_art33_34] |
| Juridisch adviseur | Beslissingen over de meldplicht |
| Belangrijke toeleveranciers | Kwetsbaarheden in hun componenten |

## Oefenen

- [ ] Doe de [tabletopoefening](08-drill.md) minstens één keer per jaar, en na grote veranderingen
- [ ] Log tijden in je systemen in UTC, zodat tijdlijnen op elkaar aansluiten
