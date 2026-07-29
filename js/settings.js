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



document
.getElementById("addContractorBtn")
?.addEventListener(
"click",
addContractor
);



document
.getElementById("addLocalBtn")
?.addEventListener(
"click",
addLocal
);



loadSettingsLocations();


});







// ==============================
// OTWIERANIE USTAWIEŃ
// ==============================


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









// ==============================
// LISTA LOKALIZACJI
// ==============================


function loadSettingsLocations(){



const select =

document.getElementById(
"localLocation"
);



if(!select)
return;




select.innerHTML=

`

<option value="">
Wybierz lokalizację
</option>

`;





LOCATIONS.forEach(location=>{


select.innerHTML +=

`

<option value="${location}">
${location}
</option>

`;



});


}









// ==============================
// DODAJ KONTRAHENTA
// ==============================


async function addContractor(){



const input =

document.getElementById(
"newContractor"
);



const name =

input.value.trim();






if(!name){


alert(
"Podaj nazwę kontrahenta"
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


alert(

"Błąd dodawania kontrahenta: "

+

error.message

);


return;


}





alert(
"Kontrahent dodany"
);



input.value="";



}









// ==============================
// DODAJ LOKAL
// ==============================


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


alert(

"Błąd dodawania lokalu: "

+

error.message

);



return;


}







alert(
"Lokal dodany"
);






document

.getElementById(
"localMPK"
)

.value="";



document

.getElementById(
"localName"
)

.value="";



document

.getElementById(
"localLocation"
)

.value="";



}
