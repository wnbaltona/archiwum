const menuBtn = document.getElementById("menuBtn");

const menuList = document.getElementById("menuList");


menuBtn.addEventListener("click", function(){

    menuList.classList.toggle("show");

});



const addBtn = document.getElementById("addBtn");


addBtn.addEventListener("click", function(){

    const panel = document.getElementById("adminPanel");

    panel.classList.toggle("hidden");

});




const allLocations =
document.getElementById("allLocations");


allLocations.addEventListener("click", function(){


    if(typeof selectedLocation !== "undefined"){

        selectedLocation = "WSZYSTKIE";

    }


    if(typeof render === "function"){

        render();

    }


});
