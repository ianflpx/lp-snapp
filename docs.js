// Páginas /docs/*: "Copiar para IA" (referência inteira em Markdown + instrução), cópia dos blocos de código
// e sumário aberto no desktop. A cópia usa o texto já embutido na página: sem fetch, o gesto do clique vale no Safari.
(() => {
  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const area = Object.assign(document.createElement("textarea"), { value: text, readOnly: true });
      area.style.cssText = "position:fixed;opacity:0";
      document.body.append(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      return ok;
    }
  };
  const flash = (button, label, ok) => {
    const original = button.dataset.label || (button.dataset.label = button.textContent);
    button.textContent = ok ? label : "Não deu para copiar";
    clearTimeout(button._t);
    button._t = setTimeout(() => (button.textContent = original), 2000);
  };

  const status = document.querySelector(".doc__status");
  const ai = document.querySelector("[data-ai-copy]");
  const source = document.getElementById("ai-doc");
  if (ai && source) {
    ai.addEventListener("click", async () => {
      const ok = await copy(JSON.parse(source.textContent));
      flash(ai, "Copiado", ok);
      if (status) status.textContent = ok ? "Referência copiada. Cole na conversa com a IA." : "O navegador não deixou copiar. Use Ver em Markdown.";
    });
  }

  for (const button of document.querySelectorAll("[data-copy]")) {
    button.addEventListener("click", async () => {
      flash(button, "Copiado", await copy(button.closest(".code").querySelector("code").textContent));
    });
  }

  const toc = document.querySelector("[data-toc]");
  if (toc && matchMedia("(min-width: 1100px)").matches) toc.open = true;
})();
