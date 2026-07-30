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
// POBIERANIE DANYCH
// ===============================


async function loadDocuments(){



const {
data:docs,
error:docError
}

=
await supabaseClient

.from("dokumenty")

.select("*")

.order(
"lokalizacja"
);





if(docError){

console.error(docError);

return;

}







const {
data:locs,
error:locError
}

=
await supabaseClient

.from("lokale")

.select("lokalizacja")

.order(
"lokalizacja"
);







if(locError){

console.error(locError);

return;

}







documents = docs || [];







const databaseLocations = [

...new Set(

locs.map(
x=>x.lokalizacja
)

)

]
.filter(Boolean);



locations = [

...new Set(

[
...locations,
...databaseLocations

]

)

]

.sort();





createLocationFilters();

createYearFilter();

renderDocuments();



}









// ===============================
// KAFELKI LOKALIZACJI
// ===============================


function createLocationFilters(){



const container =

document.getElementById(
"locationTabs"
);





if(!container)
return;





container.innerHTML="";







locations.forEach(
location=>{



const count =

documents.filter(

d=>

d.lokalizacja===location

)

.length;







const button =

document.createElement(
"button"
);







button.className =
"location-card";







if(selectedLocation===location){

button.classList.add(
"active"
);

}







button.innerHTML =

`

<strong>
${location}
</strong>

<span>
${documentText(count)}
</span>

`;







button.onclick = ()=>{



if(selectedLocation===location){


selectedLocation="";


}

else{


selectedLocation=location;


}




createLocationFilters();

renderDocuments();



};







container.appendChild(
button
);



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








let filtered =

[...documents];







if(selectedLocation){



filtered =

filtered.filter(

d=>

d.lokalizacja===selectedLocation

);



}







const search =

document

.getElementById(
"searchInput"
)

?.value

.toLowerCase();








if(search){



filtered =

filtered.filter(

doc=>

JSON.stringify(doc)

.toLowerCase()

.includes(search)

);



}







const year =

document

.getElementById(
"yearFilter"
)

?.value;








if(year){



filtered =

filtered.filter(

d=>

String(d.rok)===year

);



}







const status =

document

.getElementById(
"statusFilter"
)

?.value;







if(status){



filtered =

filtered.filter(

d=>

d.status===status

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
// ROZWIJANE BLOKI
// ===============================


function renderLocation(
location,
docs
){



const results =

document.getElementById(
"results"
);






const opened =

expandedLocations.includes(
location
);







const box =

document.createElement(
"div"
);



box.className =
"archive-location";






box.innerHTML =


`

<div class="archive-header">


<div class="arrow">

${opened ? "▼" : "▶"}

</div>



<strong>
${location}
</strong>



<div class="counter">

${documentText(docs.length)}

</div>


</div>



<div class="location-content ${
opened ? "" : "hidden"
}">


</div>

`;








box

.querySelector(
".archive-header"
)

.onclick = ()=>{



if(
expandedLocations.includes(location)
){


expandedLocations =

expandedLocations.filter(

x=>

x!==location

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

box.querySelector(
".location-content"
);









if(docs.length===0){


content.innerHTML =

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

${doc.nazwa || "Bez nazwy"}

</h4>



<p>
Typ:
${doc.typ || "-"}
</p>



<p>
Lokal:
${doc.numer_lokalu || "-"}
</p>



<p>
Kontrahent:
${doc.nazwa_kontrahenta || "-"}
</p>



<p>
Status:
${doc.status || "-"}
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







results.appendChild(
box
);



}









// ===============================
// LATA
// ===============================


function createYearFilter(){



const select =

document.getElementById(
"yearFilter"
);





if(!select)
return;







const years = [

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








select.innerHTML =

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
// USUWANIE DOKUMENTU
// ===============================


window.deleteDocument =

async function(id){



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









// ===============================
// FILTRY
// ===============================


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

[
"yearFilter",
"statusFilter"

]

.includes(
e.target.id

)

){


renderDocuments();



}



});









// ===============================
// ODMIANA
// ===============================


function documentText(number){



if(number===1){

return "1 dokument";

}



if(
number>=2 &&
number<=4
){

return number+" dokumenty";

}



return number+" dokumentów";



}
