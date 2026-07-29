document
.getElementById("showAdmin")
.onclick = ()=>{


document
.getElementById("adminPanel")
.classList.toggle("hidden");


};





document
.getElementById("addDocument")
.onclick = async ()=>{


const newDocument = {


lokalizacja:
document.getElementById("location").value,


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



const {data,error} = await supabaseClient

.from("dokumenty")

.insert([newDocument])

.select();



if(error){

console.log(error);

alert(
"Błąd zapisu dokumentu"
);

return;

}



alert(
"Dokument został dodany"
);



location.reload();


};