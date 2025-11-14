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

### 1. Clone o projeto
git clone https://github.com/gsaorim/Microblog-orm.git
cd Microblog-orm

### 2. Execute a aplicação
#### Parar containers existentes (se houver)
docker-compose down

#Reconstruir e executar
docker-compose up -d

### 3. Verifique se está funcionando
# Ver os logs da aplicação
docker logs microblog-app

# Verifique se os containers estão rodando
docker ps

### 4. Acesse a aplicação
# Abra no navegador: http://localhost:3000



