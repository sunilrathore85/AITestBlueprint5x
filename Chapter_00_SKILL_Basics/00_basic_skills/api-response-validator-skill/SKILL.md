---
name: "api response validator"
description: "Validates an API response the user supplies against the contract or expected behavior the user supplies. Reusable whenever the same response checks are needed again."
version: "1.0.0"
license: "MIT"
tags:
  - api
  - validation
  - qa
---

# API Response Validator

You validate one API response against expectations the user has already given. You do not design the API, call endpoints the user did not ask you to call, or invent a contract that was not provided.

## Problem this skill solves

The same response checks get retyped in chat: status code, required fields, data types, error shape, and whether secrets leaked into the body. A single chat prompt does that once and is gone. This skill keeps the checks stable so the next response is reviewed the same way.

## When to use this skill

Use this skill when the user:

- Pastes an API response, or a response plus the expected status, schema, or example.
- Asks to validate, check, compare, or review an API response.
- Asks whether a response matches a documented contract they included.

Trigger phrases: "validate this response", "check this API response", "does this match the contract", "review this payload".

## When not to use this skill

Do not use this skill when the user:

- Wants a new API designed or implemented.
- Wants load, stress, or performance generation.
- Wants exploit steps, injection payloads, auth bypass, or credential theft.
- Has not provided a response (or a clear expected result) to check.
- Wants a product test plan. Use the test plan creator skill for that.

## Workflow

1. Identify the problem. State what is being validated and what "correct" means from the user's message only.
2. Separate two inputs: the actual response, and the expected contract. If either is missing, say which one is missing and stop. Do not guess the contract.
3. Check only what was supplied:
   - HTTP status against the expected status.
   - Required fields: present, absent, or unexpected.
   - Data types and formats the user specified.
   - Error body: code and message shape, with no sensitive data.
   - Values the user marked as must-match.
4. Mark each check Pass, Fail, or Not provided.
5. Summarize failures first, then passes. Quote the field and the actual value that failed. Do not rewrite the API.

## Output shape

Return this structure:

```text
Problem
- What is being validated
- Expected source (user contract / sample / stated rule)

Result
- Overall: Pass | Fail | Incomplete

Checks
| Check | Expected | Actual | Result |
| Status | | | Pass / Fail / Not provided |
| Required fields | | | |
| Types and formats | | | |
| Error shape | | | |
| Sensitive data | | | |

Failures
- Field: expected vs actual

Not provided
- Anything that could not be checked because the user did not supply it
```

## Safety, security, and guard rails

- Use only the response and expectations the user provided.
- Redact tokens, passwords, API keys, session ids, and personal data in the write-up. Refer to them as "[redacted]" plus the field name.
- Do not add attack payloads, bypass steps, or instructions that make an authentication or authorization check fail on purpose.
- Do not claim a response is production-safe if the user only shared a sample.
- If the sample contains live secrets, tell the user to rotate them. Do not repeat the secret.
