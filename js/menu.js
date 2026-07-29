const menuBtn = document.getElementById("menuBtn");
const menuList = document.getElementById("menuList");


menuBtn.addEventListener("click", () => {

    menuList.classList.toggle("active");

});



const addBtn = document.getElementById("addBtn");

addBtn.addEventListener("click", () => {

    document
    .getElementById("adminPanel")
    .classList.toggle("hidden");

});



const allLocations = document.getElementById("allLocations");


if(allLocations){

    allLocations.addEventListener("click", () => {


        if(typeof selectedLocation !== "undefined"){

            selectedLocation = "WSZYSTKIE";

        }


        if(typeof render === "function"){

            render();

        }


    });

}
