# Online 3D Viewer for Confluence on Forge

Port of https://github.com/kovacsv/Online3DViewerConfluence (MIT) from Connect to Forge. See `CASE.md`.

- `npm ci && npm test` builds the two Custom UI pages into `static/` and runs 9 tests.
- Deploy (needs a Forge login): `npm run build && forge register && forge deploy && forge install --product confluence --site <site>`.
