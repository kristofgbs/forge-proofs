# Case study: Online 3D Viewer for Confluence, from Connect to Forge

**The app.** Online 3D Viewer for Confluence (Marketplace listing 1228464, 123 installs, free) shows 3D files
attached to a Confluence page. It is open source under the MIT licence:
https://github.com/kovacsv/Online3DViewerConfluence. On 17 November 2026 it was still a Connect app, last
released in September 2025: a static site on GitHub Pages with one dynamic macro and nine parameters.

**What we did (18 November 2026, one working session).**
1. Ran Atlassian's converter and checks on the published descriptor.
2. Rebuilt the macro as a Forge Custom UI macro with the same app key and macro key, designed so the
   listing and the macros already saved on customers' pages carry over (to be proven on a real site).
3. Replaced the Connect calls (`AP.context`, `AP.request` with binary attachments) with `@forge/bridge`
   (`view.getContext`, `requestConfluence`).
4. Replaced the Connect macro editor (nine declared parameters) with a small settings page that lists the
   3D files attached to the page and saves the same nine parameter names.
5. Asked for two narrow scopes instead of Connect's broad READ, and declared the migration with
   `connectToForgeMigration`.
6. Tests: parameters, attachment matching, the settings page in a simulated browser, the manifest against
   the Forge schema, and Atlassian's own checks.

**Result of Atlassian's checks.** `adoption-status --strict`: fully adopted, no Connect modules or scopes
left. `check-upgrade`: no admin approval needed; automatic migration candidate. The app no longer needs
any server: it runs entirely on Atlassian.

**Differences from the original.** Sizes accept only auto, pixels or percent (other CSS values fall back to
the default), so a page author cannot inject styles. The settings page lists only files with a known 3D or
texture extension. Blog posts now work as well as pages.

**Open risk.** Downloading an attachment from the browser through `requestConfluence` (a redirect to the
media service, read as a blob) is the step most likely to need a change; the fallback is a small Forge
function that downloads as the user.

**Not yet verified.** It has not run inside a real Confluence site. That needs a deploy to a development
site (the Forge deploy workflow of this repository). Until then this case is UNVERIFIED and is not shown to anyone as finished.

**Use.** Offered to the original author as a free pull request.
