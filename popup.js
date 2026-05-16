const toggleBtn = document.getElementById("toggleBtn");
const addBtn = document.getElementById("addBtn");
const siteInput = document.getElementById("siteInput");
const siteList = document.getElementById("siteList");
const settingsBtn = document.getElementById("settingsBtn");
const backBtn = document.getElementById("backBtn");
const mainScreen = document.getElementById("mainScreen");
const settingsScreen = document.getElementById("settingsScreen");
const themeToggle = document.getElementById("themeToggle");

let enabled = false;
let sites = [];

settingsBtn.addEventListener("click", () => {
  mainScreen.classList.add("hidden");
  settingsScreen.classList.remove("hidden");
});

backBtn.addEventListener("click", () => {
  settingsScreen.classList.add("hidden");
  mainScreen.classList.remove("hidden");
});

chrome.storage.local.get(["darkMode"], (result) => {
  if (result.darkMode) {
    document.body.classList.add("white");
    themeToggle.checked = true;
  }
});

themeToggle.addEventListener("change", () => {
  const enabled = themeToggle.checked;

  document.body.classList.toggle("white", enabled);

  chrome.storage.local.set({
    darkMode: enabled,
  });
});

chrome.storage.local.get(["enabled", "sites"], (data) => {
  enabled = data.enabled || false;
  sites = data.sites || [];

  updateUI();
  render();
});

toggleBtn.addEventListener("click", () => {
  enabled = !enabled;

  if (enabled) {
    chrome.storage.local.set({
      enabled,
      blockedCount: 0,
    });
  } else {
    chrome.storage.local.set({ enabled });
  }

  updateUI();
});

addBtn.addEventListener("click", () => {
  const site = siteInput.value.trim();
  if (!site) return;

  sites.push(site);
  siteInput.value = "";
  console.log("Adicionando site:", site);
  chrome.storage.local.set({ sites });

  render();
});

function removeSite(index) {
  console.log("Removendo site:", sites[index]);

  sites.splice(index, 1);
  chrome.storage.local.set({ sites });

  render();
}

function updateUI() {
  toggleBtn.textContent = enabled ? "Ligado" : "Desligado";
  toggleBtn.className = enabled ? "on" : "off";
}

function render() {
  siteList.innerHTML = "";

  sites.forEach((site, index) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = site;

    const btn = document.createElement("button");
    btn.textContent = "X";

    btn.addEventListener("click", () => {
      removeSite(index);
    });

    li.appendChild(span);
    li.appendChild(btn);

    siteList.appendChild(li);
  });
}

window.removeSite = removeSite;
