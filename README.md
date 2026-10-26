# Reforger Workshop Extractor

A tiny Chrome/Firefox extension for the [Arma Reforger Workshop](https://reforger.armaplatform.com/workshop). On a mod's page it copies the mod ID and name to your clipboard, ready to paste into a server config's `mods` array.

Example output for [Fishing](https://reforger.armaplatform.com/workshop/6A6874E0907A01A6-Fishing):

```
{
        "modId": "6A6874E0907A01A6",
        "name": "Fishing"
      },
```

## Usage

Open any mod's **Info** page, then either:

- press **Alt+Shift+C**, or
- click the **Copy mod ID** button in the bottom-right corner.

A small toast confirms the copy. The shortcut is set by `isHotkey` at the top of `content.js`.

## Install

**Chrome / Edge / Brave**
1. Download or clone this repo.
2. Open `chrome://extensions` and enable **Developer mode**.
3. Click **Load unpacked** and select the repo folder.

If Chrome lists a warning about `browser_specific_settings`, it is harmless (a Firefox-only key).

**Firefox**
1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on** and select `manifest.json`.

Temporary add-ons are removed when Firefox restarts. A permanent install needs the extension signed through addons.mozilla.org.

## Design

- One small content script, no background script, so nothing runs when you're not on the Workshop site.
- No polling, no network requests, no data collected. The only permission is `clipboardWrite`.
- The mod ID comes from the page URL and the name from the page title.

## Credits

Built with help from [Claude](https://claude.ai) by Anthropic.
