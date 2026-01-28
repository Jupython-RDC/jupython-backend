# 🔗 Plan d'Intégration Frontend-Backend - Jupython

**Objectif:** Intégrer le backend Django avec le frontend HTML/JS pour transformer le prototype statique en application web fonctionnelle.

**Timeline:** 2-3 semaines (1 développeur)  
**Status:** 🟠 Ready to start  
**Faisabilité:** ✅ 90% (certains risques mineurs)

---

## 📊 Vue d'ensemble de l'intégration

### Architecture cible

```
┌─────────────────────────────────────────────────────────────┐
│                    UTILISATEUR FINAL                        │
├─────────────────────────────────────────────────────────────┤
│          FRONTEND (HTML/CSS/JavaScript)                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Accueil | À propos | Formations | Classements       │  │
│  │  Contact | Academy (Login/Register) | Dashboard      │  │
│  │                                                        │  │
│  │  API Client (fetch/AJAX)                             │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↕ HTTP/JSON                         │
├─────────────────────────────────────────────────────────────┤
│  BACKEND (Django REST API)                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  /api/accounts/    (auth, profil)                    │  │
│  │  /api/formations/  (CRUD formations)                 │  │
│  │  /api/ranking/     (classements)                     │  │
│  │  /api/enrollments/ (inscriptions)                    │  │
│  │  /api/contact/     (formulaires contact)             │  │
│  │                                                        │  │
│  │  ViewSets + Serializers + Permissions               │  │
│  │  Django ORM + Models                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↕ SQL                                │
├─────────────────────────────────────────────────────────────┤
│            BASE DE DONNÉES (SQLite/PostgreSQL)              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Users | Formations | Enrollments | Contacts | etc   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Flux d'utilisation exemple

```
1. ENREGISTREMENT
   Frontend: Form inscription → fetch POST /api/accounts/register/
   Backend:  Valide, crée User, retourne confirmation
   Database: INSERT INTO users ...

2. CONNEXION
   Frontend: Form login → fetch POST /api/accounts/login/
   Backend:  Authentifie, génère JWT token
   Frontend: Stocke token dans localStorage
   Database: (optionnel) log login

3. VOIR FORMATIONS
   Frontend: Requête GET /api/formations/
   Backend:  Récupère de la DB, filtre si demandé
   Database: SELECT * FROM formations WHERE ...
   Frontend: Affiche liste formations

4. S'INSCRIRE À FORMATION
   Frontend: Click "S'inscrire" → fetch POST /api/enrollments/enroll/
   Backend:  Crée relation user-formation, avec auth vérifiée
   Database: INSERT INTO enrollments ...
   Frontend: Affiche confirmation, rafraîchit UI

5. VOIR CLASSEMENTS
   Frontend: GET /api/ranking/
   Backend:  Calcule scores, retourne liste triée
   Database: SELECT users, COUNT enrollments ...
   Frontend: Affiche tableau classement

6. FORMULAIRE CONTACT
   Frontend: Form contact → fetch POST /api/contact/
   Backend:  Sauvegarde message, envoie email admin
   Database: INSERT INTO contacts ...
   Email:    Admin reçoit notification
```

---

## 🔑 Points clés de l'intégration

### 1. Communication Frontend-Backend

**Actuellement:** Données statiques en JavaScript
```javascript
// ❌ Actuellement:
const formations = [
  { id: 1, title: "Python", platform: "Coursera" },
  { id: 2, title: "Django", platform: "Udemy" }
];
// Hardcodé, jamais mis à jour!
```

**Après intégration:** Données dynamiques via API
```javascript
// ✅ Après:
let formations = [];
async function loadFormations() {
  const response = await fetch('/api/formations/');
  formations = await response.json();
  renderFormations(formations);
}
```

### 2. Authentification

**Actuellement:** Aucune authentification
```
- Pas de login réel
- Pas de session utilisateur
- Impossible de tracker progression
```

**Après intégration:** Authentification JWT
```javascript
// ✅ Après:
1. Utilisateur se connecte
2. Reçoit access_token + refresh_token
3. Token stocké localement
4. Chaque requête inclut: Authorization: Bearer {token}
5. Backend valide token avant de répondre
6. Utilisateur ne peut voir que ses données
```

### 3. Persistance des données

**Actuellement:** Tout se perd au rechargement
```
- Pas de sauvegarde utilisateurs
- Pas de tracking formation suivies
- Classement statique
```

**Après intégration:** Base de données permanente
```
- Utilisateurs sauvegardés
- Formations sauvegardées
- Inscriptions sauvegardées
- Classement calculé en temps réel
```

---

## 📋 Pré-requis et vérifications

### Sur le backend

**Vérifications à faire avant début:**

```bash
# 1. Code accessible et à jour
cd "f:\CODING\Jupython backend\jupython-backend"
git status  # Pas de changement en suspens

