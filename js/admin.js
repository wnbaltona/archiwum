document.addEventListener("DOMContentLoaded",()=>{


const saveBtn =
document.getElementById("saveBtn");



saveBtn.onclick = async ()=>{


const documentData={


lokalizacja:
document.getElementById("location").value,


numer_lokalu:
document.getElementById("number").value,


nazwa:
document.getElementById("name").value,


typ:
document.getElementById("type").value,


regal:
document.getElementById("shelf").value,


polka:
document.getElementById("level").value,


segregator:
document.getElementById("folder").value,


uwagi:
document.getElementById("notes").value


};





const {error}=await supabaseClient

.from("dokumenty")

.insert([documentData]);





if(error){

console.error(error);

alert("Błąd zapisu");

return;

}





document
.getElementById("successBox")
.classList.remove("hidden");





document
.getElementById("addAnother")
.onclick=()=>{


document
.getElementById("successBox")
.classList.add("hidden");


};



};



});
