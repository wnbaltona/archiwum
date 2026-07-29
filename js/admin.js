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


});








// =======================
// DODAWANIE DOKUMENTU
// =======================


async function openAddModal(){



editingDocumentId = null;



clearForm();



document

.getElementById(
"modalTitle"
)

.innerText =

"Dodaj dokument";




await loadContractors();





document

.getElementById(
"modalOverlay"
)

.classList

.remove(
"hidden"
);



}









// =======================
// EDYCJA
// =======================


window.openEditModal =

async function(doc){



editingDocumentId =
doc.id;



document

.getElementById(
"modalTitle"
)

.innerText =

"Edytuj dokument";





await loadContractors();






document

.getElementById(
"location"
)

.value =

doc.lokalizacja || "";






await loadLocals(
doc.lokalizacja
);







document

.getElementById(
"local"
)

.value =

doc.numer_lokalu || "";






document

.getElementById(
"name"
)

.value =

doc.nazwa || "";






document

.getElementById(
"type"
)

.value =

doc.typ || "";







document

.getElementById(
"contractor"
)

.value =

doc.nazwa_kontrahenta || "";







document

.getElementById(
"year"
)

.value =

doc.rok || "";






document

.getElementById(
"shelf"
)

.value =

doc.regal || "";







document

.getElementById(
"level"
)

.value =

doc.polka || "";







document

.getElementById(
"folder"
)

.value =

doc.segregator || "";







document

.getElementById(
"status"
)

.value =

doc.status || "OK";







document

.getElementById(
"notes"
)

.value =

doc.uwagi || "";








document

.getElementById(
"modalOverlay"
)

.classList

.remove(
"hidden"
);



};









// =======================
// KONTRAHENCI
// =======================


async function loadContractors(){



const select =

document

.getElementById(
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

console.error(error);

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









// =======================
// LOKALE
// =======================


async function loadLocals(location){



const select =

document

.getElementById(
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







data.forEach(item=>{


select.innerHTML +=


`

<option value="${item.nazwa}">
${item.nazwa} (${item.mpk})
</option>

`;



});



}









// =======================
// ZAPIS
// =======================


async function saveDocument(){



const data = {


lokalizacja:

document

.getElementById(
"location"
)

.value,



numer_lokalu:

document

.getElementById(
"local"
)

.value,



nazwa:

document

.getElementById(
"name"
)

.value,



typ:

document

.getElementById(
"type"
)

.value,



regal:

document

.getElementById(
"shelf"
)

.value,



polka:

document

.getElementById(
"level"
)

.value,



segregator:

document

.getElementById(
"folder"
)

.value,



status:

document

.getElementById(
"status"
)

.value,



uwagi:

document

.getElementById(
"notes"
)

.value,



nazwa_kontrahenta:

document

.getElementById(
"contractor"
)

.value,



rok:

Number(

document

.getElementById(
"year"
)

.value

)

|| null



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

.insert([data]);



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









// =======================
// CZYSZCZENIE
// =======================


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







document

.getElementById(
"status"
)

.value="OK";






document

.getElementById(
"local"
)

.innerHTML =


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