# 2. Python disponible
python --version  # 3.8+

# 3. Dépendances
pip list | grep -i django  # Django 6.0

# 4. Base de données fonctionnelle
python manage.py check  # Pas d'erreurs

# 5. Application démarre
python manage.py runserver
# Doit accéder à http://127.0.0.1:8000/admin/
```

### Sur le frontend

**Vérifications à faire avant début:**

```bash
# 1. Fichiers accessibles
ls -la "f:\CODING\Projet Jupython\frontend"

# 2. HTML valide
# Ouvrir dans navigateur, pas d'erreurs console

# 3. API Client absent (on va le créer)
grep -r "class.*Api" frontend/assets/js/  # Rien ou structure existante

# 4. Environnement de développement
# Option A: Serveur Python simple
cd frontend && python -m http.server 8000

# Option B: VS Code Live Server extension
# Click "Go Live" sur index.html
```

---

## 🎯 Phases détaillées d'intégration

### PHASE 0: Préparation (0.5 jour)

#### Étape 1: Cloner/Préparer repositories
```bash
# Frontend déjà ouvert
# Backend:
cd f:\CODING
ls -la "Jupython backend"

# Vérifier structure
cd "Jupython backend\jupython-backend"
ls -la  # Doit voir: manage.py, requirements.txt, apps (accounts, academy, ranking)
```

#### Étape 2: Installer dépendances backend
```bash
# Venv
python -m venv venv
venv\Scripts\activate

# Installer
pip install -r requirements.txt

# Ajouter nouvelles dépendances pour intégration
pip install django-cors-headers djangorestframework-simplejwt django-filter
pip freeze > requirements.txt  # Sauvegarder
```

#### Étape 3: Setup base de données
```bash
# Appliquer migrations
python manage.py migrate

# Créer admin
python manage.py createsuperuser
# Username: admin
# Email: admin@jupython.com
# Password: (secure password)

# Tester
python manage.py runserver
# http://127.0.0.1:8000/admin/ → doit fonctionner
```

#### Étape 4: Créer environment file
```bash
# Créer .env
copy .env.example .env

# Remplir:
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Email pour contact form:
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

#### Étape 5: Préparer frontend
```bash
# Ouvrir dossier frontend dans VS Code
# Installer Live Server (extension)
# Ou démarrer simple serveur:
cd frontend
python -m http.server 8000  # Frontend sur :8000
# Backend sur :8001 pour éviter conflit?
python manage.py runserver 8001
```

---

### PHASE 1: CORS & Communication (0.5 jour)

#### Objectif: Frontend peut parler au backend

#### Étape 1: Installer django-cors-headers
```bash
pip install django-cors-headers
```

#### Étape 2: Configurer CORS dans settings.py
```python
# jupython-backend/jupython/settings.py

INSTALLED_APPS = [
    # ... existant
    'corsheaders',  # AJOUTER
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # AJOUTER EN PREMIER
    'django.middleware.common.CommonMiddleware',
    # ... rest
]

# Configuration CORS
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5500",    # Live Server VSCode
    "http://127.0.0.1:5500",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost:8001",
    "http://127.0.0.1:8001",
]

CORS_ALLOW_CREDENTIALS = True

# Pour développement uniquement:
if DEBUG:
    CORS_ALLOWED_ORIGINS = [
        "http://localhost",
        "http://127.0.0.1",
        "http://localhost:*",  # Accepte tous les ports localhost
    ]
```

