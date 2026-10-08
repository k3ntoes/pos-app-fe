# POS App Context Map

This file links to the modularized domain contexts for the POS Application Frontend.

## Domain Contexts

- [Multi-Unit Context](docs/domain/multi-unit.md): Covers definitions and architectural concepts related to Business Units, Active Unit selection, and the Unit Switcher component.
- [Auth & RBAC Context](docs/domain/auth-rbac.md): Covers authentication, permissions, roles (System & Custom), global and scoped assignments, effective permissions, temporary passwords, password change requirements, and CSRF token management.
- [UI/UX & Frontend Ergonomics Context](docs/domain/ui-ux-ergonomics.md): Covers POS frontend ergonomics, glanceability, tabular figures, touch targets, destructive action isolation, alarm fatigue prevention, and glare resistance.

## Architectural Decision Records (ADRs)

- [ADR 0001: Tailwind CSS v4](docs/adr/0001-tailwind-v4.md)
- [ADR 0002: shadcn/ui dengan Base UI Engine](docs/adr/0002-shadcn-base-ui-engine.md)
- [ADR 0003: Eager Permission Loading](docs/adr/0003-eager-permission-loading.md)
- [ADR 0004: Unit Context Storage](docs/adr/0004-unit-context-storage.md)
- [ADR 0005: Granular Role Assignment dengan Hybrid UI](docs/adr/0005-granular-role-assignment-hybrid-ui.md)
- [ADR 0006: Centralized Clipboard Utility & Admin Password Management](docs/adr/0006-admin-reset-password-and-clipboard-utility.md)
- [ADR 0007: Generic DataTable Architecture & Bundle Optimization](docs/adr/0007-generic-data-table-and-bundle-optimization.md)

## Core Modules & Shared Utilities
- `src/components/data-table/`: Generic DataTable & pagination components.
- `src/lib/clipboard.ts`: Centralized clipboard utility with fallback.
- `src/lib/format.ts`: Native Intl date and currency formatting helpers.
- `src/lib/permissionMapper.ts`: Permission sanitization and mapping utilities.
