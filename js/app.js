let documents = [];
let activeLocation = "";

document.addEventListener("DOMContentLoaded", () => {
    ["searchInput", "yearFilter", "statusFilter", "localFilter", "contractorFilter"].forEach(id =>
        document.getElementById(id)?.addEventListener(id === "searchInput" ? "input" : "change", renderDocuments));
    loadDocuments();
});

async function loadDocuments() {
    const { data, error } = await supabaseClient.from("dokumenty")
        .select("*, lokale (id, mpk, nazwa, lokalizacja), kontrahenci (id, nazwa)")
        .order("created_at", { ascending: false });
    if (error) return console.error("Błąd pobierania dokumentów:", error);
    documents = data || [];
    populateFilters();
    renderLocationCards();
    renderDocuments();
}

function populateFilters() {
    fillSelect("yearFilter", [...new Set(documents.map(doc => doc.rok).filter(Boolean))].sort((a, b) => b - a), "Wszystkie lata", value => [value, value]);
    populateLocalFilter();
    const contractors = uniqueBy(documents.map(doc => doc.kontrahenci).filter(Boolean), item => item.id).sort((a, b) => a.nazwa.localeCompare(b.nazwa, "pl"));
    fillSelect("contractorFilter", contractors, "Wszyscy kontrahenci", item => [item.id, item.nazwa]);
}

function populateLocalFilter() {
    const locals = uniqueBy(documents.map(doc => doc.lokale).filter(item => item && (!activeLocation || item.lokalizacja === activeLocation)), item => item.id)
        .sort((a, b) => a.nazwa.localeCompare(b.nazwa, "pl"));
    fillSelect("localFilter", locals, "Wszystkie lokale", item => [item.id, `${item.nazwa}${item.mpk ? ` (${item.mpk})` : ""}`]);
}

function fillSelect(id, items, placeholder, getOption) {
    const select = document.getElementById(id); if (!select) return;
    const selected = select.value; select.innerHTML = `<option value="">${placeholder}</option>`;
    items.forEach(item => { const [value, label] = getOption(item); select.add(new Option(label, value)); });
    select.value = selected;
}

function uniqueBy(items, key) { return [...new Map(items.map(item => [key(item), item])).values()]; }

function renderLocationCards() {
    const box = document.getElementById("locationTabs"); if (!box) return; box.innerHTML = "";
    LOCATIONS.forEach(location => {
        const count = documents.filter(doc => doc.lokale?.lokalizacja === location).length;
        const button = document.createElement("button");
        button.className = "location-card" + (activeLocation === location ? " active" : "");
        button.innerHTML = `<strong>${escapeHtml(location)}</strong><span>${documentCount(count)}</span>`;
        button.onclick = () => filterLocation(location); box.appendChild(button);
    });
}

window.filterLocation = function (location) {
    activeLocation = activeLocation === location ? "" : location;
    populateLocalFilter();
    renderLocationCards(); renderDocuments();
};

function getFilteredDocuments() {
    const query = document.getElementById("searchInput")?.value.trim().toLocaleLowerCase("pl") || "";
    const year = document.getElementById("yearFilter")?.value || "";
    const status = document.getElementById("statusFilter")?.value || "";
    const localId = document.getElementById("localFilter")?.value || "";
    const contractorId = document.getElementById("contractorFilter")?.value || "";
    return documents.filter(doc => {
        const searchable = [doc.nazwa, doc.typ, doc.regal, doc.polka, doc.segregator, doc.uwagi, doc.lokale?.nazwa, doc.lokale?.mpk, doc.kontrahenci?.nazwa].join(" ").toLocaleLowerCase("pl");
        return (!activeLocation || doc.lokale?.lokalizacja === activeLocation) && (!query || searchable.includes(query)) &&
            (!year || String(doc.rok) === year) && (!status || doc.status === status) &&
            (!localId || doc.lokal_id === localId) && (!contractorId || doc.kontrahent_id === contractorId);
    });
}

function renderDocuments() {
    const box = document.getElementById("results"); if (!box) return;
    const data = getFilteredDocuments(); renderDashboard(data);
    if (!data.length) { box.innerHTML = '<div class="empty">Brak dokumentów spełniających wybrane kryteria.</div>'; return; }
    box.innerHTML = data.map(renderDocumentCard).join("");
    box.querySelectorAll("[data-document-id]").forEach(button => button.onclick = () => {
        const doc = documents.find(item => item.id === button.dataset.documentId);
        if (button.dataset.action === "edit") window.editDocument(doc); else deleteDocument(doc.id);
    });
}

function renderDashboard(data) {
    const box = document.getElementById("dashboardStats"); if (!box) return;
    const count = status => data.filter(doc => doc.status === status).length;
    box.innerHTML = `<div class="stat-card"><span>Wyniki</span><strong>${data.length}</strong></div><div class="stat-card ok"><span>OK</span><strong>${count("OK")}</strong></div><div class="stat-card pending"><span>Do uzupełnienia</span><strong>${count("DO UZUPEŁNIENIA")}</strong></div><div class="stat-card missing"><span>Brak</span><strong>${count("BRAK")}</strong></div>`;
}

function renderDocumentCard(doc) {
    const path = [doc.lokale?.lokalizacja, doc.lokale?.nazwa, doc.regal && `Regał ${doc.regal}`, doc.polka && `Półka ${doc.polka}`, doc.segregator && `Segregator ${doc.segregator}`].filter(Boolean).map(escapeHtml).join(" <span>›</span> ");
    const status = escapeHtml(doc.status || "BRAK STATUSU");
    return `<article class="document"><div class="document-top"><div><p class="archive-path">${path || "Brak przypisanej lokalizacji"}</p><h4>${escapeHtml(doc.nazwa || "Bez nazwy")}</h4></div><span class="status-chip status-${status.toLowerCase().replaceAll(" ", "-")}">${status}</span></div><p class="document-meta">${escapeHtml(doc.typ || "Bez typu")} · Rok: ${escapeHtml(doc.rok || "-")} · Kontrahent: ${escapeHtml(doc.kontrahenci?.nazwa || "-")}</p><details><summary>Pokaż szczegóły</summary><p>MPK: ${escapeHtml(doc.lokale?.mpk || "-")}</p><p>Uwagi: ${escapeHtml(doc.uwagi || "Brak")}</p></details><div class="document-actions"><button class="edit" data-action="edit" data-document-id="${doc.id}">Edytuj</button><button class="delete" data-action="delete" data-document-id="${doc.id}">Usuń</button></div></article>`;
}

async function deleteDocument(id) { if (!confirm("Usunąć dokument?")) return; const { error } = await supabaseClient.from("dokumenty").delete().eq("id", id); if (error) return alert(error.message); loadDocuments(); }
function documentCount(number) { return number === 1 ? "1 dokument" : number >= 2 && number <= 4 ? `${number} dokumenty` : `${number} dokumentów`; }
function escapeHtml(value) { const div = document.createElement("div"); div.textContent = value ?? ""; return div.innerHTML; }
