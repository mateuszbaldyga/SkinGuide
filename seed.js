var mongoose = require("mongoose");
var Group   = require("./models/group");

var data = [
    {
        name: "Nitkowanie (ang. threading)", 
        procedures: [
            { name: "Konsultacja, nitkowanie, masaz oraz makijaz brwi", price: 39 },
            {name: "Konsultacja, nitkowanie, masaż oraz henna brwi", price: 59},
            {name: "Konsultacja i nitkowanie brwi oraz henna brwi i rzęs", price: 75},
            {name: "Odbudowa brwi: dobranie kształtu, 3 spotkania z dedykowaną stylistką, nitkowanie, henna, zestaw kosmetyków (wosk oraz cień do brwi)", price: 159},
            {name: "Nitkowanie wąsika", price: 29},
            {name: "Nitkowanie brody", price: 20},
            {name: "Nitkowanie policzków", price: 39},
            {name: "Nitkowanie – cała twarz", price: 89},
            {name: "Nitkowanie szyi", price: 39},
            {name: "Henna brwi oraz masaż", price: 25},
            {name: "Henna rzęs oraz masaż", price: 25},
        ]
    },
    {
        name: "Przedłużanie rzęs", 
        procedures: [
            {name: "Przedłużanie rzęs metodą 1:1", price: 199},
            {name: "Przedłużanie rzęs metodą 2:1/Volume", price: 279},
            {name: "Uzupełnianie 1:1", price: 90},
            {name: "Uzupełnienie 2:1 /Volume", price: 120},
            {name: "Express Lashes", price: 129},
            {name: "Zdjęcie rzęs ( 1:1, 2:1 oraz Express)", price: 40},
            ]
    },
    {
        name: "Usługi wizażowe", 
        procedures: [
            {name: "Makijaż dzienny naturalny", price: 49},
            {name: "Makijaż dzienny biznesowy", price: 99},
            {name: "Makijaż wieczorowy", price: 149},
            ]
    },
    {
        name: "Zabiegi dodatkowe", 
        procedures: [
            {name: "Trwałe podkręcenie rzęs", price: 89},
            {name: "Trwałe podkręcenie rzęs z henną", price: 99},
            {name: "Maska odżywcza na brwi i rzęsy", price: 19},
            {name: "Masaż twarzy z elementami refleksologii", price: 49},
            ]
    },
];


// mongoose.connect("mongodb://localhost/skin_guide");

function seedDB(){
  Group.remove({}, function(err){
        if (!err) console.log('Success0!');
        console.log("removed all procedures!");
        data.forEach(function(seed){
            var group = new Group({
                name: seed.name,
            });
            group.save(function (err) {
                if (!err) console.log('Success1!');
            });
            seed.procedures.forEach(function(procedure){
                group.procedures.push(procedure);
                group.save(function (err) {
                    if (!err) console.log('Success2!');
                });
            })
            
        });
    });
};


module.exports = seedDB;
