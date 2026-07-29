const addBtn = document.getElementById("addBtn");

const adminPanel = document.getElementById("adminPanel");



addBtn.addEventListener("click", () => {

    adminPanel.classList.toggle("hidden");

});




const saveBtn = document.getElementById("saveBtn");


saveBtn.addEventListener("click", async () => {


    const documentData = {

        lokalizacja: document.getElementById("location").value,

        nazwa: document.getElementById("name").value,

        typ: document.getElementById("type").value,

        regal: document.getElementById("shelf").value,

        polka: document.getElementById("level").value,

        segregator: document.getElementById("folder").value,

        uwagi: document.getElementById("notes").value

    };



    const { data, error } = await supabaseClient
        .from("dokumenty")
        .insert([documentData]);



    if(error){

        console.error(error);

        alert("Błąd zapisu dokumentu");

        return;

    }



    alert("Dokument dodany");


    location.reload();


});
