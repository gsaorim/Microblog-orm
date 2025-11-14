# 🐦 Microblog Node.js com MongoDB via Docker

Sistema de microblogging feito com Node.js + Express + EJS + MongoDB, pronto para rodar facilmente em qualquer computador usando Docker para o banco de dados.

## ✨ Funcionalidades

- Cadastro e login de usuários
- CRUD de posts e comentários
- Sistema de sessões e autenticação
- Operações rápidas com MongoDB
- Interface simples via EJS

## 🚀 Como rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado
- [Docker Desktop](https://www.docker.com/products/docker-desktop) instalado e funcionando


### 🐳 Execução com Docker 

```bash
### 1. Clone o projeto
git clone https://github.com/gsaorim/Microblog-orm.git
cd Microblog-orm

# Execute com Docker Compose
docker-compose up -d

# Verifique se os containers estão rodando
docker ps

# execute manualmente:
docker run -d --name mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=admin123 -v mongo_data:/data/db mongo:latest
docker exec -it mongodb mongosh -u admin -p admin123 --authenticationDatabase admin
docker exec -it microblog-app node server.js
Acesse: http://localhost:3000
admin é o usuário, admin123 é a senha, o email pode ser qualquer um
