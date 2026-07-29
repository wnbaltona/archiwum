document.addEventListener(
"DOMContentLoaded",
()=>{


const excelBtn =
document.getElementById(
"exportExcelBtn"
);


const csvBtn =
document.getElementById(
"exportCsvBtn"
);


const missingBtn =
document.getElementById(
"missingBtn"
);





// =======================
// EXPORT EXCEL
// =======================


if(excelBtn){


excelBtn.onclick=()=>{


exportExcel();


};



}






// =======================
// EXPORT CSV
// =======================


if(csvBtn){


csvBtn.onclick=()=>{


exportCSV();


};


}







// =======================
// RAPORT BRAKÓW
// =======================


if(missingBtn){


missingBtn.onclick=()=>{


exportMissing();


};


}



});









// =======================
// EXCEL
// =======================


function exportExcel(){



if(!documents || documents.length===0){


alert(
"Brak danych do eksportu"
);


return;


}






const rows =
documents.map(doc=>({



Lokalizacja:
doc.lokalizacja,


"Lokal":
doc.numer_lokalu,


"Nazwa dokumentu":
doc.nazwa,


Typ:
doc.typ,


Regał:
doc.regal,


Półka:
doc.polka,


Segregator:
doc.segregator,


Status:
doc.status,


Uwagi:
doc.uwagi,


"Data dodania":
doc.created_at



}));







const worksheet =
XLSX.utils.json_to_sheet(rows);



const workbook =
XLSX.utils.book_new();



XLSX.utils.book_append_sheet(

workbook,

worksheet,

"Archiwum"

);





XLSX.writeFile(

workbook,

"archiwum_dokumentow.xlsx"

);



}









// =======================
// CSV
// =======================


function exportCSV(){



let csv="";




csv +=

"Lokalizacja;Lokal;Nazwa;Typ;Regal;Polka;Segregator;Status;Uwagi\n";







documents.forEach(doc=>{



csv +=

`${doc.lokalizacja};${doc.numer_lokalu};${doc.nazwa};${doc.typ};${doc.regal};${doc.polka};${doc.segregator};${doc.status};${doc.uwagi}\n`;



});








const blob =
new Blob(

[csv],

{
type:"text/csv;charset=utf-8;"
}

);






const link =
document.createElement("a");



link.href =
URL.createObjectURL(blob);



link.download =
"archiwum_dokumentow.csv";



link.click();



}









// =======================
// BRAKI
// =======================


function exportMissing(){



const missing =

documents.filter(doc=>

doc.status==="Do uzupełnienia"

||

doc.status==="Brak dokumentu"

);





if(missing.length===0){


alert(
"Brak dokumentów wymagających uzupełnienia"
);


return;


}







let text=

"RAPORT BRAKUJĄCYCH DOKUMENTÓW\n\n";






missing.forEach(doc=>{


text +=

`

Lokalizacja:
${doc.lokalizacja}

Lokal:
${doc.numer_lokalu}

Dokument:
${doc.nazwa}

Status:
${doc.status}

----------------------

`;



});







const blob =
new Blob(

[text],

{
type:"text/plain"
}

);






const link =
document.createElement("a");



link.href =
URL.createObjectURL(blob);



link.download =
"raport_brakow.txt";



link.click();



}