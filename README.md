# DoctoClone – Application de Réservation (Vue 3 + node js ) 
DoctoClone est une application web inspirée de Doctolib permettant aux utilisateurs de rechercher des prestataires et de réserver des créneaux en ligne.
Ce projet a été réalisé dans un objectif pédagogique afin de pratiquer l’architecture d’une application moderne en Vue.js, avec gestion d’état, routing avancé et design responsive.

## Technologies utilisées
Vue 3 (Composition API)
Vite
Vue Router 4
Pinia (gestion d’état)
TailwindCSS
Fake API locale (données simulées)
Backend en Node.js

## Fonctionnalités
### Authentification

- Connexion

- Inscription

- Gestion des rôles : Client / Prestataire

- Gestion de session avec Pinia

### Espace Client

- Rechercher un prestataire par :

- Nom / spécialité

- Ville

- Voir la fiche d’un prestataire

- Voir les créneaux disponibles

- Réserver un créneau

- Voir ses réservations

- Annuler une réservation

## Architecture du projet
```
src/
│
├── views/
│   ├── AuthView.vue
│   ├── LandingView.vue
│   ├── Client/
│   │   ├── ProvidersListView.vue
│   │   ├── ProviderDetailView.vue
│   │   └── MyBookingsView.vue
│
├── stores/
│   ├── auth.js
│   └── bookings.js
│
├── services/
│   └── api.js
│
├── router/
│   └── index.js
│
└── App.vue
```
## Installation

### Cloner le projet
``` git clone https://github.com/FATI-A/doctolib-clone.git``` 
``` cd doctolib-clone/frontend``` 
### Installer les dépendances
```  npm install``` 
### Lancer le projet
``` npm run dev``` 

### L’application sera disponible sur :

``` http://localhost:5173``` 
