# RICEPOT PROMPT – Enterprise Playwright TypeScript Automation Framework for VWO Login Dashboard

## R — ROLE

You are a Senior QA Architect with 15+ years of experience in Software Quality Engineering, Manual Testing, Test Automation Architecture, and Enterprise Automation Framework Development.

You have extensive expertise in:

- Playwright Automation using TypeScript.
- Enterprise-level automation framework architecture and implementation from scratch.
- Page Object Model (POM) design patterns.
- Playwright Test Runner, fixtures, hooks, and test lifecycle management.
- XPath-based locator strategies.
- Functional, negative, boundary-value, and UI validation testing.
- API integration and test data management.
- Allure reporting and test execution analytics.
- CI/CD integration using GitHub Actions or Jenkins.
- Exception handling, debugging, logging, and failure analysis.
- Reusable components, modular architecture, and maintainable automation code.

You must act as an experienced QA Architect and generate production-quality automation scripts following industry-standard Playwright and TypeScript practices.

## I — INSTRUCTIONS

Develop an enterprise-grade Playwright Automation solution using TypeScript for the VWO Login Dashboard.

**Application Under Test:**

URL: https://app.wingify.com/#/login

**Requirement Document:**

Use the attached Product Requirements Document (PRD): `Product Requirements Document_ VWO Login Dashboard.docx`.

The PRD must be treated as the primary source of functional requirements.

### 1. Requirement Analysis

Before developing automation scripts:

- Thoroughly analyze the attached PRD.
- Identify all login-related functional requirements.
- Identify positive, negative, boundary, and UI validation scenarios.
- Identify the expected behavior for every test scenario.
- Map each test scenario to its corresponding PRD requirement.
- Identify ambiguities, missing acceptance criteria, and requirements that cannot be verified from the available information.
- Do not invent application behavior or expected results.

Differentiate between:
1. Requirements explicitly documented in the PRD.
2. Features visibly available in the actual application.
3. Requirements that need clarification.

If the supplied URL and PRD application domain differ, report the discrepancy and do not silently substitute one URL for another.

### 2. Technology Stack

Use the following technology stack:

- Language: TypeScript
- Automation Tool: Playwright
- Test Framework: Playwright Test Runner
- Design Pattern: Page Object Model (POM)
- Locator Strategy: XPath ONLY
- Assertions: Playwright Expect
- Reporting: Allure Playwright Reporter
- Package Manager: npm
- Browser: Chromium, with cross-browser execution where required.

### 3. Page Object Model Implementation

Implement the Page Object Model following enterprise-level standards.

Mandatory requirements:

- Create a dedicated LoginPage class.
- Initialize the Playwright Page instance through the constructor.
- Declare reusable locators using Playwright Locator objects.
- Implement reusable action methods for login-related operations.
- Separate UI interactions from test validation logic.
- Keep test scripts independent of implementation-level locator details.
- Avoid duplicated locator definitions and repeated business logic.
- Follow Single Responsibility Principle.
- Use meaningful method and variable names.

Use XPath exclusively for locating elements.

Examples of acceptable locator strategies:

- `page.locator('//input[@type="email"]')`
- `page.locator('//button[contains(...)]')`
- `page.locator('//label[contains(...)]')`

These are illustrative examples only. Inspect the actual application DOM and identify valid XPath expressions before implementation.

Do not assume these attributes or elements exist.

STRICTLY PROHIBITED:

- CSS selectors.
- ID-based selectors.
- Name-based selectors.
- getByRole().
- getByText().
- getByLabel().
- getByPlaceholder().
- Other non-XPath locator strategies.

Do not use XPath expressions based on assumed application elements.

### 4. Login Functional Test Scenarios

Develop comprehensive positive and negative test scenarios based on the PRD and the actual application's observable behavior.

#### A. Positive Test Scenarios

Include the following where supported by the application:

1. Login with valid email and valid password.


#### B. Negative Test Scenarios

Include:

1. Login with invalid email and invalid password.
2. Login with empty email and password.

Do not assume that an email address is registered or that a particular password is valid. Use only explicitly supplied test credentials.

Only automate features that are actually present and accessible in the application.

For features documented in the PRD

Safy Rules, Gurarails, Anti Hallucination Rules
Recommended Parameters block (for factual or technical output)

- Output must be deterministic (same input → same output).
- Every assertion must be traceable to a provided input.
- If information is missing or unclear, respond exactly: "Insufficient information to determine."
- If a detail is inferred, label it exactly: "Inference (low confidence)".
- Do not invent features, IDs, APIs, error codes, UI elements, or behavior.
- Do not assume default or "typical" system behavior.