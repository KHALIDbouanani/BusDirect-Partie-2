export function validerReservation(trip, nom, telephone, siegeIgnore) {
    nom = nom.trim();
    telephone = telephone.trim();
    if (nom === "") {
        return { champ: "nom", message: "Le nom du passager est obligatoire." };
    }

    const nomPris = trip.reservations.some((r) => (r.seat !== siegeIgnore && r.name.trim().toUpperCase() === nom.toUpperCase()));
    if (nomPris) {
        return { champ: "nom", message: "Ce nom est déjà utilisé sur ce trajet." };
    }

    if (!/^0[67]\d{8}$/.test(telephone)) {
        return { champ: "telephone", message: "10 chiffres commençant par 06 ou 07" };
    }

    const telPris = trip.reservations.some((r) => (r.seat !== siegeIgnore && r.phone === telephone)) || trip.waitingList.some((p) => p.phone === telephone);
    if (telPris) {
        return { champ: "telephone", message: "Ce numéro est déjà utilisé sur ce trajet." };
    }

    return null;
}