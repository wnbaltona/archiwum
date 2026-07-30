// ===============================
// SETTINGS.JS (POPRAWIONY)
// ===============================

const SETTINGS_LOCATIONS = [
  "OKĘCIE", "MODLIN", "RADOM", "RZESZÓW", "ŚWINOUJŚCIE",
  "POZNAŃ", "WROCŁAW", "KATOWICE", "ZIELONA GÓRA", "KRAKÓW",
  "GDAŃSK", "GDYNIA", "FRANCJA", "SONATA"
];

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("settingsBtn")?.addEventListener("click", openSettings);
  document.getElementById("closeSettings")?.addEventListener("click", closeSettings);
  document.getElementById("showAddContractor")?.addEventListener("click", showAddContractor);
  document.getElementById("showContractors")?.addEventListener("click", settingsLoadContractors);
  document.getElementById("showAddLocal")?.addEventListener("click", showAddLocal);
  document.getElementById("showLocals")?.addEventListener("click", settingsLoadLocals);
});

function openSettings() {
  document.getElementById("settingsOverlay").classList.remove("hidden");
  document.getElementById("settingsContent").innerHTML = "";
}

function closeSettings() {
  document.getElementById("settingsOverlay").classList.add("hidden");
}

function showAddContractor() {
  document.getElementById("settingsContent").innerHTML = `
    <h3>Dodaj kontrahenta</h3>
    <div class="settings-form">
      <label>Nazwa kontrahenta</label>
      <input id="contractorName" placeholder="Wpisz nazwę">
      <button id="saveContractor">Zapisz kontrahenta</button>
    </div>
  `;
  document.getElementById("saveContractor").onclick = addContractor;
}

async function addContractor() {
  const name = document.getElementById("contractorName").value.trim();
  if (!name) {
    alert("Wpisz nazwę kontrahenta");
    return;
  }

  const { error } = await supabaseClient.from("kontrahenci").insert({ nazwa: name });
  if (error) {
    alert(error.message);
    return;
  }

  alert("Dodano kontrahenta");
  settingsLoadContractors();
}

async function settingsLoadContractors() {
  const box = document.getElementById("settingsContent");
  box.innerHTML = "Ładowanie...";

  const { data, error } = await supabaseClient
    .from("kontrahenci")
    .select("*")
    .order("nazwa");

  if (error) {
    box.innerHTML = error.message;
    return;
  }

  box.innerHTML = `<h3>Lista kontrahentów</h3>`;
  data.forEach(item => {
    box.innerHTML += `
      <div class="setting-row">
        <div>${item.nazwa}</div>
        <button class="delete" onclick="deleteContractor('${item.id}')">Usuń</button>
      </div>
    `;
  });
}

window.deleteContractor = async function(id) {
  if (!confirm("Usunąć kontrahenta?")) return;

  await supabaseClient
    .from("dokumenty")
    .update({ kontrahent_id: null })
    .eq("kontrahent_id", id);

  const { error } = await supabaseClient
    .from("kontrahenci")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Usunięto kontrahenta");
  settingsLoadContractors();
};

function showAddLocal() {
  let options = SETTINGS_LOCATIONS.map(x => `<option value="${x}">${x}</option>`).join("");

  document.getElementById("settingsContent").innerHTML = `
    <h3>Dodaj lokal</h3>
    <div class="settings-form">
      <label>MPK</label>
      <input id="localMPK" placeholder="MPK">
      <label>Nazwa lokalu</label>
      <input id="localName" placeholder="Nazwa lokalu">
      <label>Lokalizacja</label>
      <select id="localLocation">
        <option value="">Wybierz lokalizację</option>
        ${options}
      </select>
      <button id="saveLocal">Zapisz lokal</button>
    </div>
  `;
  document.getElementById("saveLocal").onclick = addLocal;
}

async function addLocal() {
  const data = {
    mpk: document.getElementById("localMPK").value.trim(),
    nazwa: document.getElementById("localName").value.trim(),
    lokalizacja: document.getElementById("localLocation").value
  };

  if (!data.nazwa || !data.lokalizacja) {
    alert("Uzupełnij dane");
    return;
  }

  const { error } = await supabaseClient.from("lokale").insert(data);
  if (error) {
    alert(error.message);
    return;
  }

  alert("Dodano lokal");
  settingsLoadLocals();
}

async function settingsLoadLocals() {
  const box = document.getElementById("settingsContent");
  box.innerHTML = "Ładowanie...";

  const { data, error } = await supabaseClient
    .from("lokale")
    .select("*")
    .order("lokalizacja");

  if (error) {
    box.innerHTML = error.message;
    return;
  }

  box.innerHTML = `<h3>Lista lokali</h3>`;
  data.forEach(item => {
    box.innerHTML += `
      <div class="setting-row">
        <div>
          <strong>${item.nazwa}</strong><br>
          MPK: ${item.mpk || "-"}<br>
          ${item.lokalizacja}
        </div>
        <button class="delete" onclick="deleteLocal('${item.id}')">Usuń</button>
      </div>
    `;
  });
}

window.deleteLocal = async function(id) {
  if (!confirm("Usunąć lokal?")) return;

  await supabaseClient
    .from("dokumenty")
    .update({ lokal_id: null })
    .eq("lokal_id", id);

  const { error } = await supabaseClient
    .from("lokale")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  settingsLoadLocals();
};
