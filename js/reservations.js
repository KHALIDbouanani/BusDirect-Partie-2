// jour 3
export function disponibilité(trip) {
    const placesLibres = trip.capacity - trip.reservations.length;
    if(placesLibres > 0){
        return true;
    }
    if(placesLibres === 0){
        return false;
    }
}
// jour 5
export function estVIP(numero) {
    if (numero >= 1 && numero <= 4) {
        return true;
    }
    return false;
}
export function prixSiege(prix, numero) {
    if (estVIP(numero)) {
        return Math.round(prix * 1.1);
    }
    return prix;
}
// jour 6
export function siegeLibre(trip, numero) {
    return !trip.reservations.some(r => r.seat === numero);
}

export function siegesLibres(trip) {
    const libres = [];
    for (let num = 1; num <= trip.capacity; num++) {
        if (siegeLibre(trip, num)) libres.push(num);
    }
    return libres;
}

export function siegeAutomatique(trip) {
    for (let num = 5; num <= trip.capacity; num++) {
        if (siegeLibre(trip, num)){
            return num;
        }
    }
    return null;
}

export function libelleSiege(prix, numero) {
    const type = estVIP(numero) ? "VIP" : "Standard";
    return `Siège ${numero} — ${type} ${prixSiege(prix, numero)} DH`;
}