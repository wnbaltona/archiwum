document.addEventListener(
"DOMContentLoaded",
()=>{


const settingsBtn =
document.getElementById(
"settingsBtn"
);



if(settingsBtn){

settingsBtn.onclick =
openSettings;

}




document
.getElementById("closeSettings")
?.addEventListener(
"click",
closeSettings
);





document
.getElementById("showAddContractor")
?.addEventListener(
"click",
showAddContractor
);





document
.getElementById("showContractors")
?.addEventListener(
"click",
loadContractors
);





document
.getElementById("showAddLocal")
?.addEventListener(
"click",
showAddLocal
);





document
.getElementById("showLocals")
?.addEventListener(
"click",
loadLocals
);



});








// ========================
// OTWIERANIE USTAWIEŃ
// ========================


function openSettings(){


document

.getElementById(
"settingsOverlay"
)

.classList

.remove(
"hidden"
);


}







function closeSettings(){


document

.getElementById(
"settingsOverlay"
)

.classList

.add(
"hidden"
);


}









// ========================
// DODAJ KONTRAHENTA
// ========================


function showAddContractor(){



const box =

document.getElementById(
"settingsContent"
);




box.innerHTML =

`

<h3>
Dodaj kontrahenta
</h3>


<input 
id="contractorName"
placeholder="Nazwa kontrahenta">


<button id="saveContractor">

Zapisz

</button>


`;





document

.getElementById(
"saveContractor"
)

.onclick =

addContractor;


}









async function addContractor(){



const input =

document.getElementById(
"contractorName"
);



const name =
input.value.trim();






if(!name){

alert(
"Wpisz nazwę kontrahenta"
);

return;

}







const {

error

}

=

await supabaseClient

.from("kontrahenci")

.insert([

{

nazwa:name

}

]);







if(error){

alert(error.message);

return;

}





alert(
"Dodano kontrahenta"
);



input.value="";



}









// ========================
// LISTA KONTRAHENTÓW
// ========================


async function loadContractors(){



const box =

document.getElementById(
"settingsContent"
);



box.innerHTML =
"Ładowanie...";






const {

data,

error

}

=

await supabaseClient

.from("kontrahenci")

.select("*")

.order(
"nazwa"
);






if(error){

box.innerHTML =
error.message;

return;

}







box.innerHTML =

`

<h3>
Lista kontrahentów
</h3>

`;







if(!data.length){


box.innerHTML +=

`
<p>
Brak kontrahentów
</p>
`;

return;


}








data.forEach(item=>{


box.innerHTML +=


`

<div class="setting-row">


<span>

${item.nazwa}

</span>



<button onclick="deleteContractor('${item.id}')">

Usuń

</button>


</div>

`;



});




}







window.deleteContractor =

async function(id){



if(

!confirm(
"Usunąć kontrahenta?"
)

)

return;






const {

error

}

=

await supabaseClient

.from("kontrahenci")

.delete()

.eq(
"id",
id
);








if(error){

alert(error.message);

return;

}





loadContractors();



};









// ========================
// DODAJ LOKAL
// ========================


function showAddLocal(){



const box =

document.getElementById(
"settingsContent"
);




box.innerHTML =


`

<h3>
Dodaj lokal
</h3>



<input 
id="localMPK"
placeholder="MPK">



<input 
id="localName"
placeholder="Nazwa lokalu">





<select id="localLocation">

<option value="">
Wybierz lokalizację
</option>


</select>





<button id="saveLocal">

Zapisz

</button>


`;







const select =

document.getElementById(
"localLocation"
);






if(typeof LOCATIONS !== "undefined"){



LOCATIONS.forEach(location=>{


select.innerHTML +=


`

<option value="${location}">
${location}
</option>

`;



});



}







document

.getElementById(
"saveLocal"
)

.onclick =

addLocal;



}









async function addLocal(){



const mpk =

document

.getElementById(
"localMPK"
)

.value

.trim();





const name =

document

.getElementById(
"localName"
)

.value

.trim();





const location =

document

.getElementById(
"localLocation"
)

.value;








if(

!mpk ||

!name ||

!location

){

alert(
"Uzupełnij wszystkie pola"
);

return;

}








const {

error

}

=

await supabaseClient

.from("lokale")

.insert([

{

mpk:mpk,

nazwa:name,

lokalizacja:location

}

]);








if(error){

alert(error.message);

return;

}







alert(
"Dodano lokal"
);



}









// ========================
// LISTA LOKALI
// ========================


async function loadLocals(){



const box =

document.getElementById(
"settingsContent"
);



box.innerHTML =
"Ładowanie...";







const {

data,

error

}

=

await supabaseClient

.from("lokale")

.select("*")

.order(
"lokalizacja"
);







if(error){

box.innerHTML =
error.message;

return;

}







box.innerHTML =

`

<h3>
Lista lokali
</h3>

`;








if(!data.length){


box.innerHTML +=

`

<p>
Brak lokali
</p>

`;

return;


}








data.forEach(local=>{



box.innerHTML +=


`

<div class="setting-row">


<span>

${local.nazwa}

(${local.mpk})

<br>

${local.lokalizacja}

</span>



<button onclick="deleteLocal('${local.id}')">

Usuń

</button>



</div>

`;



});





}








window.deleteLocal =

async function(id){



if(

!confirm(
"Usunąć lokal?"
)

)

return;






const {

error

}

=

await supabaseClient

.from("lokale")

.delete()

.eq(
"id",
id
);







if(error){

alert(error.message);

return;

}






loadLocals();



};
