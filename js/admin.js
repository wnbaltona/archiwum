let editingId = null;



document.addEventListener(
"DOMContentLoaded",
()=>{



const saveBtn =
document.getElementById("saveBtn");

const closeBtn =
document.getElementById("closeModal");






// =====================
// ZAMYKANIE MODALA
// =====================


closeBtn.addEventListener(
"click",
()=>{

closeModal();

}

);







// =====================
// ZAPIS
// =====================


saveBtn.addEventListener(
"click",
async ()=>{





const required=[

"location",
"number",
"name",
"type",
"shelf",
"level",
"folder",
"status"

];



let valid=true;





required.forEach(id=>{


const field=
document.getElementById(id);



if(!field.value.trim()){


field.classList.add(
"invalid"
);


valid=false;


}

else{


field.classList.remove(
"invalid"
);


}


});







if(!valid){


showError(
"Uzupełnij wszystkie wymagane pola."
);


return;


}









const data={



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



typ:

document
.getElementById("type")
.value,



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







// EDYCJA


if(editingId){



result = await supabaseClient

.from("dokumenty")

.update(data)

.eq(
"id",
editingId
);



}






// NOWY


else{


result = await supabaseClient

.from("dokumenty")

.insert([data]);


}









if(result.error){



console.error(
result.error
);



showError(
"Błąd zapisu dokumentu."
);



return;


}







showSuccess();



if(typeof loadDocuments==="function"){


loadDocuments();


}







});






});









// =====================
// OTWÓRZ DODAWANIE
// =====================


function openAddModal(){



editingId=null;



document
.getElementById("modalOverlay")
.classList.remove(
"hidden"
);



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
.classList.remove(
"hidden"
);




document
.getElementById("modalTitle")
.innerText=
"Edytuj dokument";



document
.getElementById("saveBtn")
.innerText=
"Zapisz zmiany";





document.getElementById("location").value=
doc.lokalizacja || "";

document.getElementById("number").value=
doc.numer_lokalu || "";

document.getElementById("name").value=
doc.nazwa || "";

document.getElementById("type").value=
doc.typ || "";

document.getElementById("shelf").value=
doc.regal || "";

document.getElementById("level").value=
doc.polka || "";

document.getElementById("folder").value=
doc.segregator || "";

document.getElementById("status").value=
doc.status || "OK";

document.getElementById("notes").value=
doc.uwagi || "";



}









// =====================
// ZAMKNIJ
// =====================


function closeModal(){



document
.getElementById("modalOverlay")
.classList.add(
"hidden"
);



clearForm();



editingId=null;



}









// =====================
// CZYSZCZENIE
// =====================


function clearForm(){



document
.querySelectorAll(
"#modalOverlay input, #modalOverlay textarea"
)

.forEach(field=>{


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



document
.getElementById("successBox")
.classList.add(
"hidden"
);



document
.getElementById("errorBox")
.classList.add(
"hidden"
);



}









// =====================
// KOMUNIKATY
// =====================


function showSuccess(){



const box=
document.getElementById(
"successBox"
);



box.innerText=
"Dokument został zapisany.";





box.classList.remove(
"hidden"
);



}







function showError(text){



const box=
document.getElementById(
"errorBox"
);



box.innerText=text;



box.classList.remove(
"hidden"
);



}
