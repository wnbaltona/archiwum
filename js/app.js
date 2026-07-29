let documents=[];


const results =
document.getElementById("results");


const searchInput =
document.getElementById("searchInput");



fetch("dokumenty.csv")

.then(response=>response.text())

.then(data=>{

documents=parseCSV(data);

showLocations();

});



function parseCSV(csv){


let rows=csv.split("\n");


let headers=
rows[0].split(";");


return rows.slice(1)
.filter(r=>r.trim()!="")
.map(row=>{


let values=row.split(";");

let obj={};


headers.forEach((h,i)=>{

obj[h.trim()]=values[i]?.trim();

});


return obj;


});

}



function showLocations(){


results.innerHTML="";


let locations=[

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



locations.forEach(location=>{


let docs=
documents.filter(
d=>d["Lokalizacja"]==location
);



if(docs.length){


results.innerHTML+=`

<div class="location">

<h3 onclick="openLocation('${location}')">

▶ ${location}
(${docs.length})

</h3>


<div id="${location}" class="hidden">


${docs.map(d=>`

<div class="card">

<b>📄 ${d["Nazwa dokumentu"]}</b>

<p>
🗄️ Regał:
${d["Regał"]}
</p>

<p>
📚 Półka:
${d["Półka"]}
</p>

<p>
📂 Segregator:
${d["Segregator"]}
</p>

</div>


`).join("")}


</div>


</div>

`;

}


});


}



function openLocation(id){

document
.getElementById(id)
.classList.toggle("hidden");

}



searchInput.addEventListener(
"input",
()=>{


let text=
searchInput.value.toLowerCase();


results.innerHTML="";


documents
.filter(d=>
JSON.stringify(d)
.toLowerCase()
.includes(text)
)
.forEach(d=>{


results.innerHTML+=`

<div class="card">

📄 ${d["Nazwa dokumentu"]}

<br>

📍 ${d["Lokalizacja"]}

<br>

🗄️ Regał:
${d["Regał"]}

</div>

`;

});


});