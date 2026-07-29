const menuBtn =
document.getElementById("menuBtn");


const menuList =
document.getElementById("menuList");



menuBtn.addEventListener("click",()=>{


menuList.classList.toggle("active");


});





document
.getElementById("addBtn")
.addEventListener("click",()=>{


document
.getElementById("adminPanel")
.classList.toggle("hidden");


});





document
.getElementById("allLocations")
.addEventListener("click",()=>{


if(typeof selectedLocation !== "undefined"){

selectedLocation="WSZYSTKIE";

}



if(typeof render === "function"){

render();

}


});
