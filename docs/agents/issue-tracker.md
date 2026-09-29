# Issue Tracker

This repository tracks issues and task dependencies using **Beads (`bd`)**.

## Conventions

- Issues and tasks are tracked via the `bd` CLI locally.
- Application data and audit data live in MariaDB; Beads manages its local issue metadata.

## Workflow Commands

- Finding ready work: `bd ready`
- Viewing an issue: `bd show <id>`
- Claiming work: `bd update <id> --claim`
- Closing completed work: `bd close <id>`
- Creating follow-up issues: `bd create --title "<title>" --body "<body>"`
- Storing persistent agent memory: `bd remember "<note>"`