#### Étape 3: Tester connexion
```javascript
// Dans console navigateur (frontend):
fetch('http://localhost:8001/api/formations/')
  .then(r => r.json())
  .then(console.log)
  .catch(err => console.error('Erreur:', err))
```

**Expected output:** Array de formations (vide si pas encore de données)  
**Si CORS error:** Vérifier settings.py

#### Étape 4: Créer API Client basique
```javascript
// frontend/assets/js/api.js - CRÉER NOUVEAU FICHIER

const API_BASE = 'http://localhost:8001/api';

class ApiClient {
  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = {...options.headers || {}};
    
    // Ajouter token si authentifié
    const token = localStorage.getItem('access_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    headers['Content-Type'] = 'application/json';

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (response.status === 401) {
      // Token expiré
      localStorage.removeItem('access_token');
      window.location.href = '/academy/login.html';
      return;
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Formations
  async getFormations(filters = {}) {
    let url = '/formations/';
    if (Object.keys(filters).length > 0) {
      url += '?' + new URLSearchParams(filters).toString();
    }
    return this.request(url);
  }

  async getFormation(id) {
    return this.request(`/formations/${id}/`);
  }

  // Ranking
  async getRanking(filters = {}) {
    let url = '/ranking/';
    if (Object.keys(filters).length > 0) {
      url += '?' + new URLSearchParams(filters).toString();
    }
    return this.request(url);
  }

  // À ajouter plus tard:
  // Register, login, enroll, contact, etc.
}

const api = new ApiClient();
```

---

### PHASE 2: Authentification (1.5 jours)

#### Objectif: Users peuvent s'enregistrer et se connecter

#### Étape 1: Installer JWT
```bash
pip install djangorestframework-simplejwt
```

#### Étape 2: Configurer JWT dans settings.py
```python
# jupython-backend/jupython/settings.py

INSTALLED_APPS = [
    # ...
    'rest_framework_simplejwt',  # AJOUTER
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ALGORITHM': 'HS256',
}
```

#### Étape 3: Implémenter Login endpoint

**File: accounts/api.py**
```python
# REMPLACER l'existant par:

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_401_UNAUTHORIZED
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, UserSerializer

class RegisterAPIView(APIView):
    """
    POST /api/accounts/register/
    Body: {username, email, password, university}
    """
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {"message": "Utilisateur créé avec succès", "user_id": user.id},
                status=201
            )
        return Response(serializer.errors, status=400)


class LoginAPIView(APIView):
    """
    POST /api/accounts/login/
    Body: {username, password}
    """
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if not user:
            return Response(
                {"error": "Identifiants invalides"},
                status=HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data
        })


class LogoutAPIView(APIView):
    """
    POST /api/accounts/logout/
    Body: {refresh}
    """
    def post(self, request):
        try:
            refresh = request.data.get('refresh')
            token = RefreshToken(refresh)
            token.blacklist()
            return Response({"message": "Déconnexion réussie"})
        except Exception as e:
            return Response({"error": str(e)}, status=400)


class ProfileAPIView(APIView):
    """
    GET /api/accounts/profile/  → Récupère profil
    PUT /api/accounts/profile/  → Met à jour profil
    Requiert authentification
    """
    def get(self, request):
        if not request.user.is_authenticated:
            return Response({"error": "Non authentifié"}, status=401)
        
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'university': user.university,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'date_joined': user.date_joined,
        })

    def put(self, request):
        if not request.user.is_authenticated:
            return Response({"error": "Non authentifié"}, status=401)

        user = request.user
        user.email = request.data.get('email', user.email)
        user.university = request.data.get('university', user.university)
        user.first_name = request.data.get('first_name', user.first_name)
        user.last_name = request.data.get('last_name', user.last_name)
        user.save()

        return Response({
            "message": "Profil mis à jour",
            "user": UserSerializer(user).data
        })
```

