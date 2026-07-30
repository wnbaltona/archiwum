// ===============================
// ADMIN.JS (POPRAWIONY)
// ===============================

const LOCATIONS = [
  "OKĘCIE", "MODLIN", "RADOM", "RZESZÓW", "ŚWINOUJŚCIE",
  "POZNAŃ", "WROCŁAW", "KATOWICE", "ZIELONA GÓRA", "KRAKÓW",
  "GDAŃSK", "GDYNIA", "FRANCJA", "SONATA"
];

let editingDocumentId = null;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("addBtn")?.addEventListener("click", openAddDocument);
  document.getElementById("closeModal")?.addEventListener("click", closeModal);
  document.getElementById("saveBtn")?.addEventListener("click", saveDocument);
  document.getElementById("location")?.addEventListener("change", e => {
    adminLoadLocals(e.target.value);
  });
});

async function openAddDocument() {
  editingDocumentId = null;
  clearForm();
  document.getElementById("modalTitle").innerText = "Dodaj dokument";

  await loadLocations();
  await adminLoadContractors();

  document.getElementById("modalOverlay").classList.remove("hidden");
}

async function loadLocations() {
  const select = document.getElementById("location");
  if (!select) return;
  select.innerHTML = `<option value="">Wybierz lokalizację</option>`;
  LOCATIONS.forEach(loc => {
    select.innerHTML += `<option value="${loc}">${loc}</option>`;
  });
}

async function adminLoadLocals(location) {
  const select = document.getElementById("local");
  if (!select) return;
  select.innerHTML = `<option>Ładowanie...</option>`;

  const { data, error } = await supabaseClient
    .from("lokale")
    .select("*")
    .eq("lokalizacja", location)
    .order("nazwa");

  if (error) {
    console.error(error);
    return;
  }

  select.innerHTML = `<option value="">Wybierz lokal</option>`;
  data.forEach(lokal => {
    select.innerHTML += `
      <option value="${lokal.id}">
        ${lokal.nazwa} ${lokal.mpk ? " - MPK " + lokal.mpk : ""}
      </option>
    `;
  });
}

async function adminLoadContractors() {
  const select = document.getElementById("contractor");
  if (!select) return;

  const { data, error } = await supabaseClient
    .from("kontrahenci")
    .select("*")
    .order("nazwa");

  if (error) {
    console.error(error);
    return;
  }

  select.innerHTML = `<option value="">Wybierz kontrahenta</option>`;
  data.forEach(item => {
    select.innerHTML += `<option value="${item.id}">${item.nazwa}</option>`;
  });
}

async function saveDocument() {
  const data = {
    lokalizacja: document.getElementById("location").value,
    lokal_id: document.getElementById("local").value || null,
    kontrahent_id: document.getElementById("contractor").value || null,
    nazwa: document.getElementById("name").value,
    typ: document.getElementById("type").value,
    rok: Number(document.getElementById("year").value) || null,
    regal: document.getElementById("shelf").value,
    polka: document.getElementById("level").value,
    segregator: document.getElementById("folder").value,
    status: document.getElementById("status").value,
    uwagi: document.getElementById("notes").value
  };

  let result;
  if (editingDocumentId) {
    result = await supabaseClient
      .from("dokumenty")
      .update(data)
      .eq("id", editingDocumentId);
  } else {
    result = await supabaseClient.from("dokumenty").insert(data);
  }

  if (result.error) {
    alert(result.error.message);
    return;
  }

  closeModal();
  if (typeof loadDocuments === "function") {
    loadDocuments();
  }
}

window.openEditModal = async function(doc) {
  editingDocumentId = doc.id;

  await loadLocations();
  await adminLoadContractors();

  document.getElementById("location").value = doc.lokalizacja || "";
  await adminLoadLocals(doc.lokalizacja);

  document.getElementById("local").value = doc.lokal_id || "";
  document.getElementById("contractor").value = doc.kontrahent_id || "";
  document.getElementById("name").value = doc.nazwa || "";
  document.getElementById("type").value = doc.typ || "";
  document.getElementById("year").value = doc.rok || "";
  document.getElementById("shelf").value = doc.regal || "";
  document.getElementById("level").value = doc.polka || "";
  document.getElementById("folder").value = doc.segregator || "";
  document.getElementById("status").value = doc.status || "OK";
  document.getElementById("notes").value = doc.uwagi || "";

  document.getElementById("modalOverlay").classList.remove("hidden");
};

function clearForm() {
  document.querySelectorAll("#modalOverlay input, #modalOverlay textarea")
    .forEach(el => el.value = "");
  const localSelect = document.getElementById("local");
  if (localSelect) {
    localSelect.innerHTML = `<option>Najpierw wybierz lokalizację</option>`;
  }
}

function closeModal() {
  document.getElementById("modalOverlay")?.classList.add("hidden");
  editingDocumentId = null;
}
