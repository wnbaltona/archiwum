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





menuBtn.onclick=()=>{


menuList.classList.toggle(
"hidden"
);


};







document.addEventListener(
"click",
(e)=>{


if(
!menuBtn.contains(e.target)
&&
!menuList.contains(e.target)
){


menuList.classList.add(
"hidden"
);


}



});



});
