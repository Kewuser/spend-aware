# SpendAware

**Status:** In active development

A personal finance web application that reconciles pending and posted credit card transactions to give a real-time, accurate picture of true spending — including a "safe-to-spend" number based on budget, upcoming expenses, and days remaining in the billing cycle.

## Problem

I pay my credit cards on time, but credit card transactions don't post immediately — there's often a lag of several days between making a purchase and seeing it reflected in my posted balance. That gap made it easy to lose track of how much I'd actually spent, and by the time charges posted, I'd already spent more than I realized.

## Solution

SpendAware combines **posted balance** + **pending charges** — pulled via the Plaid API — to calculate true current spending in real time, then factors in your monthly budget and days remaining to surface a single, actionable **safe-to-spend** number.

## Tech Stack

- **Backend:** Node.js, TypeScript, Express
- **Database:** PostgreSQL (Prisma ORM)
- **Auth:** JWT, bcrypt password hashing
- **Frontend:** React, TypeScript
- **Transaction Data:** Plaid API (Sandbox environment for pending/posted transaction data)
- **Testing:** Jest
- **CI:** GitHub Actions
- **Cloud (AWS):** RDS (Postgres), Elastic Beanstalk / ECS Fargate, S3 + CloudFront

## The Core Engineering Challenge

Credit card transactions typically show up as "pending" before they finalize as "posted" days later. A naive implementation could easily double-count a charge during that transition. Reconciling a posted transaction back to its pending version without duplicating it is the central technical problem this project solves.

## Roadmap

- [ ] Transaction model + pending/posted reconciliation logic
- [ ] Safe-to-spend calculation
- [ ] Auth (signup/login)
- [ ] Automated test suite
- [ ] Frontend dashboard
- [ ] CI pipeline
- [ ] AWS deployment (RDS, Elastic Beanstalk/Fargate, S3 + CloudFront)

More detail — setup instructions, API docs, and testing info — will be added as those pieces are built.

## Build Phases

**Phase 1 — Core Logic (local only)**
- Transaction model + pending/posted reconciliation logic
- Safe-to-spend calculation
- Seeded/mock transaction data for testing edge cases
- Tests for reconciliation logic

**Phase 2 — Full App (local only)**
- Auth (signup/login)
- Frontend dashboard
- Plaid API integration (Sandbox) to replace mock data
- Automated test suite expanded to cover auth + API layer

**Phase 3 — Deployment**
- CI pipeline (GitHub Actions)
- AWS deployment: RDS (Postgres), Elastic Beanstalk/Fargate, S3 + CloudFront
- Billing alert / free-tier monitoring set up before going live
