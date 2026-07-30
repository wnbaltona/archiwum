// ======================================
// APP.JS
// STRONA GŁÓWNA ARCHIWUM DOKUMENTÓW
// ======================================


let documents = [];
let activeLocation = "";



// ======================================
// START
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    loadDocuments();

});



// ======================================
// POBIERANIE DOKUMENTÓW
// ======================================

async function loadDocuments() {

    const {
        data,
        error
    } = await supabaseClient
        .from("dokumenty")
        .select(`
            *,
            lokale (
                id,
                mpk,
                nazwa,
                lokalizacja
            ),
            kontrahenci (
                id,
                nazwa
            )
        `)
        .order("created_at", {
            ascending: false
        });


    if (error) {

        console.error("Błąd pobierania dokumentów:", error);
        return;

    }


    documents = data || [];


    renderLocationCards();

    renderDocuments();

}




// ======================================
// LOKALIZACJE
// ======================================

function getLocations() {

    return [
        "OKĘCIE",
        "MODLIN",
        "RADOM",
        "RZESZÓW",
        "ŚWINOUJŚCIE",
        "POZNAŃ",
        "WROCŁAW",
        "KATOWICE",
        "ZIELONA GÓRA",
        "KRAKÓW",
        "GDAŃSK",
        "GDYNIA",
        "FRANCJA",
        "SONATA"
    ];

}




// ======================================
// KARTY LOKALIZACJI
// ======================================

function renderLocationCards() {


    const box = document.getElementById("locationTabs");


    if (!box) return;


    box.innerHTML = "";


    getLocations().forEach(location => {


        const count = documents.filter(doc =>
            doc.lokale &&
            doc.lokale.lokalizacja === location
        ).length;



        box.innerHTML += `

            <button class="location-card"
            onclick="filterLocation('${location}')">

                <strong>${location}</strong>

                <span>
                    ${documentCount(count)}
                </span>

            </button>

        `;


    });


}




// ======================================
// FILTROWANIE
// ======================================

window.filterLocation = function(location) {


    if (activeLocation === location) {

        activeLocation = "";

    } else {

        activeLocation = location;

    }


    renderDocuments();


};





// ======================================
// WYŚWIETLANIE DOKUMENTÓW
// ======================================

function renderDocuments() {


    const box = document.getElementById("results");


    if (!box) return;


    let data = [...documents];



    if (activeLocation) {


        data = data.filter(doc =>

            doc.lokale &&
            doc.lokale.lokalizacja === activeLocation

        );


    }



    if (!data.length) {


        box.innerHTML = `

            <div class="empty">

                Brak dokumentów

            </div>

        `;


        return;

    }




    const grouped = {};



    data.forEach(doc => {


        const location =
            doc.lokale?.lokalizacja || "BRAK LOKALIZACJI";



        if (!grouped[location]) {

            grouped[location] = [];

        }


        grouped[location].push(doc);


    });





    box.innerHTML = "";



    Object.keys(grouped).forEach(location => {


        box.innerHTML += `

        <div class="archive-location">


            <div class="archive-header"
            onclick="toggleLocation('${location}')">


                <span>▶</span>

                <strong>
                    ${location}
                </strong>


                <span>
                    ${documentCount(grouped[location].length)}
                </span>


            </div>



            <div id="location-${location}"
            class="location-content hidden">


                ${renderDocumentList(grouped[location])}


            </div>


        </div>

        `;


    });


}





// ======================================
// LISTA DOKUMENTÓW
// ======================================

function renderDocumentList(list) {


    return list.map(doc => {


        return `

        <div class="document">


            <h4>
                ${doc.nazwa || "Bez nazwy"}
            </h4>


            <p>
                Lokal:
                ${doc.lokale?.nazwa || "-"}
            </p>


            <p>
                MPK:
                ${doc.lokale?.mpk || "-"}
            </p>


            <p>
                Kontrahent:
                ${doc.kontrahenci?.nazwa || "-"}
            </p>


            <p>
                Rok:
                ${doc.rok || "-"}
            </p>


            <p>
                Status:
                ${doc.status || "-"}
            </p>


            <button
            onclick="deleteDocument('${doc.id}')">

                Usuń

            </button>


        </div>

        `;


    }).join("");

}




// ======================================
// ROZWIJANIE LOKALIZACJI
// ======================================

window.toggleLocation = function(location) {


    const box =
        document.getElementById(
            "location-" + location
        );


    if (!box) return;


    box.classList.toggle("hidden");


};





// ======================================
// USUWANIE DOKUMENTU
// ======================================

window.deleteDocument = async function(id) {


    if (!confirm("Usunąć dokument?")) {

        return;

    }



    const {
        error
    } = await supabaseClient
        .from("dokumenty")
        .delete()
        .eq("id", id);



    if (error) {


        alert(error.message);

        return;


    }



    loadDocuments();


};





// ======================================
// LICZNIK
// ======================================

function documentCount(number) {


    if (number === 0) {

        return "0 dokumentów";

    }


    if (number === 1) {

        return "1 dokument";

    }


    if (number >= 2 && number <= 4) {

        return number + " dokumenty";

    }


    return number + " dokumentów";


}
