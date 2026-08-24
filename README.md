# SpendAware

**Status: In active development**

A personal finance web application that reconciles pending and posted credit card transactions to give a real-time, accurate picture of true spending — including a "safe-to-spend" number based on budget, upcoming expenses, and days remaining in the billing cycle.

## Problem

I pay my credit cards on time, but credit card transactions don't post immediately — there's often a lag of several days between making a purchase and seeing it reflected in my posted balance. That gap made it easy to lose track of how much I'd actually spent, and by the time charges posted, I'd already spent more than I realized.

## Solution

SpendAware combines **posted balance + pending charges** to calculate true current spending in real time, then factors in your monthly budget and days remaining to surface a single, actionable **safe-to-spend** number.

## Planned Tech Stack

- **Backend:** Python, FastAPI
- **Database:** SQLite (SQLAlchemy ORM)
- **Auth:** JWT, password hashing
- **Testing:** pytest
- **CI:** GitHub Actions
- **Frontend:** React (or a minimal HTML/JS dashboard)

## The Core Engineering Challenge

Credit card transactions typically show up as "pending" before they finalize as "posted" days later. A naive implementation could easily double-count a charge during that transition. Reconciling a posted transaction back to its pending version without duplicating it is the central technical problem this project solves.

## Roadmap

- [ ] Transaction model + pending/posted reconciliation logic
- [ ] Safe-to-spend calculation
- [ ] Auth (signup/login)
- [ ] Automated test suite
- [ ] Frontend dashboard
- [ ] CI pipeline

More detail — setup instructions, API docs, and testing info — will be added as those pieces are built.
