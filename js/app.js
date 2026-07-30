// ===============================
// APP.JS
// ===============================


let documents = [];

let selectedLocation = "";

let openedLocations = [];



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





document.addEventListener(
"DOMContentLoaded",
()=>{


loadDocuments();


document
.getElementById("searchInput")
?.addEventListener(
"input",
renderDocuments
);



document
.getElementById("yearFilter")
?.addEventListener(
"change",
renderDocuments
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

.select(`

*,

lokale!lokal_id(

id,

nazwa,

mpk,

lokalizacja

),

kontrahenci!kontrahent_id(

id,

nazwa

)

`)

.order(
"lokalizacja"
);





if(error){

console.error(error);

alert(
"Błąd pobierania dokumentów"
);

return;

}





documents=data || [];



createLocationButtons();

createYears();

renderDocuments();



}









// ===============================
// PRZYCISKI LOKALIZACJI
// ===============================


function createLocationButtons(){


const box =
document.getElementById(
"locationTabs"
);



box.innerHTML="";





locations.forEach(
location=>{


const count =
documents.filter(
d=>d.lokalizacja===location
)
.length;





const button =
document.createElement(
"button"
);



button.className="location-card";



button.innerHTML=

`
<strong>
${location}
</strong>

<span>
${count} ${documentLabel(count)}
</span>
`;





button.onclick=()=>{


selectedLocation =
selectedLocation===location
?
""
:
location;



createLocationButtons();

renderDocuments();


};





box.appendChild(button);



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



let list=[...documents];




if(selectedLocation){


list=list.filter(
d=>d.lokalizacja===selectedLocation
);


}




const search =
document.getElementById(
"searchInput"
)
.value
.toLowerCase();





if(search){


list=list.filter(
d=>

JSON.stringify(d)
.toLowerCase()
.includes(search)

);


}




const year =
document.getElementById(
"yearFilter"
)
.value;





if(year){


list=list.filter(
d=>

String(d.rok)===year

);


}







locations.forEach(
location=>{


if(
selectedLocation &&
location!==selectedLocation
)
return;




const docs =
list.filter(
d=>d.lokalizacja===location
);



renderLocation(
location,
docs
);



});



}









function renderLocation(
location,
docs
){



const results =
document.getElementById(
"results"
);



const open =
openedLocations.includes(
location
);




const div =
document.createElement(
"div"
);



div.className=
"archive-location";




div.innerHTML=

`

<div class="archive-header">


<span class="arrow">

${open ? "▼":"▶"}

</span>


<strong>
${location}
</strong>


<span class="counter">

${docs.length}
${documentLabel(docs.length)}

</span>


</div>


<div class="location-content ${
open ? "" : "hidden"
}"></div>

`;





div
.querySelector(".archive-header")
.onclick=()=>{


if(open){

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
div.querySelector(
".location-content"
);






if(docs.length===0){


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
${doc.status || "-"}
</p>


<button class="edit"
onclick='openEditModal(${JSON.stringify(doc)})'>

Edytuj

</button>


<button class="delete"
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


function createYears(){


const select =
document.getElementById(
"yearFilter"
);



select.innerHTML=

`
<option value="">
Wszystkie lata
</option>
`;




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
)

.forEach(
year=>{


select.innerHTML+=

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







function documentLabel(n){


if(n===1)
return "dokument";

if(n>=2 && n<=4)
return "dokumenty";

return "dokumentów";


}
