document.addEventListener(
"DOMContentLoaded",
()=>{


const btn =
document.getElementById(
"menuBtn"
);


const menu =
document.getElementById(
"menuList"
);





if(!btn || !menu)
return;





btn.onclick=()=>{


menu.classList.toggle(
"hidden"
);


};







document.addEventListener(
"click",
(e)=>{


if(

!menu.contains(e.target)

&&

!btn.contains(e.target)

){


menu.classList.add(
"hidden"
);


}


});



});
