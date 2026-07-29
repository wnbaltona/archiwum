document.addEventListener("DOMContentLoaded",()=>{


const menuBtn =
document.getElementById("menuBtn");


const menuList =
document.getElementById("menuList");



const addBtn =
document.getElementById("addBtn");


const allLocations =
document.getElementById("allLocations");






// OTWIERANIE MENU


if(menuBtn){


menuBtn.onclick=()=>{


menuList.classList.toggle("active");


};


}







// DODAJ DOKUMENT


if(addBtn){


addBtn.onclick=()=>{



const modal =
document.getElementById("modalOverlay");



modal.classList.remove("hidden");



document
.getElementById("modalTitle")
.innerText=
"Dodaj dokument";



document
.getElementById("saveBtn")
.innerText=
"Zapisz dokument";






// czyszczenie formularza


document
.querySelectorAll(
".modal input, .modal textarea"
)

.forEach(field=>{


field.value="";


field.classList.remove("invalid");


});





const location =
document.getElementById("location");



if(location){


location.value="";


}




editingId=null;




document
.getElementById("successBox")
.classList.add("hidden");



document
.getElementById("errorBox")
.classList.add("hidden");





menuList.classList.remove("active");


};


}









// WSZYSTKIE LOKALIZACJE


if(allLocations){



allLocations.onclick=()=>{


selectedLocation="WSZYSTKIE";


if(typeof render==="function"){


render();


}



menuList.classList.remove("active");



};


}





});
