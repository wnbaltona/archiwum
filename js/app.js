// ===============================
// APP.JS
// ===============================


let documents = [];

let selectedLocation = "";

let expandedLocations = [];




// START

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
.order("lokalizacja");





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


const container =
document.getElementById(
"locationTabs"
);



if(!container)
return;



container.innerHTML="";




const locations = [

...new Set(

documents.map(
d=>d.lokalizacja
)

)

]
.filter(Boolean)
.sort();





locations.forEach(location=>{


const count =

documents.filter(
d=>d.lokalizacja===location
)
.length;





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
b=>
b.classList.remove(
"active"
)
);



button.classList.add(
"active"
);



}



renderDocuments();



};







container.appendChild(
button
);



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





let filtered =
[...documents];






// lokalizacja


if(selectedLocation){


filtered =

filtered.filter(
doc=>

doc.lokalizacja===selectedLocation

);


}





// wyszukiwanie


const search =

document

.getElementById(
"searchInput"
)

.value

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






// rok


const year =

document

.getElementById(
"yearFilter"
)

.value;





if(year){


filtered =

filtered.filter(
doc=>

String(doc.rok)===year

);


}






// status


const status =

document

.getElementById(
"statusFilter"
)

.value;





if(status){


filtered =

filtered.filter(
doc=>

doc.status===status

);



}







results.innerHTML="";






const grouped={};






filtered.forEach(doc=>{


if(!grouped[doc.lokalizacja]){

grouped[doc.lokalizacja]=[];

}


grouped[doc.lokalizacja].push(doc);



});







Object

.keys(grouped)

.sort()

.forEach(location=>{


renderLocation(
location,
grouped[location]
);



});



}









// ===============================
// ROZWIJANE LOKALIZACJE
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

${docs.length}

</div>


</div>



<div class="location-content ${opened ? "" : "hidden"}">

</div>

`;








box
.querySelector(
".archive-header"
)

.onclick=()=>{


if(
expandedLocations.includes(location)
){


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

box.querySelector(
".location-content"
);







docs.forEach(doc=>{


content.innerHTML +=


`

<div class="document">


<h4>

${doc.nazwa}

</h4>


<p>
Typ:
${doc.typ}
</p>


<p>
Lokal:
${doc.numer_lokalu}
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





results.appendChild(box);



}









// ===============================
// FILTR LAT
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
// NASŁUCH FILTRÓW
// ===============================


document.addEventListener(
"input",
(e)=>{


if(
e.target.id==="searchInput"
){

renderDocuments();

}



});






document.addEventListener(
"change",
(e)=>{


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