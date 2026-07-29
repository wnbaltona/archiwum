const menuBtn =
document.getElementById("menuBtn");


const menuPanel =
document.getElementById("menuPanel");



menuBtn.onclick = ()=>{


menuPanel.classList.toggle("show");


};




document
.getElementById("addBtn")
.onclick=()=>{


document
.getElementById("adminPanel")
.classList.toggle("hidden");


};




document
.getElementById("allLocations")
.onclick=()=>{


selectedLocation="WSZYSTKIE";


render();


};
