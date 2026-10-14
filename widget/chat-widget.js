(function () {
  const WEBHOOK_URL = "https://TON-DOMAINE-N8N/webhook/chat-assistant";
  const sessionId = "s-" + Math.random().toString(36).slice(2);

  const box = document.createElement("div");
  box.style.cssText = "position:fixed;bottom:20px;right:20px;width:340px;height:460px;display:flex;flex-direction:column;background:#fff;border:1px solid #ddd;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,.2);font-family:sans-serif;z-index:99999;overflow:hidden";
  box.innerHTML =
    '<div style="background:#1a3c6e;color:#fff;padding:12px;font-weight:bold">Assistant virtuel</div>' +
    '<div id="ai-msgs" style="flex:1;overflow-y:auto;padding:10px;font-size:14px"></div>' +
    '<form id="ai-form" style="display:flex;border-top:1px solid #eee">' +
    '<input id="ai-input" placeholder="Votre message..." style="flex:1;border:0;padding:12px;outline:0">' +
    '<button style="border:0;background:#1a3c6e;color:#fff;padding:0 16px;cursor:pointer">Envoyer</button></form>';
  document.body.appendChild(box);

  const msgs = box.querySelector("#ai-msgs");
  const input = box.querySelector("#ai-input");

  function add(text, mine) {
    const d = document.createElement("div");
    d.style.cssText =
      "margin:6px 0;padding:8px 10px;border-radius:8px;max-width:85%;white-space:pre-wrap;" +
      (mine ? "background:#1a3c6e;color:#fff;margin-left:auto" : "background:#f1f1f1");
    d.textContent = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  }

  add("Bonjour ! Comment puis-je vous aider ?", false);

  box.querySelector("#ai-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    add(text, true);
    const wait = add("...", false);
    try {
      const r = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatInput: text, sessionId: sessionId }),
      });
      const data = await r.json();
      wait.textContent = data.output || "Désolé, je n'ai pas de réponse.";
    } catch (err) {
      wait.textContent = "Erreur de connexion.";
    }
  });
})();
