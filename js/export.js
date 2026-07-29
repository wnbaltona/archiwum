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





if(excelBtn){


excelBtn.onclick=()=>{


exportExcel();


};


}







if(csvBtn){


csvBtn.onclick=()=>{


exportCSV();


};


}







if(missingBtn){


missingBtn.onclick=()=>{


exportMissing();


};


}



});









function exportExcel(){



if(!documents.length){


alert(
"Brak dokumentów do eksportu"
);


return;


}






const data =

documents.map(doc=>({


Lokalizacja:
doc.lokalizacja,


"Lokal":
doc.numer_lokalu,


Dokument:
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
doc.uwagi


}));






const sheet =

XLSX.utils.json_to_sheet(data);



const workbook =

XLSX.utils.book_new();



XLSX.utils.book_append_sheet(

workbook,

sheet,

"Archiwum"

);



XLSX.writeFile(

workbook,

"archiwum_dokumentow.xlsx"

);



}









function exportCSV(){



let csv =

"Lokalizacja;Lokal;Dokument;Typ;Regal;Polka;Segregator;Status;Uwagi\n";





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



link.href=

URL.createObjectURL(blob);



link.download=

"archiwum.csv";



link.click();



}









function exportMissing(){



const missing =

documents.filter(doc=>

doc.status==="Do uzupełnienia"

||

doc.status==="Brak dokumentu"

);






if(!missing.length){


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


------------------

`;



});







const blob=

new Blob(

[text],

{
type:"text/plain"
}

);





const link=

document.createElement("a");



link.href=

URL.createObjectURL(blob);



link.download=

"raport_brakow.txt";



link.click();



}
