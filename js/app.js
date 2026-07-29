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



// ===============================
// POBIERANIE DOKUMENTÓW
// ===============================


async function loadDocuments(){


    const { data, error } = await supabaseClient
        .from("dokumenty")
        .select("*")
        .order("lokalizacja");


    if(error){

        console.error(error);

        results.innerHTML =
        "Błąd pobierania dokumentów";

        return;

    }


    documents = data || [];


    createLocations();

    createFilters();

    render();


}




// ===============================
// LOKALIZACJE
// ===============================


function createLocations(){


    if(!locationTabs)
    return;


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







// ===============================
// FILTRY
// ===============================


function createFilters(){


    if(!typeFilter || !shelfFilter)
    return;



    const types =
    [
        ...new Set(
            documents
            .map(d=>d.typ)
            .filter(Boolean)
        )
    ];



    const shelves =
    [
        ...new Set(
            documents
            .map(d=>d.regal)
            .filter(Boolean)
        )
    ];



    typeFilter.innerHTML =
    `
    <option value="">
    Wszystkie typy
    </option>
    `;



    types.forEach(type=>{


        typeFilter.innerHTML +=
        `
        <option value="${type}">
        ${type}
        </option>
        `;


    });





    shelfFilter.innerHTML =
    `
    <option value="">
    Wszystkie regały
    </option>
    `;



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







// ===============================
// WYŚWIETLANIE
// ===============================


function render(){


    if(!results)
    return;



    results.innerHTML="";



    let filtered =
    [...documents];



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
        Brak dokumentów
        </div>
        `;


        return;

    }






    const grouped = {};



    filtered.forEach(doc=>{


        if(!grouped[doc.lokalizacja]){


            grouped[doc.lokalizacja]=[];

        }


        grouped[doc.lokalizacja]
        .push(doc);



    });







    Object.keys(grouped).forEach(location=>{


        let locationBox =
        document.createElement("div");


        locationBox.className="location";



        locationBox.innerHTML =
        `
        <h2>
        ${location}
        </h2>
        `;





        const locals={};



        grouped[location]
        .forEach(doc=>{


            const local =
            doc.numer_lokalu || "Brak numeru";



            if(!locals[local]){


                locals[local]=[];

            }


            locals[local].push(doc);



        });








        Object.keys(locals)
        .forEach(local=>{



            let localBox =
            document.createElement("div");


            localBox.className="card";



            localBox.innerHTML =
            `
            <h3>
            Lokal: ${local}
            </h3>
            `;






            locals[local]
            .forEach(doc=>{


                localBox.innerHTML +=
                `

                <div class="document">


                <strong>
                ${doc.nazwa || "Brak nazwy"}
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



                <button onclick="editDocument('${doc.id}')">
                Edytuj
                </button>



                <button onclick="deleteDocument('${doc.id}')">
                Usuń
                </button>


                </div>

                <hr>

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







// ===============================
// USUWANIE
// ===============================


async function deleteDocument(id){


    const confirmDelete =
    confirm(
    "Czy na pewno usunąć dokument?"
    );


    if(!confirmDelete)
    return;




    const {error}=await supabaseClient
    .from("dokumenty")
    .delete()
    .eq("id",id);




    if(error){

        console.error(error);

        alert("Nie udało się usunąć dokumentu");

        return;

    }



    loadDocuments();


}









// ===============================
// EDYCJA
// ===============================


async function editDocument(id){


    const doc =
    documents.find(
        d=>d.id == id
    );


    if(!doc)
    return;




    document
    .getElementById("modalOverlay")
    .classList.remove("hidden");




    document.getElementById("location").value =
    doc.lokalizacja || "";


    document.getElementById("number").value =
    doc.numer_lokalu || "";


    document.getElementById("name").value =
    doc.nazwa || "";


    document.getElementById("type").value =
    doc.typ || "";


    document.getElementById("shelf").value =
    doc.regal || "";


    document.getElementById("level").value =
    doc.polka || "";


    document.getElementById("folder").value =
    doc.segregator || "";


    document.getElementById("notes").value =
    doc.uwagi || "";





    const saveBtn =
    document.getElementById("saveBtn");



    saveBtn.onclick = async ()=>{


        const updateData={


            lokalizacja:
            document.getElementById("location").value,


            numer_lokalu:
            document.getElementById("number").value,


            nazwa:
            document.getElementById("name").value,


            typ:
            document.getElementById("type").value,


            regal:
            document.getElementById("shelf").value,


            polka:
            document.getElementById("level").value,


            segregator:
            document.getElementById("folder").value,


            uwagi:
            document.getElementById("notes").value

        };




        const {error}=await supabaseClient

        .from("dokumenty")

        .update(updateData)

        .eq("id",id);





        if(error){

            console.error(error);

            alert("Błąd edycji");

            return;

        }




        document
        .getElementById("modalOverlay")
        .classList.add("hidden");



        loadDocuments();



    };



}


loadDocuments();
