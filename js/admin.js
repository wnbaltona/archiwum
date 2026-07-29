let editingDocumentId = null;



document.addEventListener(
"DOMContentLoaded",
()=>{


const addBtn =
document.getElementById("addBtn");


const closeBtn =
document.getElementById("closeModal");


const saveBtn =
document.getElementById("saveBtn");


const locationSelect =
document.getElementById("location");




if(addBtn){

addBtn.onclick = () => {

openAddModal();

};

}





if(closeBtn){

closeBtn.onclick = () => {

closeModal();

};

}






if(saveBtn){

saveBtn.onclick = () => {

saveDocument();

};

}






if(locationSelect){

locationSelect.onchange = () => {

loadLocals(
locationSelect.value
);

};

}






loadLocations();

loadContractors();



});








// =================================
// OTWIERANIE DODAWANIA
// =================================


function openAddModal(){


editingDocumentId=null;



clearForm();



document.getElementById(
"modalTitle"
).innerText="Dodaj dokument";



document.getElementById(
"modalOverlay"
)
.classList
.remove("hidden");



}









// =================================
// EDYCJA - GLOBALNA
// =================================


window.openEditModal = async function(doc){


editingDocumentId = doc.id;



document.getElementById(
"modalOverlay"
)
.classList
.remove("hidden");



document.getElementById(
"modalTitle"
)
.innerText="Edytuj dokument";





document.getElementById("name").value =
doc.nazwa || "";

document.getElementById("type").value =
doc.typ || "";

document.getElementById("year").value =
doc.rok || "";

document.getElementById("shelf").value =
doc.regal || "";

document.getElementById("level").value =
doc.polka || "";

document.getElementById("folder").value =
doc.segregator || "";

document.getElementById("status").value =
doc.status || "OK";

document.getElementById("notes").value =
doc.uwagi || "";





if(doc.lokale){


document.getElementById(
"location"
)
.value =
doc.lokale.lokalizacja;



await loadLocals(
doc.lokale.lokalizacja
);



document.getElementById(
"local"
)
.value =
doc.lokale.id;



}



};









// =================================
// LOKALIZACJE
// =================================


async function loadLocations(){


const select =
document.getElementById(
"location"
);



if(!select)
return;




let locations = [

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







const {
data
}
=
await supabaseClient

.from("lokale")

.select(
"lokalizacja"
);





if(data){


data.forEach(item=>{


if(item.lokalizacja){

locations.push(
item.lokalizacja
);

}


});


}







locations=[

...new Set(locations)

];







select.innerHTML=

`

<option value="">
Wybierz lokalizację
</option>

`;






locations.forEach(location=>{


select.innerHTML +=

`

<option value="${location}">

${location}

</option>

`;



});



}









// =================================
// LOKALE
// =================================


async function loadLocals(location){


const select =
document.getElementById(
"local"
);



if(!select)
return;




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





if(!data || data.length===0){


select.innerHTML=

`

<option value="">
Brak lokali
</option>

`;

return;


}








data.forEach(local=>{


select.innerHTML +=

`

<option value="${local.id}">

${local.nazwa} (${local.mpk})

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

data

}

=

await supabaseClient

.from("kontrahenci")

.select("*")

.order(
"nazwa"
);






select.innerHTML=

`

<option value="">
Wybierz kontrahenta
</option>

`;






if(data){


data.forEach(item=>{


select.innerHTML +=

`

<option value="${item.id}">

${item.nazwa}

</option>

`;



});


}



}









// =================================
// ZAPIS
// =================================


async function saveDocument(){



const required=[


"location",
"local",
"name",
"type",
"year",
"shelf",
"level",
"folder"

];





let ok=true;




required.forEach(id=>{


const field =
document.getElementById(id);



if(!field.value){


field.classList.add(
"invalid"
);


ok=false;


}else{


field.classList.remove(
"invalid"
);


}


});






if(!ok){


alert(
"Uzupełnij wszystkie wymagane pola"
);


return;


}







const documentData={


lokal_id:

Number(
document.getElementById("local").value
),



kontrahent_id:

document.getElementById("contractor").value
?
Number(
document.getElementById("contractor").value
)
:
null,



nazwa:

document.getElementById("name").value,



typ:

document.getElementById("type").value,



rok:

Number(
document.getElementById("year").value
),



regal:

document.getElementById("shelf").value,



polka:

document.getElementById("level").value,



segregator:

document.getElementById("folder").value,



status:

document.getElementById("status").value,



uwagi:

document.getElementById("notes").value



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



}else{


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

"Błąd zapisu: "

+

result.error.message

);


return;


}







alert(
"Dokument zapisany"
);



closeModal();



if(typeof loadDocuments==="function"){


loadDocuments();


}



}









// =================================
// ZAMYKANIE
// =================================


function closeModal(){


document.getElementById(
"modalOverlay"
)

.classList

.add(
"hidden"
);


}









function clearForm(){



document.querySelectorAll(

"#modalOverlay input, #modalOverlay textarea"

)

.forEach(el=>{


el.value="";


});





document.getElementById(
"local"
)

.innerHTML=

`

<option>
Najpierw wybierz lokalizację
</option>

`;



}
