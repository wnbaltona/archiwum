const menuBtn =
document.getElementById("menuBtn");


const menuList =
document.getElementById("menuList");



menuBtn.addEventListener("click", ()=>{


menuList.classList.toggle("show");

document
.getElementById("allLocations")
.addEventListener(
"click",
()=>{

selectedLocation="WSZYSTKIE";

render();

});
