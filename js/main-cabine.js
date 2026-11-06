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
    // jour 7
    formulaire_modification(trip);
    formulaire_suppression(trip);
    formulaire_attente(trip);
    afficherListeAttente(trip);
    mettreAJourEtats(trip)
    actualisation_page(trip);
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

// jour 7
function notification(paragraphe, message, succes) {
    paragraphe.textContent = message;
    if (succes) {
        paragraphe.className = "rounded px-3 py-2 text-sm bg-green-100 text-green-800 border border-green-400"
    } else {
        paragraphe.className = "rounded px-3 py-2 text-sm bg-red-100 text-red-800 border border-red-400";
    }
    clearTimeout(paragraphe.minuteur);
    paragraphe.minuteur = setTimeout(() => {
        paragraphe.textContent = "";
        paragraphe.className = "hidden";
    }, 3000);
}

function ajouterOption(select, valeur, texte) {
    const opt = document.createElement("option");
    opt.value = valeur;
    opt.textContent = texte;
    select.appendChild(opt)
}

function options_a_choisir(t) {
    const siegeReserver = document.getElementById("siegeReserver");
    const siegeModifier = document.getElementById("siegeModifier");
    const passagerModifier = document.getElementById("passagerModifier");
    const passagerSupprimer = document.getElementById("passagerSupprimer");

    siegeReserver.innerHTML = ""
    siegeModifier.innerHTML = "";
    passagerModifier.innerHTML = "";
    passagerSupprimer.innerHTML = "";
    document.getElementById("nouveauNom").value = "";
    document.getElementById("telephoneModifier").value = "";

    ajouterOption(siegeReserver, "", "Choisir un siège (facultatif)");
    ajouterOption(siegeModifier, "", "Garder le siège actuel");
    ajouterOption(passagerModifier, "", "Choisir un passager");
    ajouterOption(passagerSupprimer, "", "Choisir un passager");

    const libres = siegesLibres(t);
    for (let i = 0; i < libres.length; i++) {
        ajouterOption(siegeReserver, libres[i], libelleSiege(t.price, libres[i]));
        ajouterOption(siegeModifier, libres[i], libelleSiege(t.price, libres[i]));
    }

    for (let idx = 0; idx < t.reservations.length; idx++) {
        const r = t.reservations[idx];
        const texte = r.name + " (siège " + r.seat + ")";
        ajouterOption(passagerModifier, r.seat, texte);
        ajouterOption(passagerSupprimer, r.seat, texte);
    }
}

function mettreAJourEtats(t) {
    const complet = t.reservations.length >= t.capacity
    document.getElementById("fieldsetReserver").disabled = complet;
    document.getElementById("fieldsetAttente").disabled = !complet;
}

function actualisation_page(t) {
    afficherSieges(t);
    Bus_info(t);
    options_a_choisir(t);
    afficherListeAttente(t);
    mettreAJourEtats(t);
}

function formulaire_modification(t) {
    const passagerModifier = document.getElementById("passagerModifier");
    passagerModifier.addEventListener("change", () => {
        remplirFormulaireModifier(t);
    });
    document.getElementById("formModifier").addEventListener("submit", (e) => {
        e.preventDefault();
        modifier(t);
    });
}

function remplirFormulaireModifier(t) {
    const valeur = document.getElementById("passagerModifier").value;
    const nouveauNom = document.getElementById("nouveauNom");
    const telephoneModifier = document.getElementById("telephoneModifier");

    if (valeur === "") {
        nouveauNom.value = "";
        telephoneModifier.value = "";
        return;
    }
    const res = t.reservations.find(r => r.seat === Number(valeur))
    if (res !== undefined) {
        nouveauNom.value = res.name;
        telephoneModifier.value = res.phone;
    }
}

