// ===============================
// EXPORT.JS
// ===============================


document.addEventListener(
"DOMContentLoaded",
()=>{


document

.getElementById("exportBtn")

?.addEventListener(

"click",

exportDocuments

);



});









async function exportDocuments(){



const {

data,

error

}

=

await supabaseClient

.from("dokumenty")

.select("*");







if(error){

alert(
"Błąd eksportu: " + error.message
);

return;

}







if(!data || data.length===0){


alert(
"Brak dokumentów do eksportu"
);


return;


}







const headers =

Object.keys(
data[0]
);







let csv =

headers.join(";")
+
"\n";







data.forEach(
row=>{


csv +=

headers.map(

h=>

`"${

(row[h] ?? "")

.toString()

.replaceAll('"','""')

}"`

)

.join(";")

+

"\n";



});







const blob =

new Blob(

[

"\ufeff" + csv

],

{

type:
"text/csv;charset=utf-8;"

}

);







const url =

URL.createObjectURL(
blob
);







const link =

document.createElement(
"a"
);



link.href=url;



link.download =
"archiwum_dokumentow.csv";



document.body.appendChild(
link
);



link.click();



document.body.removeChild(
link
);



URL.revokeObjectURL(
url
);



}