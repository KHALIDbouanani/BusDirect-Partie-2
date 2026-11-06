// jour 5
import {initialiser, sauvegarder} from './store.js';
import {estVIP, prixSiege, siegeLibre, siegesLibres, siegeAutomatique, libelleSiege} from './reservations.js';

const id = Number(new URLSearchParams(location.search).get("id"));
const trips = await initialiser();
let minuteur;

let trip;
if (trips) {
    trip = trips.find(trip => {
        return trip.id === id;
    });
}

if (trip === undefined) {
    afficherIntrouvable();
} else {
    afficherInfo(trip);
    afficherSieges(trip);
    // jour 6
    options_a_choisir(trip);
    formulaire_reservation(trip);
}

function afficherIntrouvable() {
    document.getElementById("Trajet").innerHTML = "";
    const main = document.querySelector("main");
    main.innerHTML = `<nav class="lg:col-span-3">
            <a href="index.html" class="inline-block bg-blue-100 border border-blue-400 rounded px-3 py-2">&larr; Trajets</a>
        </nav>
        <p class="lg:col-span-3 text-center text-lg border border-red-600 bg-red-200 font-semibold text-red-600 rounded">Trajet introuvable</p>`;
}

function afficherInfo(trip) {
    const infoTrajet = document.getElementById("Trajet");
    const route = infoTrajet.querySelector("#route");
    const prix = infoTrajet.querySelector("#prix");
    route.textContent = `${trip.departure} → ${trip.destination}`;
    prix.textContent = `${trip.price} DH/Place`;

    const horaires = document.createElement("p");
    horaires.className = "bg-sky-100 border border-sky-400 rounded px-3 py-1";
    horaires.textContent = `Départ ${trip.departureTime} - Arrivée ${trip.arrivalTime}`;
    infoTrajet.append(horaires);

    const disponibles = document.getElementById("disponibles");
    disponibles.textContent = trip.capacity - trip.reservations.length;

    const recetteTotale = trip.reservations.reduce((acc, reservation) => {
        return acc + prixSiege(trip.price, reservation.seat);
    }, 0);
    const recette = document.getElementById("recette");
    recette.textContent = recetteTotale;
}

function afficherSieges(trip) {
    const seats = document.getElementById("grillePlaces");
    let html = "";

    for (let num = 1; num <= 20; num++) {
        let occupe = false;
        for (let i = 0; i < trip.reservations.length; i++) {
            if (trip.reservations[i].seat === num) {
                occupe = true;
                break;
            }
        }
        const vip = estVIP(num);

        let couleur = "bg-white border border-gray-400";
        let nom = "Libre";
        let styleNom = "statut text-xs text-gray-500";
        let Vip = "";
        let cardVip = "";
        let colonne = "";

        if (vip) {
            Vip = "VIP ";
            couleur = "bg-amber-400 border border-amber-700";
            cardVip = `<span class="rounded bg-amber-700 px-1 text-[10px] font-bold text-white">VIP</span>`;
        }

        if (occupe) {
            const reservation = trip.reservations.find((r) => { return r.seat === num;});
            nom = reservation.name;
            styleNom = "statut text-xs truncate";
            if (vip) {
                couleur = "bg-red-300 border-2 border-amber-600";
            } else {
                couleur = "bg-red-300 border border-red-500";
            }
        }
        if (num % 4 === 3) {
            colonne = "col-start-4 ";
        }

        html += `<article id="place-${num}" class="Place ${Vip}${colonne}${couleur} rounded p-1 text-center min-w-0"><p class="numero font-bold">${num}</p><p class="${styleNom}">${nom}</p>${cardVip}</article>`;
    }

    seats.innerHTML = html;
}

// jour 6
function afficherErreur(paragraphe, msg) {
    paragraphe.textContent = msg;
    if (msg === "") {
        paragraphe.classList.add("hidden")
    } else {
        paragraphe.classList.remove("hidden");
    }
}

function effacerErreurs() {
    afficherErreur(document.getElementById("erreurNom"), "");
    afficherErreur(document.getElementById("erreurTelephone"), "");
    afficherErreur(document.getElementById("erreurSiege"), "");
}

function afficherConfirmation() {
    const msg = document.getElementById("messageReserver");
    msg.textContent = "Réservation confirmée";
    msg.className = "rounded px-3 py-2 text-sm bg-green-100 text-green-800 border border-green-400";
    clearTimeout(minuteur);
    minuteur = setTimeout(() => {
        msg.textContent = "";
        msg.className = "hidden";
    }, 3000);
}

function formulaire_reservation(t) {
    const formulaire = document.getElementById("formReserver");
    formulaire.addEventListener("submit", (e) => {
        e.preventDefault();
        reserver(t, formulaire);
    })
}

function reserver(t, formulaire) {
    const nom = document.getElementById("nomPassager").value.trim()
    const telephone = document.getElementById("numéroPassager").value.trim();
    const siegeChoisi = document.getElementById("siegeReserver").value;
    const erreurSiege = document.getElementById("erreurSiege");

    effacerErreurs();

    if (nom === "") {
        afficherErreur(document.getElementById("erreurNom"), "Le nom du passager est obligatoire.");
        return;
    }
    const nomExiste = t.reservations.some(r => r.name.trim().toUpperCase() === nom.toUpperCase())
    if (nomExiste) {
        afficherErreur(document.getElementById("erreurNom"), "Ce nom est déjà utilisé sur ce trajet.");
        return;
    }
    if (!/^0[67]\d{8}$/.test(telephone)) {
        afficherErreur(document.getElementById("erreurTelephone"), "10 chiffres commençant par 06 ou 07");
        return;
    }
    const telExiste = t.reservations.some(r => r.phone === telephone) || t.waitingList.some(p => p.phone === telephone);
    if (telExiste) {
        afficherErreur(document.getElementById("erreurTelephone"), "Ce numéro est déjà utilisé sur ce trajet.");
        return;
    }

    let numero;
    if (siegeChoisi === "") {
        numero = siegeAutomatique(t);
        if (numero === null) {
            afficherErreur(erreurSiege, "Ce trajet est complet.");
            return;
        }
    } else {
        numero = Number(siegeChoisi);
        if (!siegeLibre(t, numero)) {
            afficherErreur(erreurSiege, "Ce siège n'est plus disponible.");
            options_a_choisir(t);
            return;
        }
    }

    const nouvelle = { seat: numero, name: nom, phone: telephone };
    t.reservations = [...t.reservations, nouvelle];
    sauvegarder(trips);

    afficherSieges(t);
    Bus_info(t);
    formulaire.reset();
    options_a_choisir(t);
    mettreAJourEtats(t);
    afficherConfirmation();
}

