let editingDocumentId = null;



document.addEventListener(
"DOMContentLoaded",
()=>{


document
.getElementById("addBtn")
?.addEventListener(
"click",
openAddModal
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



loadDocumentLocations();

loadContractors();


});






// =================================
// LOKALIZACJE W FORMULARZU
// =================================


function loadDocumentLocations(){


const select =
document.getElementById(
"location"
);



if(!select)
return;




select.innerHTML =

`
<option value="">
Wybierz lokalizację
</option>
`;





LOCATIONS.forEach(location=>{


select.innerHTML +=

`
<option value="${location}">
${location}
</option>
`;


});


}







// =================================
// KONTRAHENCI
// =================================


async function loadContractors(){



const select =
document.getElementById(
"contractor"
);



if(!select)
return;





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

console.error(
"Błąd pobierania kontrahentów:",
error
);

return;

}





select.innerHTML =

`
<option value="">
Wybierz kontrahenta
</option>
`;






data.forEach(item=>{


select.innerHTML +=

`
<option value="${item.nazwa}">
${item.nazwa}
</option>
`;



});


}







// =================================
// OTWIERANIE DODAWANIA
// =================================


function openAddModal(){



editingDocumentId = null;



clearForm();



document
.getElementById(
"modalTitle"
)
.innerText =
"Dodaj dokument";





document
.getElementById(
"modalOverlay"
)
.classList
.remove(
"hidden"
);



}








// =================================
// LOKALE WG LOKALIZACJI
// =================================


async function loadLocals(location){



const select =
document.getElementById(
"local"
);



if(!select)
return;






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







if(!data || data.length===0){


select.innerHTML =

`
<option>
Brak dodanych lokali
</option>
`;

return;


}







data.forEach(local=>{


select.innerHTML +=

`
<option value="${local.nazwa}">
${local.nazwa} (${local.mpk})
</option>
`;



});



}









// =================================
// EDYCJA
// =================================


window.openEditModal = function(doc){



editingDocumentId = doc.id;



document
.getElementById(
"modalOverlay"
)
.classList
.remove(
"hidden"
);





document
.getElementById(
"modalTitle"
)
.innerText =
"Edytuj dokument";





document.getElementById(
"location"
).value =
doc.lokalizacja || "";




loadLocals(
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



};









// =================================
// ZAPIS DOKUMENTU
// =================================


async function saveDocument(){



const documentData = {


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
).value,



typ:

document.getElementById(
"type"
).value,



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
).value,



nazwa_kontrahenta:

document.getElementById(
"contractor"
).value,



rok:

Number(
document.getElementById(
"year"
).value
)
||
null


};








let result;





if(editingDocumentId){


result =

await supabaseClient

.from("dokumenty")

.update(
documentData
)

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
[
documentData
]
);



}







if(result.error){


alert(
"Błąd zapisu dokumentu: "
+
result.error.message
);


return;


}






closeModal();



loadDocuments();



}









// =================================
// ZAMKNIĘCIE
// =================================


function closeModal(){


document

.getElementById(
"modalOverlay"
)

.classList

.add(
"hidden"
);



}








function clearForm(){



document

.querySelectorAll(
"#modalOverlay input, #modalOverlay textarea"
)

.forEach(
element=>{

element.value="";

}

);





document.getElementById(
"status"
).value="OK";





document.getElementById(
"local"
).innerHTML =

`
<option>
Najpierw wybierz lokalizację
</option>
`;



}
