let editingId = null;



document.addEventListener(
"DOMContentLoaded",
()=>{


const addBtn =
document.getElementById("addBtn");


const closeBtn =
document.getElementById("closeModal");


const saveBtn =
document.getElementById("saveBtn");




if(addBtn){

addBtn.onclick = ()=>{

openAddModal();

};

}




if(closeBtn){

closeBtn.onclick = ()=>{

closeModal();

};

}




if(saveBtn){

saveBtn.onclick = ()=>{

saveDocument();

};

}



});








// =====================
// OTWIERANIE NOWEGO
// =====================


function openAddModal(){


editingId=null;


document
.getElementById("modalOverlay")
.classList.remove("hidden");



document
.getElementById("modalTitle")
.innerText=
"Dodaj dokument";



document
.getElementById("saveBtn")
.innerText=
"Zapisz dokument";



clearForm();



}









// =====================
// EDYCJA
// =====================


function openEditModal(doc){


editingId=doc.id;



document
.getElementById("modalOverlay")
.classList.remove("hidden");



document
.getElementById("modalTitle")
.innerText=
"Edytuj dokument";



document
.getElementById("saveBtn")
.innerText=
"Zapisz zmiany";





document.getElementById("location").value =
doc.lokalizacja || "";



document.getElementById("number").value =
doc.numer_lokalu || "";



document.getElementById("name").value =
doc.nazwa || "";



document.getElementById("contractor").value =
doc.nazwa_kontrahenta || "";



document.getElementById("type").value =
doc.typ || "";



document.getElementById("year").value =
doc.rok || "";



document.getElementById("shelf").value =
doc.regal || "";



document.getElementById("level").value =
doc.polka || "";



document.getElementById("folder").value =
doc.segregator || "";



document.getElementById("status").value =
doc.status || "OK";



document.getElementById("notes").value =
doc.uwagi || "";



}









// =====================
// ZAPIS
// =====================


async function saveDocument(){



const required=[


"location",
"number",
"name",
"contractor",
"type",
"year",
"shelf",
"level",
"folder",
"status"


];




let valid=true;





required.forEach(id=>{


const field =
document.getElementById(id);



if(!field.value.trim()){


field.classList.add("invalid");

valid=false;


}else{


field.classList.remove("invalid");


}



});






if(!valid){


showError(
"Uzupełnij wszystkie wymagane pola."
);


return;


}









const documentData={



lokalizacja:

document
.getElementById("location")
.value,



numer_lokalu:

document
.getElementById("number")
.value,



nazwa:

document
.getElementById("name")
.value,



nazwa_kontrahenta:

document
.getElementById("contractor")
.value,



typ:

document
.getElementById("type")
.value,



rok:

Number(
document
.getElementById("year")
.value
),



regal:

document
.getElementById("shelf")
.value,



polka:

document
.getElementById("level")
.value,



segregator:

document
.getElementById("folder")
.value,



status:

document
.getElementById("status")
.value,



uwagi:

document
.getElementById("notes")
.value,



updated_at:

new Date()

};








let result;






if(editingId){



result =

await supabaseClient

.from("dokumenty")

.update(documentData)

.eq(
"id",
editingId
);



}else{



result =

await supabaseClient

.from("dokumenty")

.insert([documentData]);



}









if(result.error){



console.error(
"Błąd Supabase:",
result.error
);



showError(

result.error.message

);



return;


}








showSuccess();



setTimeout(()=>{


closeModal();



if(typeof loadDocuments==="function"){


loadDocuments();


}



},700);






}











// =====================
// ZAMKNIJ
// =====================


function closeModal(){



document

.getElementById("modalOverlay")

.classList.add("hidden");



editingId=null;



clearForm();



}









// =====================
// CZYSZCZENIE
// =====================


function clearForm(){



const fields =

document.querySelectorAll(

"#modalOverlay input, #modalOverlay textarea"

);





fields.forEach(field=>{


field.value="";


field.classList.remove(
"invalid"
);


});






document
.getElementById("location")
.value="";



document
.getElementById("status")
.value="OK";



hideMessages();


}









// =====================
// KOMUNIKATY
// =====================


function showSuccess(){


const box =
document.getElementById("successBox");


box.innerText =
"Dokument został zapisany.";


box.classList.remove(
"hidden"
);


}





function showError(text){



const box =
document.getElementById("errorBox");


box.innerText=text;


box.classList.remove(
"hidden"
);


}





function hideMessages(){



document

.getElementById("successBox")

.classList.add("hidden");



document

.getElementById("errorBox")

.classList.add("hidden");



}
