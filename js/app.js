let documents = [];


const results = document.getElementById("results");

const searchInput = document.getElementById("searchInput");



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



let selectedLocation = "WSZYSTKIE";




// pobieranie z Supabase

async function loadDocuments(){


const {data,error}=await supabaseClient
.from("dokumenty")
.select("*")
.order("created_at",{ascending:false});



if(error){

console.error(error);

results.innerHTML=
"❌ Błąd pobierania dokumentów";

return;

}


documents=data || [];


createLocationTabs();

renderDocuments();


}





// zakładki lokalizacji

function createLocationTabs(){


const tabs =
document.createElement("div");


tabs.className="location-tabs";



locations.forEach(loc=>{


const button =
document.createElement("button");


button.innerText=loc;


button.onclick=()=>{


selectedLocation=loc;


renderDocuments();


};



tabs.appendChild(button);



});



document
.querySelector("main")
.insertBefore(
tabs,
results
);


}




// wyświetlanie


function renderDocuments(){


results.innerHTML="";



let filtered =
documents;



if(selectedLocation!=="WSZYSTKIE"){


filtered =
filtered.filter(
d=>d.lokalizacja===selectedLocation
);


}




if(filtered.length===0){


results.innerHTML=

`
<div class="card">

Brak dokumentów

</div>
`;

return;

}




filtered.forEach(doc=>{


results.innerHTML+=`

<div class="card">


<h3>
📄 ${doc.nazwa}
</h3>


<p>
📍 ${doc.lokalizacja}
</p>


<p>
🗄️ Regał:
${doc.regal || "-"}
</p>


<p>
📚 Półka:
${doc.polka || "-"}
</p>


<p>
📂 Segregator:
${doc.segregator || "-"}
</p>


</div>

`;


});

}




// wyszukiwanie


searchInput.addEventListener(
"input",
()=>{


let value =
searchInput.value.toLowerCase();



let filtered =
documents.filter(doc=>

JSON.stringify(doc)
.toLowerCase()
.includes(value)

);



results.innerHTML="";



filtered.forEach(doc=>{


results.innerHTML+=`

<div class="card">


<h3>
📄 ${doc.nazwa}
</h3>


<p>
📍 ${doc.lokalizacja}
</p>


<p>
🗄️ Regał:
${doc.regal}
</p>


</div>

`;


});


});




loadDocuments();
