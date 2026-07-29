let documents = [];

let selectedLocation = "WSZYSTKIE";





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








// ==========================
// POBIERANIE DOKUMENTÓW
// ==========================


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

console.error(
"Błąd pobierania dokumentów:",
error
);

return;

}





documents=data || [];




createLocations();




createYearFilter();




render();



}









// ==========================
// LOKALIZACJE
// ==========================


function createLocations(){


const box =
document.getElementById(
"locationTabs"
);



if(!box)
return;




box.innerHTML="";






let locations=[

"WSZYSTKIE",

...LOCATIONS

];






documents.forEach(doc=>{


if(doc.lokalizacja){

locations.push(
doc.lokalizacja
);

}


});






locations=[

...new Set(locations)

];







locations.forEach(location=>{



const count =


location==="WSZYSTKIE"

?

documents.length

:

documents.filter(

doc=>

doc.lokalizacja===location

).length;







const button =
document.createElement(
"button"
);



button.className=
"location-card";





if(
selectedLocation===location
){

button.classList.add(
"active"
);

}





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


createLocations();


};






box.appendChild(button);



});



}









// ==========================
// FILTR LAT
// ==========================


function createYearFilter(){


const select =
document.getElementById(
"yearFilter"
);



if(!select)
return;





const years=[

...new Set(

documents

.map(doc=>doc.rok)

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





years.forEach(year=>{


select.innerHTML +=

`

<option value="${year}">
${year}
</option>

`;



});



}









// ==========================
// WYŚWIETLANIE
// ==========================


function render(){



const results =
document.getElementById(
"results"
);



if(!results)
return;





results.innerHTML="";





let list=[...documents];





// lokalizacja


if(
selectedLocation !== "WSZYSTKIE"
){


list=list.filter(

doc=>

doc.lokalizacja===selectedLocation

);


}







// wyszukiwarka


const search =

document

.getElementById(
"searchInput"
)

?.value

.toLowerCase()

.trim();






if(search){



list=list.filter(

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

?.value;





if(year){


list=list.filter(

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

?.value;





if(status){



list=list.filter(

doc=>

doc.status===status

);



}









if(!list.length){


results.innerHTML=

`

<div class="document">

Brak dokumentów

</div>

`;

return;

}










// sortowanie


list.sort(

(a,b)=>

Number(b.rok||0)

-

Number(a.rok||0)

);









// grupowanie


const grouped={};






list.forEach(doc=>{



const location=

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





const box=

document.createElement(
"div"
);



box.className=
"archive-location";








box.innerHTML=

`

<div class="archive-header">

${location}

</div>


<div class="archive-content">

</div>

`;







const content=

box.querySelector(
".archive-content"
);






box

.querySelector(
".archive-header"
)

.onclick=()=>{


box.classList.toggle(
"open"
);


};







const years={};






docs.forEach(doc=>{


const y=
doc.rok || "Brak roku";


if(!years[y]){

years[y]=[];

}



years[y].push(doc);



});






Object.entries(years)

.sort(

(a,b)=>Number(b[0])-Number(a[0])

)

.forEach(

([year,yearDocs])=>{





const yearBox=

document.createElement(
"div"
);



yearBox.className=
"year-box";




yearBox.innerHTML=

`

<h3>
${year}
</h3>

`;







yearDocs.forEach(doc=>{



const card=

document.createElement(
"div"
);



card.className=
"document";




card.innerHTML=

`

<h4>
${doc.nazwa}
</h4>


<p>
Lokal:
${doc.numer_lokalu}
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
Segregator:
${doc.segregator}
</p>


<p>
Status:
${doc.status}
</p>


<p>
Uwagi:
${doc.uwagi || "-"}
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






content.appendChild(yearBox);



});






results.appendChild(box);



});



}









// ==========================
// ODMIANA
// ==========================


function documentText(number){


if(number===1)

return "dokument";



if(

number%10>=2 &&

number%10<=4 &&

(number%100<12 || number%100>14)

)

return "dokumenty";



return "dokumentów";



}









// ==========================
// USUWANIE
// ==========================


async function deleteDocument(id){



if(
!confirm(
"Czy usunąć dokument?"
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
