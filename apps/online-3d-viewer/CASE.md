# Case study: Online 3D Viewer for Confluence, from Connect to Forge

**The app.** Online 3D Viewer for Confluence (Marketplace listing 1228464, 123 installs, free) shows 3D files
attached to a Confluence page. It is open source under the MIT licence:
https://github.com/kovacsv/Online3DViewerConfluence. On 17 November 2026 it was still a Connect app, last
released in September 2025: a static site on GitHub Pages with one dynamic macro and nine parameters.

**What we did (18 November 2026, one working session).**
1. Ran Atlassian's converter and checks on the published descriptor.
2. Rebuilt the macro as a Forge Custom UI macro with the same app key and macro key, designed so the
   listing and the macros already saved on customers' pages carry over.
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

**Verified on a real site (18 November 2026).** Deployed to a Confluence Cloud development site with
GitHub Actions. On a page with an attached STL file the macro downloads the attachment through
`requestConfluence` and draws the model (`docs/test-site-2026-11-18.jpg`). Three fixes were needed on the
way: Save and messages moved to the top of the settings dialog, and a larger dialog. Not yet shown in
practice: an existing Connect macro taking over after a real listing upgrade (that needs the original
listing), and picking a file in the settings dialog by hand (driven only by automation so far).

**Use.** Offered to the original author as a free pull request.
