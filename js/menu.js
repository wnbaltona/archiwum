// ===============================
// MENU.JS
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const menuBtn = document.getElementById("menuBtn");
    const menuList = document.getElementById("menuList");

    if (!menuBtn || !menuList) return;

    // menu startowo zamknięte
    menuList.classList.add("hidden");

    // otwieranie / zamykanie
    menuBtn.addEventListener("click", (e) => {

        e.stopPropagation();

        menuList.classList.toggle("hidden");

    });

    // kliknięcie poza menu zamyka menu
    document.addEventListener("click", (e) => {

        if (
            !menuList.contains(e.target) &&
            !menuBtn.contains(e.target)
        ) {

            menuList.classList.add("hidden");

        }

    });

    // kliknięcie w pozycję menu również je zamyka
    menuList.querySelectorAll("button").forEach(button => {

        button.addEventListener("click", () => {

            menuList.classList.add("hidden");

        });

    });

});
