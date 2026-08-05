let documents = [];
let activeLocation = "";



/* =========================================================
   START APLIKACJI
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    [
        "searchInput",
        "yearFilter",
        "statusFilter",
        "localFilter",
        "contractorFilter"

    ].forEach(id => {

        const element =
            document.getElementById(id);


        if(element){

            element.addEventListener(

                id === "searchInput"
                    ? "input"
                    : "change",

                renderDocuments

            );

        }

    });



    createClearButton();


    loadDocuments();


});




function createClearButton(){


    const filterBox =
        document.querySelector(".filter-box");


    if(
        !filterBox ||
        document.getElementById("clearFilters")
    ){

        return;

    }



    const button =
        document.createElement("button");


    button.id =
        "clearFilters";


    button.type =
        "button";


    button.className =
        "clear-filters";


    button.textContent =
        "Wyczyść filtry";


    filterBox.appendChild(button);



    button.onclick =
        clearFilters;


}







function clearFilters(){


    activeLocation = "";


    [
        "searchInput",
        "yearFilter",
        "statusFilter",
        "localFilter",
        "contractorFilter"

    ]

    .forEach(id => {


        const field =
            document.getElementById(id);


        if(field){

            field.value = "";

        }


    });



    populateLocalFilter();

    renderLocationCards();

    renderDocuments();


}







/* =========================================================
   POBIERANIE DANYCH SUPABASE
========================================================= */


async function loadDocuments(){



    const {

        data,

        error

    } = await supabaseClient

        .from("dokumenty")

        .select(

            `*,
            lokale (
                id,
                mpk,
                nazwa,
                lokalizacja
            ),
            kontrahenci (
                id,
                nazwa
            )`

        )

        .order(

            "created_at",

            {
                ascending:false
            }

        );




    if(error){


        console.error(

            "Błąd pobierania dokumentów:",

            error

        );


        return;

    }





    documents =
        data || [];



    populateFilters();

    renderLocationCards();

    renderDocuments();



}








/* =========================================================
   FILTRY
========================================================= */


function populateFilters(){



    fillSelect(

        "yearFilter",

        [

            ...new Set(

                documents

                .map(doc => doc.rok)

                .filter(Boolean)

            )

        ]

        .sort(

            (a,b)=>b-a

        ),

        "Wszystkie lata",

        value => [

            value,

            value

        ]

    );



    populateLocalFilter();




    const contractors =


        uniqueBy(

            documents

            .map(doc => doc.kontrahenci)

            .filter(Boolean),

            item => item.id

        )

        .sort(

            (a,b)=>

                a.nazwa.localeCompare(

                    b.nazwa,

                    "pl"

                )

        );




    fillSelect(

        "contractorFilter",

        contractors,

        "Wszyscy kontrahenci",

        item => [

            item.id,

            item.nazwa

        ]

    );



}







function populateLocalFilter(){



    const locals =


        uniqueBy(

            documents

            .map(doc => doc.lokale)

            .filter(

                item =>

                    item &&

                    (

                        !activeLocation ||

                        item.lokalizacja === activeLocation

                    )

            ),

            item => item.id

        )



        .sort(

            (a,b)=>

                a.nazwa.localeCompare(

                    b.nazwa,

                    "pl"

                )

        );





    fillSelect(

        "localFilter",

        locals,

        "Wszystkie lokale",

        item => [

            item.id,

            `${item.nazwa}${item.mpk ? ` (${item.mpk})` : ""}`

        ]

    );



}







function fillSelect(

    id,

    items,

    placeholder,

    getOption

){



    const select =
        document.getElementById(id);



    if(!select){

        return;

    }




    const selected =
        select.value;



    select.innerHTML =

        `<option value="">
            ${placeholder}
        </option>`;




    items.forEach(item => {



        const [

            value,

            label

        ] = getOption(item);




        select.add(

            new Option(

                label,

                value

            )

        );


    });



    select.value =
        selected;



}







function uniqueBy(items,key){


    return [

        ...new Map(

            items.map(

                item => [

                    key(item),

                    item

                ]

            )

        ).values()

    ];


}

/* =========================================================
   LOKALIZACJE
========================================================= */


function renderLocationCards(){


    const box =
        document.getElementById("locationTabs");


    if(!box){

        return;

    }



    box.innerHTML = "";



    LOCATIONS.forEach(location => {



        const count =

            documents.filter(

                doc =>

                    doc.lokale?.lokalizacja === location

            )

            .length;




        const button =
            document.createElement("button");



        button.className =

            "location-card" +

            (

                activeLocation === location

                ?

                " active"

                :

                ""

            );



        button.innerHTML = `

            <strong>

                ${escapeHtml(location)}

            </strong>


            <span>

                ${documentCount(count)}

            </span>

        `;



        button.onclick = () => {

            filterLocation(location);

        };



        box.appendChild(button);



    });


}





