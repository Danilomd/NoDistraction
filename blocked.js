// pegar domínio
const params = new URLSearchParams(window.location.search);
const site = params.get("site");

if (site) {
  document.getElementById("blockedSite").textContent = `🔒 ${site} está bloqueado`;
}

// pegar contador
chrome.storage.local.get(["blockedCount"], (data) => {
  const count = data.blockedCount || 0;

  document.getElementById("counter").textContent =
    `🚫 Tentativas bloqueadas: ${count}`;
});

// botão voltar
document.getElementById("backBtn").addEventListener("click", () => {
  window.history.back();
});