# Rewrap (Galastri fork)

This fork adds **Rewrap: Force Rewrap as Plain Text** (`rewrap.forceRewrap`).
Run it from the Command Palette, or assign a keyboard shortcut. It wraps the
selected lines regardless of the document language, including text inside
Markdown code blocks, indented code, tables, and source code. With no selection,
it wraps the paragraph at each cursor. Use Select All to wrap the entire file.
It uses the normal Rewrap width, rulers, tab size, and sentence spacing settings.
Repeated invocations cycle through rulers, like the normal command.

Standalone backtick and tilde fence lines (including language labels) are kept
intact, so they are not joined to the surrounding text. Other content follows
plain text rules: paragraphs split at blank lines or changes in indentation;
Markdown list and table structure is not interpreted. Select only the text you
want to reflow when preserving those structures matters.

The original `Alt+Q` command and automatic wrapping retain their normal behavior.
The force command has no default shortcut. For example, add this entry to
**Preferences: Open Keyboard Shortcuts (JSON)**:

```json
{
  "key": "alt+shift+q",
  "command": "rewrap.forceRewrap",
  "when": "editorTextFocus"
}
```

## Build and install from GitHub

1. Open **Actions > Build VSIX > Run workflow** and select the `stable` branch.
   If GitHub displays an Actions enablement notice for this fork, enable workflows
   first.
2. After the run succeeds, download **Rewrap-VSCode** under **Artifacts** on the
   run summary page. Extract the ZIP to obtain `Rewrap-VSCode.vsix`.
3. In VS Code, open **Extensions > ... > Install from VSIX...** and choose that
   file. Disable the original `stkb.rewrap` extension so both extensions do not
   register the same commands and shortcuts. Reload VS Code if prompted.

The workflow also builds on pushes and pull requests. It typechecks, lints,
runs the core and forced-wrap regression tests, builds the extension, runs VS
Code integration tests, and uploads a VSIX. It does not publish to a marketplace
and requires no publishing token. Artifacts are retained for 30 days.

The fork's extension ID is `andregalastri.rewrap`, keeping it distinct from the
original Marketplace package. Original project documentation follows below.

---

<!-- This part has to be written in HTML, because doing it in markdown puts the content in
a <p>, which adds unwanted margins. It has to be in a table so it can be right-aligned on
GitHub. For GitHub we can't get rid of the border on the td nor make the font smaller as
we want-->
<table class="topright" align="right" style="font-size:90%;width:auto;margin:0;border:none">
<tr style="border:none"><td align="right" style="border:none">
For <a href="https://marketplace.visualstudio.com/items?itemName=stkb.rewrap"><b>VS Code</b></a>,
<a href="https://open-vsx.org/extension/stkb/rewrap"><b>Open VSX</b></a> and
<a href="https://marketplace.visualstudio.com/items?itemName=stkb.Rewrap-18980">
  <b>Visual Studio</b></a>.<br/>
Latest stable version <b>1.16.3</b> / pre-release <b>17.x</b> /
<a href="https://github.com/stkb/vscode-rewrap/releases">changelog</a>
</td></tr></table>


<h1 style="font-size: 2.5em">Rewrap</h1>

<img src="https://stkb.github.io/Rewrap/images/example.svg" width="700px"/><br/><br/>

The main Rewrap command is: <sn>**Rewrap Comment / Text**</sn>, by default bound to
`Alt+Q`. With the cursor in a comment block, hit this to re-wrap the contents to the
[specified wrapping column](https://stkb.github.io/Rewrap/configuration/#wrapping-column).


## Features

* Re-wrap comment blocks in many languages, with per-language settings.
* Smart handling of contents, including Java-/JS-/XMLDoc tags and code examples.
* Can select lines to wrap or multiple comments/paragraphs at once (even the whole
  document).
* Also works with Markdown documents, LaTeX or any kind of plain text file.

The contents of comments are usually parsed as markdown, so you can use lists, code
samples (which are untouched) etc:

<img src="https://stkb.github.io/Rewrap/images/example1.svg" width="700px"/>

<div class="hideOnDocsSite"><br/><b><a href="https://stkb.github.io/Rewrap/">
See the docs site for more info.</a></b></div>
