// =====================================
// APP.JS
// ARCHIWUM DOKUMENTÓW
// =====================================


// ===============================
// ZMIENNE
// ===============================

let documents = [];
let currentLocation = "";

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



// ===============================
// START
// ===============================

document.addEventListener(
"DOMContentLoaded",
()=>{

    loadDocuments();

    createLocationButtons();

    loadContractorsToForm();

    setupFilters();

});





// ===============================
// POBIERANIE DOKUMENTÓW
// ===============================


async function loadDocuments(){


const {
data,
error
}=await supabaseClient

.from("dokumenty")

.select(`

*,

lokale(
    id,
    nazwa,
    mpk,
    lokalizacja
),

kontrahenci(
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

console.error(error);

return;

}




documents=data || [];



renderDocuments();


}




// ===============================
// LOKALIZACJE NA GÓRZE
// ===============================


function createLocationButtons(){


const box=document.getElementById(
"locationTabs"
);


if(!box)return;



box.innerHTML="";



locations.forEach(location=>{


const count =
documents.filter(d=>

d.lokale?.lokalizacja===location

).length;




box.innerHTML += `

<button 
class="location-card"
onclick="filterLocation('${location}')">


<strong>
${location}
</strong>


<span>
${documentText(count)}
</span>


</button>

`;



});


}




// ===============================
// LICZNIK
// ===============================


function documentText(number){


if(number===1)
return "1 dokument";


if(number>1 && number<5)
return number+" dokumenty";


return number+" dokumentów";


}





// ===============================
// FILTR LOKALIZACJI
// ===============================


window.filterLocation=function(location){


currentLocation=location;


renderDocuments();


};





// ===============================
// RENDER
// ===============================


function renderDocuments(){


const box=document.getElementById(
"results"
);


if(!box)return;



let data=[...documents];



if(currentLocation){


data=data.filter(d=>

d.lokale?.lokalizacja===currentLocation

);


}




const grouped={};



locations.forEach(l=>{

grouped[l]=[];

});



data.forEach(doc=>{


const loc=
doc.lokale?.lokalizacja;


if(loc){

grouped[loc].push(doc);

}



});





box.innerHTML="";



locations.forEach(location=>{


const docs=
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
${documentText(docs.length)}
</span>


</div>



<div 
id="content-${location}"
class="location-content hidden">


${renderDocs(docs)}


</div>


</div>

`;



});



createLocationButtons();


}





// ===============================
// DOKUMENTY
// ===============================


function renderDocs(list){


if(!list.length)

return "<p>Brak dokumentów</p>";




return list.map(doc=>`


<div class="document">


<h4>
${doc.nazwa || ""}
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


`).join("");



}





// ===============================
// ROZWIJANIE
// ===============================


window.toggleLocation=function(location){


const box=document.getElementById(
"content-"+location
);


if(!box)return;



box.classList.toggle(
"hidden"
);



};





// ===============================
// USUWANIE DOKUMENTU
// ===============================


window.deleteDocument=async function(id){


if(!confirm(
"Usunąć dokument?"
))

return;



const {
error
}=await supabaseClient

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





// ===============================
// KONTRAHENCI DO FORMULARZA
// ===============================


async function loadContractorsToForm(){


const select=document.getElementById(
"contractor"
);


if(!select)return;




const {
data,
error
}=await supabaseClient

.from("kontrahenci")

.select("*")

.order(
"nazwa"
);



if(error){

console.error(error);

return;

}




select.innerHTML=`

<option value="">
Wybierz kontrahenta
</option>

`;




data.forEach(c=>{


select.innerHTML +=`

<option value="${c.id}">
${c.nazwa}
</option>

`;


});


}




// ===============================
// FILTRY
// ===============================


function setupFilters(){


const search =
document.getElementById(
"searchInput"
);


if(search){


search.addEventListener(
"input",
renderDocuments
);


}

// =====================================
// DODAWANIE DOKUMENTU - MODAL
// =====================================


document.addEventListener(
"DOMContentLoaded",
()=>{


const addBtn =
document.getElementById("addBtn");


const overlay =
document.getElementById("modalOverlay");


const close =
document.getElementById("closeModal");



if(addBtn){


addBtn.addEventListener(
"click",
()=>{


overlay.classList.remove("hidden");


loadLocationsToForm();


loadContractorsToForm();


}

);


}



if(close){


close.addEventListener(
"click",
()=>{


overlay.classList.add("hidden");


}

);


}



const locationSelect =
document.getElementById("location");


if(locationSelect){


locationSelect.addEventListener(
"change",
()=>{


loadLocalsForLocation(
locationSelect.value
);


}

);


}



const save =
document.getElementById("saveBtn");


if(save){


save.addEventListener(
"click",
saveDocument
);


}



});





// =====================================
// LOKALIZACJE DO FORMULARZA
// =====================================


async function loadLocationsToForm(){


const select =
document.getElementById("location");


if(!select)return;



select.innerHTML=`

<option>
Wybierz lokalizację
</option>

`;



locations.forEach(loc=>{


select.innerHTML +=`

<option value="${loc}">
${loc}
</option>

`;

});


}





// =====================================
// LOKALE PO LOKALIZACJI
// =====================================


async function loadLocalsForLocation(location){


const select =
document.getElementById("local");



if(!select)return;



select.innerHTML=`

<option>
Ładowanie...
</option>

`;



const {
data,
error
}=await supabaseClient

.from("lokale")

.select("*")

.eq(
"lokalizacja",
location
)

.order(
"nazwa"
);



if(error){

console.error(error);

return;

}



select.innerHTML=`

<option>
Wybierz lokal
</option>

`;



data.forEach(local=>{


select.innerHTML +=`

<option value="${local.id}">

${local.nazwa}
${local.mpk ? " - "+local.mpk : ""}

</option>

`;


});


}





// =====================================
// ZAPIS DOKUMENTU
// =====================================


async function saveDocument(){



const data={


lokal_id:
document.getElementById("local").value || null,


kontrahent_id:
document.getElementById("contractor").value || null,


nazwa:
document.getElementById("name").value,


typ:
document.getElementById("type").value,


rok:
Number(document.getElementById("year").value) || null,


regal:
document.getElementById("shelf").value,


polka:
document.getElementById("level").value,


segregator:
document.getElementById("folder").value,


status:
document.getElementById("status").value,


uwagi:
document.getElementById("notes").value



};




if(!data.nazwa){

alert(
"Wpisz nazwę dokumentu"
);

return;

}




const {
error
}=await supabaseClient

.from("dokumenty")

.insert([data]);




if(error){

console.error(error);

alert(error.message);

return;

}




alert(
"Dokument dodany"
);



document
.getElementById("modalOverlay")
.classList.add("hidden");



loadDocuments();


}

}
