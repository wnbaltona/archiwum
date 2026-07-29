document.addEventListener("DOMContentLoaded",()=>{


const menuBtn =
document.getElementById("menuBtn");


const menuList =
document.getElementById("menuList");



menuBtn.onclick=()=>{

menuList.classList.toggle("active");

};





document.getElementById("addBtn").onclick=()=>{


document
.getElementById("modalOverlay")
.classList.remove("hidden");


menuList.classList.remove("active");


};





document.getElementById("closeModal").onclick=()=>{


document
.getElementById("modalOverlay")
.classList.add("hidden");


};





document.getElementById("closeAfterSave").onclick=()=>{


document
.getElementById("modalOverlay")
.classList.add("hidden");


};





document.getElementById("addAnother").onclick=()=>{


document
.getElementById("successBox")
.classList.add("hidden");


};



document.getElementById("allLocations").onclick=()=>{


if(typeof selectedLocation !== "undefined"){

selectedLocation="WSZYSTKIE";

}


if(typeof render==="function"){

render();

}


};


});
