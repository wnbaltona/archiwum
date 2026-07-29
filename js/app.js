let documents = [];

let selectedLocation = "WSZYSTKIE";


const DEFAULT_LOCATIONS = [

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



document.addEventListener(
"DOMContentLoaded",
()=>{


loadDocuments();



document
.getElementById("searchInput")
?.addEventListener(
"input",
render
);



document
.getElementById("yearFilter")
?.addEventListener(
"change",
render
);



document
.getElementById("statusFilter")
?.addEventListener(
"change",
render
);



});







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
"rok",
{
ascending:false
}
);




if(error){

console.error(error);

return;

}




documents = data || [];



createLocations();

createYears();

render();



}









function createLocations(){



const box =

document.getElementById(
"locationTabs"
);



if(!box)
return;




box.innerHTML="";





const allLocations = [

"WSZYSTKIE",

...DEFAULT_LOCATIONS

];







allLocations.forEach(location=>{



let count;



if(location==="WSZYSTKIE"){


count = documents.length;


}

else{


count = documents.filter(doc=>

doc.lokalizacja===location

).length;


}






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






button.onclick=()=>{


selectedLocation =
location;



render();



};





box.appendChild(button);



});



}









function createYears(){



const select =

document.getElementById(
"yearFilter"
);



if(!select)
return;





const years =

[

...

new Set(

documents

.map(x=>x.rok)

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









function render(){



const results =

document.getElementById(
"results"
);



if(!results)
return;



results.innerHTML="";







let filtered =

[...documents];







if(
selectedLocation !== "WSZYSTKIE"
){


filtered = filtered.filter(doc=>

doc.lokalizacja === selectedLocation

);



}







const search =

document

.getElementById(
"searchInput"
)

?.value

.toLowerCase()

|| "";







if(search){


filtered = filtered.filter(doc=>

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


filtered = filtered.filter(doc=>

String(doc.rok)===year

);



}








const status =

document

.getElementById(
"statusFilter"
)

?.value;







if(status){


filtered = filtered.filter(doc=>

doc.status===status

);



}








const grouped={};







DEFAULT_LOCATIONS.forEach(location=>{


grouped[location]=[];


});






filtered.forEach(doc=>{


if(!grouped[doc.lokalizacja]){


grouped[doc.lokalizacja]=[];

}


grouped[doc.lokalizacja].push(doc);



});








Object.entries(grouped)

.forEach(
([location,docs])=>{



createLocationBox(
location,
docs,
results
);



});



}









function createLocationBox(
location,
docs,
container
){



const section =

document.createElement(
"div"
);



section.className =
"archive-location";





section.innerHTML =


`

<div class="archive-header">


<span class="arrow">
▶
</span>



<strong>
${location}
</strong>



<span class="counter">

${docs.length} dokumentów

</span>


</div>


<div class="location-content hidden">

</div>

`;








const header =

section.querySelector(
".archive-header"
);



const content =

section.querySelector(
".location-content"
);



const arrow =

section.querySelector(
".arrow"
);








header.onclick=()=>{


content.classList.toggle(
"hidden"
);



if(
content.classList.contains(
"hidden"
)

){


arrow.textContent="▶";


}

else{


arrow.textContent="▼";


}


};









const years={};





docs.forEach(doc=>{


const year =
doc.rok || "Brak roku";



if(!years[year]){


years[year]=[];

}



years[year].push(doc);



});








Object.entries(years)

.sort(
(a,b)=>b[0]-a[0]
)

.forEach(
([year,items])=>{





const yearBox =

document.createElement(
"div"
);



yearBox.className =
"year-box";





yearBox.innerHTML =


`

<h3>
${year}
</h3>

`;







items.forEach(doc=>{



const card =

document.createElement(
"div"
);



card.className =
"document";







card.innerHTML =


`

<h4>
${doc.nazwa || "-"}
</h4>


<p>
Lokal:
${doc.numer_lokalu || "-"}
</p>


<p>
Kontrahent:
${doc.nazwa_kontrahenta || "-"}
</p>


<p>
Typ:
${doc.typ || "-"}
</p>


<p>
Status:
${doc.status || "-"}
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







yearBox.appendChild(card);



});







content.appendChild(yearBox);



});






container.appendChild(section);



}










async function deleteDocument(id){



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



}
