let documents=[];


const results =
document.getElementById("results");


const search =
document.getElementById("searchInput");



const locations=[

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



async function load(){


const {data,error}=await supabaseClient
.from("dokumenty")
.select("*");



if(error){

console.log(error);

return;

}



documents=data;


render();


}




function render(){


results.innerHTML="";



locations.forEach(loc=>{


let docs=
documents.filter(
d=>d.lokalizacja===loc
);



if(!docs.length)return;



results.innerHTML+=`

<div class="location">


<div class="location-title"
onclick="toggle('${loc}')">

▶ ${loc} (${docs.length})

</div>



<div id="${loc}" class="documents hidden">


${docs.map(d=>`

<div class="card">

<b>📄 ${d.nazwa}</b>

<br>

📦 Regał: ${d.regal || "-"}

<br>

📚 Półka: ${d.polka || "-"}

<br>

📂 Segregator: ${d.segregator || "-"}

</div>

`).join("")}



</div>


</div>


`;


});


}



function toggle(id){

document
.getElementById(id)
.classList.toggle("hidden");

}




search.addEventListener(
"input",
()=>{


let value=
search.value.toLowerCase();



let filtered=
documents.filter(d=>

JSON.stringify(d)
.toLowerCase()
.includes(value)

);



documents=filtered;


render();


});


load();