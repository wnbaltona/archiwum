// ===============================
// ADMIN.JS
// ===============================


let editingDocumentId = null;



document.addEventListener(
"DOMContentLoaded",
()=>{


document
.getElementById("addBtn")
?.addEventListener(
"click",
openAddDocument
);



document
.getElementById("closeModal")
?.addEventListener(
"click",
closeModal
);



document
.getElementById("saveBtn")
?.addEventListener(
"click",
saveDocument
);



document
.getElementById("location")
?.addEventListener(
"change",
(e)=>{

loadLocals(e.target.value);

});



});






// ===============================
// OTWÓRZ FORMULARZ
// ===============================


async function openAddDocument(){


editingDocumentId=null;


clearForm();


document.getElementById(
"modalTitle"
).innerText =
"Dodaj dokument";



await loadLocations();

await loadContractors();



document
.getElementById("modalOverlay")
.classList
.remove("hidden");



}








// ===============================
// POBIERANIE LOKALIZACJI
// ===============================


async function loadLocations(){


const select =
document.getElementById(
"location"
);



const {
data,
error
}

=
await supabaseClient

.from("lokale")

.select(
"lokalizacja"
)

.order(
"lokalizacja"
);





if(error){

console.error(error);

alert(error.message);

return;

}





const locations =
[
...new Set(
data
.map(x=>x.lokalizacja)
.filter(Boolean)
)

];





select.innerHTML=

`
<option value="">
Wybierz lokalizację
</option>
`;





locations.forEach(
location=>{


select.innerHTML +=

`
<option value="${location}">
${location}
</option>

`;



});



}









// ===============================
// LOKALE PO LOKALIZACJI
// ===============================


async function loadLocals(location){



const select =
document.getElementById(
"local"
);



select.innerHTML=

`
<option>
Ładowanie...
</option>
`;





if(!location){

select.innerHTML=

`
<option>
Najpierw wybierz lokalizację
</option>

`;

return;

}





const {
data,
error
}

=
await supabaseClient

.from("lokale")

.select(
"id,nazwa,mpk,lokalizacja"
)

.eq(
"lokalizacja",
location
)

.order(
"nazwa"
);





if(error){

console.error(error);

return;

}





select.innerHTML=

`
<option value="">
Wybierz lokal
</option>
`;





data.forEach(
lokal=>{


select.innerHTML +=

`
<option value="${lokal.id}">

${lokal.nazwa}
${lokal.mpk ? " ("+lokal.mpk+")":""}

</option>

`;



});



}









// ===============================
// KONTRAHENCI
// ===============================


async function loadContractors(){



const select =
document.getElementById(
"contractor"
);



const {
data,
error
}

=
await supabaseClient

.from("kontrahenci")

.select(
"id,nazwa"
)

.order(
"nazwa"
);





if(error){

console.error(error);

return;

}





select.innerHTML=

`
<option value="">
Wybierz kontrahenta
</option>

`;





data.forEach(
item=>{


select.innerHTML +=

`
<option value="${item.id}">
${item.nazwa}
</option>

`;



});



}









// ===============================
// ZAPIS
// ===============================


async function saveDocument(){



const data = {


lokalizacja:

document
.getElementById("location")
.value,



lokal_id:

document
.getElementById("local")
.value || null,



kontrahent_id:

document
.getElementById("contractor")
.value || null,



nazwa:

document
.getElementById("name")
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
) || null,



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
.value



};








let result;



if(editingDocumentId){


result =
await supabaseClient

.from("dokumenty")

.update(data)

.eq(
"id",
editingDocumentId
);



}

else{


result =
await supabaseClient

.from("dokumenty")

.insert(data);



}






if(result.error){

alert(result.error.message);

return;

}





closeModal();



if(typeof loadDocuments==="function"){

loadDocuments();

}



}









// ===============================
// EDYCJA
// ===============================


window.openEditModal =
async function(doc){


editingDocumentId =
doc.id;



await loadLocations();

await loadContractors();




document
.getElementById("location")
.value =
doc.lokalizacja;



await loadLocals(
doc.lokalizacja
);




document
.getElementById("local")
.value =
doc.lokal_id || "";



document
.getElementById("contractor")
.value =
doc.kontrahent_id || "";



document
.getElementById("name")
.value =
doc.nazwa || "";



document
.getElementById("type")
.value =
doc.typ || "";



document
.getElementById("year")
.value =
doc.rok || "";



document
.getElementById("shelf")
.value =
doc.regal || "";



document
.getElementById("level")
.value =
doc.polka || "";



document
.getElementById("folder")
.value =
doc.segregator || "";



document
.getElementById("status")
.value =
doc.status || "OK";



document
.getElementById("notes")
.value =
doc.uwagi || "";




document
.getElementById("modalOverlay")
.classList
.remove("hidden");



};









function clearForm(){


document
.querySelectorAll(
"#modalOverlay input, #modalOverlay textarea"
)

.forEach(
x=>x.value=""
);



document
.getElementById("local")
.innerHTML=

`
<option>
Najpierw wybierz lokalizację
</option>

`;



}







function closeModal(){


document
.getElementById("modalOverlay")
.classList
.add("hidden");



editingDocumentId=null;



}
