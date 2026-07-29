document.addEventListener("DOMContentLoaded",()=>{


const saveBtn =
document.getElementById("saveBtn");



saveBtn.onclick = async ()=>{



const documentData={


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







// JEŻELI EDYTUJEMY ISTNIEJĄCY DOKUMENT


if(editingId){



const {error}=await supabaseClient


.from("dokumenty")


.update(documentData)


.eq("id",editingId);




if(error){


console.error(error);


alert("Nie udało się zapisać zmian");


return;


}



alert("Dokument został zaktualizowany");



closeModal();



loadDocuments();



editingId=null;



return;



}









// DODAWANIE NOWEGO DOKUMENTU


const {error}=await supabaseClient


.from("dokumenty")


.insert([documentData]);






if(error){


console.error(error);


alert("Nie udało się dodać dokumentu");


return;


}






document
.getElementById("successBox")
.classList.remove("hidden");



document
.getElementById("saveBtn")
.disabled=true;



loadDocuments();



};






// ZAMKNIĘCIE PO DODANIU


document
.getElementById("closeAfterSave")
.onclick=()=>{


closeModal();


};






});









function closeModal(){



document
.getElementById("modalOverlay")
.classList.add("hidden");



document
.getElementById("successBox")
.classList.add("hidden");



document
.getElementById("saveBtn")
.disabled=false;



document
.getElementById("saveBtn")
.innerText=
"Zapisz dokument";



document
.getElementById("modalTitle")
.innerText=
"Dodaj dokument";




// czyszczenie formularza


document.getElementById("number").value="";

document.getElementById("name").value="";

document.getElementById("type").value="";

document.getElementById("shelf").value="";

document.getElementById("level").value="";

document.getElementById("folder").value="";

document.getElementById("notes").value="";


editingId=null;



}
