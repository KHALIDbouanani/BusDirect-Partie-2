function search(num) {
    for (let i = 0; i < reservations.length; i++) {
        if (reservations[i].numero === num) {
            return reservations[i];
        }
    }
    return null;
}
function siege_automatique() {
    for (let num = 1; num <= nombreSieges; num++) {
        if (search(num) === null) {
            return num;
        }
    }
    return "full";
}
function nom_exist(nom, num_to_skip) {
    for (let i = 0; i < reservations.length; i++) {
        const memeNom = reservations[i].nom.toUpperCase() === nom.toUpperCase();
        if (memeNom && reservations[i].numero !== num_to_skip) {
            return true;
        }
    }
    return false;
}
function option(select, valeur, affichage) {
    const option = document.createElement("option");
    option.value = valeur;
    option.textContent = affichage;
    select.appendChild(option);
}
function actualisation_page() {
    Sieges()
    options_a_choisir()
    Bus_info()
}
function Sieges() {
    for (let i = 0; i < places.length; i++) {
        const numero = Number(places[i].querySelector(".numero").textContent);
        const statut = places[i].querySelector(".statut");
        const reservation = search(numero);
        if (reservation === null) {
            places[i].classList.remove("bg-red-300", "border-red-500");
            places[i].classList.add("bg-white", "border-gray-400");
            statut.textContent = "Libre";
            statut.classList.remove("truncate");
            statut.classList.add("text-gray-500");
        } else {
            places[i].classList.remove("bg-white", "border-gray-400");
            places[i].classList.add("bg-red-300", "border-red-500");
            statut.textContent = reservation.nom;
            statut.classList.remove("text-gray-500");
            statut.classList.add("truncate");
        }
    }
}
function options_a_choisir() {
    siegeReserver.innerHTML = "";
    siegeModifier.innerHTML = "";
    passagerModifier.innerHTML = "";
    passagerSupprimer.innerHTML = "";
    option(siegeReserver, "", "Choisir un siege (facultatif)");
    option(siegeModifier, "", "Garder le siège actuel");
    option(passagerModifier, "", "Choisir un passager");
    option(passagerSupprimer, "", "Choisir un passager");
    for (let num = 1; num <= nombreSieges; num++) {
        if (search(num) === null) {
        option(siegeReserver, num, "Siège " + num);
        option(siegeModifier, num, "Siège " + num);
        }
    } 
    for (let i = 0; i < reservations.length; i++) {
    const texte = reservations[i].nom + " (siège " + reservations[i].numero + ")";
        option(passagerModifier, reservations[i].numero, texte);
        option(passagerSupprimer, reservations[i].numero, texte);
    }
}
function Bus_info() {
    disponibles.textContent = nombreSieges - reservations.length;
    recette.textContent = reservations.length * prixPlace;
}
function Notification (section,message,check){
    section.textContent = message;
    if(check){
        section.className = "rounded px-3 py-2 text-sm bg-green-100 text-green-800 border border-green-400";
    }else{
        section.className = "rounded px-3 py-2 text-sm bg-red-100 text-red-800 border border-red-400";
    }
    setTimeout(function(){section.className = ("hidden")},3000);
}


const disponibles = document.getElementById("disponibles")
const recette = document.getElementById("recette")
const places = document.querySelectorAll(".Place")
const inputNom = document.getElementById("nomPassager")
const siegeReserver = document.getElementById("siegeReserver")
const btnConfirmer = document.getElementById("btnConfirmer")
const messageReserver = document.getElementById("messageReserver")
// ---------------Modification----------------------------------------------
const passagerModifier = document.getElementById("passagerModifier")
const nouveauNom = document.getElementById("nouveauNom")
const siegeModifier = document.getElementById("siegeModifier")
const btnModifier = document.getElementById("btnModifier")
const messageModifier = document.getElementById("messageModifier")
// -----------------Suppression--------------------- 
const passagerSupprimer = document.getElementById("passagerSupprimer")
const btnSupprimer = document.getElementById("btnSupprimer")
const messageSupprimer = document.getElementById("messageSupprimer")

const prixPlace = 80
const nombreSieges = 20
let reservations = [];

storage()
// ------------------>Reservation<---------------

btnConfirmer.addEventListener("click", function () {
    let numero;
    const nom = inputNom.value.trim();
    if (nom === "") {
        Notification (messageReserver,"Entrer un nom",false)
        return;
    }
    if (nom_exist(nom, 0)) {
        Notification (messageReserver,"Le nom existe déja",false)
        return;
    }
    if (siegeReserver.value === "") {
        numero = siege_automatique();
        if (numero === "full") {
            Notification (messageReserver,"!!LES PLACES SONT PLEINES!!",false)
            return;
        }
    } else {
        numero = Number(siegeReserver.value);
    }
    Notification (messageReserver,"Réservation complète avec succès",true)
    reservations.push({ numero: numero, nom: nom });
    sauvegarder()
    actualisation_page();
    inputNom.value = "";
});

// ----------------->Modification<----------------

function Formulaire_de_Modifier() {
    if (passagerModifier.value === "") {
        nouveauNom.value = "";
        return;
    }
    const reservation = search(Number(passagerModifier.value));
    if (reservation !== null) {
        nouveauNom.value = reservation.nom;
    }
}
passagerModifier.addEventListener("change", Formulaire_de_Modifier)
btnModifier.addEventListener("click", function () {
    if (passagerModifier.value === "") {
        Notification (messageModifier,"Choisir un passager",false)
        return;
    }
    const ancienNumero = Number(passagerModifier.value);
    const reservation = search(ancienNumero);
    const nom = nouveauNom.value.trim();

    if (nom === "") {
        Notification (messageModifier,"Le nom est obligatoire",false)
        return;
    }
    if (nom_exist(nom, ancienNumero)) {
        Notification (messageModifier,"Le nom existe déja",false)
        return;
    }

    let nouveauNumero = ancienNumero;
    if (siegeModifier.value !== "") {
        nouveauNumero = Number(siegeModifier.value);
    }
    Notification (messageModifier,"Modification complète avec succès",true)
    reservation.nom = nom;
    reservation.numero = nouveauNumero;
    sauvegarder()
    actualisation_page();
    nouveauNom.value = "";
});

// ------------->suppression<-------------

btnSupprimer.addEventListener("click", function() {
    if (passagerSupprimer.value === "") {
        Notification(messageSupprimer,"Choisir un passager",false)
        return;
    }
    const numero = Number(passagerSupprimer.value);
    for (let i = 0; i < reservations.length; i++) {
        if (reservations[i].numero === numero) {
            reservations.splice(i, 1);
            break;
        }
    }
    sauvegarder()
    Notification(messageSupprimer,"Suppression complète avec succès",true)
    actualisation_page();
    nouveauNom.value = ""; 
});
function storage(){
    const KEY = localStorage.getItem("reservations");
    if(KEY!==null){
        reservations = JSON.parse(KEY);
    }
}
function sauvegarder() {
    localStorage.setItem("reservations",JSON.stringify(reservations));
}
actualisation_page()