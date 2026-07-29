document.addEventListener("DOMContentLoaded",()=>{


const menuBtn =
document.getElementById("menuBtn");


const menuList =
document.getElementById("menuList");




menuBtn.onclick=()=>{


menuList.classList.toggle("active");


};






// OTWARCIE FORMULARZA DODAWANIA


const addBtn =
document.getElementById("addBtn");



addBtn.onclick=()=>{


document
.getElementById("modalOverlay")
.classList.remove("hidden");



document
.getElementById("modalTitle")
.innerText=
"Dodaj dokument";



document
.getElementById("saveBtn")
.innerText=
"Zapisz dokument";



document
.getElementById("successBox")
.classList.add("hidden");



editingId=null;



menuList.classList.remove("active");



};






// WSZYSTKIE LOKALIZACJE


const allLocations =
document.getElementById("allLocations");



allLocations.onclick=()=>{


selectedLocation="WSZYSTKIE";


render();



menuList.classList.remove("active");


};






});
