// ===============================
// APP.JS
// ===============================


let documents = [];

let locations = [

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


let selectedLocation = "";

let expandedLocations = [];





document.addEventListener(
"DOMContentLoaded",
()=>{

loadDocuments();


});








// ===============================
// POBIERANIE DOKUMENTÓW
// ===============================


async function loadDocuments(){



const {

data,

error

}

=

await supabaseClient

.from("dokumenty")

.select(`

*,

lokale(

id,

nazwa,

mpk,

lokalizacja

),


kontrahenci(

id,

nazwa

)

`)

.order(
"lokalizacja"
);







if(error){

console.error(error);

return;

}





documents = data || [];





createLocationFilters();

createYearFilter();

renderDocuments();



}









// ===============================
// FILTRY LOKALIZACJI
// ===============================


function createLocationFilters(){



const box =
document.getElementById(
"locationTabs"
);



box.innerHTML="";






locations.forEach(
location=>{


const count =

documents.filter(
d=>

d.lokalizacja===location

)

.length;







const btn =
document.createElement(
"button"
);



btn.className =
"location-card";



btn.innerHTML =

`

<strong>
${location}
</strong>

<span>
${documentText(count)}
</span>

`;






btn.onclick = ()=>{


if(selectedLocation===location){

selectedLocation="";

}

else{

selectedLocation=location;

}



createLocationFilters();

renderDocuments();



};







box.appendChild(btn);



});



}









// ===============================
// WYŚWIETLANIE
// ===============================


function renderDocuments(){



const results =
document.getElementById(
"results"
);



results.innerHTML="";





let filtered=[...documents];





if(selectedLocation){


filtered =

filtered.filter(
d=>

d.lokalizacja===selectedLocation

);


}








const search =

document.getElementById(
"searchInput"
)

.value

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








locations.forEach(
location=>{


const docs =

filtered.filter(
d=>

d.lokalizacja===location

);






if(
selectedLocation &&
location!==selectedLocation
){

return;

}




renderLocation(
location,
docs
);



});



}









// ===============================
// BLOK LOKALIZACJI
// ===============================


function renderLocation(
location,
docs
){



const results =
document.getElementById(
"results"
);





const open =

expandedLocations.includes(
location
);





const div =
document.createElement(
"div"
);



div.className =
"archive-location";





div.innerHTML =


`

<div class="archive-header">

<span class="arrow">

${open ? "▼":"▶"}

</span>


<strong>
${location}
</strong>


<span class="counter">

${documentText(docs.length)}

</span>


</div>


<div class="location-content ${
open ? "" : "hidden"
}"></div>

`;








div
.querySelector(
".archive-header"
)

.onclick=()=>{


if(open){


expandedLocations =

expandedLocations.filter(
x=>x!==location
);


}

else{


expandedLocations.push(
location
);


}



renderDocuments();



};







const content =

div.querySelector(
".location-content"
);






if(!docs.length){


content.innerHTML=

`
<p>
Brak dokumentów
</p>
`;

}

else{



docs.forEach(
doc=>{


content.innerHTML +=


`

<div class="document">


<h4>
${doc.nazwa}
</h4>



<p>
Lokal:
${doc.lokale?.nazwa || "-"}
</p>



<p>
MPK:
${doc.lokale?.mpk || "-"}
</p>



<p>
Kontrahent:
${doc.kontrahenci?.nazwa || "-"}
</p>



<p>
Typ:
${doc.typ || "-"}
</p>



<p>
Rok:
${doc.rok || "-"}
</p>



<p>
Status:
${doc.status}
</p>



<p>
${doc.uwagi || ""}
</p>



<button 
class="edit"
onclick='openEditModal(${JSON.stringify(doc)})'>

Edytuj

</button>



<button 
class="delete"
onclick="deleteDocument('${doc.id}')">

Usuń

</button>


</div>


`;



});



}







results.appendChild(div);



}









// ===============================
// LATA
// ===============================


function createYearFilter(){



const select =
document.getElementById(
"yearFilter"
);



const years =

[

...new Set(

documents

.map(
d=>d.rok
)

.filter(Boolean)

)

]

.sort(
(a,b)=>b-a
);






select.innerHTML=

`

<option value="">
Wszystkie lata
</option>

`;





years.forEach(
year=>{


select.innerHTML +=

`

<option value="${year}">
${year}
</option>

`;



});



}









// ===============================
// USUWANIE
// ===============================


window.deleteDocument = async function(id){



if(
!confirm(
"Usunąć dokument?"
)

)

return;



const {

error

}

=

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



};









function documentText(number){


if(number===1){

return "1 dokument";

}


if(number>=2 && number<=4){

return number+" dokumenty";

}



return number+" dokumentów";


}








document.addEventListener(
"input",
e=>{


if(
e.target.id==="searchInput"
){

renderDocuments();

}


});





document.addEventListener(
"change",
e=>{


if(

e.target.id==="yearFilter"

)

{

renderDocuments();

}



});
