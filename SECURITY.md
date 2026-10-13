# Security

## Never post vulnerability or incident details in public issues

This repository is public. **Do not** open issues, discussions or pull requests that contain
details of a real, unpatched vulnerability or an ongoing incident, including your own case data or
exported case files. Report those to your coordinating CSIRT (in the Netherlands: the NCSC), not here.

## Reporting a vulnerability in CRA Meldwijzer itself

Use GitHub's private vulnerability reporting for this repository ("Security" tab -> "Report a
vulnerability"). Please do not open a public issue.

## Privacy design

- The app makes no network requests after loading: no analytics, no fonts or scripts from third
  parties, no backend.
- Case data stays in memory unless you explicitly opt in to saving it in your browser.
- Exported case files are plain JSON on your own device. They are not an official notification and
  not a secure evidence vault.
