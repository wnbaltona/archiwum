let documents = [];

let selectedLocation = "WSZYSTKIE";





const DEFAULT_LOCATIONS = [


"WSZYSTKIE",

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

.getElementById(
"searchInput"
)

?.addEventListener(
"input",
render
);




document

.getElementById(
"yearFilter"
)

?.addEventListener(
"change",
render
);





document

.getElementById(
"statusFilter"
)

?.addEventListener(
"change",
render
);



});










// =========================
// POBIERANIE DOKUMENTÓW
// =========================


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







documents =
data || [];






createLocations();



createYears();



render();



}











// =========================
// LOKALIZACJE
// =========================


function createLocations(){



const box =

document.getElementById(
"locationTabs"
);



if(!box)
return;






box.innerHTML="";






DEFAULT_LOCATIONS.forEach(location=>{



let count=0;






if(location==="WSZYSTKIE"){


count =
documents.length;


}

else{



count =

documents.filter(doc=>

doc.lokalizacja === location

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











// =========================
// LATA
// =========================


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











// =========================
// RENDER
// =========================


function render(){



const results =

document.getElementById(
"results"
);



if(!results)
return;





results.innerHTML="";






let list =

[...documents];








if(selectedLocation !== "WSZYSTKIE"){



list =

list.filter(doc=>

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


list =

list.filter(doc=>

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


list =

list.filter(doc=>

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



list =

list.filter(doc=>

doc.status===status

);



}








if(!list.length){



results.innerHTML =


`

<div class="empty">

Brak dokumentów

</div>

`;

return;


}









const grouped={};







list.forEach(doc=>{



const location =

doc.lokalizacja ||

"Brak lokalizacji";






if(!grouped[location]){

grouped[location]=[];

}




grouped[location].push(doc);



});









Object.entries(grouped)

.forEach(
([location,docs])=>{





const box =

document.createElement(
"div"
);



box.className =
"archive-location";





box.innerHTML =


`

<div class="archive-header">

${location}

</div>

`;







const years={};








docs.forEach(doc=>{



if(!years[doc.rok]){

years[doc.rok]=[];

}



years[doc.rok].push(doc);



});









Object.entries(years)

.sort(
(a,b)=>b[0]-a[0]
)

.forEach(
([year,docs])=>{





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







docs.forEach(doc=>{



const card =

document.createElement(
"div"
);



card.className =
"document";







card.innerHTML =


`

<h4>

${doc.nazwa}

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
${doc.typ}
</p>



<p>
Regał:
${doc.regal}
</p>



<p>
Półka:
${doc.polka}
</p>



<p>
Status:
${doc.status}
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







yearBox.appendChild(card);



});






box.appendChild(yearBox);



});







results.appendChild(box);



});




}









// =========================
// USUWANIE
// =========================


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
