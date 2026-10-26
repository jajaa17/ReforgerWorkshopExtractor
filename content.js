(() => {
  'use strict';

  // Mod info page: /workshop/<16-char hex ID>[-<Name>]
  const MOD_PATH = /^\/workshop\/([0-9A-F]{16})(?:-[^/]*)?\/?$/i;

  // Change the shortcut here (default: Alt+Shift+C).
  const isHotkey = (e) =>
    e.altKey && e.shiftKey && !e.ctrlKey && !e.metaKey && e.code === 'KeyC';

  // Output format, matches the entries in a server config's mods array.
  const format = ({ id, name }) =>
    `      {\n        "modId": "${id}",\n        "name": ${JSON.stringify(name)}\n      },`;

  function getMod() {
    const m = MOD_PATH.exec(location.pathname);
    if (!m) return null;
    // textContent, not innerText: the page upper-cases the title with CSS.
    const h1 = document.querySelector('h1')?.textContent.trim();
    const title = document.title.replace(/\s*-\s*Arma Reforger( Workshop)?\s*$/i, '').trim();
    const name = h1 || title;
    return name ? { id: m[1].toUpperCase(), name } : null;
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
      document.documentElement.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    }
  }

  // UI is created lazily, inside a shadow root so site CSS can't affect it.
  let ui;
  function mount() {
    if (ui) return ui;
    const host = document.createElement('div');
    const root = host.attachShadow({ mode: 'closed' });
    const style = document.createElement('style');
    style.textContent =
      'button,.toast{position:fixed;right:16px;z-index:2147483647;border-radius:8px;' +
      'font:600 13px/1 system-ui,sans-serif}' +
      'button{bottom:16px;padding:10px 14px;border:0;background:#4b5320;color:#fff;' +
      'cursor:pointer;box-shadow:0 2px 8px #0006}' +
      'button:hover{background:#5d6a28}' +
      '.toast{bottom:64px;padding:10px 14px;background:#111;color:#fff;opacity:0;' +
      'transition:opacity .15s;pointer-events:none}' +
      '.toast.on{opacity:1}';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.hidden = true; // sync() reveals it on mod pages
    btn.textContent = 'Copy mod ID (Alt+Shift+C)';
    btn.addEventListener('click', run);
    const toast = document.createElement('div');
    toast.className = 'toast';
    root.append(style, btn, toast);
    document.documentElement.appendChild(host);
    return (ui = { btn, toast });
  }

  let timer;
  function say(msg) {
    const { toast } = mount();
    toast.textContent = msg;
    toast.classList.add('on');
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove('on'), 1800);
  }

  // Called straight from a click/keydown so the clipboard write keeps its user gesture.
  async function run() {
    const mod = getMod();
    if (!mod) return say('Open a mod page first');
    say((await copyText(format(mod))) ? `Copied: ${mod.name}` : 'Copy failed');
  }

  // Show the button only on mod pages. The site is a SPA, so re-check when
  // <head> changes (title/meta update on every navigation). No polling.
  function sync() {
    const onMod = MOD_PATH.test(location.pathname);
    if (onMod || ui) mount().btn.hidden = !onMod;
  }
  sync();
  new MutationObserver(sync).observe(document.head, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  window.addEventListener(
    'keydown',
    (e) => {
      if (!e.repeat && isHotkey(e)) {
        e.preventDefault();
        run();
      }
    },
    true
  );
})();
