let documents = [];

let selectedLocation = "WSZYSTKIE";

let editingId = null;



const results = document.getElementById("results");

const searchInput = document.getElementById("searchInput");

const typeFilter = document.getElementById("typeFilter");

const shelfFilter = document.getElementById("shelfFilter");

const locationTabs = document.getElementById("locationTabs");



const locations = [

"WSZYSTKIE",

"OKĘCIE",

"RADOM",

"MODLIN",

"SONATA",

"RZESZÓW",

"KATOWICE",

"KRAKÓW",

"ZIELONA GÓRA",

"FRANCJA",

"BYDGOSZCZ",

"POZNAŃ",

"WROCŁAW"

];





// ================================
// START
// ================================


document.addEventListener(
"DOMContentLoaded",
()=>{

loadDocuments();

});







// ================================
// POBIERANIE DANYCH
// ================================


async function loadDocuments(){


const {data,error}=await supabaseClient

.from("dokumenty")

.select("*")

.order("lokalizacja");





if(error){


console.error(error);


results.innerHTML=`

<div class="location">

Błąd pobierania danych.

</div>

`;


return;


}





documents=data || [];



createLocationTabs();


createFilters();


render();


}







// ================================
// ZAKŁADKI LOKALIZACJI
// ================================


function createLocationTabs(){


locationTabs.innerHTML="";



locations.forEach(location=>{



const btn=
document.createElement("button");



btn.textContent=location;



btn.onclick=()=>{


selectedLocation=location;


render();


};





locationTabs.appendChild(btn);



});


}









// ================================
// FILTRY
// ================================


function createFilters(){



const types=[

...new Set(

documents

.map(d=>d.typ)

.filter(Boolean)

)

];



typeFilter.innerHTML=`

<option value="">

Wszystkie typy

</option>

`;




types.forEach(type=>{


typeFilter.innerHTML+=`

<option value="${type}">
${type}
</option>

`;



});








const shelves=[

...new Set(

documents

.map(d=>d.regal)

.filter(Boolean)

)

];





shelfFilter.innerHTML=`

<option value="">

Wszystkie regały

</option>

`;





shelves.forEach(regal=>{


shelfFilter.innerHTML+=`

<option value="${regal}">
${regal}
</option>

`;



});




}






typeFilter.addEventListener(
"change",
render
);


shelfFilter.addEventListener(
"change",
render
);


searchInput.addEventListener(
"input",
render
);









// ================================
// RENDER
// ================================


function render(){



results.innerHTML="";



let filtered=[...documents];






if(selectedLocation!=="WSZYSTKIE"){


filtered=
filtered.filter(
d=>d.lokalizacja===selectedLocation
);


}







if(typeFilter.value){


filtered=
filtered.filter(
d=>d.typ===typeFilter.value
);


}







if(shelfFilter.value){


filtered=
filtered.filter(
d=>d.regal===shelfFilter.value
);


}








const search =
searchInput.value
.toLowerCase();






if(search){


filtered =
filtered.filter(doc=>


JSON.stringify(doc)

.toLowerCase()

.includes(search)


);


}







if(filtered.length===0){


results.innerHTML=`

<div class="location">

Brak dokumentów

</div>

`;

return;

}









const grouped={};





filtered.forEach(doc=>{


if(!grouped[doc.lokalizacja]){


grouped[doc.lokalizacja]=[];

}


grouped[doc.lokalizacja]
.push(doc);



});









Object.entries(grouped)

.forEach(([location,docs])=>{






const locationBox =
document.createElement("div");


locationBox.className=
"archive-location";







const header =
document.createElement("div");



header.className=
"archive-header";




header.innerHTML=`

<div>

<strong>
${location}
</strong>

<span>
${docs.length} dokumentów
</span>


</div>


<div class="arrow">

▼

</div>

`;







const content =
document.createElement("div");



content.className=
"archive-content hidden";








header.onclick=()=>{


content.classList.toggle(
"hidden"
);



header
.classList.toggle(
"open"
);



};











// GRUPA LOKALI


const locals={};





docs.forEach(doc=>{



const local =
doc.numer_lokalu ||
"Brak numeru";



if(!locals[local]){


locals[local]=[];

}



locals[local]
.push(doc);



});









Object.entries(locals)

.forEach(([local,items])=>{






const localBox =
document.createElement("div");



localBox.className=
"local-box";




localBox.innerHTML=`

<h3>

Lokal ${local}

</h3>

`;









items.forEach(doc=>{





const card =
document.createElement("div");



card.className=
"document";





card.innerHTML=`

<strong>

${doc.nazwa || "Brak nazwy"}

</strong>


<p>
Typ:
${doc.typ || "-"}
</p>


<p>
Regał:
${doc.regal || "-"}
</p>


<p>
Półka:
${doc.polka || "-"}
</p>


<p>
Segregator:
${doc.segregator || "-"}
</p>



<p>
Uwagi:
${doc.uwagi || "-"}
</p>



<button class="edit-btn">

Edytuj

</button>


<button class="delete-btn">

Usuń

</button>


`;








card
.querySelector(".edit-btn")
.onclick=()=>{


editDocument(doc.id);


};





card
.querySelector(".delete-btn")
.onclick=()=>{


deleteDocument(doc.id);


};








localBox.appendChild(card);



});







content.appendChild(localBox);



});






locationBox.appendChild(header);


locationBox.appendChild(content);




results.appendChild(locationBox);



});



}









// ================================
// EDYCJA
// ================================


function editDocument(id){


const doc =
documents.find(
d=>d.id==id
);



if(!doc)
return;




editingId=id;



document
.getElementById("modalOverlay")
.classList.remove("hidden");



document
.getElementById("modalTitle")
.innerText=
"Edytuj dokument";



document
.getElementById("saveBtn")
.innerText=
"Zapisz zmiany";




location.value=
doc.lokalizacja || "";


number.value=
doc.numer_lokalu || "";


name.value=
doc.nazwa || "";


type.value=
doc.typ || "";


shelf.value=
doc.regal || "";


level.value=
doc.polka || "";


folder.value=
doc.segregator || "";


notes.value=
doc.uwagi || "";



}









// ================================
// USUWANIE
// ================================


async function deleteDocument(id){



const confirmDelete =
confirm(
"Czy na pewno usunąć dokument?"
);



if(!confirmDelete)
return;






const {error}=

await supabaseClient

.from("dokumenty")

.delete()

.eq(
"id",
id
);







if(error){


alert(
"Nie udało się usunąć dokumentu"
);


console.error(error);


return;


}




loadDocuments();



}
