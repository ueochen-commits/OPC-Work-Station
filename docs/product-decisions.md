# Product Decisions

## Trial and Payment

- Trial is 14 days and does not require card binding.
- After trial expiry, unpaid users enter read-only mode.
- v1 uses XORPAY for WeChat / Alipay payment.
- v1 does not use automatic recurring billing. Users renew manually by paying monthly or yearly.

## v1 Scope Rule

The PRD document version can move independently from the product version. Product v1 scope is defined by the PRD v1 boundary section. Any feature explicitly marked v1.1+ is out of v1.

## Scheduling API Contract

`POST /api/tasks/:id/postpone` is a dry-run endpoint. It returns the proposed plan and conflicts only.

`POST /api/tasks/:id/postpone/confirm` writes changes, records history, creates an undo snapshot, and returns an `undo_id`.

## Repository Notes

The full PRD and XORPAY reference documents currently live in the parent project folder. This repository keeps implementation-facing decisions and schema close to code.