#### Étape 4: Ajouter UserSerializer
**File: accounts/serializers.py**
```python
# AJOUTER à la fin:

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'university', 'first_name', 'last_name', 'date_joined']
```

#### Étape 5: Ajouter routes
**File: accounts/urls.py**
```python
# REMPLACER par:

from django.urls import path
from .api import RegisterAPIView, LoginAPIView, LogoutAPIView, ProfileAPIView

urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('logout/', LogoutAPIView.as_view(), name='logout'),
    path('profile/', ProfileAPIView.as_view(), name='profile'),
]
```

#### Étape 6: Tester endpoints
```bash
# Terminal:
curl -X POST http://localhost:8001/api/accounts/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","email":"alice@example.com","password":"secure123","university":"UNKIN"}'

# Response:
# {"message": "Utilisateur créé avec succès", "user_id": 1}
```

```bash
curl -X POST http://localhost:8001/api/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"secure123"}'

# Response:
# {"access": "eyJ0eXAiOiJKV1QiLCJhbGc...", "refresh": "...", "user": {...}}
```

#### Étape 7: Mettre à jour API Client
**File: frontend/assets/js/api.js**
```javascript
// AJOUTER à la classe ApiClient:

  // Authentification
  async register(userData) {
    return this.request('/accounts/register/', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async login(username, password) {
    const data = await this.request('/accounts/login/', {
      method: 'POST',
      body: JSON.stringify({username, password})
    });
    
    // Sauvegarder tokens
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  }

  async logout() {
    const refresh = localStorage.getItem('refresh_token');
    if (refresh) {
      await this.request('/accounts/logout/', {
        method: 'POST',
        body: JSON.stringify({refresh})
      });
    }
    
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  async getProfile() {
    return this.request('/accounts/profile/');
  }

  async updateProfile(data) {
    return this.request('/accounts/profile/', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
```

#### Étape 8: Intégrer dans register.html
**File: frontend/academy/register.html** (find et modify form submit)

```javascript
// Dans register.js:
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
      const data = {
        username: document.querySelector('[name="username"]').value,
        email: document.querySelector('[name="email"]').value,
        password: document.querySelector('[name="password"]').value,
        university: document.querySelector('[name="university"]').value || ''
      };
      
      await api.register(data);
      alert('Inscription réussie! Veuillez vous connecter.');
      window.location.href = '/academy/login.html';
    } catch (error) {
      alert('Erreur: ' + error.message);
    }
  });
});
```

#### Étape 9: Intégrer dans login.html
**File: frontend/academy/login.html** (modify form submit)

```javascript
// Dans login.js:
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
      const username = document.querySelector('[name="username"]').value;
      const password = document.querySelector('[name="password"]').value;
      
      await api.login(username, password);
      alert('Connexion réussie!');
      window.location.href = '/index.html';
    } catch (error) {
      alert('Erreur: ' + error.message);
    }
  });
});
```

---

### PHASE 3: Données dynamiques (1 jour)

#### Objectif: Formations et classements chargés depuis le backend

#### Étape 1: Charger formations dynamiquement
**File: frontend/courses.js** (remplacer données statiques)

```javascript
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Charger formations
    const formations = await api.getFormations();
    
    // Rendre coursesContainer
    const container = document.getElementById('courses-container');
    container.innerHTML = '';
    
    formations.forEach(f => {
      const html = `
        <div class="course-card">
          <h3>${f.title}</h3>
          <p>Platform: ${f.platform}</p>
          <p>${f.is_free ? '✅ Gratuit' : '💰 Payant'}</p>
          <a href="${f.link}" target="_blank">Voir le cours</a>
          <button onclick="enrollCourse(${f.id})">S'inscrire</button>
        </div>
      `;
      container.innerHTML += html;
    });
    
  } catch (error) {
    console.error('Erreur chargement formations:', error);
    document.getElementById('courses-container').innerHTML = 
      '<p>Erreur lors du chargement des formations</p>';
  }
});

async function enrollCourse(formationId) {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert('Veuillez vous connecter d\'abord');
      window.location.href = '/academy/login.html';
      return;
    }
    
    const result = await api.request('/enrollments/enroll/', {
      method: 'POST',
      body: JSON.stringify({formation_id: formationId})
    });
    
    alert(result.status === 'created' 
      ? 'Inscription réussie!' 
      : 'Vous êtes déjà inscrit à ce cours');
  } catch (error) {
    alert('Erreur: ' + error.message);
  }
}
```