function filterLocation(location){


    activeLocation =

        activeLocation === location

        ?

        ""

        :

        location;



    populateLocalFilter();

    renderLocationCards();

    renderDocuments();


}


window.filterLocation =
    filterLocation;








/* =========================================================
   POBIERANIE FILTROWANYCH DOKUMENTÓW
========================================================= */


function getFilteredDocuments(){



    const query =

        document.getElementById("searchInput")
        ?.value
        .trim()
        .toLowerCase()

        ||

        "";




    const year =

        document.getElementById("yearFilter")
        ?.value

        ||

        "";




    const status =

        document.getElementById("statusFilter")
        ?.value

        ||

        "";




    const localId =

        document.getElementById("localFilter")
        ?.value

        ||

        "";




    const contractorId =

        document.getElementById("contractorFilter")
        ?.value

        ||

        "";






    return documents.filter(doc => {



        const searchable = [


            doc.nazwa,

            doc.typ,

            doc.regal,

            doc.polka,

            doc.segregator,

            doc.uwagi,

            doc.lokale?.nazwa,

            doc.lokale?.mpk,

            doc.kontrahenci?.nazwa



        ]

        .join(" ")

        .toLowerCase();





        return (

            (!activeLocation ||

                doc.lokale?.lokalizacja === activeLocation)



            &&



            (!query ||

                searchable.includes(query))



            &&



            (!year ||

                String(doc.rok) === year)



            &&



            (!status ||

                doc.status === status)



            &&



            (!localId ||

                String(doc.lokal_id) === String(localId))



            &&



            (!contractorId ||

                String(doc.kontrahent_id) === String(contractorId))


        );



    });



}








/* =========================================================
   RENDER DOKUMENTÓW
========================================================= */


function renderDocuments(){



    const box =
        document.getElementById("results");



    if(!box){

        return;

    }





    const data =
        getFilteredDocuments();




    renderDashboard(data);




    const heading = `

        <div class="results-heading">

            <h2>

                Dokumenty

            </h2>


            <span>

                ${documentCount(data.length)}

            </span>


        </div>

    `;





    if(!data.length){


        box.innerHTML =

            heading +

            `

            <div class="empty">

                Brak dokumentów spełniających wybrane kryteria.

            </div>

            `;



        return;


    }





    const groups =

        data.reduce(

            (result,doc)=>{


                const location =

                    doc.lokale?.lokalizacja

                    ||

                    "Brak lokalizacji";



                if(!result[location]){

                    result[location] = [];

                }



                result[location].push(doc);



                return result;


            },

            {}

        );







    box.innerHTML =

        heading +

        Object.entries(groups)

        .map(

            ([location,list]) =>

                renderLocationGroup(

                    location,

                    list,

                    Boolean(activeLocation)

                )

        )

        .join("");






    box

    .querySelectorAll("[data-document-id]")

    .forEach(button => {



        button.onclick = () => {



            const doc =

                documents.find(

                    item =>

                        String(item.id) ===

                        String(button.dataset.documentId)

                );





            if(!doc){

                return;

            }





            if(

                button.dataset.action === "edit"

            ){

                window.editDocument(doc);

            }

            else{

                deleteDocument(doc.id);

            }



        };



    });



}








function renderLocationGroup(

    location,

    list,

    isActive

){



    return `


    <details

        class="location-group"

        ${isActive ? "open" : ""}

    >


        <summary>


            <span class="group-arrow">

                ›

            </span>



            <strong>

                ${escapeHtml(location)}

            </strong>



            <span class="group-count">

                ${documentCount(list.length)}

            </span>



        </summary>




        <div class="group-documents">


            ${

                list

                .map(renderDocumentCard)

                .join("")

            }


        </div>



    </details>



    `;



}








/* =========================================================
   DASHBOARD - KLIKANE STATUSY
========================================================= */


