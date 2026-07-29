let documents = [];

let selectedLocation = "WSZYSTKIE";


const results =
document.getElementById("results");


const searchInput =
document.getElementById("searchInput");


const typeFilter =
document.getElementById("typeFilter");


const shelfFilter =
document.getElementById("shelfFilter");



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




// =====================
// POBIERANIE DANYCH
// =====================


async function loadDocuments(){


const {data,error}=await supabaseClient
.from("dokumenty")
.select("*")
.order("lokalizacja");



if(error){

console.log(error);

return;

}



documents=data || [];


createLocations();

createFilters();

render();


}





// =====================
// ZAKŁADKI
// =====================


function createLocations(){


const box =
document.getElementById("locationTabs");


box.innerHTML="";



locations.forEach(loc=>{


let btn=document.createElement("button");

btn.innerText=loc;



btn.onclick=()=>{


selectedLocation=loc;

render();


};



box.appendChild(btn);



});


}






// =====================
// FILTRY
// =====================


function createFilters(){


let types=[

...new Set(
documents.map(d=>d.typ)
.filter(Boolean)
)

];


let shelves=[

...new Set(
documents.map(d=>d.regal)
.filter(Boolean)
)

];



typeFilter.innerHTML=
`
<option value="">
Wszystkie typy
</option>
`;



types.forEach(t=>{


typeFilter.innerHTML+=`

<option value="${t}">
${t}
</option>

`;

});





shelfFilter.innerHTML=
`
<option value="">
Wszystkie regały
</option>
`;



shelves.forEach(s=>{


shelfFilter.innerHTML+=`

<option value="${s}">
${s}
</option>

`;

});



}





typeFilter.onchange=render;

shelfFilter.onchange=render;





// =====================
// WYŚWIETLANIE
// =====================


function render(){


results.innerHTML="";



let data=[...documents];





if(selectedLocation !== "WSZYSTKIE"){


data=data.filter(
d=>d.lokalizacja===selectedLocation
);

}





if(typeFilter.value){


data=data.filter(
d=>d.typ===typeFilter.value
);


}





if(shelfFilter.value){


data=data.filter(
d=>d.regal===shelfFilter.value
);


}







let search =
searchInput.value.toLowerCase();



if(search){


data=data.filter(d=>

JSON.stringify(d)
.toLowerCase()
.includes(search)

);


}




// grupowanie lokalizacjami


let grouped={};



data.forEach(doc=>{


if(!grouped[doc.lokalizacja]){

grouped[doc.lokalizacja]=[];

}


grouped[doc.lokalizacja].push(doc);


});






Object.keys(grouped).forEach(location=>{



results.innerHTML+=`

<div class="location">


<h2>
📍 ${location}
</h2>



${groupDocuments(grouped[location])}



</div>

`;



});


}







function groupDocuments(docs){



let locals={};



docs.forEach(doc=>{


let local =
doc.numer_lokalu || "Brak numeru";



if(!locals[local]){

locals[local]=[];

}


locals[local].push(doc);



});



let html="";



Object.keys(locals).forEach(local=>{


html+=`

<div class="card">


<h3>
🚪 Lokal: ${local}
</h3>



${locals[local].map(doc=>`

<div>

📄 <b>${doc.nazwa}</b>

<br>

🗂 Typ:
${doc.typ || "-"}

<br>

🗄 Regał:
${doc.regal || "-"}

<br>

📚 Półka:
${doc.polka || "-"}

<br>

📂 Segregator:
${doc.segregator || "-"}

<br>

📝 ${doc.uwagi || ""}


</div>

<hr>

`).join("")}



</div>

`;



});



return html;


}






searchInput.addEventListener(
"input",
render
);



loadDocuments();
