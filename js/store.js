async function chargeDonnees() {
    try{
        const response = await fetch("./data/trips.json");
        if(!response.ok){
            throw new Error("Fichier introuvable");
        }
        const data = await response.json();
        return data;
    }
    catch(error){
        console.error(error.message);
    }
}

export async function initialiser(){
    const KEY = localStorage.getItem("trips");
    if(KEY!==null){
        return JSON.parse(KEY);
    }
    const trips = await chargeDonnees();
    if(trips){
        sauvegarder()
    }
    return trips
}
export function sauvegarder() {
    localStorage.setItem("trips",JSON.stringify(trips));
}