const menuButton = document.getElementById("menuBtn");
const menuDropdown = document.getElementById("menuList");


if(menuButton && menuDropdown){

    menuButton.addEventListener("click", () => {

        menuDropdown.classList.toggle("active");

    });

}



// otwieranie formularza

const addDocumentButton = document.getElementById("addBtn");


if(addDocumentButton){

    addDocumentButton.addEventListener("click", () => {


        const panel = document.getElementById("adminPanel");


        if(panel){

            panel.classList.toggle("hidden");

        }


    });

}



// wszystkie lokalizacje

const allLocationsButton =
document.getElementById("allLocations");


if(allLocationsButton){

    allLocationsButton.addEventListener("click",()=>{


        if(typeof selectedLocation !== "undefined"){

            selectedLocation="WSZYSTKIE";

        }


        if(typeof render === "function"){

            render();

        }


    });

}
