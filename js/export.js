document.addEventListener(
"DOMContentLoaded",
()=>{


document

.getElementById(
"exportBtn"
)

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







if(!data || data.length===0){


alert(
"Brak danych do eksportu"
);


return;


}







let csv =

[
[
"Lokalizacja",
"Lokal",
"Nazwa",
"Typ",
"Regał",
"Półka",
"Segregator",
"Status",
"Kontrahent",
"Rok",
"Uwagi"
]

];







data.forEach(doc=>{



csv.push([


doc.lokalizacja || "",

doc.numer_lokalu || "",

doc.nazwa || "",

doc.typ || "",

doc.regal || "",

doc.polka || "",

doc.segregator || "",

doc.status || "",

doc.nazwa_kontrahenta || "",

doc.rok || "",

doc.uwagi || ""


]);



});








const content =

csv

.map(row=>

row

.map(value=>

`"${String(value).replaceAll('"','""')}"`

)

.join(";")

)

.join("\n");







const blob =

new Blob(

[
content
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
