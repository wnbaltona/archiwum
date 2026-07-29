let documents = [];

let selectedLocation = "WSZYSTKIE";




// START

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
"rok",
{
ascending:false
}
);





if(error){

console.error(
"Błąd pobierania:",
error
);

return;

}





documents=data || [];



createLocations();


render();



}









// ===============================
// FILTRY LOKALIZACJI
// ===============================


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




// dodaj lokalizacje z bazy

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






box.appendChild(button);



});




}










// ===============================
// ODMIANA
// ===============================


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









// ===============================
// WYŚWIETLANIE
// ===============================


function render(){



const results =
document.getElementById(
"results"
);



if(!results)
return;




results.innerHTML="";




let list=[...documents];






// filtr lokalizacji


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






if(!list.length){


results.innerHTML=

`

<div class="empty">

Brak dokumentów

</div>

`;

return;


}







// sortowanie po roku

list.sort(

(a,b)=>

Number(b.rok || 0)

-

Number(a.rok || 0)

);









// grupowanie lokalizacja


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





const locationBox =

document.createElement(
"div"
);



locationBox.className=
"archive-location";






locationBox.innerHTML=

`

<div class="archive-header">

${location}

</div>

`;









// grupowanie rok


const years={};





docs.forEach(doc=>{


const year=

doc.rok || "Brak roku";



if(!years[year])

years[year]=[];



years[year].push(doc);



});








Object.entries(years)

.sort(

(a,b)=>

Number(b[0])

-

Number(a[0])

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
Lokalizacja:
${doc.lokalizacja}
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
Rok:
${doc.rok || "-"}
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

.onclick=

()=>{

openEditModal(doc);

};







card

.querySelector(".delete")

.onclick=

()=>{

deleteDocument(doc.id);

};






yearBox.appendChild(card);



});





locationBox.appendChild(yearBox);



});





results.appendChild(locationBox);



});




}









// ===============================
// USUWANIE
// ===============================


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


alert(
error.message
);


return;

}



loadDocuments();



}
