// jour 2
import {initialiser} from './store.js';
const trips = await initialiser();

// jour 3 
import {insertion} from './render.js';
const List = document.getElementById('listeTrajets');
List.innerHTML = "";
// for(let i = 0;i<trips.length;i++){
//     insertion(List,trips[i])
// }
trips.map(trip => insertion(List,trip));

const totalprix_text = document.getElementById("prixTotal");
const placesDisponibles_text = document.getElementById("placesDisponibles");
const placesTotales_text = document.getElementById("placesTotales");

const totalPrix = trips.reduce((acc, trip) => { return acc + trip.price; }, 0);
const totalPlacesDisponibles = trips.reduce((acc, trip) => { return acc + (trip.capacity - trip.reservations.length); }, 0);
const totalPlacesTotales = trips.reduce((acc, trip) => { return acc + trip.capacity; }, 0);

totalprix_text.textContent = `${totalPrix} DH`;
placesDisponibles_text.textContent = `${totalPlacesDisponibles} places`;
placesTotales_text.textContent = `${totalPlacesTotales} places`;