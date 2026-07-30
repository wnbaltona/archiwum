// ===============================
// ADMIN.JS
// ===============================


const LOCATIONS = [

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
e=>{

loadLocals(
e.target.value
);

});


});







// ===============================
// DODAJ
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
loc=>{


select.innerHTML +=

`
<option value="${loc}">
${loc}
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







data.forEach(
lokal=>{


select.innerHTML +=


`
<option value="${lokal.id}">

${lokal.nazwa}

${lokal.mpk ? " - MPK "+lokal.mpk : ""}

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

document.getElementById(
"location"
).value,



lokal_id:

document.getElementById(
"local"
).value || null,



kontrahent_id:

document.getElementById(
"contractor"
).value || null,



nazwa:

document.getElementById(
"name"
).value,



typ:

document.getElementById(
"type"
).value,



rok:

Number(
document.getElementById(
"year"
).value
)
|| null,



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



if(typeof loadDocuments==="function"){

loadDocuments();

}



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
"location"
).value =
doc.lokalizacja;



await loadLocals(
doc.lokalizacja
);



document.getElementById(
"local"
).value =
doc.lokal_id || "";



document.getElementById(
"contractor"
).value =
doc.kontrahent_id || "";



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









function clearForm(){


document
.querySelectorAll(
"#modalOverlay input, textarea"
)
.forEach(
el=>el.value=""
);


document.getElementById(
"local"
).innerHTML=

`
<option>
Najpierw wybierz lokalizację
</option>
`;



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
