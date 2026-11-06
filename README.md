# BusDirect
BusDirect est un projet de site web permettant de gérer la réservation des places dans un bus. Le site propose une liste de 20 trajets, une grille interactive des 20 sièges par trajet, la réservation, la modification, la suppression, et une liste d'attente quand le bus est complet, avec sauvegarde des données dans le navigateur.

## Aperçu du projet
L'objectif de ce projet est de créer une application web simple et fonctionnelle pour gérer les réservations d'un bus, avec une interface claire et une mise à jour en temps réel des places disponibles et de la recette.


## Fonctionnalités
### 1. Réservation d'une place :
```
- Saisie du nom et du téléphone du passager.
- Choix manuel d'un siège ou attribution automatique du premier siège libre.
- Vérification des doublons de nom et de téléphone, et des places disponibles.
```
### 2. Modification d'une réservation :
```
- Sélection d'un passager existant, formulaire pré-rempli.
- Changement du nom, du téléphone et/ou du siège.
- Mêmes vérifications que la réservation.
```
### 3. Suppression d'une réservation :
```
- Sélection d'un passager et suppression de sa réservation.
- Le siège redevient libre.
```
### 4. Grille des sièges :
```
- Affichage des 20 sièges avec leur statut (Libre / Occupé).
- Sièges VIP (1 à 4) : +10 % sur le prix, badge et couleur différente.
- Mise à jour visuelle en temps réel.
```
### 5. Liste d'attente :
```
- Activée uniquement quand le bus est complet.
- Le premier de la liste récupère le siège libéré lors d'une annulation.
- Bouton pour retirer une personne de la liste.
```
### 6. Tableau de bord :
```
- Nombre de places disponibles par trajet.
- Recette totale du trajet (prix du siège, +10 % si VIP).
```
### 7. Recherche et pagination :
```
- Recherche par ville de départ ou d'arrivée.
- Filtre Disponible / Complet.
- Pagination par 6 trajets.
```
### 8. Persistance des données :
```
- Sauvegarde automatique dans le localStorage.
```
## Technologies Utilisés
- HTML5 — Structure et contenu du site.
- CSS3 / Tailwind CSS v4 — Mise en page, style et présentation visuelle.
- JavaScript — Logique de réservation, gestion du DOM et persistance des données.
- localStorage — Sauvegarde des réservations côté client.
## Structure de Project 
```
BusDirect/
├── index.html
├── cabine.html
├── data/
│ └── trips.json
├── js/
│ ├── store.js
│ ├── validators.js
│ ├── reservations.js
│ ├── render.js
│ ├── main-trajets.js
│ └── main-cabine.js
├── src/
│ └── output.css
├── package.json
├── README.md
└── img/
  └── Logo.jpg
```
## Lien de Jira
https://bouananikhalid83.atlassian.net/
## Lien de Vercel
https://busdirect-partie-2-nlm7tc20x-khalid-4971.vercel.app/
