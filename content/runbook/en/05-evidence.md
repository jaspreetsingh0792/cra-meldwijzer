# 5. Evidence checklist

Two goals: investigating the event, and later showing that you reported correctly and on time.

## The decision trail (most often forgotten)

- [ ] Time of first detection, and what the signal was
- [ ] Awareness time per track, and **why** that moment
- [ ] The answers given in the decision tree, and who gave them
- [ ] Every reportability decision: who, when, on what information
- [ ] Submission time and reference number of every report
- [ ] What users were told, when and through which channel
- [ ] When a corrective or mitigating measure became available. This starts the 14-day clock for
      the vulnerability final report [src:cra_art14_1_2].

## Technical evidence

- [ ] Logs (application, server, network, authentication), copied before rotation or rebuild
- [ ] Indicators of compromise: IP addresses, domains, hashes, payloads
- [ ] Affected product versions, SBOMs and build records
- [ ] For an incident in your own environment: images or snapshots of affected systems, access
      logs of build, update and signing infrastructure
- [ ] External sources: advisory, known-exploited listing, CSIRT notice, customer report (keep
      the original message with its timestamp)

## Handling

- Keep evidence in a location with restricted access, and record who accessed it.
- Do **not** put case data or evidence in public tickets or repositories.
- Use UTC timestamps, and note the time zone of every time you record by hand.
