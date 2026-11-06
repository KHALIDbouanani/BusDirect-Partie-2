// jour 3
import {disponibilité} from "./reservations.js";
export function insertion(parent,trip) {
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

// jour 4
export function renderTrips(modifiedTrips, page, size) {
  if (modifiedTrips === undefined || modifiedTrips === null) {
    modifiedTrips = trips;
  }
    
  if (page === undefined || page === null) {
    page = 1;
  }

  if (size === undefined || size === null) {
    size = 6;
  }

  let listeTrajets = document.getElementById("listeTrajets");
  listeTrajets.innerHTML = "";

  let startIndex = (page - 1) * size;
  let endEndex = startIndex + size;

  let selectedTrips = modifiedTrips.slice(startIndex, endEndex);

  selectedTrips.forEach((trip) => {insertion(listeTrajets, trip)});
  rederPagination(modifiedTrips, page, modifiedTrips.length, size)
}

export function handleFilter(trips) {
    const serchCity = document.getElementById("recherchet");
    const statusSelector = document.getElementById("filtreStatut");      
    const city = serchCity.value.toLocaleLowerCase().trim();
    const status = statusSelector.value;
    const filtredTrips = trips.filter((trip) => {

    const matchCity = trip.departure.toLocaleLowerCase().includes(city) || trip.destination.toLocaleLowerCase().includes(city);
    let matchFilter = false;
    if (status === "tout") {
      matchFilter = true;
    } else if (status === "disponible") {
      matchFilter = trip.capacity > trip.reservations.length;
    } else if (status === "complete") {
      matchFilter = trip.capacity === trip.reservations.length;
    }    
    return matchCity && matchFilter;
    });
    if (filtredTrips.length === 0) {
        const pagination = document.getElementById("pagination");
        const listeTrajets = document.getElementById("listeTrajets");
        listeTrajets.innerHTML = "<p class='col-span-3 text-center text-lg border border-red-600 bg-red-200 font-semibold text-red-600 rounded'>Aucun trajet trouvé</p>";
        pagination.innerHTML = "";
        return;
    } else {
        renderTrips(filtredTrips, 1, 6);
    }
}

function rederPagination(modifiedTrips, courantPage, totalElement, pageSize) {
  const paginationHTML = document.getElementById("pagination");
  paginationHTML.innerHTML = "";

  let totalPages = Math.ceil(totalElement / pageSize);

  if (totalPages <= 1) {
    return;
  }
  if (courantPage > 1) {
    const prevBtn = document.createElement("button");
    prevBtn.innerHTML = "&lt;";
    prevBtn.className = "block rounded bg-[#3D8EFF] px-3 py-1 font-bold text-white hover:text-black";
    prevBtn.addEventListener("click", () => {
      renderTrips(modifiedTrips, courantPage - 1, pageSize);
    });
    paginationHTML.appendChild(prevBtn);
  }
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;

    if (i === courantPage) {
      btn.className = "block rounded bg-[#3D8EFF] px-3 py-1 font-bold text-white hover:text-black";
    } else {
      btn.className = "block rounded bg-white px-3 py-1 hover:bg-sky-100";
    }

    btn.addEventListener("click", () => {
      renderTrips(modifiedTrips, i, pageSize);
    });

    paginationHTML.appendChild(btn);
  }
  if (courantPage < totalPages) {
    const nextBtn = document.createElement("button");
    nextBtn.innerHTML = "&gt;";
    nextBtn.className = "block rounded bg-[#3D8EFF] px-3 py-1 font-bold text-white hover:text-black";
    nextBtn.addEventListener("click", () => {
      renderTrips(modifiedTrips, courantPage + 1, pageSize);
    });
    paginationHTML.appendChild(nextBtn);
  }
}