function renderDashboard(data){



    const box =

        document.getElementById("dashboardStats");



    if(!box){

        return;

    }




    const count = status =>

        data.filter(

            doc =>

                String(doc.status)
                .toUpperCase() === status

        )

        .length;





    const currentStatus =

        document.getElementById("statusFilter")
        ?.value

        ||

        "";






    box.innerHTML = `



        <button

            class="stat-card ${currentStatus === "" ? "active" : ""}"

            data-status="">


            <span>

                Wszystkie

            </span>


            <strong>

                ${data.length}

            </strong>


        </button>





        <button

            class="stat-card ok ${currentStatus === "OK" ? "active" : ""}"

            data-status="OK">


            <span>

                OK

            </span>


            <strong>

                ${count("OK")}

            </strong>


        </button>





        <button

            class="stat-card pending ${currentStatus === "DO UZUPEŁNIENIA" ? "active" : ""}"

            data-status="DO UZUPEŁNIENIA">


            <span>

                Do uzupełnienia

            </span>


            <strong>

                ${count("DO UZUPEŁNIENIA")}

            </strong>


        </button>





        <button

            class="stat-card missing ${currentStatus === "BRAK" ? "active" : ""}"

            data-status="BRAK">


            <span>

                Brak

            </span>


            <strong>

                ${count("BRAK")}

            </strong>


        </button>


    `;





    box

    .querySelectorAll("[data-status]")

    .forEach(button => {



        button.onclick = () => {



            const filter =

                document.getElementById("statusFilter");



            if(filter){



                filter.value =

                    filter.value === button.dataset.status

                    ?

                    ""

                    :

                    button.dataset.status;



            }



            renderDocuments();



        };


    });



}

/* =========================================================
   KARTA DOKUMENTU
========================================================= */


function renderDocumentCard(doc){


    const path = [

        doc.lokale?.lokalizacja,

        doc.lokale?.nazwa,

        doc.regal && `Regał ${doc.regal}`,

        doc.polka && `Półka ${doc.polka}`,

        doc.segregator && `Segregator ${doc.segregator}`


    ]

    .filter(Boolean)

    .map(escapeHtml)

    .join(" <span>›</span> ");





    const status =

        escapeHtml(

            doc.status || "BRAK"

        );





    return `


<article class="document">


    <div class="document-top">


        <div>


            <p class="archive-path">

                ${

                    path ||

                    "Brak przypisanej lokalizacji"

                }

            </p>



            <h4>

                ${

                    escapeHtml(

                        doc.nazwa ||

                        "Bez nazwy"

                    )

                }

            </h4>


        </div>



        <span class="status-chip status-${

            status

            .toLowerCase()

            .replaceAll(" ","-")

        }">


            ${status}


        </span>


    </div>





    <p class="document-meta">


        ${

            escapeHtml(

                doc.typ ||

                "Bez typu"

            )

        }


        · Rok:

        ${

            escapeHtml(

                doc.rok ||

                "-"

            )

        }



        · Kontrahent:

        ${

            escapeHtml(

                doc.kontrahenci?.nazwa ||

                "-"

            )

        }


    </p>





    <details>


        <summary>

            Pokaż szczegóły

        </summary>



        <p>

            MPK:

            ${

                escapeHtml(

                    doc.lokale?.mpk ||

                    "-"

                )

            }


        </p>



        <p>

            Uwagi:

            ${

                escapeHtml(

                    doc.uwagi ||

                    "Brak"

                )

            }


        </p>



    </details>





    <div class="document-actions">


        <button

            type="button"

            class="edit"

            data-action="edit"

            data-document-id="${doc.id}">


            Edytuj


        </button>




        <button

            type="button"

            class="delete"

            data-action="delete"

            data-document-id="${doc.id}">


            Usuń


        </button>


    </div>



</article>


`;



}









/* =========================================================
   USUWANIE DOKUMENTU
========================================================= */


async function deleteDocument(id){



    if(!id){

        alert(

            "Brak identyfikatora dokumentu."

        );

        return;

    }





    if(

        !confirm(

            "Usunąć ten dokument?"

        )

    ){

        return;

    }





    const {

        error

    } = await supabaseClient

        .from("dokumenty")

        .delete()

        .eq(

            "id",

            id

        );






    if(error){



        alert(

            "Nie udało się usunąć dokumentu: "

            +

            error.message

        );


        return;


    }






    await loadDocuments();



}









/* =========================================================
   FUNKCJE POMOCNICZE
========================================================= */



function documentCount(number){



    if(number === 1){

        return "1 dokument";

    }



    if(

        number >= 2 &&

        number <= 4

    ){

        return `${number} dokumenty`;

    }



    return `${number} dokumentów`;

}







function escapeHtml(value){



    const div =

        document.createElement("div");



    div.textContent =

        value ?? "";



    return div.innerHTML;


}

/* =========================================================
   MOTYW JASNY / CIEMNY
========================================================= */

const themeToggle = document.getElementById("themeToggle");


if (themeToggle) {

    const savedTheme = localStorage.getItem("theme");


    if (savedTheme === "dark") {

        document.body.classList.add("dark-theme");
        themeToggle.checked = true;

    }


    themeToggle.addEventListener("change", () => {


        if (themeToggle.checked) {

            document.body.classList.add("dark-theme");

            localStorage.setItem(
                "theme",
                "dark"
            );


        } else {

            document.body.classList.remove("dark-theme");

            localStorage.setItem(
                "theme",
                "light"
            );

        }


    });

}
