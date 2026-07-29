let documents = [];

let selectedLocation = "WSZYSTKIE";



document.addEventListener(
"DOMContentLoaded",
()=>{

loadDocuments();

});




// ============================
// POBIERANIE DOKUMENTÓW
// ============================


async function loadDocuments(){


const {
data,
error
}=

await supabaseClient

.from("dokumenty")

.select(`

*,

lokale (

id,

mpk,

nazwa,

lokalizacja

),

kontrahenci (

id,

nazwa

)

`)

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



documents = data || [];



createLocations();


render();



}








// ============================
// STAŁE + BAZOWE LOKALIZACJE
// ============================


async function createLocations(){



const box =
document.getElementById(
"locationTabs"
);



if(!box)
return;



box.innerHTML="";





let locations = [


"WSZYSTKIE",

"WARSZAWA",

"OKĘCIE",

"RADOM",

"MODLIN",

"GDAŃSK",

"GDYNIA",

"ŚWINOUJŚCIE",

"BYDGOSZCZ",

"POZNAŃ",

"WROCŁAW",

"KRAKÓW",

"KATOWICE",

"RZESZÓW",

"ZIELONA GÓRA",

"FRANCJA"


];






// pobranie dodatkowych lokalizacji

const {
data,
error
}=

await supabaseClient

.from("lokale")

.select(
"lokalizacja"
);






if(!error && data){



data.forEach(item=>{


if(item.lokalizacja){


locations.push(
item.lokalizacja
);


}



});



}







locations=[

...

new Set(
locations
)

];







locations.forEach(location=>{


let count;



if(location==="WSZYSTKIE"){


count =
documents.length;



}else{



count =

documents.filter(doc=>{


return (

doc.lokalizacja===location

||

doc.lokale?.lokalizacja===location

);


}).length;



}







const button =
document.createElement(
"button"
);



button.className =
"location-card";





button.innerHTML = `

<strong>
${location}
</strong>

<span>
${count} ${documentText(count)}
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









// ============================
// ODMIANA
// ============================


function documentText(number){


if(number===1){

return "dokument";

}



if(

number % 10 >=2 &&

number % 10 <=4 &&

(number %100 <12 || number %100 >14)

){

return "dokumenty";

}



return "dokumentów";

}









// ============================
// WYŚWIETLANIE
// ============================


function render(){



const results =
document.getElementById(
"results"
);



if(!results)
return;



results.innerHTML="";




let list=[...documents];






if(selectedLocation!=="WSZYSTKIE"){



list = list.filter(doc=>{


return (

doc.lokalizacja===selectedLocation

||

doc.lokale?.lokalizacja===selectedLocation

);


});



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



list = list.filter(doc=>


JSON.stringify(doc)

.toLowerCase()

.includes(search)



);



}







if(!list.length){



results.innerHTML=

`

<div class="empty">

Brak dokumentów w tej lokalizacji

</div>

`;



return;

}








// sortowanie

list.sort(

(a,b)=>

Number(b.rok || 0)

-

Number(a.rok || 0)

);









const grouped={};





list.forEach(doc=>{



const location =

doc.lokale?.lokalizacja

||

doc.lokalizacja

||

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

<strong>

${location}

</strong>

</div>

`;








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

(a,b)=>

Number(b[0])-Number(a[0])

)

.forEach(

([year,yearDocs])=>{





const yearBox =
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



const card =

document.createElement(
"div"
);



card.className=
"document";






const localName =

doc.lokale

?

`${doc.lokale.nazwa} (${doc.lokale.mpk})`

:

doc.numer_lokalu || "-";








card.innerHTML=

`

<h4>
${doc.nazwa || "-"}
</h4>


<p>
Lokal:
${localName}
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
Regał:
${doc.regal || "-"}
</p>


<p>
Półka:
${doc.polka || "-"}
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








locationBox.appendChild(yearBox);



});






results.appendChild(locationBox);



});



}









// ============================
// USUWANIE
// ============================


async function deleteDocument(id){

    if(
        !confirm(
            "Czy na pewno usunąć dokument?"
        )
    ){
        return;
    }


    const {
        error
    } = await supabaseClient
        .from("dokumenty")
        .delete()
        .eq("id", id);



    if(error){

        alert(error.message);

        return;

    }


    loadDocuments();

}
