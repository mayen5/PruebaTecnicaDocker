# Imagen base oficial de Node.js
FROM node:18

# Crear carpeta de trabajo
WORKDIR /app

# Copiar package.json y lock (si existe)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Compilar el proyecto TypeScript
RUN npm run build

# Exponer puerto de la API
EXPOSE 3001

# Comando de inicio
CMD ["npm", "start"]