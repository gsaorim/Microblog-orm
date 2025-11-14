FROM node:18-alpine

WORKDIR /usr/src/app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o restante da aplicação
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
