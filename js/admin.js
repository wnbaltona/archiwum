// ===============================
// ADMIN.JS
// ===============================


const DOCUMENT_LOCATIONS = [

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

loadLocals(
e.target.value
);

});


});









// ===============================
// OTWÓRZ DODAWANIE
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
// EDYCJA
// ===============================


window.openEditModal = async function(doc){



editingDocumentId =
doc.id;




await loadLocations();

await loadContractors();





document.getElementById(
"modalTitle"
).innerText =
"Edytuj dokument";





document.getElementById(
"location"
).value =
doc.lokalizacja || "";





await loadLocals(
doc.lokalizacja
);





document.getElementById(
"local"
).value =
doc.numer_lokalu || "";




document.getElementById(
"name"
).value =
doc.nazwa || "";



document.getElementById(
"type"
).value =
doc.typ || "";



document.getElementById(
"year"
).value =
doc.rok || "";



document.getElementById(
"contractor"
).value =
doc.nazwa_kontrahenta || "";



document.getElementById(
"shelf"
).value =
doc.regal || "";



document.getElementById(
"level"
).value =
doc.polka || "";



document.getElementById(
"folder"
).value =
doc.segregator || "";



document.getElementById(
"status"
).value =
doc.status || "OK";



document.getElementById(
"notes"
).value =
doc.uwagi || "";






document
.getElementById("modalOverlay")
.classList
.remove("hidden");



};









// ===============================
// LISTA LOKALIZACJI
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






DOCUMENT_LOCATIONS.forEach(
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
// LISTA LOKALI
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






const {

data,

error

}

=

await supabaseClient

.from("lokale")

.select("*")

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





select.innerHTML =


`

<option value="">
Wybierz lokal
</option>

`;







if(!data.length){


select.innerHTML +=


`

<option>
Brak lokali
</option>

`;

return;


}







data.forEach(
lokal=>{


select.innerHTML +=


`

<option value="${lokal.nazwa}">

${lokal.nazwa}

${lokal.mpk ? " ("+lokal.mpk+")" : ""}

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

.select("*")

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

<option value="${item.nazwa}">

${item.nazwa}

</option>

`;



});



}









// ===============================
// ZAPIS DOKUMENTU
// ===============================


async function saveDocument(){



const data = {


lokalizacja:

document.getElementById(
"location"
).value,



numer_lokalu:

document.getElementById(
"local"
).value,



nazwa:

document.getElementById(
"name"
).value.trim(),



typ:

document.getElementById(
"type"
).value.trim(),



rok:

document.getElementById(
"year"
).value || null,



nazwa_kontrahenta:

document.getElementById(
"contractor"
).value || null,



regal:

document.getElementById(
"shelf"
).value,



polka:

document.getElementById(
"level"
).value,



segregator:

document.getElementById(
"folder"
).value,



status:

document.getElementById(
"status"
).value,



uwagi:

document.getElementById(
"notes"
).value



};








let result;





if(editingDocumentId){



result = await supabaseClient

.from("dokumenty")

.update(data)

.eq(
"id",
editingDocumentId
);



}
else{


result = await supabaseClient

.from("dokumenty")

.insert(data);



}








if(result.error){

alert(result.error.message);

return;

}





closeModal();



if(
typeof loadDocuments==="function"
){

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
el=>{

el.value="";

}

);





document.getElementById(
"location"
).innerHTML=

`

<option>
Wybierz lokalizację
</option>

`;





document.getElementById(
"local"
).innerHTML=

`

<option>
Najpierw wybierz lokalizację
</option>

`;





document.getElementById(
"status"
).value="OK";



}









function closeModal(){



document

.getElementById(
"modalOverlay"
)

.classList

.add(
"hidden"
);



editingDocumentId=null;



}
