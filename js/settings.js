// ===============================
// SETTINGS.JS
// ===============================


document.addEventListener(
"DOMContentLoaded",
()=>{


document
.getElementById("settingsBtn")
?.addEventListener(
"click",
openSettings
);



document
.getElementById("closeSettings")
?.addEventListener(
"click",
closeSettings
);



});





// ===============================
// OTWARCIE USTAWIEŃ
// ===============================


function openSettings(){


const overlay =
document.getElementById(
"settingsOverlay"
);


if(!overlay)
return;



overlay.classList.remove(
"hidden"
);



showSettingsMenu();


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







// ===============================
// GŁÓWNE MENU USTAWIEŃ
// ===============================


function showSettingsMenu(){


const box =
document.getElementById(
"settingsContent"
);



box.innerHTML =


`

<div class="settings-buttons">


<button onclick="showAddContractor()">

Dodaj kontrahenta

</button>



<button onclick="loadContractors()">

Lista kontrahentów

</button>



<button onclick="showAddLocal()">

Dodaj lokal

</button>



<button onclick="loadLocals()">

Lista lokali

</button>


</div>

`;



}









// ===============================
// DODAJ KONTRAHENTA
// ===============================


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


const name =

document

.getElementById(
"contractorName"
)

.value

.trim();





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



showSettingsMenu();



}









// ===============================
// LISTA KONTRAHENTÓW
// ===============================


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

data:contractor

}

=

await supabaseClient

.from("kontrahenci")

.select("nazwa")

.eq(
"id",
id
)

.single();







if(contractor){



await supabaseClient

.from("dokumenty")

.update({

nazwa_kontrahenta:null

})

.eq(

"nazwa_kontrahenta",

contractor.nazwa

);



}







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









// ===============================
// DODAJ LOKAL
// ===============================


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

<option>
Wybierz lokalizację
</option>

<option>OKĘCIE</option>
<option>RADOM</option>
<option>MODLIN</option>
<option>BYDGOSZCZ</option>
<option>KRAKÓW</option>
<option>POZNAŃ</option>
<option>WROCŁAW</option>
<option>ŚWINOUJŚCIE</option>
<option>GDAŃSK</option>
<option>GDYNIA</option>
<option>ZIELONA GÓRA</option>
<option>RZESZÓW</option>
<option>FRANCJA</option>
<option>KATOWICE</option>

</select>




<button onclick="addLocal()">

Zapisz

</button>


`;



}









async function addLocal(){


const data = {


mpk:
document.getElementById(
"localMPK"
).value,


nazwa:
document.getElementById(
"localName"
).value,


lokalizacja:
document.getElementById(
"localLocation"
).value


};






const {

error

}

=

await supabaseClient

.from("lokale")

.insert([data]);






if(error){

alert(error.message);

return;

}




alert(
"Dodano lokal"
);



showSettingsMenu();



}









// ===============================
// LISTA LOKALI
// ===============================


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






data.forEach(item=>{


box.innerHTML +=


`

<div class="setting-row">


<span>

${item.nazwa}
(${item.mpk})

<br>

${item.lokalizacja}

</span>



<button onclick="deleteLocal('${item.id}')">

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