#### Étape 2: Charger classements dynamiquement
**File: frontend/rankings.js** (remplacer données statiques)

```javascript
let ranking = [];
let currentUniversity = null;

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Charger ranking complet
    ranking = await api.getRanking();
    displayRanking(ranking);
    
    // Configurer filtres
    const universityFilter = document.getElementById('university-filter');
    if (universityFilter) {
      universityFilter.addEventListener('change', (e) => {
        currentUniversity = e.target.value;
        displayRanking(ranking);
      });
    }
    
  } catch (error) {
    console.error('Erreur chargement ranking:', error);
  }
});

function displayRanking(data) {
  let filtered = data;
  
  if (currentUniversity && currentUniversity !== 'all') {
    filtered = data.filter(r => r.university === currentUniversity);
  }
  
  const tableBody = document.querySelector('tbody');
  tableBody.innerHTML = '';
  
  filtered.forEach((user, index) => {
    const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${user.username}</td>
        <td>${user.university || 'N/A'}</td>
        <td>${user.score}</td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}
```

#### Étape 3: Ajouter support filtres au backend (OPTIONAL)

Si vous voulez des filtres plus complexes côté serveur:

**File: academy/api.py** (modifier FormationViewSet)
```python
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend

class FormationViewSet(ModelViewSet):
    queryset = Formation.objects.all()
    serializer_class = FormationSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['platform', 'is_free']
    search_fields = ['title', 'platform']
```

Puis dans le frontend:
```javascript
// Avec filtres serveur:
const formations = await api.getFormations({
  platform: 'coursera',
  is_free: true
});
```

---

### PHASE 4: Endpoints additionnels (1 jour)

#### Étape 1: Endpoint Enrollment
**File: academy/api.py**
```python
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Enrollment, Formation

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def enroll_course(request):
    """Inscrire utilisateur à une formation"""
    formation_id = request.data.get('formation_id')
    
    try:
        formation = Formation.objects.get(id=formation_id)
    except Formation.DoesNotExist:
        return Response({'error': 'Formation non trouvée'}, status=404)
    
    enrollment, created = Enrollment.objects.get_or_create(
        user=request.user,
        formation=formation
    )
    
    return Response({
        'enrollment_id': enrollment.id,
        'status': 'created' if created else 'already_enrolled',
        'date_joined': enrollment.date_joined
    }, status=201 if created else 200)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_enrollments(request):
    """Récupérer inscriptions de l'utilisateur"""
    enrollments = Enrollment.objects.filter(user=request.user)
    data = [{
        'id': e.id,
        'formation': {
            'id': e.formation.id,
            'title': e.formation.title,
            'platform': e.formation.platform,
            'link': e.formation.link
        },
        'date_joined': e.date_joined
    } for e in enrollments]
    
    return Response(data)
```

**Routes: academy/urls.py**
```python
path('enrollments/enroll/', enroll_course, name='enroll'),
path('enrollments/my/', my_enrollments, name='my-enrollments'),
```

#### Étape 2: Contact endpoint (Email)
```bash
pip install django-anymail[sendgrid]  # ou simplement: pip install django
```

**File: jupython/settings.py**
```python
# Config email (Gmail example)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv('EMAIL_USER', 'your-email@gmail.com')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_PASSWORD', 'your-app-password')
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
```

**File: contact/models.py** (créer app contact)
```python
from django.db import models

class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.subject} - {self.name}"
```

