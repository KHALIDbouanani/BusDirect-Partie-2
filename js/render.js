// jour 3
import {disponibilité} from "./reservations.js";
export async function insertion(parent,trip) {
    const disponible = disponibilité(trip)? 'border border-green-400 bg-green-200' : 'border border-red-400 bg-red-200';
    const dispo_text = disponibilité(trip)? "Disponible" : "Complet";
    const {departure,destination,departureTime,arrivalTime,price,capacity,reservations,waitingList} = trip;
    // const departure = trip.departure;
    // const destination = trip.destination;
    // const departureTime = trip.departureTime;
    // const arrivalTime = trip.arrivalTime;
    // const price = trip.price;
    // const capacity = trip.capacity;
    // const reservations = trip.reservations.length;
    // const waitingList = trip.waitingList.length;
    parent.innerHTML += `    <article class="flex flex-col rounded-lg border border-purple-500 bg-white overflow-hidden">
        <div class="flex items-center justify-between bg-[#3DC2FF] px-4 py-2">
            <p class="text-lg font-bold">Bus Direct</p><span class="rounded-full ${disponible} px-3 py-0.5 text-sm font-semibold">${dispo_text}</span>
        </div>
        <div class="grid grid-cols-3 items-center gap-2 p-4">
            <div class="text-start">
                <p class="text-lg font-bold">${departure}</p>
                <p class="text-sm text-gray-600">Départ ${departureTime}</p>
            </div>
            <p class="text-2xl text-center text-[#3D8EFF]">&rarr;</p>
            <div class="text-end">
                <p class="text-lg font-bold">${destination}</p>
                <p class="text-sm text-gray-600">Arrivée ${arrivalTime}</p>
            </div>
        </div>
        <div class="flex flex-col gap-3 p-4">
            <div class="flex items-center justify-between">
                <p class="text-sm font-bold">Prix</p>
                <p class="text-xl font-bold text-red-700">${price}</p>
            </div>
            <div>
                <p class="flex justify-between text-sm font-bold">Sièges disponibles <span class="font-normal">${reservations.length}/${capacity}</span></p>
            </div>
            <p class="flex justify-between text-sm font-bold">Liste d'attente <span class="font-normal">${waitingList.length}</span></p>
            <a href="cabine.html?id=${trip.id}" class="self-end rounded bg-[#3D8EFF] px-6 py-2 text-white hover:bg-blue-600 hover:rounded-xl">Voir le trajet</a>
        </div>
    </article>`
}
