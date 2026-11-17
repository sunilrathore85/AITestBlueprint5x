---
name: "bug triage"
description: "Turns a defect report into a triage comment with priority, severity, how to test, and risks. Reusable whenever a bug needs the same comment shape."
version: "1.0.0"
license: "MIT"
tags:
  - defects
  - triage
  - qa
---

# Bug Triage

You write a defect triage comment from the bug report the user provides. You set priority, severity, how to test it, and the risks. You do not invent product behavior that the report does not support.

## Problem this skill solves

Bug comments drift. One note has steps, the next has a guess, and priority is missing. Reviewers then re-ask the same questions. This skill makes every triage comment carry the same four decisions: priority, severity, how to test, and risks.

## When to use this skill

Use this skill when the user:

- Pastes a bug, defect, ticket, or failure note and asks to triage it.
- Asks for priority, severity, a retest method, or risks on a defect.
- Asks for a comment they can paste on the ticket.

Trigger phrases: "triage this bug", "set priority and severity", "how should we test this defect", "write the bug comment".

## When not to use this skill

Do not use this skill when the user:

- Asks for a test plan or a full test-case suite. Use the test plan or test case skill.
- Asks for a code fix or a patch.
- Has not described the defect (symptom, and where it happened).
- Asks for exploit steps, credential theft, or how to attack a system. Record the security symptom at high level only, with no attack procedure.

## Workflow

1. Identify the problem. Restate the defect in one sentence from the report: who is affected, what fails, and where.
2. If the report has no symptom, stop and ask for it. Do not assign priority from a title alone.
3. Set severity from impact on the product, using only facts in the report:
   - Blocker: no workaround, core flow unusable, or data/security exposure described by the report.
   - Critical: major flow broken, workaround is painful.
   - Major: important function wrong, a workaround exists.
   - Minor: limited function or cosmetic issue with a clear workaround.
   - Trivial: copy, alignment, or noise that does not block the task.
4. Set priority from what should be fixed first, separate from severity:
   - P0: fix before further testing or release of that flow.
   - P1: fix in the current cycle.
   - P2: fix after P0 and P1, still in scope.
   - P3: backlog, does not block the cycle.
5. Write how to test it: preconditions, steps already in the report, and the observable expected result. One action per step. If a step was not in the report, mark it as not provided instead of inventing clicks.
6. State risks: user impact, areas that may break on the fix, and what must be retested. Do not add exploit detail.
7. Output the comment ready to paste.

## Output shape

```text
Problem
<one sentence>

Severity: Blocker | Critical | Major | Minor | Trivial
Priority: P0 | P1 | P2 | P3
Why: <one or two sentences tied to the report>

How to test
1. <precondition>
2. <step>
Expected: <observable result>

Risks
- <user or release risk>
- <regression area to retest>

Not provided
- <facts the report did not include>
```

## Safety, security, and guard rails

- Use only facts from the defect report and requirements the user supplied.
- Do not put personal data, passwords, tokens, or customer identifiers in the comment. Use "[redacted]" plus the field name.
- Do not include attack procedures, payloads, or bypass steps. For a security defect, state the impact and the safe retest (confirm the control holds), not how to break it.
- Do not raise or lower severity to match a guess about the business. If impact is unknown, say so and leave severity as not provided.
- The comment recommends test focus. It does not declare the bug fixed.
