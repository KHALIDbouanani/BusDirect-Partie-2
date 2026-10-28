# BusDirect
BusDirect est un projet de site web permettant de gérer la réservation des places dans un bus effectuant le trajet Safi → Marrakech. Le site propose une grille interactive des 20 sièges, la réservation, la modification et la suppression des réservations, avec sauvegarde des données dans le navigateur.

## Aperçu du projet
L'objectif de ce projet est de créer une application web simple et fonctionnelle pour gérer les réservations d'un bus, avec une interface claire et une mise à jour en temps réel des places disponibles et de la recette.


## Fonctionnalités
### 1. Réservation d'une place :
```
- Saisie du nom du passager.
- Choix manuel d'un siège ou attribution automatique du premier siège libre.
- Vérification des doublons de nom et des places disponibles.
```
### 2. Modification d'une réservation :
```
- Sélection d'un passager existant.
- Changement du nom et/ou du siège.
- Vérification des doublons de nom.
```
### 3. Suppression d'une réservation :
```
- Sélection d'un passager et suppression de sa réservation.
```
### 4. Grille des sièges :
```
- Affichage des 20 sièges avec leur statut (Libre / Occupé).
- Mise à jour visuelle en temps réel (couleurs, nom du passager).
```
### 5. Tableau de bord :
```
- Nombre de places disponibles.
- Recette totale (80 DH par place).
```
### 6. Persistance des données :
```
- Sauvegarde automatique des réservations dans le localStorage.
```
### 7. Notifications  :
```
- Messages de succès ou d'erreur pour chaque action.
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
├── script.js
├── input.css
├── output.css
├── package.json
├── package-lock.json
├── README.md
└── img/
    └── Logo.jpg
```
## Lien de Jira
https://bouananikhalid83.atlassian.net/
## Lien de Vercel
busdirect-two.vercel.app
