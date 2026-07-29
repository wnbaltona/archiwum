document.addEventListener(
"DOMContentLoaded",
()=>{


const settingsBtn =
document.getElementById(
"settingsBtn"
);


const closeSettings =
document.getElementById(
"closeSettings"
);



const addContractorBtn =
document.getElementById(
"addContractorBtn"
);



const addLocalBtn =
document.getElementById(
"addLocalBtn"
);






if(settingsBtn){


settingsBtn.onclick=()=>{


openSettings();


};


}







if(closeSettings){


closeSettings.onclick=()=>{


closeSettingsModal();


};


}








if(addContractorBtn){


addContractorBtn.onclick=()=>{


addContractor();


};


}







if(addLocalBtn){


addLocalBtn.onclick=()=>{


addLocal();


};


}




});









// ==============================
// OTWIERANIE
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








// ==============================
// ZAMYKANIE
// ==============================


function closeSettingsModal(){



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
// KONTRAHENT
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





if(typeof loadFormData==="function"){


loadFormData();


}



}









// ==============================
// LOKAL
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
"Uzupełnij wszystkie pola lokalu"
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







if(typeof loadLocations==="function"){


loadLocations();


}



}
