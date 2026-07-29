let documents = [];

let selectedLocation = "WSZYSTKIE";



document.addEventListener(
"DOMContentLoaded",
function(){

loadDocuments();

}
);




// =================================
// POBIERANIE DANYCH
// =================================


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

lokale(
id,
mpk,
nazwa,
lokalizacja
),

kontrahenci(
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

console.error(error);

return;

}



documents = data || [];



await createLocations();


render();



}









// =================================
// LOKALIZACJE
// =================================


async function createLocations(){


const box =
document.getElementById(
"locationTabs"
);



if(!box)
return;



box.innerHTML="";





let locations=[


"WSZYSTKIE",

"WARSZAWA",

"GDAŃSK",

"GDYNIA",

"ŚWINOUJŚCIE"


];






// pobieranie dodatkowych lokalizacji z lokali

const {

data

}

=

await supabaseClient

.from("lokale")

.select(
"lokalizacja"
);





if(data){


data.forEach(item=>{


if(item.lokalizacja){

locations.push(
item.lokalizacja
);

}


});


}






locations=[

...

new Set(
locations
.filter(Boolean)
)

];








locations.forEach(location=>{



let count=0;





if(location==="WSZYSTKIE"){


count=documentumentsCount();



}

else{


count=

documents.filter(doc=>

doc.lokale?.lokalizacja===location

)

.length;


}







const button=

document.createElement(
"button"
);



button.className=
"location-card";





button.innerHTML=

`

<strong>

${location}

</strong>


<span>

${count}

${documentText(count)}

</span>

`;






button.onclick=function(){



selectedLocation=location;


render();



};







box.appendChild(button);



});



}









function documentCount(){

return documents.length;

}









// =================================
// ODMIANA
// =================================


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









// =================================
// WYŚWIETLANIE
// =================================


function render(){



const results=

document.getElementById(
"results"
);



if(!results)
return;



results.innerHTML="";





let list=[...documents];







if(selectedLocation!=="WSZYSTKIE"){


list=list.filter(doc=>


doc.lokale?.lokalizacja===selectedLocation


);


}







const search=

document.getElementById(
"searchInput"
)

?.value

.toLowerCase()

|| "";






if(search){


list=list.filter(doc=>

JSON.stringify(doc)

.toLowerCase()

.includes(search)

);



}







if(list.length===0){


results.innerHTML=

`

<div class="empty">

Brak dokumentów

</div>

`;


return;


}






// grupowanie lokalizacji

const groups={};



list.forEach(doc=>{



const location=

doc.lokale?.lokalizacja

||

"Brak lokalizacji";



if(!groups[location])

groups[location]=[];



groups[location].push(doc);



});







Object.entries(groups)

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

Number(b[0])-

Number(a[0])

)

.forEach(

([year,yearDocs])=>{





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








yearDocs.forEach(doc=>{





const card=

document.createElement(
"div"
);



card.className=
"document";







const local=

doc.lokale

?

`${doc.lokale.nazwa} (${doc.lokale.mpk})`

:

"-";









card.innerHTML=

`

<h4>

${doc.nazwa || "Bez nazwy"}

</h4>


<p>
Lokal:
${local}
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


<button class="edit">

Edytuj

</button>


<button class="delete">

Usuń

</button>

`;








card.querySelector(".delete")

.onclick=

function(){

deleteDocument(doc.id);

};






if(typeof openEditModal==="function"){


card.querySelector(".edit")

.onclick=

function(){

openEditModal(doc);

};


}





yearBox.appendChild(card);



});






locationBox.appendChild(yearBox);



});







results.appendChild(locationBox);



});



}









// =================================
// USUWANIE
// =================================


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
