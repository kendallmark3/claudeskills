# Agent Operating Model

Recommended agent roles:

- Repo Cartographer: reads repo and creates repo-context.md.
- Feature Planner: creates implementation plan and task breakdown.
- Implementer: codes only against approved plan and tasks.
- Test Evidence Engineer: runs verification and captures evidence.
- Security Reviewer: checks auth, secrets, data, logging, and access controls.

One agent can perform multiple roles, but the roles should remain explicit.
