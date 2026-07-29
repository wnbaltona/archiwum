document.addEventListener(
"DOMContentLoaded",
()=>{


const menuBtn =
document.getElementById("menuBtn");


const menuList =
document.getElementById("menuList");



if(!menuBtn || !menuList){

return;

}





// rozwijanie menu

menuBtn.addEventListener(
"click",
(e)=>{


e.stopPropagation();


menuList.classList.toggle(
"active"
);



});







// klik poza menu - zamykanie


document.addEventListener(
"click",
()=>{


menuList.classList.remove(
"active"
);


});





// żeby kliknięcie w menu go nie zamykało

menuList.addEventListener(
"click",
(e)=>{


e.stopPropagation();


});






// dodawanie dokumentu


const addBtn =
document.getElementById("addBtn");



if(addBtn){


addBtn.onclick=()=>{


if(typeof openAddModal==="function"){


openAddModal();


}



menuList.classList.remove(
"active"
);



};


}





});
