const adminButton =
document.getElementById("showAdmin");


const adminPanel =
document.getElementById("adminPanel");



adminButton.onclick=()=>{


adminPanel.classList.toggle("hidden");


};





document
.getElementById("addDocument")
.onclick = async ()=>{


const documentData={


nazwa:
document.getElementById("name").value,


typ:
document.getElementById("type").value,


miasto:
document.getElementById("city").value,


lokal:
document.getElementById("local").value,


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

alert(
"Błąd zapisu"
);

console.log(error);

return;

}



alert(
"Dokument dodany!"
);


location.reload();


};