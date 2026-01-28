# Jupython Frontend

Le frontend de la plateforme Jupython est une application web statique développée pour promouvoir et gérer les certifications IT en Afrique. Cette interface utilisateur permet aux étudiants, enseignants et administrateurs d'interagir avec la plateforme de manière intuitive et responsive.

## 🚀 Technologies Utilisées

- **HTML5** : Structure des pages web
- **Tailwind CSS** : Framework CSS pour le styling (chargé via CDN)
- **JavaScript ES6+** : Logique côté client et interactions
- **Responsive Design** : Adapté pour mobile et desktop

## 📁 Structure du Projet

```
frontend/
├── README.md                    # Ce fichier
├── index.html                   # Page d'accueil principale
├── about.html                   # Page "À propos"
├── contact.html                 # Page de contact
├── courses.html                 # Catalogue des formations
├── projects.html                # Projets et réalisations
├── rankings.html                # Classements des étudiants
├── article-*.html              # Articles du blog
├── academy/
│   ├── login.html              # Connexion à l'academy
│   ├── register.html           # Inscription à l'academy
│   ├── dashboard.html          # Tableau de bord étudiant
│   └── profile.html            # Profil utilisateur
├── admin/                      # Interface d'administration
├── assets/
│   ├── css/
│   │   ├── styles.css          # Styles personnalisés
│   │   ├── login.css           # Styles spécifiques login
│   │   └── theme.css           # Thème global
│   ├── js/
│   │   ├── main.js             # Application principale
│   │   ├── api.js              # Gestion des appels API
│   │   ├── index.js            # Scripts page d'accueil
│   │   ├── about.js            # Scripts page à propos
│   │   ├── contact.js          # Scripts page contact
│   │   ├── courses.js          # Scripts page formations
│   │   ├── projects.js         # Scripts page projets
│   │   ├── rankings.js         # Scripts page classements
│   │   ├── login.js            # Scripts connexion
│   │   ├── register.js         # Scripts inscription
│   │   └── mobile-menu.js      # Menu mobile
│   └── images/                 # Images et ressources visuelles
├── images/                     # Images principales (héros, logos)
├── favicon.svg                 # Icône du site
├── robots.txt                  # Instructions pour les moteurs de recherche
└── sitemap.xml                 # Plan du site
```

## 🎯 Fonctionnalités Principales

### Pages Publiques
- **Accueil** : Présentation de la plateforme avec classements en temps réel
- **À propos** : Histoire, équipe et valeurs de Jupython
- **Formations** : Catalogue des cours disponibles avec filtres
- **Projets** : Réalisations des étudiants
- **Classements** : Tableau d'excellence des étudiants certifiés
- **Contact** : Formulaire de contact avec validation
- **Blog** : Articles sur les certifications et technologies

### Academy (Espace Étudiant)
- **Connexion/Inscription** : Authentification des utilisateurs
- **Dashboard** : Suivi des progrès et certifications
- **Profil** : Gestion du profil utilisateur

### Administration
- Interface d'administration pour gérer le contenu

## 🛠️ Installation et Développement

### Prérequis
- Navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Serveur web local pour le développement (optionnel)

### Lancement Local

1. **Via Navigateur Direct** :
   ```bash
   # Ouvrir index.html directement dans le navigateur
   # Fonctionne pour la navigation statique
   ```

2. **Via Serveur Local** (recommandé pour les appels API) :
   ```bash
   # Utiliser un serveur HTTP simple
   python -m http.server 8000
   # Puis ouvrir http://localhost:8000
   ```

3. **Via VS Code Live Server** :
   - Installer l'extension "Live Server"
   - Clic droit sur `index.html` > "Open with Live Server"

### Développement

- **Modification du Style** : Éditer les classes Tailwind directement dans le HTML ou ajouter des styles personnalisés dans `assets/css/styles.css`
- **JavaScript** : Les scripts sont modulaires par page dans `assets/js/`
- **Responsive** : Utiliser les classes Tailwind pour la responsivité (sm:, md:, lg:)

## 🔧 Scripts JavaScript

### main.js
- Classe principale `JupythonApp` gérant les interactions globales
- Validation des formulaires
- Scroll fluide
- Gestion de la navigation

### Scripts Spécifiques
- `api.js` : Gestion des appels vers le backend
- Scripts par page pour les fonctionnalités spécifiques

## 🎨 Design System

### Couleurs
- **Primaire** : Orange (#FF6B35, #FB923C)
- **Fond** : Gris foncé (#111827, #1F2937)
- **Texte** : Blanc (#FFFFFF), Gris clair (#F3F4F6)

### Typographie
- Police : Sans-serif (par défaut Tailwind)
- Tailles : Responsive avec classes Tailwind

### Composants
- Cartes avec bordures arrondies et ombres
- Boutons avec effets hover
- Formulaires avec validation en temps réel

## 🌐 SEO et Performance

- Meta tags optimisés pour les moteurs de recherche
- Open Graph pour le partage sur réseaux sociaux
- Sitemap XML pour l'indexation
- Robots.txt pour le crawling
- Images optimisées et lazy loading

## 📱 Responsive Design

Le site est entièrement responsive grâce à Tailwind CSS :
- **Mobile** : < 768px
- **Tablet** : 768px - 1024px
- **Desktop** : > 1024px

## 🔗 Intégration Backend

Le frontend communique avec le backend via :
- API REST (fichier `api.js`)
- Endpoints pour l'authentification, les données utilisateurs, etc.

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

## 📄 Licence

© 2025 Jupython. Tous droits réservés.

---

**Développé avec ❤️ pour l'Afrique par l'équipe Jupython**
