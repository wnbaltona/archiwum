// ===============================
// APP.JS
// ===============================


let documents = [];

let selectedLocation = "";

let openedLocations = [];







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

.select("*")

.order(
"lokalizacja"
);





if(error){

console.error(error);

return;

}





documents = data || [];



createLocationButtons();


fillYearFilter();


renderDocuments();



}









// ===============================
// LOKALIZACJE
// ===============================


function createLocationButtons(){


const box =
document.getElementById(
"locationTabs"
);



if(!box)
return;



const locations =

[

...new Set(

documents.map(

d=>d.lokalizacja

)

)

];





box.innerHTML="";





locations.forEach(location=>{


const count =

documents.filter(

d=>d.lokalizacja===location

).length;





const button =

document.createElement(
"button"
);



button.className =
"location-card";



button.innerHTML =

`

<strong>
${location}
</strong>

<span>
${count} dokumentów
</span>

`;





button.onclick = ()=>{


if(selectedLocation===location){


selectedLocation="";


button.classList.remove(
"active"
);



}

else{


selectedLocation=location;



document

.querySelectorAll(
".location-card"
)

.forEach(

b=>b.classList.remove(
"active"
)

);



button.classList.add(
"active"
);



}



renderDocuments();



};





box.appendChild(button);



});



}








// ===============================
// RENDER
// ===============================


function renderDocuments(){



const results =

document.getElementById(
"results"
);



if(!results)
return;






let filtered = [...documents];







// lokalizacja


if(selectedLocation){


filtered =

filtered.filter(

d=>

d.lokalizacja===selectedLocation

);



}






// wyszukiwarka


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

d=>

JSON.stringify(d)

.toLowerCase()

.includes(search)

);



}







// rok


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







// status


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








results.innerHTML="";






const grouped = {};





filtered.forEach(doc=>{


if(!grouped[doc.lokalizacja]){


grouped[doc.lokalizacja]=[];

}


grouped[doc.lokalizacja].push(doc);



});









Object.keys(grouped)

.sort()

.forEach(location=>{


createLocationBlock(

location,

grouped[location]

);



});



}









// ===============================
// ROZWIJANE LOKALIZACJE
// ===============================


function createLocationBlock(
location,
docs
){



const results =

document.getElementById(
"results"
);





const wrapper =

document.createElement(
"div"
);



wrapper.className =
"archive-location";







const opened =

openedLocations.includes(
location
);







wrapper.innerHTML =



`

<div class="archive-header">


<div class="arrow">

${opened ? "▼" : "▶"}

</div>



<strong>

${location}

</strong>


<div class="counter">

${docs.length}

</div>


</div>



<div class="location-content ${opened ? "" : "hidden"}">

</div>


`;






const header =

wrapper.querySelector(
".archive-header"
);





header.onclick=()=>{


if(
openedLocations.includes(location)
){


openedLocations =

openedLocations.filter(

x=>x!==location

);



}

else{


openedLocations.push(
location
);



}



renderDocuments();



};







const content =

wrapper.querySelector(
".location-content"
);







docs

.sort(

(a,b)=>

(b.rok||0)

-

(a.rok||0)

)

.forEach(doc=>{


content.innerHTML +=


`

<div class="document">


<h4>
${doc.nazwa}
</h4>



<p>
Typ: ${doc.typ}
</p>



<p>
Lokal: ${doc.numer_lokalu}
</p>



<p>
Kontrahent:
${doc.nazwa_kontrahenta || "-"}
</p>



<p>
Status:
${doc.status}
</p>



<button 
class="edit"
onclick='openEditModal(${JSON.stringify(doc)})'>

Edytuj

</button>



</div>

`;



});







results.appendChild(wrapper);



}









// ===============================
// LATA
// ===============================


function fillYearFilter(){



const select =

document

.getElementById(
"yearFilter"
);



if(!select)
return;





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

.sort();






select.innerHTML =


`

<option value="">
Wszystkie lata
</option>

`;






years.forEach(year=>{


select.innerHTML +=


`

<option value="${year}">
${year}
</option>

`;



});



}









// ===============================
// FILTRY
// ===============================


document.addEventListener(
"input",
e=>{


if(

e.target.id==="searchInput"

)

renderDocuments();



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

)

renderDocuments();



});
