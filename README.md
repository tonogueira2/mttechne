# Boleirplate API Nodejs



### Configurando
Preencha os arquivos de configuração na pasta "config" com as informações do banco de dados e serviços usados pelo projeto.

Crie o arquivo development.env dentro da pasta .env e preecha-o com as configurações necessárias usando .env.example como exemplo.

Execute os seguintes comandos:
```
> npm install or yarn

> NODE_ENV=development npx sequelize db:create --env development
> NODE_ENV=development npx sequelize db:migrate --env development
> NODE_ENV=development npx sequelize db:seed:all --env development
```