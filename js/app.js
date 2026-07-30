// ======================================
// ADMIN.JS
// DODAWANIE DOKUMENTÓW
// ======================================



// ======================================
// OTWIERANIE FORMULARZA
// ======================================


document.addEventListener(
"DOMContentLoaded",
()=>{


const addBtn =
document.getElementById("addBtn");


const modal =
document.getElementById("modalOverlay");


const closeBtn =
document.getElementById("closeModal");



if(addBtn){


addBtn.addEventListener(
"click",
()=>{


modal.classList.remove(
"hidden"
);


loadLocations();

loadContractors();


}

);


}



if(closeBtn){


closeBtn.addEventListener(
"click",
()=>{


modal.classList.add(
"hidden"
);


}

);


}




const location =
document.getElementById("location");



if(location){


location.addEventListener(
"change",
()=>{


loadLocals(
location.value
);


}

);


}




const save =
document.getElementById("saveBtn");



if(save){


save.addEventListener(
"click",
saveDocument
);


}



});






// ======================================
// LOKALIZACJE
// ======================================


function loadLocations(){



const select =
document.getElementById(
"location"
);



if(!select)
return;



const locations=[

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



select.innerHTML=`

<option value="">
Wybierz lokalizację
</option>

`;



locations.forEach(item=>{


select.innerHTML +=`

<option value="${item}">
${item}
</option>

`;

});


}






// ======================================
// LOKALE PO LOKALIZACJI
// ======================================


async function loadLocals(location){



const select =
document.getElementById(
"local"
);



if(!select)
return;



select.innerHTML=`

<option>
Ładowanie...
</option>

`;




const {
data,
error
}=await supabaseClient

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

select.innerHTML=`

<option>
Błąd pobierania lokali
</option>

`;

return;

}




select.innerHTML=`

<option value="">
Wybierz lokal
</option>

`;



data.forEach(local=>{


select.innerHTML +=`

<option value="${local.id}">

${local.nazwa}
${local.mpk ? " ("+local.mpk+")" : ""}

</option>

`;


});



}







// ======================================
// KONTRAHENCI
// ======================================


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
}=await supabaseClient

.from("kontrahenci")

.select("*")

.order(
"nazwa"
);




if(error){

console.error(error);

return;

}




select.innerHTML=`

<option value="">
Wybierz kontrahenta
</option>

`;




data.forEach(item=>{


select.innerHTML +=`

<option value="${item.id}">

${item.nazwa}

</option>

`;



});


}







// ======================================
// ZAPIS DOKUMENTU
// ======================================


async function saveDocument(){



const documentData={



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
).value.trim(),



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






if(!documentData.nazwa){


alert(
"Podaj nazwę dokumentu"
);


return;


}




const {
error
}=await supabaseClient

.from("dokumenty")

.insert([
documentData
]);





if(error){

console.error(error);

alert(error.message);

return;

}




alert(
"Dokument dodany"
);




document
.getElementById(
"modalOverlay"
)
.classList.add(
"hidden"
);



if(typeof loadDocuments==="function"){

loadDocuments();

}



}
