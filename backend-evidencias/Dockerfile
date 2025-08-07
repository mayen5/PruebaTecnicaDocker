FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copiamos el resto del código
COPY . .

# Exponer puerto
EXPOSE 3001

# Usar nodemon en desarrollo
CMD ["npx", "nodemon", "--watch", "src", "--exec", "ts-node", "src/server.ts"]
