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







// =====================
// ODMIANA
// =====================


function documentText(number){

number = Number(number);



if(number === 1){

return "dokument";

}



if(
number % 10 >= 2 &&
number % 10 <=4 &&
(number %100 <12 || number %100 >14)

){

return "dokumenty";

}



return "dokumentów";

}










document.addEventListener(
"DOMContentLoaded",
()=>{


loadDocuments();


});









// =====================
// POBIERANIE
// =====================


async function loadDocuments(){



const {

data,

error

}= await supabaseClient

.from("dokumenty")

.select("*")

.order(
"rok",
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



const locations=[

"WSZYSTKIE",

...

new Set(

documents

.map(d=>d.lokalizacja)

.filter(Boolean)

)

];






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



button.className=
"location-card";



button.innerHTML=

`

<strong>
${location}
</strong>


<span>
${count} ${documentText(count)}
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



let types =

[

...

new Set(

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









let shelves =

[

...

new Set(

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
// WYŚWIETLANIE
// =====================


function render(){



results.innerHTML="";



let list=[...documents];






if(selectedLocation !== "WSZYSTKIE"){



list=list.filter(

d=>d.lokalizacja===selectedLocation

);


}








if(typeFilter.value){


list=list.filter(

d=>d.typ===typeFilter.value

);


}





if(shelfFilter.value){


list=list.filter(

d=>d.regal===shelfFilter.value

);


}






if(statusFilter.value){


list=list.filter(

d=>d.status===statusFilter.value

);


}







const search=

searchInput.value.toLowerCase();






if(search){



list=list.filter(d=>

JSON.stringify(d)

.toLowerCase()

.includes(search)

);



}







// dodatkowe sortowanie po roku

list.sort(

(a,b)=>

Number(b.rok || 0)

-

Number(a.rok || 0)

);







if(!list.length){



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

.forEach(([location,docs])=>{



const archive=

document.createElement("div");



archive.className=
"archive-location";







const header=

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
${docs.length} ${documentText(docs.length)}
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











// grupowanie lokali


const locals={};



docs.forEach(doc=>{



const nr=

doc.numer_lokalu || "Brak numeru";




if(!locals[nr]){


locals[nr]=[];

}


locals[nr].push(doc);



});









Object.entries(locals)

.forEach(([nr,docs])=>{



const localBox=

document.createElement("div");



localBox.className=
"local-box";



localBox.innerHTML=

`

<h3>
Lokal ${nr}
</h3>

`;









docs.forEach(doc=>{



const card=

document.createElement("div");



card.className=
"document";





card.innerHTML=

`

<strong>
${doc.nazwa}
</strong>


<p>
Kontrahent:
${doc.nazwa_kontrahenta || "-"}
</p>


<p>
Rok:
${doc.rok || "-"}
</p>


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
${doc.status || "-"}
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






localBox.appendChild(card);



});





content.appendChild(localBox);



});






archive.appendChild(header);

archive.appendChild(content);



results.appendChild(archive);



});



}









// =====================
// USUWANIE
// =====================


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

alert(error.message);

return;

}




loadDocuments();



}
