document
.getElementById("showAdmin")
.onclick=()=>{


document
.getElementById("adminPanel")
.classList.toggle("hidden");


};



document
.getElementById("addDocument")
.onclick=()=>{


let newDoc={

"Lokalizacja":
document.getElementById("location").value,

"Nazwa dokumentu":
document.getElementById("name").value,

"Typ":
document.getElementById("type").value,

"Regał":
document.getElementById("shelf").value,

"Półka":
document.getElementById("level").value,

"Segregator":
document.getElementById("folder").value,

"Uwagi":
document.getElementById("notes").value

};



documents.push(newDoc);


showLocations();


alert("Dodano dokument");


};
