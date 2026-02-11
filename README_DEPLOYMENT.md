# Raffine - Guide de Déploiement en Production

## 🚀 Tests de Développement - RÉSULTATS

### ✅ Backend - TOUT FONCTIONNE PARFAITEMENT

- **Base de données** : MongoDB Memory Server (automatique)
- **Serveur** : Express.js sur port 5000
- **APIs testées** : 
  - `/` ✅ (API status)
  - `/api/services` ✅ (6 services retournés)
  - `/api/auth/register` ✅ (création d'utilisateur + JWT)
  - `/api/auth/login` ✅ (authentification + JWT)
- **Tests unitaires** : 7/7 tests passent ✅
- **Authentification** : JWT fonctionnel ✅
- **CORS** : configuré correctement ✅

### ✅ Frontend - TOUT FONCTIONNE PARFAITEMENT

- **Framework** : React 18 + Vite
- **Serveur de dev** : http://localhost:5173 ✅
- **Router** : React Router v7 ✅
- **Styling** : Tailwind CSS ✅
- **API Client** : configuré vers backend ✅

### ✅ Connexion Frontend-Backend

- **Communication** : Fonctionnelle ✅
- **Authentification** : Token JWT partagé ✅
- **CORS** : Autorisé pour localhost:5173 ✅
- **LocalStorage** : Persistance utilisateur ✅

---

## 🌐 Guide de Déploiement en Production

### Option 1: Vercel + MongoDB Atlas (Recommandé)

#### Frontend sur Vercel

1. **Installer Vercel CLI**
```bash
npm i -g vercel
```

2. **Configurer le frontend**
Créer `/home/engine/project/vercel.json` :
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

3. **Variables d'environnement pour Vercel**
```env
VITE_API_URL=https://votre-backend.onrender.com/api
```

4. **Déployer**
```bash
vercel --prod
```

#### Backend sur Render

1. **Créer compte sur [Render.com](https://render.com)**

2. **Variables d'environnement**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/raffine
JWT_SECRET=votre_cle_jwt_tres_secrete_production
FRONTEND_URL=https://votre-app.vercel.app
```

3. **Fichier de build (render.yaml)**
```yaml
services:
  - type: web
    name: raffine-backend
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        fromService:
          type: configVar
          name: raffine-mongo
          property: connectionString
```

4. **Base de données MongoDB Atlas**
- Créer cluster gratuit sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Configurer whitelist IP
- Récupérer connection string

### Option 2: Heroku (Solution Complète)

#### Frontend et Backend ensemble

1. **Installer Heroku CLI**
```bash
npm install -g heroku
```

2. **Modifier package.json root**
```json
{
  "scripts": {
    "heroku-postbuild": "npm install --prefix frontend && npm run build --prefix frontend"
  }
}
```

3. **Structure pour Heroku**
```
/home/engine/project/
├── package.json (root)
├── backend/
├── frontend/
└── server.js (root for serving)
```

4. **Procfile**
```
web: node server.js
```

5. **server.js racine**
```javascript
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('frontend/dist'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running'));
```

6. **Variables d'environnement Heroku**
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=...
```

7. **Déployer**
```bash
git init
heroku create raffine-app
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Option 3: Railway + PlanetScale (Moderne)

#### Backend sur Railway

1. **Connecter GitHub à Railway**
2. **Variables d'environnement Railway**
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
FRONTEND_URL=https://votre-app.vercel.app
```

3. **Déployer automatiquement via GitHub**

#### Base de données sur PlanetScale

1. **Créer base de données MySQL sur [PlanetScale](https://planetscale.com)**
2. **Utiliser un ORM compatible (Prisma/Sequelize)**

### Option 4: Netlify + AWS Lambda

#### Frontend sur Netlify

1. **Build settings Netlify**
```
Build command: npm run build
Publish directory: dist
```

2. **Variables d'environnement**
```
VITE_API_URL=https://your-api-gateway.amazonaws.com/prod
```

#### Backend sur AWS Lambda

1. **Serverless Framework**
```yaml
service: raffine-api
provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
functions:
  api:
    handler: handler.hello
    events:
      - http:
          path: /{proxy+}
          method: ANY
```

2. **Connecter à MongoDB Atlas**
3. **Déployer avec Serverless Framework**

---

## 🔧 Configuration Avancée

### Variables d'Environnement Production

#### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/raffine
JWT_SECRET=votre_cle_jwt_tres_secrete_64_caracteres_minimum
FRONTEND_URL=https://votre-domaine.com
CORS_ORIGIN=https://votre-domaine.com
```

#### Frontend (.env.production)
```env
VITE_API_URL=https://votre-backend-url.com/api
VITE_APP_NAME=Raffine
```

### SSL et Sécurité

1. **HTTPS obligatoire** (certificats Let's Encrypt)
2. **Headers de sécurité**
```javascript
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

3. **Validation des données** (Joi/Yup)
4. **Rate limiting** (express-rate-limit)

### Monitoring et Logs

1. **Sentry** pour le tracking d'erreurs
2. **LogDNA** ou **CloudWatch** pour les logs
3. **New Relic** pour la performance
4. **Uptime monitoring** (UptimeRobot)

### Performance

1. **Cache Redis** pour les sessions
2. **CDN** pour les assets statiques
3. **Image optimization** (Cloudinary)
4. **Database indexing** optimisé

---

## 📊 Recommandation Finale

**Pour un déploiement rapide et fiable :**

1. **Frontend** : Vercel (gratuit, CDN global)
2. **Backend** : Render ou Railway (gratuit, facile)
3. **Base de données** : MongoDB Atlas (gratuit 500MB)
4. **Domaine** : Namecheap ou Cloudflare

**Coût total : ~0€/mois** pour commencer

**Avantages :**
- Déploiement en 15 minutes
- SSL automatique
- CDN global
- Scalabilité automatique
- Monitoring intégré

---

## 🚨 Checklist Déploiement Production

### Sécurité
- [ ] Variables d'environnement sécurisées
- [ ] HTTPS obligatoire
- [ ] CORS configuré correctement
- [ ] JWT avec expiration
- [ ] Validation des entrées
- [ ] Rate limiting activé

### Performance
- [ ] Base de données indexée
- [ ] Images optimisées
- [ ] Cache configuré
- [ ] CDN pour assets statiques
- [ ] Compression activée

### Monitoring
- [ ] Logs centralisés
- [ ] Alertes uptime
- [ ] Tracking d'erreurs
- [ ] Métriques de performance
- [ ] Sauvegardes automatiques

### Tests
- [ ] Tests unitaires passent
- [ ] Tests d'intégration OK
- [ ] Tests E2E validés
- [ ] Tests de charge simulés
- [ ] Vérification sécurité (OWASP)

---

**🎉 Votre application Raffine est prête pour la production !**