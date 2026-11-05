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