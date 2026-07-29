let documents=[];

let selectedLocation="WSZYSTKIE";



document.addEventListener(
"DOMContentLoaded",
()=>{


loadDocuments();


});







async function loadDocuments(){



const {

data,

error

}=

await supabaseClient

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
"rok",
{
ascending:false
}
);







if(error){

console.log(error);

return;

}





documents=data || [];



await createLocations();


render();



}









// ============================
// LOKALIZACJE
// ============================

async function createLocations(){

const box =
document.getElementById("locationTabs");


box.innerHTML="";


// pobieramy wszystkie lokalizacje z tabeli lokale

const {

data,

error

} = await supabaseClient

.from("lokale")

.select("lokalizacja");



if(error){

console.log(error);

return;

}




const locations = [

"WSZYSTKIE",

...

new Set(

data

.map(x=>x.lokalizacja)

.filter(Boolean)

)

];





locations.forEach(location=>{


const count =

location === "WSZYSTKIE"

?

documents.length

:

documents.filter(

d =>

d.lokale?.lokalizacja === location

)

.length;






const btn =

document.createElement("button");



btn.className="location-card";



btn.innerHTML = `

<strong>

${location}

</strong>

<span>

${count} ${documentText(count)}

</span>

`;





btn.onclick = ()=>{


selectedLocation = location;


render();


};





box.appendChild(btn);



});


}



}









function documentText(number){


if(number===1)

return "dokument";



if(

number%10>=2 &&

number%10<=4 &&

(number%100<12 || number%100>14)

)

return "dokumenty";



return "dokumentów";


}









// ============================
// RENDER
// ============================


function render(){



const results=

document.getElementById(
"results"
);



results.innerHTML="";





let list=[...documents];







if(selectedLocation!=="WSZYSTKIE"){


list=

list.filter(

d=>

d.lokale?.lokalizacja===selectedLocation

);


}








const search=

document

.getElementById(
"searchInput"
)

.value

.toLowerCase();







if(search){



list=list.filter(d=>



JSON.stringify(d)

.toLowerCase()

.includes(search)



);



}








if(!list.length){



results.innerHTML=

`

<div class="empty">

Brak dokumentów

</div>

`;



return;

}









// lokalizacja

const locations={};



list.forEach(doc=>{



const loc=

doc.lokale?.lokalizacja ||

"Brak lokalizacji";



if(!locations[loc])

locations[loc]=[];




locations[loc].push(doc);



});









Object.entries(locations)

.forEach(

([location,docs])=>{





const locationBox=

document.createElement(
"div"
);



locationBox.className=
"archive-location";






locationBox.innerHTML=

`

<div class="archive-header">

<strong>
${location}
</strong>


</div>

`;








// grupowanie rok


const years={};



docs.forEach(doc=>{



const year=

doc.rok || "Brak roku";



if(!years[year])

years[year]=[];



years[year].push(doc);



});








Object.entries(years)

.sort(

(a,b)=>

Number(b[0])

-

Number(a[0])

)

.forEach(

([year,docs])=>{






const yearBox=

document.createElement(
"div"
);



yearBox.className=
"year-box";





yearBox.innerHTML=

`

<h3>

${year}

</h3>

`;











// grupowanie lokali


const locals={};



docs.forEach(doc=>{



const id=

doc.lokal_id || "brak";



if(!locals[id])

locals[id]=[];



locals[id].push(doc);



});







Object.values(locals)

.forEach(localDocs=>{



const first=

localDocs[0];





const localName=

first.lokale

?

`${first.lokale.nazwa} (${first.lokale.mpk})`

:

"Brak lokalu";









const localBox=

document.createElement(
"div"
);



localBox.className=
"local-box";






localBox.innerHTML=

`

<h4>

${localName}

</h4>

`;









localDocs.forEach(doc=>{



const card=

document.createElement(
"div"
);



card.className=
"document";






card.innerHTML=

`

<strong>

${doc.nazwa}

</strong>



<p>

Kontrahent:

${

doc.kontrahenci?.nazwa

||

"-"

}

</p>



<p>

Typ:

${doc.typ || "-"}

</p>



<p>

Regał:

${doc.regal || "-"}

</p>



<p>

Półka:

${doc.polka || "-"}

</p>



<p>

Segregator:

${doc.segregator || "-"}

</p>



<p>

Status:

${doc.status || "-"}

</p>





<button class="edit">

Edytuj

</button>



<button class="delete">

Usuń

</button>

`;








card

.querySelector(".edit")

.onclick=()=>{


openEditModal(doc);


};






card

.querySelector(".delete")

.onclick=()=>{


deleteDocument(doc.id);


};








localBox.appendChild(card);



});






yearBox.appendChild(localBox);



});







locationBox.appendChild(yearBox);



results.appendChild(locationBox);



});



}









// ============================
// USUWANIE
// ============================


async function deleteDocument(id){



if(

!confirm(
"Usunąć dokument?"
)

)

return;






const {

error

}=

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


}
