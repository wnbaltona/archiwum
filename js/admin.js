const addBtn =
document.getElementById("addBtn");


const panel =
document.getElementById("adminPanel");


addBtn.onclick=()=>{

panel.classList.toggle("hidden");

};





document
.getElementById("saveBtn")
.onclick=async()=>{


const doc={


lokalizacja:
location.value,


nazwa:
name.value,


typ:
type.value,


regal:
shelf.value,


polka:
level.value,


segregator:
folder.value,


uwagi:
notes.value


};



const {error}=await supabaseClient
.from("dokumenty")
.insert([doc]);



if(error){

alert("Błąd zapisu");

console.log(error);

return;

}



alert("Dodano");


location.reload();


};