# 🏥 Doctolib Clone

Une application web moderne pour la gestion des rendez-vous médicaux, inspirée par la plateforme française Doctolib. Cette application permet aux patients de consulter les disponibilités des médecins et de réserver des créneaux, tandis que les médecins peuvent gérer leurs emplois du temps.

## 📖 Table des matières

- [Démarrage rapide](#-démarrage-rapide)
- [Architecture](#-architecture)
- [Installation détaillée](#-installation-détaillée)
- [Configuration](#-configuration)
- [Lancer l'application](#-lancer-lapplication)
- [Fonctionnalités](#-fonctionnalités)
- [Structure du projet](#-structure-du-projet)
- [Technologies](#-technologies)
- [Dépannage](#-dépannage)

## 🚀 Démarrage rapide

```bash
# 1. Cloner le repo
git clone <url-du-repo>
cd Doctolib-Clone

# 2. Installer les dépendances
cd backend && npm install
cd ../frontend && npm install

# 3. Configurer les variables d'environnement
# Créer backend/.env (voir section Configuration)

# 4. Lancer MongoDB
docker compose up -d

# 5. Dans deux terminaux différents
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
cd frontend && npm run dev

# L'app est disponible sur http://localhost:5173
```

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────┐
│        Frontend (Vue 3 + Vite + Tailwind)        │
│    http://localhost:5173                         │
└────────────────────┬─────────────────────────────┘
                     │ axios (HTTP/REST)
┌────────────────────▼─────────────────────────────┐
│      Backend (Express.js + Mongoose)             │
│    http://localhost:3000                         │
└────────────────────┬─────────────────────────────┘
                     │ TCP/Mongoose
┌────────────────────▼─────────────────────────────┐
│     MongoDB (Docker)                             │
│    mongodb://localhost:27017                     │
│    Admin: http://localhost:8081                  │
└──────────────────────────────────────────────────┘
```

**Flux d'authentification :**

1. L'utilisateur se connecte sur le frontend
2. Le backend valide les identifiants et retourne un JWT
3. Le JWT est stocké localement et utilisé pour les requêtes protégées

## ✅ Prérequis

Avant de démarrer, assurez-vous d'avoir :

- **Node.js** ≥ v18 ([installer ici](https://nodejs.org/))
- **npm** ou **yarn** (inclus avec Node.js)
- **Docker & Docker Compose** ([installer ici](https://www.docker.com/products/docker-desktop))
- **Git** (optionnel)

## 📦 Installation détaillée

### Étape 1 : Cloner le projet

```bash
git clone <url-du-repo>
cd Doctolib-Clone
```

### Étape 2 : Installer les dépendances du backend

```bash
cd backend
npm install
```

### Étape 3 : Installer les dépendances du frontend

```bash
cd ../frontend
npm install
cd ..
```

## ⚙️ Configuration

### Étape 1 : Configuration du Backend

Créez un fichier `.env` dans le dossier `backend/` :

```bash
cd backend
touch .env
```

Remplissez le fichier `backend/.env` avec :

```env
# Port du serveur
PORT=3000

# Connexion MongoDB
MONGO_URI=mongodb://admin:password123@localhost:27017/doctolib?authSource=admin

# Clé secrète pour les JWT
JWT_SECRET=your_super_secret_key_12345_change_in_production

# Environnement
NODE_ENV=development
```

> ⚠️ **Important** : N'oubliez pas d'ajouter `.env` au `.gitignore`

### Étape 2 : Lancer MongoDB avec Docker

Depuis la racine du projet :

```bash
docker compose up -d
```

Cela va démarrer :

- **MongoDB** : `mongodb://localhost:27017`
  - Identifiants : `admin` / `password123`
- **Mongo Express** (Admin UI) : `http://localhost:8081`
  - Identifiants : `admin` / `admin123`

Vérifier que les services tournent :

```bash
docker compose ps
```

Arrêter les services :

```bash
docker compose down
```

## 🚀 Lancer l'application

### Option A : Lancer dans deux terminaux (Recommandé)

**Terminal 1 - Backend** :

```bash
cd backend
npm run dev
```

Le serveur démarre sur `http://localhost:3000`

**Terminal 2 - Frontend** :

```bash
cd frontend
npm run dev
```

L'application démarre sur `http://localhost:5173`

### Vérifier que tout fonctionne

✅ **Frontend** : https://localhost:5173 (interface utilisateur)
✅ **Backend** : http://localhost:3000 (API REST)
✅ **MongoDB Admin** : http://localhost:8081 (base de données)

## 📱 Fonctionnalités

### 👨‍⚕️ Pour les Médecins

- ✅ S'inscrire avec email et mot de passe
- ✅ Se connecter à son compte
- ✅ Créer et gérer ses créneaux disponibles
- ✅ Consulter les rendez-vous réservés
- ✅ Voir les informations des patients
- ✅ Modifier son profil

### 👤 Pour les Patients

- ✅ S'inscrire avec email et mot de passe
- ✅ Se connecter à son compte
- ✅ Consulter la liste des médecins
- ✅ Voir les créneaux disponibles par médecin
- ✅ Réserver un rendez-vous
- ✅ Voir ses rendez-vous réservés
- ✅ Annuler un rendez-vous

### 🔒 Système d'Authentification

- Inscription et connexion sécurisées
- Mots de passe hashés avec **bcryptjs**
- Authentification par **JWT** (JSON Web Tokens)
- Sessions persistantes

## 📂 Structure du projet

````
Doctolib-Clone/
│
├── backend/                          # API Express.js
│   ├── config/
│   │   └── db.js                    # Connexion MongoDB
│   ├── controllers/
│   │   ├── authController.js        # Authentification (login, signup)
│   │   └── slotController.js        # Gestion des créneaux
│   ├── middleware/
│   │   └── auth.js                  # Vérification JWT
│   ├── models/
│   │   ├── Doctor.js                # Schéma Médecin
│   │   ├── Patient.js               # Schéma Patient
│   │   └── Slot.js                  # Schéma Créneau
│   ├── routes/
│   │   ├── authRoutes.js            # /api/auth (login, signup)
│   │   └── slotRoutes.js            # /api/slots
│   ├── server.js                    # Point d'entrée serveur
│   ├── seed.js                      # Données de test initiales
│   ├── package.json
│   └── .env                         # Variables d'environnement
│
├── frontend/                         # Vue 3 + Vite
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.vue          # Navigation principale
│   │   ├── views/
│   │   │   ├── Home.vue            # Page d'accueil
│   │   │   ├── Login.vue           # Authentification
│   │   │   ├── DoctorSlots.vue     # Liste créneaux médecins
│   │   │   └── MyAppointments.vue  # Mes rendez-vous
│   │   ├── router/
│   │   │   └── index.js            # Configuration Vue Router
│   │   ├── store/
│   │   │   └── auth.js             # État global Pinia
│   │   ├── api/
│   │   │   └── index.js            # Client Axios
│   │   ├── App.vue                 # Composant racine
│   │   ├── main.js                 # Point d'entrée
│   │   └── style.css               # Styles CSS personnalisés
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── tailwind.config.js           # Configuration Tailwind CSS
│
├── docker-compose.yml               # Configuration MongoDB + Mongo Express
├── README.md                        # Ce fichier
└── .gitignore

## 🛠️ Technologies

### Backend

| Technologie | Version | Rôle |
|---|---|---|
| **Express.js** | ^5.2.1 | Framework serveur |
| **MongoDB** | latest | Base de données NoSQL |
| **Mongoose** | ^9.2.1 | ODM pour MongoDB |
| **JWT** | ^9.0.3 | Authentification par token |
| **bcryptjs** | ^3.0.3 | Hash des mots de passe |
| **CORS** | ^2.8.6 | Requêtes cross-origin |
| **dotenv** | ^17.3.1 | Variables d'environnement |
| **Nodemon** | ^3.1.11 | Rechargement auto |

### Frontend

| Technologie | Version | Rôle |
|---|---|---|
| **Vue.js** | ^3.5.25 | Framework web |
| **Vite** | ^7.3.1 | Build tool |
| **Vue Router** | ^5.0.2 | Routage client-side |
| **Pinia** | ^3.0.4 | Gestion d'état |
| **Axios** | ^1.13.5 | Client HTTP |
| **Tailwind CSS** | ^4.1.18 | Framework CSS |
| **Lucide Icons** | ^0.564.0 | Icônes SVG |

### DevOps

| Technologie | Rôle |
|---|---|
| **Docker** | Containerisation |
| **Docker Compose** | Orchestration services |

## 📚 Scripts disponibles

### Backend

```bash
cd backend
npm run dev      # Lancer avec Nodemon (développement)
npm test         # Tests (à configurer)
````

### Frontend

```bash
cd frontend
npm run dev      # Lancer serveur développement Vite
npm run build    # Build pour production
npm run preview  # Aperçu du bundle production
```

## 🔐 Sécurité

- ✅ Mots de passe hashés avec bcryptjs
- ✅ Authentification par JWT
- ✅ CORS configuré
- ✅ Variables d'environnement privées (.env)
- ✅ Validation des données en entrée

## 🐛 Dépannage

### ❌ MongoDB refuse la connexion

```bash
# Vérifier que Docker est lancé
docker compose ps

# Redémarrer les services
docker compose down
docker compose up -d
```

### ❌ Port déjà en utilisation

```bash
# Vérifier quels processus utilisent les ports
lsof -i :3000    # Backend
lsof -i :5173    # Frontend
lsof -i :27017   # MongoDB

# Tuer un processus
kill -9 <PID>
```

### ❌ Erreur "Cannot find module"

```bash
# Dans le dossier concerné (backend ou frontend)
npm install

# Ou réinstaller complètement
rm -rf node_modules package-lock.json
npm install
```

### ❌ Réinitialiser la base de données

```bash
cd backend
node seed.js     # Peuple la DB avec des données de test
```

### ❌ Frontend ne se lance pas

```bash
# Vérifier la version de Node.js
node --version   # Doit être v18+

# Nettoyer Vite cache
rm -rf frontend/.vite
npm run dev
```
