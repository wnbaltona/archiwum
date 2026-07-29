let editingId = null;



document.addEventListener(
"DOMContentLoaded",
()=>{


const addBtn =
document.getElementById("addBtn");


const closeBtn =
document.getElementById("closeModal");


const saveBtn =
document.getElementById("saveBtn");


const location =
document.getElementById("location");





if(addBtn){

addBtn.onclick=()=>{

openAddModal();

};

}





if(closeBtn){

closeBtn.onclick=()=>{

closeModal();

};

}





if(saveBtn){

saveBtn.onclick=()=>{

saveDocument();

};

}





if(location){

location.onchange=()=>{

loadLocals(location.value);

};

}



loadLocations();



});









// =====================================
// LOKALIZACJE
// =====================================


async function loadLocations(){


const {

data,

error

}=

await supabaseClient

.from("lokale")

.select("lokalizacja");





if(error)
return;






const locations =

[

...

new Set(

data

.map(x=>x.lokalizacja)

)

];





const select =

document.getElementById(
"location"
);





if(select){



select.innerHTML=

`

<option value="">
Wybierz lokalizację
</option>

`;





locations.forEach(l=>{


select.innerHTML +=

`

<option>
${l}
</option>

`;



});



}



}









// =====================================
// LOKALE PO LOKALIZACJI
// =====================================


async function loadLocals(location){



const select =

document.getElementById(
"local"
);





select.innerHTML=

`

<option>
Ładowanie...
</option>

`;






if(!location){


select.innerHTML=

`

<option>
Najpierw wybierz lokalizację
</option>

`;

return;


}






const {

data,

error

}=

await supabaseClient

.from("lokale")

.select("*")

.eq(
"lokalizacja",
location
)

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
Wybierz lokal
</option>

`;






data.forEach(local=>{



select.innerHTML +=

`

<option value="${local.id}">

${local.nazwa} (${local.mpk})

</option>

`;



});



}









// =====================================
// OTWÓRZ DODAWANIE
// =====================================


function openAddModal(){



editingId=null;




document

.getElementById(
"modalOverlay"
)

.classList

.remove(
"hidden"
);




document

.getElementById(
"modalTitle"
)

.innerText=

"Dodaj dokument";





clearForm();





}









// =====================================
// EDYCJA
// =====================================


async function openEditModal(doc){



editingId=doc.id;




document

.getElementById(
"modalOverlay"
)

.classList

.remove(
"hidden"
);






document

.getElementById(
"modalTitle"
)

.innerText=

"Edytuj dokument";






document.getElementById("name").value =
doc.nazwa || "";



document.getElementById("type").value =
doc.typ || "";



document.getElementById("year").value =
doc.rok || "";



document.getElementById("shelf").value =
doc.regal || "";



document.getElementById("level").value =
doc.polka || "";



document.getElementById("folder").value =
doc.segregator || "";



document.getElementById("status").value =
doc.status || "OK";



document.getElementById("notes").value =
doc.uwagi || "";






if(doc.lokal_id){



const {

data

}=

await supabaseClient

.from("lokale")

.select("*")

.eq(
"id",
doc.lokal_id
)

.single();






if(data){



document.getElementById(
"location"
)

.value=

data.lokalizacja;



await loadLocals(
data.lokalizacja
);




document.getElementById(
"local"
)

.value=

data.id;



}



}






if(doc.kontrahent_id){


document.getElementById(
"contractor"
)

.value=

doc.kontrahent_id;


}



}









// =====================================
// ZAPIS
// =====================================


async function saveDocument(){





const required=[


"location",
"local",
"name",
"type",
"year",
"shelf",
"level",
"folder"


];






let valid=true;





required.forEach(id=>{


const el=

document.getElementById(id);



if(!el.value){


el.classList.add(
"invalid"
);


valid=false;


}else{


el.classList.remove(
"invalid"
);


}


});






if(!valid){


alert(
"Uzupełnij wszystkie wymagane pola"
);


return;


}









const data={



lokal_id:

document.getElementById(
"local"
)

.value,



kontrahent_id:

document.getElementById(
"contractor"
)

.value || null,



nazwa:

document.getElementById(
"name"
)

.value,



typ:

document.getElementById(
"type"
)

.value,



rok:

Number(

document.getElementById(
"year"
)

.value

),



regal:

document.getElementById(
"shelf"
)

.value,



polka:

document.getElementById(
"level"
)

.value,



segregator:

document.getElementById(
"folder"
)

.value,



status:

document.getElementById(
"status"
)

.value,



uwagi:

document.getElementById(
"notes"
)

.value

};









let result;





if(editingId){



result=

await supabaseClient

.from("dokumenty")

.update(data)

.eq(
"id",
editingId
);



}else{



result=

await supabaseClient

.from("dokumenty")

.insert([data]);



}







if(result.error){


alert(
"Błąd zapisu:\n"+
result.error.message
);


return;


}





closeModal();



if(typeof loadDocuments==="function"){


loadDocuments();


}



}









// =====================================
// ZAMKNIJ
// =====================================


function closeModal(){



document

.getElementById(
"modalOverlay"
)

.classList

.add(
"hidden"
);



}








function clearForm(){



document

.querySelectorAll(
"#modalOverlay input, #modalOverlay textarea"
)

.forEach(x=>{

x.value="";

});



document.getElementById(
"local"
)

.innerHTML=

`

<option>
Najpierw wybierz lokalizację
</option>

`;



}
