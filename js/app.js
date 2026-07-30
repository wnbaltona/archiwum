// ===============================
// APP.JS (POPRAWIONY)
// ===============================

let documents = [];
let locations = [
  "OKĘCIE", "MODLIN", "RADOM", "RZESZÓW", "ŚWINOUJŚCIE",
  "POZNAŃ", "WROCŁAW", "KATOWICE", "ZIELONA GÓRA", "KRAKÓW",
  "GDAŃSK", "GDYNIA", "FRANCJA", "SONATA"
];

let selectedLocation = "";
let expandedLocations = [];

document.addEventListener("DOMContentLoaded", () => {
  loadDocuments();
});

async function loadDocuments() {
  const { data, error } = await supabaseClient
    .from("dokumenty")
    .select(`
      *,
      lokale(id, nazwa, mpk, lokalizacja),
      kontrahenci(id, nazwa)
    `)
    .order("lokalizacja");

  if (error) {
    console.error(error);
    return;
  }

  documents = data || [];

  createLocationFilters();
  createYearFilter();
  renderDocuments();
}

function createLocationFilters() {
  const box = document.getElementById("locationTabs");
  if (!box) return;
  box.innerHTML = "";

  locations.forEach(location => {
    const count = documents.filter(d => d.lokalizacja === location).length;

    const btn = document.createElement("button");
    btn.className = "location-card";
    if (selectedLocation === location) {
      btn.classList.add("active");
    }

    btn.innerHTML = `
      <strong>${location}</strong>
      <span>${documentText(count)}</span>
    `;

    btn.onclick = () => {
      selectedLocation = selectedLocation === location ? "" : location;
      createLocationFilters();
      renderDocuments();
    };

    box.appendChild(btn);
  });
}

function renderDocuments() {
  const results = document.getElementById("results");
  if (!results) return;
  results.innerHTML = "";

  let filtered = [...documents];

  // Filtr lokalizacji
  if (selectedLocation) {
    filtered = filtered.filter(d => d.lokalizacja === selectedLocation);
  }

  // Filtr wyszukiwania
  const searchEl = document.getElementById("searchInput");
  const search = searchEl ? searchEl.value.toLowerCase() : "";
  if (search) {
    filtered = filtered.filter(d =>
      JSON.stringify(d).toLowerCase().includes(search)
    );
  }

  // Filtr roku (POPRAWIONY)
  const yearEl = document.getElementById("yearFilter");
  const selectedYear = yearEl ? yearEl.value : "";
  if (selectedYear) {
    filtered = filtered.filter(d => String(d.rok) === selectedYear);
  }

  locations.forEach(location => {
    const docs = filtered.filter(d => d.lokalizacja === location);

    if (selectedLocation && location !== selectedLocation) {
      return;
    }

    renderLocation(location, docs);
  });
}

function renderLocation(location, docs) {
  const results = document.getElementById("results");
  const open = expandedLocations.includes(location);

  const div = document.createElement("div");
  div.className = "archive-location";

  div.innerHTML = `
    <div class="archive-header">
      <span class="arrow">${open ? "▼" : "▶"}</span>
      <strong>${location}</strong>
      <span class="counter">${documentText(docs.length)}</span>
    </div>
    <div class="location-content ${open ? "" : "hidden"}"></div>
  `;

  div.querySelector(".archive-header").onclick = () => {
    if (open) {
      expandedLocations = expandedLocations.filter(x => x !== location);
    } else {
      expandedLocations.push(location);
    }
    renderDocuments();
  };

  const content = div.querySelector(".location-content");

  if (!docs.length) {
    content.innerHTML = `<p>Brak dokumentów</p>`;
  } else {
    docs.forEach(doc => {
      content.innerHTML += `
        <div class="document">
          <h4>${doc.nazwa}</h4>
          <p>Lokal: ${doc.lokale?.nazwa || "-"}</p>
          <p>MPK: ${doc.lokale?.mpk || "-"}</p>
          <p>Kontrahent: ${doc.kontrahenci?.nazwa || "-"}</p>
          <p>Typ: ${doc.typ || "-"}</p>
          <p>Rok: ${doc.rok || "-"}</p>
          <p>Status: ${doc.status || "-"}</p>
          <p>${doc.uwagi || ""}</p>
          <button class="edit" onclick='openEditModal(${JSON.stringify(doc)})'>Edytuj</button>
          <button class="delete" onclick="deleteDocument('${doc.id}')">Usuń</button>
        </div>
      `;
    });
  }

  results.appendChild(div);
}

function createYearFilter() {
  const select = document.getElementById("yearFilter");
  if (!select) return;

  const years = [
    ...new Set(documents.map(d => d.rok).filter(Boolean))
  ].sort((a, b) => b - a);

  select.innerHTML = `<option value="">Wszystkie lata</option>`;
  years.forEach(year => {
    select.innerHTML += `<option value="${year}">${year}</option>`;
  });
}

window.deleteDocument = async function(id) {
  if (!confirm("Usunąć dokument?")) return;

  const { error } = await supabaseClient
    .from("dokumenty")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  loadDocuments();
};

function documentText(number) {
  if (number === 1) return "1 dokument";
  if (number >= 2 && number <= 4) return number + " dokumenty";
  return number + " dokumentów";
}

document.addEventListener("input", e => {
  if (e.target.id === "searchInput") {
    renderDocuments();
  }
});

document.addEventListener("change", e => {
  if (e.target.id === "yearFilter") {
    renderDocuments();
  }
});
