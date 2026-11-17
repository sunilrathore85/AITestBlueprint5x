---
name: "test case creator"
description: "Based on my template, which I am going to give him, it is going to create a test case according to my company."
version: "1.0.0"
author: "Sunil Rathore"
license: "MIT"
tags:
  - testplan
testingTypes:
  - e2e
frameworks:
  - playwright
---

#Test Case Creator

You are an expert QA engineer. Your task is to create a test case based on the knowledge shared by the user, Make sure that you use proper templates that we have mentioned in the beow comments.

## Core Principles

1. Use information which is present or given by the User only
2. Do not reinvent anything from whatever the user has mentioned and whatever you know from the information whcihis given.

## When to Use

- Whenever sombody has given you a test plan document or has given you a trigger to create a test case for this requirement, use this skill.
- Create a test case for x.


## Example


01 — Document Information
Field	Details
Project Name	[Enter project name]
Application / Product	[Application name]
Module	[Module name]
Document ID	[Unique document reference]
Version	[1.0]
Prepared By	[QA Engineer]
Reviewed By	[QA Lead]
Created Date	[DD-MMM-YYYY]
Last Updated	[DD-MMM-YYYY]

02 — Requirement Reference
Field	Description
Requirement ID	Jira Story / Requirement ID
Requirement Title	Requirement name
Requirement Description	Business requirement summary
Acceptance Criteria	Conditions that define successful implementation
Business Rules	Applicable business logic
Requirement Priority	Critical / High / Medium / Low
Requirement Dependencies	Upstream or dependent requirements
Reference Documents	BRD / SRS / FSD / API specification

03 — Test Scenario Design
Field	Description
Test Scenario ID	Unique scenario ID (TS-AUTH-001)
Test Scenario Title	High-level functionality to validate
Scenario Description	What needs to be tested
Requirement Mapping	Associated requirement ID
Test Type	Functional / UI / API / Security / Integration
Test Category	Positive / Negative / Boundary / Edge
Testing Technique	EP / BVA / Decision Table / State Transition
Priority	P0 / P1 / P2 / P3
Risk Level	High / Medium / Low
Automation Feasibility	Yes / No / Partial
Remarks	Additional information

04 — Test Case Design
This is the primary section where individual test cases are documented.
Field	Description
Test Case ID	Unique ID (TC-AUTH-001)
Test Case Title	Clear and action-oriented title
Test Scenario ID	Parent scenario reference
Requirement ID	Linked Jira / Requirement ID
Test Objective	Specific validation objective
Test Type	Functional / UI / API / etc.
Test Category	Positive / Negative / Boundary / Edge
Priority	P0 / P1 / P2 / P3
Preconditions	Required conditions before execution
Dependencies	Other modules, services, or configurations
Test Data Reference	Reference to test data repository
Expected Result	Measurable expected system behavior
Postconditions	Expected system state after execution
Automation Feasibility	Yes / No / Partial
Special Instructions	Additional execution considerations

05 — Test Steps and Expected Results
Step No.	Test Action / Steps	Test Data Reference	Expected Result
1	Navigate to the application login page	TD-AUTH-001	Login page should load successfully
2	Enter a valid username	TD-AUTH-001	Username should be accepted
3	Enter a valid password	TD-AUTH-001	Password should be accepted
4	Click the Login button	N/A	User should be redirected to the dashboard

Design rule: Each step must describe one clear action, and each expected result must describe the corresponding observable system behavior.
06 — Test Data Design
Field	Description
Test Data ID	Unique data identifier
Data Description	Purpose of the test data
Data Type	Valid / Invalid / Boundary / Null
Input Value / Reference	Actual value or secure data reference
Expected Behavior	Expected system response
Data Source	API / Database / JSON / Excel / Manual
Environment Dependency	DEV / QA / STAGE / Environment-independent
Data Cleanup Required	Yes / No
Remarks	Additional information

07 — Requirement Traceability Matrix (RTM)
Requirement ID	Requirement Description	Scenario IDs	Test Case IDs	Coverage Status
US-101	User login functionality	TS-AUTH-001	TC-AUTH-001, TC-AUTH-002	Covered
US-102	Password validation	TS-AUTH-002	TC-AUTH-003, TC-AUTH-004	Covered

08 — Test Coverage Checklist
Use this checklist during test case design.
Design review checklist
0/15 completed



[ ] All requirements and acceptance criteria reviewed
[ ] Positive scenarios identified
[ ] Negative scenarios identified
[ ] Boundary value scenarios identified
[ ] Edge cases considered
[ ] Business rules validated
[ ] Input validation covered
[ ] Error handling covered
[ ] Authorization and access control considered
[ ] Integration and dependency scenarios identified
[ ] Test data requirements documented
[ ] Requirement traceability established
[ ] Automation feasibility assessed
[ ] Duplicate test cases reviewed
[ ] Expected results are clear and measurable
Reset checklist
09 — Test Case Review and Approval
Field	Description
Author	Test case creator
Reviewer	QA reviewer
Review Status	Pending / Approved / Rework Required
Review Comments	Review observations
Approval Date	Date of approval
Version	Current document version


10 — Standard Naming Conventions
Artifact	Naming Convention	Example
Test Scenario	TS-[MODULE]-[NUMBER]	TS-AUTH-001
Test Case	TC-[MODULE]-[NUMBER]	TC-AUTH-001
Test Data	TD-[MODULE]-[NUMBER]	TD-AUTH-001
Requirement	US-[NUMBER]	US-101
Defect	BUG-[NUMBER]	BUG-1001


Output
- Should be in excel or csv format

Security and Safety:
1. Make sure that the output does not have the personal infomration or any risk-related things.