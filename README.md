# Papaya Insurtech Application Test

Submission for Papaya Insurtech Full-Stack Engineer application test.

This repository contains both required parts:

1. Logical Questions: selected written answers.
2. AI Engineering Challenge: AI Challenge 10, Fraud Detection Scoring Engine.

## Repository Structure

```text
.
├── Logical_Question/
│   └── answers.md
└── AI_Engineering_Challenges/
    ├── AI_Challenge_10.md
    └── submission/
        ├── README.md
        ├── package.json
        ├── src/
        ├── tests/
        └── generated/
```

## Part 1: Logical Questions

Written answers are available at:

- [Logical_Question/answers.md](./Logical_Question/answers.md)

Answered questions:

- Q1: A place where people generally feel most at home.
- Q4: Earliest memory.
- Q3: What makes a salesperson pleasant.
- Q5: The last forgotten item.
- Q12: Fastest possible fuel station guideline.

## Part 2: AI Engineering Challenge

Selected challenge:

- Advanced, Challenge 10: Fraud Detection Scoring Engine
- Original prompt: [AI_Engineering_Challenges/AI_Challenge_10.md](./AI_Engineering_Challenges/AI_Challenge_10.md)
- Implementation details: [AI_Engineering_Challenges/submission/README.md](./AI_Engineering_Challenges/submission/README.md)

The solution is a TypeScript CLI application that:

- Generates a deterministic dataset of 2,000 synthetic insurance claims.
- Injects about 200 known fraudulent claims across 8 fraud patterns.
- Applies all required rule-based detection rules.
- Produces ranked risk scores from 0 to 100.
- Writes itemized evidence for each triggered rule.
- Reports precision, recall, false positive rate, and processing time.
- Includes unit tests for rules, scoring, metrics, edge cases, and challenge coverage.

## Quick Start

Requirements:

- Node.js 20 or newer
- npm

Run from the challenge submission directory:

```bash
cd AI_Engineering_Challenges/submission
npm install
npm run all
npm test
npm run typecheck
```

Generated outputs are written to:

- `AI_Engineering_Challenges/submission/generated/claims.json`
- `AI_Engineering_Challenges/submission/generated/scored_claims.json`
- `AI_Engineering_Challenges/submission/generated/metrics_report.json`
- `AI_Engineering_Challenges/submission/generated/summary.md`

## Latest Metrics

The latest generated report shows:

| Metric | Value |
| --- | ---: |
| Total claims | 2,000 |
| Fraud claims | 200 |
| Flagged claims | 239 |
| Precision | 83.68% |
| Recall | 100.00% |
| False positive rate | 2.17% |
| Processing time | 111 ms |

These results meet the challenge requirements:

- Recall at least 70%.
- False positive rate at most 20%.
- Processing 2,000 claims in less than 30 seconds.
- At least 15 unit tests.
- All 8 required fraud rules implemented.

## AI Tool Usage

AI assistance was used as part of the implementation workflow, in line with the challenge guidance. I used it to accelerate code generation, test coverage, documentation, and review iterations. I kept the final responsibility on understanding the domain assumptions, rule design, edge cases, and generated outputs.

## Notes for Reviewers

Start with this root README for orientation, then read:

1. [Logical_Question/answers.md](./Logical_Question/answers.md) for the reasoning questions.
2. [AI_Engineering_Challenges/submission/README.md](./AI_Engineering_Challenges/submission/README.md) for the technical approach, rule explanations, scoring design, metrics, and project structure.
3. `AI_Engineering_Challenges/submission/generated/summary.md` for the latest reviewer-friendly report produced by the CLI.
