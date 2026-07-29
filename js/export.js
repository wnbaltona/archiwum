document.addEventListener(
"DOMContentLoaded",
()=>{


const btn =
document.getElementById(
"exportBtn"
);



if(btn){


btn.onclick=()=>{


exportDocuments();


};


}



});







async function exportDocuments(){



const {

data,

error

}

=

await supabaseClient

.from("dokumenty")

.select(`

*,

lokale(
mpk,
nazwa,
lokalizacja
),

kontrahenci(
nazwa
)

`);






if(error){


alert(
"Błąd eksportu"
);


return;


}







let csv =

"Dokument,Lokalizacja,Lokal,MPK,Kontrahent,Rok,Typ,Regał,Półka,Status\n";







data.forEach(doc=>{


csv +=

`

"${doc.nazwa || ""}",

"${doc.lokale?.lokalizacja || ""}",

"${doc.lokale?.nazwa || ""}",

"${doc.lokale?.mpk || ""}",

"${doc.kontrahenci?.nazwa || ""}",

"${doc.rok || ""}",

"${doc.typ || ""}",

"${doc.regal || ""}",

"${doc.polka || ""}",

"${doc.status || ""}"

\n`;



});








const blob =
new Blob(
[
csv
],
{
type:"text/csv;charset=utf-8;"
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


link.download=
"archiwum_dokumentow.csv";



link.click();




URL.revokeObjectURL(
url
);



}
