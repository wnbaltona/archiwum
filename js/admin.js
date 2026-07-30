// ===============================
// ADMIN.JS
// ===============================


let editingDocumentId = null;



window.LOCATIONS = [

"OKĘCIE",
"MODLIN",
"RADOM",
"RZESZÓW",
"ŚWINOUJŚCIE",
"POZNAŃ",
"WROCŁAW",
"KATOWICE",
"ZIELONA GÓRA",
"KRAKÓW",
"GDAŃSK",
"GDYNIA",
"FRANCJA",
"SONATA"

];




// ===============================
// START
// ===============================


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
function(){

loadLocals(this.value);

});



});







// ===============================
// OTWÓRZ DOKUMENT
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
// LOKALIZACJE
// ===============================


async function loadLocations(){


const select =
document.getElementById(
"location"
);



select.innerHTML =

`
<option value="">
Wybierz lokalizację
</option>
`;



LOCATIONS.forEach(
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
// LOKALE
// ===============================


async function loadLocals(location){



const select =
document.getElementById(
"local"
);



if(!location){


select.innerHTML =

`
<option>
Najpierw wybierz lokalizację
</option>
`;

return;

}





select.innerHTML =

`
<option>
Ładowanie...
</option>
`;





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

select.innerHTML =

`
<option>
Błąd pobierania lokali
</option>
`;

return;

}







select.innerHTML =

`
<option value="">
Wybierz lokal
</option>
`;





if(!data || data.length===0){


select.innerHTML +=

`
<option>
Brak lokali dla tej lokalizacji
</option>
`;

return;

}





data.forEach(
lokal=>{


select.innerHTML +=

`
<option value="${lokal.id}">

${lokal.nazwa}
${lokal.mpk ? " - "+lokal.mpk:""}

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







select.innerHTML =

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



const documentData = {


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

document
.getElementById("year")
.value || null,



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

.update(documentData)

.eq(
"id",
editingDocumentId
);



}

else{


result =

await supabaseClient

.from("dokumenty")

.insert(
documentData
);



}







if(result.error){

alert(
result.error.message
);

return;

}




closeModal();



if(typeof loadDocuments==="function"){

loadDocuments();

}



}








// ===============================
// CZYSZCZENIE
// ===============================


function clearForm(){



document
.querySelectorAll(
"#modalOverlay input, #modalOverlay textarea"
)

.forEach(
el=>el.value=""
);





document
.getElementById("location")
.innerHTML=

`
<option>
Wybierz lokalizację
</option>
`;





document
.getElementById("local")
.innerHTML=

`
<option>
Najpierw wybierz lokalizację
</option>
`;



}







// ===============================
// ZAMKNIĘCIE
// ===============================


function closeModal(){


document
.getElementById("modalOverlay")
.classList
.add("hidden");



editingDocumentId=null;



}
