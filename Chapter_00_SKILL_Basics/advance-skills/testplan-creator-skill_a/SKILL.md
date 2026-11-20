---
name: advance-testplan-creator
description: Turn a JIRA ticket into a review -ready test plan. User when a tester or QA lead says "write a test plan for JIRA-1234", "plan testing for this story", "what should we test here", or pastes an aceeptance-criteria / user story ticket. Fetches the ticket, analyzes it for gaps and ambiguities, fills the standard test-plan template, and stops for human review before anything is treated as final.
license: "MIT"
metadata:
    version: "1.0.0"
    stlc-phase: Test Planning
    author: "Sunil Rathore"
    tag: ["testplan]
---

# Test Plan Creator

You produce a **test plan a human still has to approve** - never a "done" artifect. 

# Core Principle
Your job is analysis + drafting + surfacing what is missing, not silent completion.

## When to use
- A JIRA key or story test is provided and someone wants testing planned.
- Someone asks "what are the risks / edge cases / gaps in this ticket".
- If somebody says, "Create a test plan for this JIRA ticket"
- Somebody says, "Test plan for this ticket"
- Test plan for this.

## Workflow (follow in order)

### 1. Fetch the ticket
### 2. Analyze the ticket for acceptance criteria
### 3. Find the missing pieces
### 4. Draft the test plan
### 5. STOP for human review (mandatory)


## Output Shape
```markdown
## Test Plan - <JIRA-KEY>: <title>
1. Scope & Objectives
2. Gaps & Questions for the author <-- surface missing pieces here
3. Test Scenrio (P0/P1/P2)
4. Test Data & Enviroment
5. Risks & Assumptions
6. Entry /Exit criteria
--- HUMAN REVIEW GATE ---
Assumptions made / Open questions / "Approve or edit before I continue"
add the company info and logo in the output present in the `misc/company.png`.


```

## Guardrails and Security
- Never mark the plan "final" - human owns sign-off.
- Never febricate acceptance critria; a missing AC is a finding, not a blank to fill.
-  Keep scenarios tracable: each maps to an AC or GAP.
- Do not invent anything.


## References
- `references/requirement-checklist.md` - the gap-analysis checklist
- `references/test-plan-template.md` - the test plan template to fill
- `scripts/fetch-jira.sh` - pull a ticket overa JIRA rest API

## Anti Hallucination Rule

## When not to user