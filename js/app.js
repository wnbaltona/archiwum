const input =
document.getElementById("searchInput");


const results =
document.getElementById("results");



let documents=[];



async function loadDocuments(){


const {data,error}=

await supabaseClient

.from("dokumenty")

.select("*");



if(error){

console.log(error);

return;

}



documents=data;


displayDocuments();


}



function displayDocuments(search=""){


results.innerHTML="";



const filtered =
documents.filter(doc=>


JSON.stringify(doc)

.toLowerCase()

.includes(search.toLowerCase())

);



filtered.forEach(doc=>{


results.innerHTML+=`

<div class="card">


<h2>
📄 ${doc.nazwa}
</h2>


<p>
<b>Typ:</b> ${doc.typ}
</p>


<p>
<b>Miasto:</b> ${doc.miasto}
</p>


<p>
<b>Lokal:</b> ${doc.lokal}
</p>


<p>
<b>Regał:</b> ${doc.regal}
</p>


<p>
<b>Półka:</b> ${doc.polka}
</p>


<p>
<b>Segregator:</b> ${doc.segregator}
</p>


<p>
📝 ${doc.uwagi ?? ""}
</p>


</div>


`;

});


}



input.addEventListener(
"input",
()=>displayDocuments(input.value)
);



loadDocuments();