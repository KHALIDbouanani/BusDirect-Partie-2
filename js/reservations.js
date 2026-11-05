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