**File: contact/api.py**
```python
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from .models import ContactMessage

class ContactAPIView(APIView):
    def post(self, request):
        try:
            msg = ContactMessage.objects.create(
                name=request.data.get('name'),
                email=request.data.get('email'),
                subject=request.data.get('subject'),
                message=request.data.get('message')
            )
            
            # Envoyer email à admin
            send_mail(
                f'Nouveau message contact: {msg.subject}',
                f'De: {msg.name} ({msg.email})\n\n{msg.message}',
                settings.DEFAULT_FROM_EMAIL,
                ['admin@jupython.com'],
                fail_silently=False
            )
            
            return Response({'message': 'Message envoyé avec succès'}, status=201)
        except Exception as e:
            return Response({'error': str(e)}, status=400)
```

**Routes: URLs**
```python
path('api/contact/', ContactAPIView.as_view()),
```

---

### PHASE 5: Polish & Testing (0.5 jour)

#### Étape 1: Seed data
```python
# Créer: jupython-backend/seed_data.py

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jupython.settings')
django.setup()

from academy.models import Formation
from django.contrib.auth import get_user_model

User = get_user_model()

# Créer utilisateurs de test
User.objects.get_or_create(
    username='alice',
    defaults={
        'email': 'alice@example.com',
        'university': 'UNKIN',
        'is_staff': False
    }
)

# Créer formations
formations_data = [
    {'title': 'Python Basics', 'platform': 'Coursera', 'link': 'https://...', 'is_free': True},
    {'title': 'Django Course', 'platform': 'Udemy', 'link': 'https://...', 'is_free': False},
    # ... plus de formations
]

for data in formations_data:
    Formation.objects.get_or_create(**data)

print("Données seed chargées!")
```

```bash
# Exécuter:
python seed_data.py
```

#### Étape 2: Admin interface
```bash
# Dans terminal:
python manage.py createsuperuser
# Puis: http://localhost:8001/admin/
```

#### Étape 3: Tests API avec Postman/curl

```bash
# 1. Register
curl -X POST http://localhost:8001/api/accounts/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "bob",
    "email": "bob@test.com",
    "password": "test123",
    "university": "UNKIN"
  }'

# 2. Login
curl -X POST http://localhost:8001/api/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "bob", "password": "test123"}'
# Garder le token retourné

# 3. Voir profil (avec token)
curl -X GET http://localhost:8001/api/accounts/profile/ \
  -H "Authorization: Bearer {token}"

# 4. Voir formations
curl -X GET http://localhost:8001/api/formations/

# 5. S'inscrire (avec token)
curl -X POST http://localhost:8001/api/enrollments/enroll/ \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"formation_id": 1}'

# 6. Voir classement
curl -X GET http://localhost:8001/api/ranking/
```

---

## 🔄 Checklist d'intégration

### Avant de commencer
- [ ] Backend clonéet accessible
- [ ] Frontend clonéet accessible
- [ ] Python 3.8+ installé
- [ ] pip et venv fonctionnels

### Phase 0: Setup
- [ ] venv créé et activé
- [ ] `pip install -r requirements.txt` réussi
- [ ] Nouvelles dépendances installées (CORS, JWT, Filter)
- [ ] `python manage.py migrate` réussi
- [ ] Superuser créé
- [ ] Frontend serveur lancé (localhost:xxxx)
- [ ] Backend serveur lancé (localhost:8001)

### Phase 1: CORS
- [ ] `corsheaders` dans INSTALLED_APPS
- [ ] CorsMiddleware en premier dans MIDDLEWARE
- [ ] CORS_ALLOWED_ORIGINS configuré
- [ ] Test fetch simple réussi

### Phase 2: Auth
- [ ] `rest_framework_simplejwt` installé et configuré
- [ ] POST `/accounts/register/` fonctionnel
- [ ] POST `/accounts/login/` fonctionnel ✅ JWT retourné
- [ ] POST `/accounts/logout/` fonctionnel
- [ ] GET `/accounts/profile/` fonctionnel (avec token)
- [ ] PUT `/accounts/profile/` fonctionnel (avec token)
- [ ] Api client updated avec auth methods
- [ ] Frontend: Register page intégrée
- [ ] Frontend: Login page intégrée
- [ ] Frontend: Token sauvegardé/utilisé

