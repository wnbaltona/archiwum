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
()=>{

loadLocals(
document.getElementById("location").value
);

}

);



loadLocations();


});






// ==================================
// OTWIERANIE DODAWANIA
// ==================================


function openAddModal(){


editingDocumentId=null;


clearForm();



document.getElementById(
"modalTitle"
).innerText=
"Dodaj dokument";



document
.getElementById("modalOverlay")
.classList
.remove("hidden");



}









// ==================================
// LOKALIZACJE
// ==================================


function loadLocations(){


const select =
document.getElementById(
"location"
);



if(!select)
return;




select.innerHTML=

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









// ==================================
// LOKALE
// ==================================


async function loadLocals(location){



const select =
document.getElementById(
"local"
);



if(!select)
return;





select.innerHTML=

`
<option value="">
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





select.innerHTML=

`
<option value="">
Wybierz lokal
</option>

`;





if(!data || data.length===0){


select.innerHTML=

`
<option value="">
Brak lokali dla tej lokalizacji
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










// ==================================
// EDYCJA
// ==================================


window.openEditModal=function(doc){


editingDocumentId=doc.id;




document
.getElementById("modalOverlay")
.classList
.remove("hidden");





document.getElementById(
"modalTitle"
).innerText=
"Edytuj dokument";







document.getElementById("location").value =
doc.lokalizacja;



loadLocals(
doc.lokalizacja
);



document.getElementById("local").value =
doc.numer_lokalu;



document.getElementById("name").value =
doc.nazwa;



document.getElementById("type").value =
doc.typ;



document.getElementById("year").value =
doc.rok || "";



document.getElementById("shelf").value =
doc.regal;



document.getElementById("level").value =
doc.polka;



document.getElementById("folder").value =
doc.segregator;



document.getElementById("contractor").value =
doc.nazwa_kontrahenta || "";



document.getElementById("status").value =
doc.status || "OK";



document.getElementById("notes").value =
doc.uwagi || "";



};









// ==================================
// ZAPIS
// ==================================


async function saveDocument(){



const fields=[

"location",
"local",
"name",
"type",
"shelf",
"level",
"folder"

];





for(
const field of fields
){



const element =
document.getElementById(field);



if(!element.value.trim()){


alert(
"Uzupełnij wszystkie wymagane pola"
);


element.focus();


return;


}



}







const documentData={



lokalizacja:

document.getElementById("location").value,



numer_lokalu:

document.getElementById("local").value,



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



status:

document.getElementById("status").value,



uwagi:

document.getElementById("notes").value,



nazwa_kontrahenta:

document.getElementById("contractor").value,



rok:

Number(
document.getElementById("year").value
)

};








let result;





if(editingDocumentId){


result=

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


result=

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
"Błąd zapisu: "
+
result.error.message
);


return;


}






closeModal();



if(
typeof loadDocuments === "function"
){

loadDocuments();

}



}










// ==================================
// ZAMYKANIE
// ==================================


function closeModal(){


document
.getElementById("modalOverlay")
.classList
.add("hidden");


}










function clearForm(){



document

.querySelectorAll(

"#modalOverlay input, #modalOverlay textarea"

)

.forEach(element=>{


element.value="";


});





document.getElementById("status").value="OK";



document.getElementById("local").innerHTML=

`
<option>
Najpierw wybierz lokalizację
</option>
`;



}
