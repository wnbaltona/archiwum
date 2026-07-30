// ======================================
// APP.JS
// STRONA GŁÓWNA ARCHIWUM
// ======================================


let documents = [];

let activeLocation = "";




// ======================================
// START
// ======================================

document.addEventListener(
"DOMContentLoaded",
()=>{

    loadDocuments();

});





// ======================================
// POBIERANIE DOKUMENTÓW
// ======================================


async function loadDocuments(){


const {
data,
error
}= await supabaseClient

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
"created_at",
{
ascending:false
}
);



if(error){

console.error(
"Dokumenty:",
error
);

return;

}



documents = data || [];



renderLocationCards();

renderDocuments();


}






// ======================================
// KARTY LOKALIZACJI
// ======================================


function renderLocationCards(){


const box =
document.getElementById(
"locationTabs"
);


if(!box)
return;



const locations = [

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



box.innerHTML="";



locations.forEach(location=>{


const count = documents.filter(doc=>

doc.lokale &&
doc.lokale.lokalizacja === location

).length;



box.innerHTML += `


<button 
class="location-card"
onclick="filterLocation('${location}')">


<strong>
${location}
</strong>


<span>
${formatDocuments(count)}
</span>


</button>


`;



});


}






// ======================================
// FILTR LOKALIZACJI
// ======================================


window.filterLocation=function(location){


if(activeLocation===location){

activeLocation="";

}
else{

activeLocation=location;

}



renderDocuments();


};






// ======================================
// WYŚWIETLANIE ARCHIWUM
// ======================================


function renderDocuments(){



const box =
document.getElementById(
"results"
);



if(!box)
return;



let data=[...documents];



if(activeLocation){


data=data.filter(doc=>

doc.lokale &&
doc.lokale.lokalizacja===activeLocation

);


}





const grouped={};



data.forEach(doc=>{


const location =
doc.lokale?.lokalizacja || "BRAK LOKALIZACJI";



if(!grouped[location]){

grouped[location]=[];

}



grouped[location].push(doc);



});





box.innerHTML="";



Object.keys(grouped)
.forEach(location=>{



const docs =
grouped[location];



box.innerHTML += `


<div class="archive-location">



<div 
class="archive-header"
onclick="toggleLocation('${location}')">


<span class="arrow">
▶
</span>


<strong>
${location}
</strong>


<span class="counter">
${formatDocuments(docs.length)}
</span>



</div>




<div 
id="location-${location}"
class="location-content hidden">


${renderDocumentList(docs)}


</div>



</div>



`;



});



}







// ======================================
// LISTA DOKUMENTÓW
// ======================================


function renderDocumentList(list){



if(!list.length)

return "<p>Brak dokumentów</p>";




return list.map(doc=>{


return `


<div class="document">


<h4>
${doc.nazwa || "Bez nazwy"}
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
Rok:
${doc.rok || "-"}
</p>



<p>
Status:
${doc.status || "-"}
</p>



<button
class="delete"
onclick="deleteDocument('${doc.id}')">

Usuń

</button>



</div>


`;



}).join("");



}







// ======================================
// ROZWIJANIE LOKALIZACJI
// ======================================


window.toggleLocation=function(location){



const box =
document.getElementById(
"location-"+location
);



if(!box)
