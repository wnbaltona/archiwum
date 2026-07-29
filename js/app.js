let documents = [];

const results = document.getElementById("results");
const searchInput = document.getElementById("searchInput");


// kolejność lokalizacji

const locations = [
    "OKĘCIE",
    "RADOM",
    "MODLIN",
    "SONATA",
    "RZESZÓW",
    "KATOWICE",
    "KRAKÓW",
    "ZIELONA GÓRA",
    "FRANCJA",
    "BYDGOSZCZ",
    "POZNAŃ",
    "WROCŁAW"
];



// ==========================
// POBIERANIE DANYCH
// ==========================


async function loadDocuments() {


    const { data, error } = await supabaseClient
        .from("dokumenty")
        .select("*")
        .order("lokalizacja", { ascending: true });



    if (error) {

        console.error(
            "Błąd pobierania:",
            error
        );

        results.innerHTML = `
        <div class="card">
        ❌ Nie udało się pobrać dokumentów
        </div>
        `;

        return;
    }



    documents = data || [];


    showLocations();

}



// ==========================
// WYŚWIETLANIE LOKALIZACJI
// ==========================


function showLocations() {


    results.innerHTML = "";



    locations.forEach(location => {


        const locationDocuments =
            documents.filter(doc =>
                doc.lokalizacja === location
            );



        if (locationDocuments.length === 0) {

            return;

        }



        results.innerHTML += `

        <div class="location">


            <div 
            class="location-title"
            onclick="toggleLocation('${location}')">

                ▶ ${location}

                <span>
                (${locationDocuments.length})
                </span>

            </div>



            <div 
            id="${location}"
            class="documents hidden">


                ${
                    locationDocuments.map(doc => `

                    <div class="card">


                        <h3>
                        📄 ${doc.nazwa}
                        </h3>


                        <p>
                        📌 Typ:
                        ${doc.typ || "-"}
                        </p>


                        <p>
                        🗄️ Regał:
                        ${doc.regal || "-"}
                        </p>


                        <p>
                        📚 Półka:
                        ${doc.polka || "-"}
                        </p>


                        <p>
                        📂 Segregator:
                        ${doc.segregator || "-"}
                        </p>


                        <p>
                        📝 ${doc.uwagi || ""}
                        </p>


                    </div>


                    `).join("")
                }



            </div>


        </div>

        `;


    });



}



// ==========================
// ROZWIJANIE LOKALIZACJI
// ==========================


function toggleLocation(location) {


    const element =
        document.getElementById(location);



    if(element){

        element.classList.toggle(
            "hidden"
        );

    }

}



// ==========================
// WYSZUKIWANIE
// ==========================


searchInput.addEventListener(
"input",
function(){


    const text =
    searchInput.value
    .toLowerCase()
    .trim();



    if(text === ""){

        showLocations();

        return;

    }




    const filtered =
    documents.filter(doc => {


        return (

            (doc.nazwa || "")
            .toLowerCase()
            .includes(text)


            ||

            (doc.lokalizacja || "")
            .toLowerCase()
            .includes(text)


            ||

            (doc.typ || "")
            .toLowerCase()
            .includes(text)


            ||

            (doc.regal || "")
            .toLowerCase()
            .includes(text)


            ||

            (doc.polka || "")
            .toLowerCase()
            .includes(text)


            ||

            (doc.segregator || "")
            .toLowerCase()
            .includes(text)


        );


    });



    showSearchResults(filtered);


});




// ==========================
// WYNIKI SZUKANIA
// ==========================


function showSearchResults(data){


    results.innerHTML = "";



    if(data.length === 0){


        results.innerHTML = `

        <div class="card">

        Brak wyników

        </div>

        `;


        return;

    }





    data.forEach(doc => {



        results.innerHTML += `


        <div class="card">


            <h3>
            📄 ${doc.nazwa}
            </h3>


            <p>
            📍 ${doc.lokalizacja}
            </p>


            <p>
            🗄️ Regał:
            ${doc.regal || "-"}
            </p>


            <p>
            📚 Półka:
            ${doc.polka || "-"}
            </p>


            <p>
            📂 Segregator:
            ${doc.segregator || "-"}
            </p>



        </div>


        `;


    });


}



// START

loadDocuments();