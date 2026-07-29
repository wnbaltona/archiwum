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
"Błąd eksportu: "
+
error.message
);


return;


}





if(
!data ||
data.length===0
){


alert(
"Brak dokumentów do eksportu"
);


return;


}







const headers=[

"Lokalizacja",

"Lokal",

"Nazwa dokumentu",

"Typ",

"Rok",

"Kontrahent",

"Regał",

"Półka",

"Segregator",

"Status",

"Uwagi"

];







let csv=headers.join(";")
+
"\n";






data.forEach(doc=>{



csv +=

[


doc.lokalizacja,

doc.numer_lokalu,

doc.nazwa,

doc.typ,

doc.rok,

doc.nazwa_kontrahenta,

doc.regal,

doc.polka,

doc.segregator,

doc.status,

doc.uwagi


]

.map(value=>{


if(value===null || value===undefined)

return "";


return String(value)
.replaceAll(";"," ");


})

.join(";")

+

"\n";



});









const blob =

new Blob(

[

"\ufeff"

+

csv

],

{

type:
"text/csv;charset=utf-8;"

}

);







const url =

URL.createObjectURL(blob);





const link =

document.createElement(
"a"
);



link.href=url;



link.download=

"dokumenty_export.csv";



link.click();






URL.revokeObjectURL(url);



}
