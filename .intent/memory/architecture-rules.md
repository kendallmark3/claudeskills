# Architecture Rules

- Preserve existing application patterns unless there is an explicit decision to change them.
- Identify frontend, backend, API, database, auth, deployment, CI/CD, observability, and security impacts before coding.
- Do not invent services, endpoints, schemas, or components without repo evidence.
- Record architectural assumptions and decisions in the feature intent workspace.
- Prefer small, testable increments over large generated changes.
- Do not hardcode branch names in public-facing install URLs. Prefer a redirect endpoint or release tag that survives branch renames.
