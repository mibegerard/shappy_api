# Utiliser une image de base officielle de Node.js
FROM node:16

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances avec l'option --legacy-peer-deps
RUN npm install --legacy-peer-deps

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port sur lequel l'application s'exécute
EXPOSE 3000

# Définir la commande pour démarrer l'application
CMD ["npm", "start"]