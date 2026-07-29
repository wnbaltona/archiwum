let documents = [];

let selectedLocation = "WSZYSTKIE";





const results =
document.getElementById("results");


const searchInput =
document.getElementById("searchInput");


const typeFilter =
document.getElementById("typeFilter");


const shelfFilter =
document.getElementById("shelfFilter");


const statusFilter =
document.getElementById("statusFilter");


const locationTabs =
document.getElementById("locationTabs");









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








document.addEventListener(
"DOMContentLoaded",
()=>{


loadDocuments();


});









// ======================
// POBIERANIE DANYCH
// ======================


async function loadDocuments(){



const {data,error}=

await supabaseClient

.from("dokumenty")

.select("*")

.order(
"created_at",
{
ascending:false
}
);







if(error){


console.error(error);


return;


}




documents=data || [];



updateDashboard();



createLocationTabs();



createFilters();



render();



}









// ======================
// DASHBOARD
// ======================


function updateDashboard(){





document
.getElementById("documentsCount")
.innerText=
documents.length;






const locs =
new Set(
documents.map(
d=>d.lokalizacja
)
);



document
.getElementById("locationsCount")
.innerText=
locs.size;








const month =
new Date()
.getMonth();





const current =
documents.filter(d=>{


if(!d.created_at)
return false;



return (
new Date(d.created_at)
.getMonth()
===month
);



});






document
.getElementById("monthCount")
.innerText=
current.length;








const missing =
documents.filter(
d=>
d.status==="Do uzupełnienia"
||
d.status==="Brak dokumentu"
);



document
.getElementById("missingCount")
.innerText=
missing.length;



}











// ======================
// LOKALIZACJE
// ======================


function createLocationTabs(){


locationTabs.innerHTML="";



locations.forEach(loc=>{


const button =
document.createElement("button");



button.innerText=loc;



button.onclick=()=>{


selectedLocation=loc;


render();


};



locationTabs.appendChild(button);



});



}









// ======================
// FILTRY
// ======================


function createFilters(){



const types =
[
...new Set(
documents
.map(d=>d.typ)
.filter(Boolean)
)
];



typeFilter.innerHTML=
`
<option value="">
Wszystkie typy
</option>
`;



types.forEach(t=>{


typeFilter.innerHTML +=

`
<option>
${t}
</option>
`;



});







const shelves =
[
...new Set(
documents
.map(d=>d.regal)
.filter(Boolean)
)
];




shelfFilter.innerHTML=
`
<option value="">
Wszystkie regały
</option>
`;




shelves.forEach(s=>{


shelfFilter.innerHTML+=

`
<option>
${s}
</option>

`;



});



}







typeFilter.onchange=render;

shelfFilter.onchange=render;

statusFilter.onchange=render;

searchInput.oninput=render;









// ======================
// RENDER
// ======================


function render(){



results.innerHTML="";



let filtered =
[...documents];







if(selectedLocation!=="WSZYSTKIE"){


filtered =
filtered.filter(
d=>
d.lokalizacja===selectedLocation
);


}






if(typeFilter.value){


filtered =
filtered.filter(
d=>
d.typ===typeFilter.value
);


}




if(shelfFilter.value){


filtered =
filtered.filter(
d=>
d.regal===shelfFilter.value
);


}




if(statusFilter.value){


filtered =
filtered.filter(
d=>
d.status===statusFilter.value
);


}








const search =
searchInput.value
.toLowerCase();





if(search){


filtered =
filtered.filter(
d=>

JSON.stringify(d)
.toLowerCase()
.includes(search)

);


}







if(filtered.length===0){


results.innerHTML=
`

<div class="archive-location">

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

.forEach(
([location,docs])=>{



const box =
document.createElement("div");


box.className=
"archive-location";







const header =
document.createElement("div");



header.className=
"archive-header";



header.innerHTML=

`

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


header.classList.toggle(
"open"
);


};









const locals={};



docs.forEach(doc=>{



const nr =
doc.numer_lokalu ||
"Brak numeru";



if(!locals[nr]){


locals[nr]=[];

}



locals[nr].push(doc);



});









Object.entries(locals)

.forEach(
([nr,items])=>{



const local =
document.createElement("div");



local.className=
"local-box";





local.innerHTML=

`

<h3>

Lokal ${nr}

</h3>

`;







items.forEach(doc=>{





const card =
document.createElement("div");



card.className=
"document";




card.innerHTML=

`

<strong>

${doc.nazwa || "-"}

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

Status:

<span class="status">

${doc.status || "OK"}

</span>

</p>



<p>

${doc.uwagi || ""}

</p>



<button class="edit">

Edytuj

</button>



<button class="delete">

Usuń

</button>


`;









card.querySelector(".edit")

.onclick=()=>{


openEditModal(doc);


};






card.querySelector(".delete")

.onclick=()=>{


deleteDocument(doc.id);


};








local.appendChild(card);



});





content.appendChild(local);



});








box.appendChild(header);

box.appendChild(content);


results.appendChild(box);



});



}









// ======================
// USUWANIE
// ======================


async function deleteDocument(id){



if(
!confirm(
"Czy usunąć dokument?"
)
)
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
"Błąd usuwania"
);


return;


}



loadDocuments();



}
