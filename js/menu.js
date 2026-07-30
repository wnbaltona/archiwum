// ===============================
// MENU.JS
// ===============================


document.addEventListener(
"DOMContentLoaded",
()=>{


const menuBtn =
document.getElementById(
"menuBtn"
);



const menuList =
document.getElementById(
"menuList"
);




if(!menuBtn || !menuList)
return;





// startowo zamknięte

menuList.classList.add(
"hidden"
);







// kliknięcie ikony menu


menuBtn.addEventListener(
"click",
(e)=>{


e.stopPropagation();



menuList.classList.toggle(
"hidden"
);



}

);








// klik poza menu


document.addEventListener(
"click",
(e)=>{


if(

!menuList.contains(e.target)

&&

!menuBtn.contains(e.target)

){


menuList.classList.add(
"hidden"
);



}



}

);








// kliknięcie opcji menu


menuList

.querySelectorAll(
"button"
)

.forEach(
button=>{


button.addEventListener(
"click",
()=>{


menuList.classList.add(
"hidden"
);



}

);



}

);



});