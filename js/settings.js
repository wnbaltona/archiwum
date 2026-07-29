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

loadContractorsList();

loadLocalsList();


});







function openSettings(){


document
.getElementById("settingsOverlay")
.classList
.remove("hidden");


}



function closeSettings(){


document
.getElementById("settingsOverlay")
.classList
.add("hidden");


}







// =======================
// LOKALIZACJE
// =======================


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








// =======================
// KONTRAHENCI
// =======================


async function loadContractorsList(){


const box =
document.getElementById(
"contractorsList"
);



if(!box)
return;



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




if(error)
return;




box.innerHTML="";



data.forEach(item=>{


const row =
document.createElement(
"div"
);


row.className =
"contractor-row";



row.innerHTML=

`

<span>
${item.nazwa}
</span>


<button>
Usuń
</button>

`;



row.querySelector("button")
.onclick=()=>{

deleteContractor(item.id);

};



box.appendChild(row);



});


}







async function addContractor(){


const input =
document.getElementById(
"newContractor"
);


const name =
input.value.trim();




if(!name)
return;



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



input.value="";


loadContractorsList();


}







async function deleteContractor(id){



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



loadContractorsList();


}









// =======================
// LOKALE
// =======================


async function addLocal(){


const mpk =
document.getElementById(
"localMPK"
)
.value.trim();



const name =
document.getElementById(
"localName"
)
.value.trim();



const location =
document.getElementById(
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




document.getElementById(
"localMPK"
).value="";


document.getElementById(
"localName"
).value="";


loadLocalsList();



}









async function loadLocalsList(){



const box =
document.getElementById(
"localsList"
);



if(!box)
return;




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






if(error)
return;




box.innerHTML="";






data.forEach(local=>{


const row =
document.createElement(
"div"
);



row.className =
"contractor-row";




row.innerHTML=

`

<span>

${local.nazwa} (${local.mpk})
<br>

${local.lokalizacja}

</span>


<button>
Usuń
</button>

`;





row.querySelector("button")
.onclick=()=>{


deleteLocal(
local.id
);


};





box.appendChild(row);



});



}









async function deleteLocal(id){



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




loadLocalsList();



}
