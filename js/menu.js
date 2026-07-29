document.addEventListener("DOMContentLoaded",()=>{


const menuBtn =
document.getElementById("menuBtn");


const menuList =
document.getElementById("menuList");



if(menuBtn){


menuBtn.onclick=()=>{


menuList.classList.toggle("active");


};


}




const addBtn =
document.getElementById("addBtn");



if(addBtn){


addBtn.onclick=()=>{


document
.getElementById("modalOverlay")
.classList.remove("hidden");



document
.getElementById("successBox")
.classList.add("hidden");



document
.getElementById("modalTitle")
.innerText="Dodaj dokument";



menuList.classList.remove("active");


};



}






const allLocations =
document.getElementById("allLocations");



if(allLocations){


allLocations.onclick=()=>{


if(typeof selectedLocation !== "undefined"){

selectedLocation="WSZYSTKIE";

}



if(typeof render==="function"){

render();

}



menuList.classList.remove("active");


};


}






});
