// =========================
// OTWIERANIE FORMULARZA
// =========================

const addBtn = document.getElementById("addBtn");

const adminPanel = document.getElementById("adminPanel");


if(addBtn && adminPanel){


    addBtn.addEventListener("click", () => {

        adminPanel.classList.toggle("hidden");

    });


}



// =========================
// ZAPIS DOKUMENTU
// =========================


const saveBtn = document.getElementById("saveBtn");


if(saveBtn){


saveBtn.addEventListener("click", async () => {



    const documentData = {


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



    // sprawdzenie wymaganych pól

    if(
        !documentData.lokalizacja ||
        !documentData.nazwa
    ){

        alert(
        "Uzupełnij lokalizację i nazwę dokumentu"
        );

        return;

    }




    const { data, error } = await supabaseClient

        .from("dokumenty")

        .insert([documentData]);





    if(error){


        console.error(
        "Błąd zapisu:",
        error
        );


        alert(
        "Nie udało się zapisać dokumentu"
        );


        return;

    }





    alert(
    "Dokument został dodany"
    );





    // czyszczenie formularza


    document.getElementById("number").value="";

    document.getElementById("name").value="";

    document.getElementById("type").value="";

    document.getElementById("shelf").value="";

    document.getElementById("level").value="";

    document.getElementById("folder").value="";

    document.getElementById("notes").value="";




    // odświeżenie danych

    if(typeof loadDocuments === "function"){

        loadDocuments();

    }


});

}
