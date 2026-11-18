# forge-proofs

Two small Atlassian Forge apps, kept as worked examples of moving Connect apps to Forge before Connect
support ends on 31 January 2027.

| App | What |
|---|---|
| `apps/dot-diagrams` | A Confluence macro that draws Graphviz DOT diagrams, fully on Forge. |
| `apps/online-3d-viewer` | [Online 3D Viewer for Confluence](https://github.com/kovacsv/Online3DViewerConfluence) (MIT, Viktor Kovacs) rebuilt from Connect to Forge with the same app and macro keys. See its `CASE.md`. |

Each app: `npm ci && npm test`. Deploy to a development site with the "Forge deploy" workflow
(Actions tab), which needs the repository secrets `FORGE_EMAIL` and `FORGE_API_TOKEN`.

MIT licence. The 3D viewer keeps its original licence (`apps/online-3d-viewer/ORIGINAL-LICENSE.md`).
