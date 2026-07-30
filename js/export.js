document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("exportBtn")?.addEventListener("click", exportDocuments);
});

async function exportDocuments() {
    const data = typeof getFilteredDocuments === "function" ? getFilteredDocuments() : [];
    if (!data.length) return alert("Brak danych do eksportu.");

    const rows = [["Lokalizacja", "Lokal", "MPK", "Nazwa", "Typ", "Regał", "Półka", "Segregator", "Status", "Kontrahent", "Rok", "Uwagi"]];
    data.forEach(doc => rows.push([
        doc.lokale?.lokalizacja || "", doc.lokale?.nazwa || "", doc.lokale?.mpk || "", doc.nazwa || "", doc.typ || "",
        doc.regal || "", doc.polka || "", doc.segregator || "", doc.status || "", doc.kontrahenci?.nazwa || "", doc.rok || "", doc.uwagi || ""
    ]));
    const content = "\uFEFF" + rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(";")).join("\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url; link.download = "archiwum_dokumentow.csv"; link.click();
    URL.revokeObjectURL(url);
}
