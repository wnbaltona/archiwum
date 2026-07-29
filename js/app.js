let documents = [];

let selectedLocation = "WSZYSTKIE";



const results = document.getElementById("results");

const searchInput = document.getElementById("searchInput");

const typeFilter = document.getElementById("typeFilter");

const shelfFilter = document.getElementById("shelfFilter");

const locationTabs = document.getElementById("locationTabs");




const locations = [
    "WSZYSTKIE",
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





// =====================
// POBIERANIE DANYCH
// =====================

async function loadDocuments(){


    const {data,error} = await supabaseClient
    .from("dokumenty")
    .select("*")
    .order("lokalizacja");


    if(error){

        console.error(error);

        results.innerHTML =
        "Nie udało się pobrać dokumentów.";

        return;

    }


    documents = data || [];


    createLocationTabs();

    createFilters();

    render();


}





// =====================
// ZAKŁADKI LOKALIZACJI
// =====================


function createLocationTabs(){


    if(!locationTabs) return;


    locationTabs.innerHTML="";


    locations.forEach(location=>{


        const button =
        document.createElement("button");


        button.textContent = location;



        button.onclick = ()=>{


            selectedLocation = location;

            render();


        };



        locationTabs.appendChild(button);


    });


}






// =====================
// FILTRY
// =====================


function createFilters(){


    if(!typeFilter || !shelfFilter) return;



    const types = [
        ...new Set(
            documents
            .map(d=>d.typ)
            .filter(Boolean)
        )
    ];



    const shelves = [
        ...new Set(
            documents
            .map(d=>d.regal)
            .filter(Boolean)
        )
    ];




    typeFilter.innerHTML =
    `<option value="">
    Wszystkie typy
    </option>`;


    types.forEach(type=>{


        typeFilter.innerHTML +=
        `
        <option value="${type}">
        ${type}
        </option>
        `;


    });





    shelfFilter.innerHTML =
    `<option value="">
    Wszystkie regały
    </option>`;



    shelves.forEach(shelf=>{


        shelfFilter.innerHTML +=
        `
        <option value="${shelf}">
        ${shelf}
        </option>
        `;


    });


}





if(typeFilter){

    typeFilter.addEventListener(
        "change",
        render
    );

}



if(shelfFilter){

    shelfFilter.addEventListener(
        "change",
        render
    );

}





// =====================
// WYŚWIETLANIE
// =====================


function render(){


    if(!results) return;


    results.innerHTML="";



    let filtered = [...documents];



    if(selectedLocation !== "WSZYSTKIE"){


        filtered =
        filtered.filter(
            d =>
            d.lokalizacja === selectedLocation
        );


    }





    if(typeFilter && typeFilter.value){


        filtered =
        filtered.filter(
            d =>
            d.typ === typeFilter.value
        );


    }




    if(shelfFilter && shelfFilter.value){


        filtered =
        filtered.filter(
            d =>
            d.regal === shelfFilter.value
        );


    }





    const search =
    searchInput ?
    searchInput.value.toLowerCase()
    :
    "";



    if(search){


        filtered =
        filtered.filter(doc=>

            JSON.stringify(doc)
            .toLowerCase()
            .includes(search)

        );


    }






    if(filtered.length===0){


        results.innerHTML =
        `
        <div class="location">
        Brak dokumentów.
        </div>
        `;


        return;

    }





    const grouped = {};



    filtered.forEach(doc=>{


        if(!grouped[doc.lokalizacja]){

            grouped[doc.lokalizacja]=[];

        }


        grouped[doc.lokalizacja].push(doc);



    });







    Object.keys(grouped).forEach(location=>{


        const locationBox =
        document.createElement("div");


        locationBox.className="location";



        locationBox.innerHTML =
        `
        <h2>
        ${location}
        </h2>
        `;



        const locals = {};



        grouped[location].forEach(doc=>{


            const local =
            doc.numer_lokalu || "Brak numeru";


            if(!locals[local]){

                locals[local]=[];

            }


            locals[local].push(doc);



        });







        Object.keys(locals).forEach(local=>{


            const localBox =
            document.createElement("div");


            localBox.className="card";



            localBox.innerHTML =
            `
            <h3>
            Lokal: ${local}
            </h3>
            `;




            locals[local].forEach(doc=>{


                localBox.innerHTML +=
                `

                <div class="document">

                <strong>
                ${doc.nazwa || "Bez nazwy"}
                </strong>

                <p>
                Typ: ${doc.typ || "-"}
                </p>

                <p>
                Regał: ${doc.regal || "-"}
                </p>

                <p>
                Półka: ${doc.polka || "-"}
                </p>

                <p>
                Segregator: ${doc.segregator || "-"}
                </p>

                <p>
                Uwagi: ${doc.uwagi || "-"}
                </p>


                </div>

                `;


            });



            locationBox.appendChild(localBox);


        });



        results.appendChild(locationBox);



    });



}





if(searchInput){

    searchInput.addEventListener(
        "input",
        render
    );

}




loadDocuments();
