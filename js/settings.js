// ======================================
// USTAWIENIA - KONTRAHENCI I LOKALE
// ======================================


document.addEventListener(
"DOMContentLoaded",
()=>{


const settingsBtn =
document.getElementById("settingsBtn");


const settingsOverlay =
document.getElementById("settingsOverlay");


const closeSettings =
document.getElementById("closeSettings");



if(settingsBtn){


settingsBtn.onclick=()=>{


settingsOverlay
.classList
.remove("hidden");



loadLocationsForSettings();


};



}






if(closeSettings){


closeSettings.onclick=()=>{


settingsOverlay
.classList
.add("hidden");


};



}





loadContractors();


});









// ======================================
// DODAWANIE KONTRAHENTA
// ======================================


const addContractorBtn =

document.getElementById(
"addContractorBtn"
);



if(addContractorBtn){



addContractorBtn.onclick =
async()=>{



const input =

document.getElementById(
"newContractor"
);




const name =
input.value.trim();





if(!name){


alert(
"Wpisz nazwę kontrahenta"
);


return;


}






const {error}=

await supabaseClient

.from("kontrahenci")

.insert([

{

nazwa:name

}

]);







if(error){


alert(
"Błąd dodawania kontrahenta:\n"
+
error.message
);


return;


}







input.value="";



alert(
"Kontrahent dodany"
);



loadContractors();



};



}









// ======================================
// LISTA KONTRAHENTÓW
// ======================================


async function loadContractors(){



const select =

document.getElementById(
"contractor"
);




if(!select)
return;





const {

data,

error

}=

await supabaseClient

.from("kontrahenci")

.select("*")

.order(
"nazwa"
);






if(error){

console.log(error);

return;

}







select.innerHTML=

`

<option value="">
Wybierz kontrahenta
</option>

`;






data.forEach(item=>{



select.innerHTML +=

`

<option value="${item.id}">

${item.nazwa}

</option>

`;



});



}









// ======================================
// LOKALIZACJE W USTAWIENIACH
// ======================================


async function loadLocationsForSettings(){



const selects=[

document.getElementById(
"localLocation"
),

document.getElementById(
"location"
)

];






const {

data,

error

}=

await supabaseClient

.from("dokumenty")

.select(
"lokalizacja"
);







if(error)
return;







const locations=[


...

new Set(

data

.map(
x=>x.lokalizacja
)

.filter(Boolean)

)

];









selects.forEach(select=>{



if(!select)
return;





select.innerHTML=

`

<option value="">
Wybierz lokalizację
</option>

`;





locations.forEach(location=>{



select.innerHTML +=

`

<option>

${location}

</option>

`;



});



});



}









// ======================================
// DODAWANIE LOKALU
// ======================================



const addLocalBtn =

document.getElementById(
"addLocalBtn"
);





if(addLocalBtn){



addLocalBtn.onclick =
async()=>{






const mpk =

document

.getElementById(
"localMPK"
)

.value.trim();






const name =

document

.getElementById(
"localName"
)

.value.trim();







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
"Uzupełnij wszystkie pola lokalu"
);



return;



}








const {error}=

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

"Błąd dodawania lokalu:\n"

+

error.message

);



return;



}








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





alert(
"Lokal dodany"
);




};



}