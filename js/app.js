let documents = [];

let selectedLocation = "WSZYSTKIE";

let editingId = null;



const results = document.getElementById("results");

const searchInput = document.getElementById("searchInput");

const typeFilter = document.getElementById("typeFilter");

const shelfFilter = document.getElementById("shelfFilter");

const locationTabs = document.getElementById("locationTabs");





const locations = [

"WSZYSTKIE",

"OKĘCIE",

"RADOM",

"MODLIN",

"SONATA",

"RZESZÓW",

"KATOWICE",

"KRAKÓW",

"ZIELONA GÓRA",

"FRANCJA",

"BYDGOSZCZ",

"POZNAŃ",

"WROCŁAW"

];







// ==================================
// POBIERANIE DANYCH
// ==================================


async function loadDocuments(){


const {data,error}=await supabaseClient

.from("dokumenty")

.select("*")

.order("lokalizacja");




if(error){


console.error(error);


results.innerHTML =
"Nie udało się pobrać dokumentów";


return;


}




documents=data || [];



createLocationTabs();

createFilters();

render();


}









// ==================================
// ZAKŁADKI LOKALIZACJI
// ==================================


function createLocationTabs(){


if(!locationTabs)
return;



locationTabs.innerHTML="";



locations.forEach(location=>{


const button =
document.createElement("button");



button.textContent=location;



button.onclick=()=>{


selectedLocation=location;


render();


};



locationTabs.appendChild(button);



});


}









// ==================================
// FILTRY
// ==================================


function createFilters(){



if(!typeFilter || !shelfFilter)
return;



const types=[

...new Set(

documents

.map(d=>d.typ)

.filter(Boolean)

)

];




const shelves=[

...new Set(

documents

.map(d=>d.regal)

.filter(Boolean)

)

];





typeFilter.innerHTML=`

<option value="">
Wszystkie typy
</option>

`;




types.forEach(type=>{


typeFilter.innerHTML+=`

<option value="${type}">
${type}
</option>

`;



});







shelfFilter.innerHTML=`

<option value="">
Wszystkie regały
</option>

`;





shelves.forEach(shelf=>{


shelfFilter.innerHTML+=`

<option value="${shelf}">
${shelf}
</option>

`;



});



}






typeFilter.addEventListener(
"change",
render
);



shelfFilter.addEventListener(
"change",
render
);







// ==================================
// WYŚWIETLANIE
// ==================================


function render(){


results.innerHTML="";



let filtered=[...documents];





if(selectedLocation!=="WSZYSTKIE"){


filtered=filtered.filter(

d=>d.lokalizacja===selectedLocation

);


}





if(typeFilter.value){


filtered=filtered.filter(

d=>d.typ===typeFilter.value

);


}






if(shelfFilter.value){


filtered=filtered.filter(

d=>d.regal===shelfFilter.value

);


}






const search=
searchInput.value
.toLowerCase();





if(search){


filtered=filtered.filter(doc=>


JSON.stringify(doc)

.toLowerCase()

.includes(search)


);


}






if(filtered.length===0){


results.innerHTML=`

<div class="location">

Brak dokumentów

</div>

`;

return;


}







const grouped={};




filtered.forEach(doc=>{


if(!grouped[doc.lokalizacja]){


grouped[doc.lokalizacja]=[];

}


grouped[doc.lokalizacja].push(doc);



});








Object.keys(grouped).forEach(location=>{



const locationBox=
document.createElement("div");


locationBox.className="location";



locationBox.innerHTML=`

<h2>

${location}

</h2>

`;






const locals={};




grouped[location].forEach(doc=>{



const local=
doc.numer_lokalu || "Brak numeru";



if(!locals[local]){


locals[local]=[];

}



locals[local].push(doc);



});








Object.keys(locals).forEach(local=>{



const localBox=
document.createElement("div");



localBox.className="card";



localBox.innerHTML=`

<h3>

Lokal: ${local}

</h3>

`;







locals[local].forEach(doc=>{



localBox.innerHTML+=`

<div class="document">


<strong>

${doc.nazwa || "Brak nazwy"}

</strong>



<p>
Typ: ${doc.typ || "-"}
</p>



<p>
Regał: ${doc.regal || "-"}
</p>



<p>
Półka: ${doc.polka || "-"}
</p>



<p>
Segregator: ${doc.segregator || "-"}
</p>



<p>
Uwagi: ${doc.uwagi || "-"}
</p>




<button onclick="editDocument('${doc.id}')">

Edytuj

</button>



<button onclick="deleteDocument('${doc.id}')">

Usuń

</button>



</div>

`;



});





locationBox.appendChild(localBox);



});





results.appendChild(locationBox);



});



}









searchInput.addEventListener(

"input",

render

);









// ==================================
// USUWANIE
// ==================================


async function deleteDocument(id){



const answer=
confirm(
"Czy na pewno usunąć dokument?"
);



if(!answer)
return;





const {error}=await supabaseClient

.from("dokumenty")

.delete()

.eq("id",id);






if(error){


console.error(error);


alert(
"Nie udało się usunąć dokumentu"
);


return;


}




loadDocuments();



}









// ==================================
// EDYCJA
// ==================================


async function editDocument(id){



const doc =
documents.find(
d=>d.id==id
);




if(!doc)
return;





editingId=id;





document
.getElementById("modalOverlay")
.classList.remove("hidden");

document
.getElementById("errorBox")
.classList.add("hidden");


document
.getElementById("successBox")
.classList.add("hidden");

document
.getElementById("modalTitle")
.innerText=
"Edytuj dokument";



document
.getElementById("saveBtn")
.innerText=
"Zapisz zmiany";





document.getElementById("location").value=
doc.lokalizacja || "";



document.getElementById("number").value=
doc.numer_lokalu || "";



document.getElementById("name").value=
doc.nazwa || "";



document.getElementById("type").value=
doc.typ || "";



document.getElementById("shelf").value=
doc.regal || "";



document.getElementById("level").value=
doc.polka || "";



document.getElementById("folder").value=
doc.segregator || "";



document.getElementById("notes").value=
doc.uwagi || "";



}



loadDocuments();
