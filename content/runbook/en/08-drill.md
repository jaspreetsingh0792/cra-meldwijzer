# 8. Tabletop drill

About 90 minutes. A facilitator reads out the injects. The team decides what it does and **writes
down times**. Everything below is fictional.

## Scenario: the weekend botnet

You make a home router, "HR-200", sold since 2021 in the Netherlands, Belgium and Germany.

| Inject | Time | What happens |
|---|---|---|
| 1 | Friday 17:40 | Customer support gets an email: "my router is part of a botnet according to my ISP". The support agent leaves for the weekend. |
| 2 | Saturday 09:15 | A security researcher posts that a vulnerability in the embedded web server library used in many routers is being exploited. Your HR-200 firmware uses that library. |
| 3 | Saturday 13:00 | Your on-call engineer finds exploitation attempts against the HR-200 in your telemetry, and at least one success. |
| 4 | Saturday 20:00 | The incident lead is unreachable (on a flight). |
| 5 | Monday 10:00 | While investigating, you find that someone logged in to your firmware build server two weeks ago with a stolen account. |
| 6 | Thursday 16:00 | A patched firmware version is released. |

## Questions per inject

1. Is this a signal? Who should have received it? Did the clock start?
2. Is the vulnerability in our product, and which versions? Is there reliable evidence of
   exploitation yet?
3. When are you aware? What are the deadlines (write them down, with dates and times)?
4. Who sends the early warning? Does the team know how to log in to MijnNCSC?
5. Is this a second track (severe incident)? What is its awareness moment and its deadlines?
   Does it change the content of the vulnerability notification?
6. Which deadline does the patch start? What do you tell users, and how?

## Points the debrief should cover

- Inject 1 is a signal, but probably not yet awareness. Should it have reached the security team
  over the weekend?
- Awareness for the vulnerability is around inject 3: the early warning is due within 24 hours of
  that moment, on a Sunday.
- Inject 4 tests deputies and pre-agreed decision rights.
- Inject 5 opens a **separate** severe-incident assessment (build infrastructure, possible
  malicious code), with its own clock.
- Inject 6 starts the 14-day clock for the vulnerability final report.
- Throughout: are users being informed, and is the case log complete?
- Cbw or GDPR angles? (The ISP's customers' data? Your own services?)

Afterwards: list three improvements, assign owners, and schedule the next drill.
