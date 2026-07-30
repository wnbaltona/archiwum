let editingDocumentId = null;

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("addBtn")?.addEventListener("click", () => openDocumentModal());
    document.getElementById("closeModal")?.addEventListener("click", closeDocumentModal);
    document.getElementById("location")?.addEventListener("change", event => loadDocumentLocals(event.target.value));
    document.getElementById("saveBtn")?.addEventListener("click", saveDocument);
});

async function openDocumentModal(doc = null) {
    editingDocumentId = doc?.id || null;
    document.getElementById("modalTitle").textContent = doc ? "Edytuj dokument" : "Dodaj dokument";
    document.getElementById("saveBtn").textContent = doc ? "Zapisz zmiany" : "Zapisz dokument";
    document.getElementById("modalOverlay").classList.remove("hidden");
    populateDocumentLocations();
    await loadDocumentContractors(doc?.kontrahent_id);
    const fields = { name: "nazwa", type: "typ", year: "rok", shelf: "regal", level: "polka", folder: "segregator", notes: "uwagi", status: "status" };
    Object.entries(fields).forEach(([id, key]) => document.getElementById(id).value = doc?.[key] ?? (id === "status" ? "OK" : ""));
    document.getElementById("location").value = doc?.lokale?.lokalizacja || "";
    await loadDocumentLocals(doc?.lokale?.lokalizacja || "", doc?.lokal_id);
}

function closeDocumentModal() { document.getElementById("modalOverlay").classList.add("hidden"); editingDocumentId = null; }
function populateDocumentLocations() { const select = document.getElementById("location"); select.innerHTML = '<option value="">Wybierz lokalizację</option>'; LOCATIONS.forEach(location => select.add(new Option(location, location))); }

async function loadDocumentLocals(location, selectedId = "") {
    const select = document.getElementById("local");
    if (!location) { select.innerHTML = '<option value="">Najpierw wybierz lokalizację</option>'; return; }
    select.innerHTML = '<option value="">Ładowanie…</option>';
    const { data, error } = await supabaseClient.from("lokale").select("id, nazwa, mpk").eq("lokalizacja", location).order("nazwa");
    if (error) { console.error(error); select.innerHTML = '<option value="">Nie udało się pobrać lokali</option>'; return; }
    select.innerHTML = '<option value="">Wybierz lokal</option>';
    data.forEach(local => select.add(new Option(`${local.nazwa}${local.mpk ? ` (${local.mpk})` : ""}`, local.id)));
    select.value = selectedId || "";
    if (!data.length) select.innerHTML = '<option value="">Brak lokali dla tej lokalizacji</option>';
}

async function loadDocumentContractors(selectedId = "") {
    const select = document.getElementById("contractor");
    const { data, error } = await supabaseClient.from("kontrahenci").select("id, nazwa").order("nazwa");
    if (error) return console.error(error);
    select.innerHTML = '<option value="">Wybierz kontrahenta</option>'; data.forEach(item => select.add(new Option(item.nazwa, item.id))); select.value = selectedId || "";
}

async function saveDocument() {
    const documentData = { lokal_id: document.getElementById("local").value || null, kontrahent_id: document.getElementById("contractor").value || null, nazwa: document.getElementById("name").value.trim(), typ: document.getElementById("type").value.trim(), rok: Number(document.getElementById("year").value) || null, regal: document.getElementById("shelf").value.trim(), polka: document.getElementById("level").value.trim(), segregator: document.getElementById("folder").value.trim(), status: document.getElementById("status").value, uwagi: document.getElementById("notes").value.trim() };
    if (!document.getElementById("location").value || !documentData.lokal_id || !documentData.nazwa) return alert("Wybierz lokalizację i lokal oraz podaj nazwę dokumentu.");
    const request = editingDocumentId ? supabaseClient.from("dokumenty").update(documentData).eq("id", editingDocumentId) : supabaseClient.from("dokumenty").insert(documentData);
    const { error } = await request; if (error) return alert(error.message);
    closeDocumentModal(); loadDocuments();
}

window.editDocument = openDocumentModal;
