let documents = [];


const input = document.getElementById("searchInput");
const results = document.getElementById("results");


// pobranie Excela w formacie CSV

fetch("dokumenty.csv")

.then(response => response.text())

.then(data => {


    documents = parseCSV(data);

    displayDocuments();


})

.catch(error => {

console.log("Błąd wczytywania danych:", error);

});




// zamiana CSV na obiekty

function parseCSV(csv){


const rows = csv.split("\n");


const headers = rows[0]
.split(";")
.map(h=>h.trim());



return rows.slice(1)

.filter(row=>row.trim() !== "")

.map(row=>{


const values = row.split(";");


let obj={};


headers.forEach((header,index)=>{

obj[header]=values[index];

});


return obj;


});


}




function displayDocuments(search=""){


results.innerHTML="";



const filtered = documents.filter(doc=>{


return Object.values(doc)

.join(" ")

.toLowerCase()

.includes(search.toLowerCase());


});



if(filtered.length===0){

results.innerHTML=`

<div class="card">

<h2>Brak wyników</h2>

</div>

`;

return;

}



filtered.forEach(doc=>{


results.innerHTML += `


<div class="card">


<h2>
📄 ${doc["Nazwa dokumentu"]}
</h2>


<div class="info">


<div>
<b>Typ:</b>
${doc["Typ"]}
</div>


<div>
<b>Miasto:</b>
${doc["Miasto"]}
</div>


<div>
<b>Lokal:</b>
${doc["Lokal"]}
</div>


<div>
<b>Regał:</b>
${doc["Regał"]}
</div>


<div>
<b>Półka:</b>
${doc["Półka"]}
</div>


<div>
<b>Segregator:</b>
${doc["Segregator"]}
</div>


</div>


<p>
📝 ${doc["Uwagi"] || ""}
</p>


</div>


`;

});


}




input.addEventListener(
"input",
()=>displayDocuments(input.value)
);