### Phase 3: Données
- [ ] GET `/formations/` retourne données (vide ou seed)
- [ ] GET `/ranking/` retourne données
- [ ] Frontend: Formations chargées dynamiquement
- [ ] Frontend: Classement chargé dynamiquement
- [ ] Frontend: Filtres formation fonctionnels
- [ ] Frontend: Filtres ranking fonctionnels

### Phase 4: Extras
- [ ] POST `/enrollments/enroll/` fonctionnel
- [ ] GET `/enrollments/my/` fonctionnel
- [ ] POST `/api/contact/` fonctionnel
- [ ] Email contact envoyé avec succès
- [ ] Frontend: Contact form intégré

### Phase 5: Polish
- [ ] Seed data chargé
- [ ] Admin interface accessible
- [ ] Tous les endpoints testés avec Postman/curl
- [ ] Tests avec 2-3 comptes utilisateurs
- [ ] Erreurs gérées proprement (401, 404, 500, etc.)
- [ ] Messages d'erreur clairs pour utilisateur
- [ ] Tokens actualisés correctement
- [ ] Sessions persistent après refresh page

### Tests finaux
- [ ] Parcours complet utilisateur:
  - [ ] S'enregistrer
  - [ ] Se connecter
  - [ ] Voir formations
  - [ ] S'inscrire à formation
  - [ ] Voir classement
  - [ ] Voir son profil
  - [ ] Envoyer message contact
  - [ ] Se déconnecter
- [ ] Tests multi-utilisateurs (vérifier isolation données)
- [ ] Tests mobile/responsive
- [ ] Tests performance (chargement lent?)
- [ ] Tests sécurité (JWT valide?, CORS correct?)

---

## 🚨 Troubleshooting

### CORS Error: "No 'Access-Control-Allow-Origin'"

**Cause:** CORS pas configuré ou pas de match avec origin

**Solution:**
```python
# settings.py - vérifier:
1. corsheaders dans INSTALLED_APPS? 
2. CorsMiddleware en PREMIER dans MIDDLEWARE?
3. CORS_ALLOWED_ORIGINS inclut votre frontend URL?
4. CORS_ALLOW_CREDENTIALS = True si vous utilisez cookies?
```

### 401 Unauthorized: "Token invalid or expired"

**Cause:** Token manquant ou expiré dans requête

**Solution:**
```javascript
// Vérifier dans api.js:
1. Token est dans localStorage?
2. Format Authorization: "Bearer {token}" correct?
3. Token pas expiré? (ACCESS_TOKEN_LIFETIME dans settings)

// Ajouter refresh logic:
if (response.status === 401) {
  const refresh = localStorage.getItem('refresh_token');
  // Utiliser refresh token pour obtenir nouveau access
}
```

### 404: "Endpoint not found"

**Cause:** Route mal configurée dans urls.py

**Solution:**
```python
# Vérifier:
1. Include() utilisé correctement?
2. Chemin du path() correspond à ce qu'on fetch()?
3. Méthode HTTP correcte (GET vs POST)?
4. Pas de typo dans path name?

# Exemple:
# urls.py: path('api/accounts/', include('accounts.urls'))
# accounts/urls.py: path('login/', LoginAPIView.as_view())
# Frontend: fetch('/api/accounts/login/', {method: 'POST'}) ✅
```

### 500: "Internal Server Error"

**Cause:** Exception dans le code backend

**Solution:**
```bash
# Vérifier logs Django:
# Dans terminal du serveur Django, chercher l'erreur complète
# Commun:
- ImportError (module not found)
- AttributeError (mauvaise référence)
- Database not migrated

# Fix:
python manage.py migrate
python manage.py check
```

### Données vides dans formations/ranking

**Cause:** Base de données vide

**Solution:**
```bash
# Charger seed data:
python seed_data.py

# Ou manuellement via admin:
python manage.py runserver
# Visit: http://localhost:8001/admin/
# Login avec superuser
# Créer quelques formations de test
```

### Authentification ne persiste pas après refresh

**Cause:** Token pas sauvegardé ou pas inclus dans requêtes

