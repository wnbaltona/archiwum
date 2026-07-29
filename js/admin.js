document.addEventListener("DOMContentLoaded",()=>{


const saveBtn =
document.getElementById("saveBtn");


const closeBtn =
document.getElementById("closeModal");


const closeAfterSave =
document.getElementById("closeAfterSave");





// ============================
// ZAMKNIĘCIE X
// ============================


if(closeBtn){


closeBtn.onclick=()=>{


closeModal();


};


}






// ============================
// ZAPIS
// ============================


saveBtn.onclick = async ()=>{





const requiredFields=[

"location",
"number",
"name",
"type",
"shelf",
"level",
"folder"

];



let emptyFields=[];





requiredFields.forEach(id=>{


const field=
document.getElementById(id);



if(!field.value.trim()){


emptyFields.push(id);


field.classList.add("invalid");


}else{


field.classList.remove("invalid");


}


});







if(emptyFields.length>0){



showError(
"Uzupełnij wszystkie pola oznaczone *"
);



return;


}







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









let response;






// EDYCJA


if(editingId){



response =
await supabaseClient

.from("dokumenty")

.update(documentData)

.eq("id",editingId);



}






// NOWY DOKUMENT


else{



response =
await supabaseClient

.from("dokumenty")

.insert([documentData]);



}








if(response.error){


console.error(response.error);


showError(
"Wystąpił błąd podczas zapisu"
);


return;


}







document
.getElementById("successBox")
.classList.remove("hidden");



document
.getElementById("errorBox")
.classList.add("hidden");





if(typeof loadDocuments==="function"){


loadDocuments();


}



};











// ============================
// ZAMKNIĘCIE PO SUKCESIE
// ============================


if(closeAfterSave){


closeAfterSave.onclick=()=>{


closeModal();


};


}







});











// ============================
// FUNKCJA ZAMYKANIA
// ============================


function closeModal(){



const modal =
document.getElementById("modalOverlay");



if(modal){


modal.classList.add("hidden");


}







const success =
document.getElementById("successBox");



if(success){


success.classList.add("hidden");


}







const error =
document.getElementById("errorBox");



if(error){


error.classList.add("hidden");


}







document
.querySelectorAll(
".modal input, .modal textarea"
)

.forEach(field=>{


field.value="";


field.classList.remove("invalid");


});







const title =
document.getElementById("modalTitle");



if(title){


title.innerText=
"Dodaj dokument";


}







const button =
document.getElementById("saveBtn");



if(button){


button.innerText=
"Zapisz dokument";


}







editingId=null;



}











// ============================
// BŁĄD
// ============================


function showError(text){



const box =
document.getElementById("errorBox");



if(!box)
return;



box.innerText=text;



box.classList.remove("hidden");



}
