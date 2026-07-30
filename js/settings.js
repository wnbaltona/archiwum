// Ustawienia: niezależne funkcje, aby nie kolidowały z formularzem dokumentu.
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("settingsBtn")?.addEventListener("click", openSettings);
    document.getElementById("closeSettings")?.addEventListener("click", closeSettings);
    document.getElementById("showAddContractor")?.addEventListener("click", showAddContractor);
    document.getElementById("showContractors")?.addEventListener("click", loadSettingsContractors);
    document.getElementById("showAddLocal")?.addEventListener("click", showAddLocal);
    document.getElementById("showLocals")?.addEventListener("click", loadSettingsLocals);
});

function openSettings() { document.getElementById("settingsOverlay").classList.remove("hidden"); document.getElementById("settingsContent").innerHTML = ""; }
function closeSettings() { document.getElementById("settingsOverlay").classList.add("hidden"); }

function showAddContractor() {
    document.getElementById("settingsContent").innerHTML = `
        <div class="settings-form"><h3>Dodaj kontrahenta</h3>
        <label for="contractorName">Nazwa kontrahenta</label><input id="contractorName" placeholder="np. Firma XYZ">
        <button class="primary-button" id="saveContractor">Zapisz</button></div>`;
    document.getElementById("saveContractor").onclick = addContractor;
}

async function addContractor() {
    const nazwa = document.getElementById("contractorName").value.trim();
    if (!nazwa) return alert("Podaj nazwę kontrahenta.");
    const { error } = await supabaseClient.from("kontrahenci").insert({ nazwa });
    if (error) return alert(error.message);
    loadSettingsContractors();
}

async function loadSettingsContractors() {
    const box = document.getElementById("settingsContent"); box.textContent = "Ładowanie…";
    const { data, error } = await supabaseClient.from("kontrahenci").select("id, nazwa").order("nazwa");
    if (error) return box.textContent = error.message;
    box.innerHTML = `<h3>Lista kontrahentów</h3>${data.length ? "" : "<p>Brak kontrahentów.</p>"}`;
    data.forEach(item => box.insertAdjacentHTML("beforeend", `<div class="setting-row"><span>${escapeHtml(item.nazwa)}</span><button class="delete" data-contractor-id="${item.id}">Usuń</button></div>`));
    box.querySelectorAll("[data-contractor-id]").forEach(button => button.onclick = () => deleteContractor(button.dataset.contractorId));
}

async function deleteContractor(id) {
    if (!confirm("Usunąć kontrahenta? Dokumenty pozostaną w archiwum, ale bez przypisanego kontrahenta.")) return;
    const { error: updateError } = await supabaseClient.from("dokumenty").update({ kontrahent_id: null }).eq("kontrahent_id", id);
    if (updateError) return alert(updateError.message);
    const { error } = await supabaseClient.from("kontrahenci").delete().eq("id", id);
    if (error) return alert(error.message);
    loadSettingsContractors();
}

function showAddLocal() {
    const options = LOCATIONS.map(location => `<option value="${escapeHtml(location)}">${escapeHtml(location)}</option>`).join("");
    document.getElementById("settingsContent").innerHTML = `
        <div class="settings-form"><h3>Dodaj lokal</h3>
        <label for="localMPK">MPK</label><input id="localMPK" placeholder="MPK">
        <label for="localName">Nazwa lokalu</label><input id="localName" placeholder="Nazwa lokalu">
        <label for="localLocation">Lokalizacja</label><select id="localLocation"><option value="">Wybierz lokalizację</option>${options}</select>
        <button class="primary-button" id="saveLocal">Zapisz</button></div>`;
    document.getElementById("saveLocal").onclick = addLocal;
}

async function addLocal() {
    const data = { mpk: document.getElementById("localMPK").value.trim(), nazwa: document.getElementById("localName").value.trim(), lokalizacja: document.getElementById("localLocation").value };
    if (!data.nazwa || !data.lokalizacja) return alert("Podaj nazwę lokalu i wybierz lokalizację.");
    const { error } = await supabaseClient.from("lokale").insert(data);
    if (error) return alert(error.message);
    loadSettingsLocals();
}

async function loadSettingsLocals() {
    const box = document.getElementById("settingsContent"); box.textContent = "Ładowanie…";
    const { data, error } = await supabaseClient.from("lokale").select("id, nazwa, mpk, lokalizacja").order("lokalizacja").order("nazwa");
    if (error) return box.textContent = error.message;
    box.innerHTML = `<h3>Lista lokali</h3>${data.length ? "" : "<p>Brak lokali.</p>"}`;
    data.forEach(item => box.insertAdjacentHTML("beforeend", `<div class="setting-row"><span><strong>${escapeHtml(item.nazwa)}</strong><br>MPK: ${escapeHtml(item.mpk || "-")}<br>${escapeHtml(item.lokalizacja || "-")}</span><button class="delete" data-local-id="${item.id}">Usuń</button></div>`));
    box.querySelectorAll("[data-local-id]").forEach(button => button.onclick = () => deleteLocal(button.dataset.localId));
}

async function deleteLocal(id) {
    if (!confirm("Usunąć lokal? Dokumenty pozostaną w archiwum, ale bez przypisanego lokalu.")) return;
    const { error: updateError } = await supabaseClient.from("dokumenty").update({ lokal_id: null }).eq("lokal_id", id);
    if (updateError) return alert(updateError.message);
    const { error } = await supabaseClient.from("lokale").delete().eq("id", id);
    if (error) return alert(error.message);
    loadSettingsLocals();
}

function escapeHtml(value) { const div = document.createElement("div"); div.textContent = value ?? ""; return div.innerHTML; }