**Solution:**
```javascript
// Dans api.js, request() method:
// Vérifier que le token est récupéré de localStorage:
const token = localStorage.getItem('access_token');
if (token) {
  headers['Authorization'] = `Bearer ${token}`;
}

// Dans login success:
localStorage.setItem('access_token', data.access);
localStorage.setItem('refresh_token', data.refresh);
```

---

## 📈 Métriques de succès

Après intégration complète, vérifier:

✅ **Fonctionnalité:**
- [ ] Utilisateurs peuvent s'enregistrer
- [ ] Utilisateurs peuvent se connecter
- [ ] Utilisateurs peuvent voir formations
- [ ] Utilisateurs peuvent s'inscrire à formations
- [ ] Utilisateurs peuvent voir classement
- [ ] Utilisateurs peuvent envoyer message contact

✅ **Performance:**
- [ ] Page charge en < 2 secondes
- [ ] API répond en < 500ms
- [ ] Pas de N+1 queries

✅ **Sécurité:**
- [ ] Tokens JWT valides et sécurisés
- [ ] Données utilisateur isolées
- [ ] Pas d'erreurs SQL injection
- [ ] CORS correctement restrictif

✅ **UX:**
- [ ] Messages d'erreur clairs
- [ ] Feedback utilisateur visible
- [ ] Transitions fluides
- [ ] Mobile responsive

---

## 📞 Résumé des fichiers à modifier/créer

### Backend
```
jupython-backend/
├── jupython/settings.py        (CORS, JWT, Email config)
├── jupython/urls.py            (inclure toutes les apps)
├── accounts/
│   ├── api.py                  (Register, Login, Profile)
│   ├── serializers.py          (UserSerializer)
│   ├── urls.py                 (routes accounts)
│   └── models.py               (User - existant)
├── academy/
│   ├── api.py                  (Formation CRUD, Enrollment)
│   ├── urls.py                 (routes academy)
│   └── models.py               (existant)
├── ranking/
│   ├── api.py                  (Ranking)
│   ├── urls.py                 (routes ranking)
│   └── models.py               (existant)
├── contact/                    (app à créer)
│   ├── models.py               (ContactMessage)
│   ├── api.py                  (ContactAPIView)
│   ├── urls.py                 (routes contact)
│   └── admin.py                (admin contact)
├── seed_data.py                (créer ce file)
└── .env                        (créer depuis .env.example)
```

### Frontend
```
frontend/
├── assets/js/
│   ├── api.js                  (créer: ApiClient class)
│   ├── register.js             (modifier pour intégration)
│   ├── login.js                (modifier pour intégration)
│   ├── courses.js              (modifier pour données dynamiques)
│   ├── rankings.js             (modifier pour données dynamiques)
│   └── contact.js              (modifier pour intégration)
├── academy/
│   ├── register.html           (modifier form handler)
│   └── login.html              (modifier form handler)
├── contact.html                (modifier form handler)
└── courses.html                (modifier pour affichage dynamique)
```

---

## 🎓 Conclusion et prochaines étapes

Après cette intégration:

✅ **Vous aurez:**
- Frontend et backend communiquant
- Authentification utilisateur fonctionnelle
- Données dynamiques depuis le serveur
- Système d'inscription aux formations
- Classements en temps réel
- Formulaire contact qui envoie emails

🚀 **Pour aller plus loin:**
1. **Certificats** - Générer PDF après complétion cours
2. **Notifications** - Email/SMS pour updates
3. **Mobile App** - Réutiliser l'API pour app native
4. **Analytics** - Tracker utilisateur behavior
5. **Payment** - Intégrer Stripe/Paypal si formations payantes
6. **Forum** - Communauté utilisateurs
7. **Gamification** - Points, badges, achievements

**Timeline total:** 2-3 semaines pour un développeur  
**Complexité:** Moyenne-basse (très faisable!)  
**Risques:** Très faibles avec cette approche

Bon développement! 🚀

---

**Créé:** Janvier 2026  
**Status:** Prêt pour implementation  
**Version:** 1.0
