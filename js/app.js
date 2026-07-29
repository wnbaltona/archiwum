let documents = [];

let selectedLocation = "WSZYSTKIE";



const results = document.getElementById("results");

const searchInput = document.getElementById("searchInput");

const typeFilter = document.getElementById("typeFilter");

const shelfFilter = document.getElementById("shelfFilter");

const statusFilter = document.getElementById("statusFilter");

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






document.addEventListener(
"DOMContentLoaded",
()=>{

loadDocuments();

});







// =====================
// POBIERANIE DANYCH
// =====================


async function loadDocuments(){


const {

data,

error

}= await supabaseClient

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


createLocationTabs();

createFilters();

render();


}









// =====================
// LOKALIZACJE
// =====================


function createLocationTabs(){


locationTabs.innerHTML="";



locations.forEach(location=>{



const count =

location==="WSZYSTKIE"

?

documents.length

:

documents.filter(

d=>d.lokalizacja===location

).length;






const button =

document.createElement("button");



button.className="location-card";



button.innerHTML=

`

<strong>
${location}
</strong>

<span>
${count} dokumentów
</span>

`;





button.onclick=()=>{


selectedLocation=location;


render();


};






locationTabs.appendChild(button);



});



}









// =====================
// FILTRY
// =====================


function createFilters(){



let types = [

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





types.forEach(type=>{


typeFilter.innerHTML +=

`

<option>
${type}
</option>

`;


});








let shelves=[

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





shelves.forEach(shelf=>{


shelfFilter.innerHTML +=

`

<option>
${shelf}
</option>

`;


});



}






typeFilter.onchange=render;

shelfFilter.onchange=render;

statusFilter.onchange=render;

searchInput.oninput=render;









// =====================
// RENDER
// =====================


function render(){



results.innerHTML="";



let list=[...documents];





if(selectedLocation!=="WSZYSTKIE"){


list=list.filter(

d=>

d.lokalizacja===selectedLocation

);


}







if(typeFilter.value){


list=list.filter(

d=>

d.typ===typeFilter.value

);


}







if(shelfFilter.value){


list=list.filter(

d=>

d.regal===shelfFilter.value

);


}







if(statusFilter.value){


list=list.filter(

d=>

d.status===statusFilter.value

);


}







const search =

searchInput.value

.toLowerCase();






if(search){


list=list.filter(d=>

JSON.stringify(d)

.toLowerCase()

.includes(search)

);


}







if(list.length===0){


results.innerHTML=

`

<div class="empty">

Brak dokumentów

</div>

`;


return;


}







const grouped={};



list.forEach(doc=>{


if(!grouped[doc.lokalizacja]){


grouped[doc.lokalizacja]=[];

}


grouped[doc.lokalizacja].push(doc);



});







Object.entries(grouped)

.forEach(

([location,docs])=>{



const archive=

document.createElement("div");



archive.className="archive-location";







const header=

document.createElement("div");



header.className="archive-header";



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








const content=

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


let nr=

doc.numer_lokalu || "Brak numeru";



if(!locals[nr]){


locals[nr]=[];

}



locals[nr].push(doc);


});







Object.entries(locals)

.forEach(

([nr,docs])=>{



const localBox=

document.createElement("div");



localBox.className="local-box";





localBox.innerHTML=

`

<h3>
Lokal ${nr}
</h3>

`;






docs.forEach(doc=>{



const card=

document.createElement("div");



card.className="document";





card.innerHTML=

`

<strong>
${doc.nazwa}
</strong>


<p>
Typ: ${doc.typ || "-"}
</p>


<p>
Regał: ${doc.regal || "-"}
</p>


<p>
Półka: ${doc.polka || "-"}
</p>


<p>
Segregator: ${doc.segregator || "-"}
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








card
.querySelector(".edit")
.onclick=()=>{


openEditModal(doc);


};







card
.querySelector(".delete")
.onclick=()=>{


deleteDocument(doc.id);


};








localBox.appendChild(card);



});





content.appendChild(localBox);



});






archive.appendChild(header);

archive.appendChild(content);



results.appendChild(archive);



}

);




}









// =====================
// USUWANIE
// =====================


async function deleteDocument(id){



if(
!confirm(
"Czy na pewno usunąć dokument?"
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
