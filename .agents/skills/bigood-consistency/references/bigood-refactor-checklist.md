# Bigood Refactor Checklist

## Before editing

- [ ] I know which area is affected.
- [ ] I read the relevant files.
- [ ] I checked existing specs/contracts.
- [ ] I know whether this is visual, structural, product, or backend-related.
- [ ] I can preserve the visual design.
- [ ] I can make a small diff.

## During editing

- [ ] No unnecessary CSS changes.
- [ ] No unnecessary layout changes.
- [ ] No broad rewrite.
- [ ] No new dependency without reason.
- [ ] No duplicated mock data.
- [ ] No business rule hidden inside JSX.
- [ ] No security-critical validation only in frontend.

## Backend-ready check

- [ ] Types exist or were created.
- [ ] Services exist or were proposed.
- [ ] Schemas exist or were proposed.
- [ ] API contract exists or was updated.
- [ ] Loading state considered.
- [ ] Empty state considered.
- [ ] Error state considered.
- [ ] Success state considered.
- [ ] companyId considered.
- [ ] unitId considered where needed.

## After editing

- [ ] Lint/typecheck/build executed when available.
- [ ] Files changed were reported.
- [ ] Risks were reported.
- [ ] Next step was suggested.
