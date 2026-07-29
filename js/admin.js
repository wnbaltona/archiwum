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








// ======================
// LOKALIZACJE
// ======================


async function loadLocations(){


const select =
document.getElementById(
"location"
);


if(!select)
return;



const locations=[

"OKĘCIE",
"RADOM",
"MODLIN",
"BYDGOSZCZ",
"KRAKÓW",
"POZNAŃ",
"WROCŁAW",
"ŚWINOUJŚCIE",
"GDAŃSK",
"GDYNIA",
"ZIELONA GÓRA",
"RZESZÓW",
"FRANCJA",
"KATOWICE"

];



select.innerHTML=
`
<option value="">
Wybierz lokalizację
</option>
`;



locations.forEach(item=>{


select.innerHTML+=

`
<option value="${item}">
${item}
</option>

`;


});


}









// ======================
// LOKALE
// ======================


async function loadLocals(location){


const select =
document.getElementById(
"local"
);



select.innerHTML="";



const {
data,
error
}=

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

console.log(error);

return;

}




select.innerHTML=

`
<option value="">
Wybierz lokal
</option>
`;




data.forEach(local=>{


select.innerHTML+=

`
<option value="${local.nazwa}">
${local.nazwa} (${local.mpk})
</option>

`;



});



}









// ======================
// OTWARCIE
// ======================


function openAddModal(){


editingDocumentId=null;


clearForm();


document
.getElementById("modalTitle")
.innerText=
"Dodaj dokument";


document
.getElementById("modalOverlay")
.classList
.remove("hidden");


}









// ======================
// EDYCJA
// ======================


window.openEditModal=function(doc){


editingDocumentId=doc.id;



document
.getElementById("modalOverlay")
.classList
.remove("hidden");



document.getElementById("modalTitle")
.innerText=
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



document.getElementById("status").value =
doc.status;



document.getElementById("notes").value =
doc.uwagi || "";



};









// ======================
// ZAPIS
// ======================


async function saveDocument(){


const data={



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





for(let key in data){


if(
data[key]==="" ||
data[key]===null
){

alert(
"Uzupełnij wszystkie wymagane pola"
);

return;

}


}






let result;



if(editingDocumentId){


result=

await supabaseClient

.from("dokumenty")

.update(data)

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
[data]
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


loadDocuments();



}









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
.forEach(el=>{

el.value="";

});



}
