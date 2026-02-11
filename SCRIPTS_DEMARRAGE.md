# 🚀 Scripts de Démarrage Rapide - Raffine

## 📋 Scripts Disponibles

### 1. Démarrer l'environnement complet
```bash
# Dans un terminal (backend)
cd /home/engine/project/backend
npm start

# Dans un autre terminal (frontend)  
cd /home/engine/project
npm run dev
```

### 2. Tester les APIs
```bash
# Test de base
curl http://localhost:5000

# Test des services
curl http://localhost:5000/api/services

# Test d'inscription
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Test de connexion
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 3. Exécuter les tests
```bash
cd /home/engine/project/backend
npm test
```

### 4. Build pour production
```bash
cd /home/engine/project
npm run build
```

---

## 🔧 Commandes Utiles

### Nettoyer l'environnement
```bash
# Supprimer node_modules
rm -rf /home/engine/project/node_modules
rm -rf /home/engine/project/backend/node_modules

# Réinstaller
cd /home/engine/project && npm install
cd /home/engine/project/backend && npm install
```

### Vérifier les ports
```bash
# Vérifier si le port 5000 est utilisé
lsof -i :5000

# Vérifier si le port 5173 est utilisé  
lsof -i :5173

# Tuer un processus sur un port
kill -9 $(lsof -t -i:5000)
```

### Logs et debug
```bash
# Logs du backend
cd /home/engine/project/backend && npm start

# Logs des tests
cd /home/engine/project/backend && npm test 2>&1 | tee test-results.log
```

---

## 🌐 URLs de Test

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000  
- **Services API**: http://localhost:5000/api/services
- **Health Check**: http://localhost:5000/api/health

---

## 📊 Données de Test

### Utilisateur de test créé
- **Email**: test@example.com
- **Password**: password123
- **JWT Token**: Généré automatiquement lors de l'authentification

### Services disponibles
1. Lumière Wellness (Spa - $120)
2. Obsidian Salon (Hair - $85)  
3. Serenity Skin (Wellness - $200)
4. Apex Fitness (Fitness - $60)
5. Aura Retreat (Wellness - $36)
6. Elegance Studio (Hair - $55)

---

## 🎯 Workflow de Développement

1. **Démarrer l'environnement**:
   ```bash
   # Terminal 1
   cd /home/engine/project/backend && npm start
   
   # Terminal 2  
   cd /home/engine/project && npm run dev
   ```

2. **Tester la connexion**:
   ```bash
   curl http://localhost:5000/api/services
   ```

3. **Développer et tester**:
   - Frontend: http://localhost:5173
   - API: http://localhost:5000/api

4. **Vérifier avec les tests**:
   ```bash
   cd /home/engine/project/backend && npm test
   ```

5. **Build pour production**:
   ```bash
   cd /home/engine/project && npm run build
   ```

---

## 🆘 Dépannage

### Problèmes courants

#### Port déjà utilisé
```bash
# Trouver et tuer le processus
lsof -ti:5000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

#### Base de données non connectée
- Vérifier que MongoDB Memory Server démarre
- Les logs doivent montrer: "MongoDB Connected: 127.0.0.1"

#### Erreur CORS
- Vérifier que `FRONTEND_URL=http://localhost:5173` dans `/home/engine/project/backend/.env`

#### JWT Token invalide
- Vérifier que `JWT_SECRET` est défini dans `/home/engine/project/backend/.env`
- Régénérer le token en se reconnectant

---

**✨ Bon développement avec Raffine !** 🚀