function modifier(t) {
    const message = document.getElementById("messageModifier");
    const valeur = document.getElementById("passagerModifier").value;
    const nom = document.getElementById("nouveauNom").value.trim();
    const telephone = document.getElementById("telephoneModifier").value.trim();
    const siegeChoisi = document.getElementById("siegeModifier").value;

    if (valeur === "") {
        notification(message, "Choisir un passager", false)
        return;
    }
    const ancienSiege = Number(valeur);

    const nomExiste = t.reservations.some(r => r.seat !== ancienSiege && r.name.trim().toUpperCase() === nom.toUpperCase())
    if (nom === "") {
        notification(message, "Le nom du passager est obligatoire.", false);
        return;
    }
    if (nomExiste) {
        notification(message, "Ce nom est déjà utilisé sur ce trajet.", false);
        return;
    }
    if (!/^0[67]\d{8}$/.test(telephone)) {
        notification(message, "10 chiffres commençant par 06 ou 07", false);
        return;
    }
    const telExiste = t.reservations.some(r => r.seat !== ancienSiege && r.phone === telephone) || t.waitingList.some(p => p.phone === telephone)
    if (telExiste) {
        notification(message, "Ce numéro est déjà utilisé sur ce trajet.", false);
        return;
    }

    let nouveauSiege = ancienSiege;
    if (siegeChoisi !== "") {
        nouveauSiege = Number(siegeChoisi);
    }
    if (nouveauSiege !== ancienSiege && !siegeLibre(t, nouveauSiege)) {
        notification(message, "Ce siège n'est plus disponible.", false);
        options_a_choisir(t);
        return;
    }

    const name = nom;
    const phone = telephone;
    const seat = nouveauSiege;
    t.reservations = t.reservations.map(r => {
        if (r.seat === ancienSiege) {
            return { ...r, name, phone, seat };
        }
        return r;
    })
    sauvegarder(trips);

    actualisation_page(t);
    notification(message, "Modification effectuée avec succès", true);
}

function formulaire_suppression(t) {
    document.getElementById("btnSupprimer").addEventListener("click", () => {
        annuler(t);
    });
}

function annuler(t) {
    const message = document.getElementById("messageSupprimer");
    const valeur = document.getElementById("passagerSupprimer").value;

    if (valeur === "") {
        notification(message, "Choisir un passager", false);
        return;
    }
    const siegeLibere = Number(valeur);

    t.reservations = t.reservations.filter(r => r.seat !== siegeLibere)

    let texte = "Réservation annulée avec succès";

    if (t.waitingList.length > 0) {
        const [premier, ...reste] = t.waitingList;
        t.reservations = [...t.reservations, { seat: siegeLibere, name: premier.name, phone: premier.phone }]
        t.waitingList = reste;
        texte = premier.name + " a obtenu le siège " + String(siegeLibere).padStart(2, "0");
    }

    sauvegarder(trips);
    actualisation_page(t);
    notification(message, texte, true);
}

function formulaire_attente(t) {
    document.getElementById("formAttente").addEventListener("submit", (e) => {
        e.preventDefault();
        ajouterAttente(t);
    });

    document.getElementById("listeAttente").addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        if (index === undefined) {
            return;
        }
        retirerAttente(t, Number(index));
    });
}

function ajouterAttente(t) {
    const message = document.getElementById("messageListAttente");
    const champNom = document.getElementById("NomListAttente");
    const champTel = document.getElementById("telephoneListAttente");
    const nom = champNom.value.trim();
    const telephone = champTel.value.trim();

    if (nom === "") {
        notification(message, "Le nom du passager est obligatoire.", false)
        return;
    }
    const nomExiste = t.reservations.some(r => r.name.trim().toUpperCase() === nom.toUpperCase())
    if (nomExiste) {
        notification(message, "Ce nom est déjà utilisé sur ce trajet.", false);
        return;
    }
    if (!/^0[67]\d{8}$/.test(telephone)) {
        notification(message, "10 chiffres commençant par 06 ou 07", false);
        return;
    }
    const telExiste = t.reservations.some(r => r.phone === telephone) || t.waitingList.some(p => p.phone === telephone)
    if (telExiste) {
        notification(message, "Ce numéro est déjà utilisé sur ce trajet.", false);
        return;
    }

    t.waitingList = [...t.waitingList, { name: nom, phone: telephone }]
    sauvegarder(trips);

    champNom.value = "";
    champTel.value = "";
    afficherListeAttente(t);
    notification(message, nom + " est en position " + t.waitingList.length, true)
}

function retirerAttente(t, index) {
    t.waitingList = t.waitingList.filter((p, i) => i !== index);
    sauvegarder(trips);
    afficherListeAttente(t);
}

function afficherListeAttente(t) {
    const liste = document.getElementById("listeAttente");
    let html = "";

    for (let i = 0; i < t.waitingList.length; i++) {
        const p = t.waitingList[i];
        html += `<li class="flex items-center justify-between gap-2 border border-gray-300 rounded px-3 py-1 text-sm"><span>${i + 1}. ${p.name} — ${p.phone}</span><button type="button" data-index="${i}" class="bg-red-500 text-white rounded px-3 py-1">Retirer</button></li>`;
    }
    if (html === "") {
        html = `<li class="text-sm text-gray-500">Aucun passager en attente</li>`;
    }
    liste.innerHTML = html
}