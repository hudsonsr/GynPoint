# GynPoint
desafio BootCamp


Instalações
Sucrase + Nodemon;

yarn add sucrase nodemon -D



É necessário configurar o pakage.json e criar o arquivo nodemon.json  assim como o lauch.json para o debug automatico

package.json:
"scripts":{
    "dev": "nodemon src/server.js",
    "dev:debug":"nodemon --inspect src/server.js"
  },

nodemon.json:
{
   "execMap":{
      "js": "node -r sucrase/register"
   }
}

launch.json:
{
   // Use IntelliSense to learn about possible attributes.
   // Hover to view descriptions of existing attributes.
   // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
   "version": "0.2.0",
   "configurations": [
      {
         "type": "node",
         "request": "attach",
         "name": "Launch Program",
         "restart": true,
         "protocol": "inspector"
      }
   ]
}

ESLint + Prettier + EditorConfig;

yarn add eslint -D
yarn eslint --init
{ Escolhas:
yarn run v1.19.1
$ /home/hudson/projetosJS/GynPoint/node_modules/.bin/eslint --init
? How would you like to use ESLint? To check syntax, find problems, and en
force code style
? What type of modules does your project use? JavaScript modules (import/e
xport)
? Which framework does your project use? None of these
? Does your project use TypeScript? Yes
? Where does your code run? Node
? How would you like to define a style for your project? Use a popular sty
le guide
? Which style guide do you want to follow? Airbnb (https://github.com/airb
nb/javascript)
? What format do you want your config file to be in? JavaScript
Checking peerDependencies of eslint-config-airbnb-base@latest
The config that you've selected requires the following dependencies:

@typescript-eslint/eslint-plugin@latest eslint-config-airbnb-base@latest eslint@^5.16.0 || ^6.1.0 eslint-plugin-import@^2.18.2 @typescript-eslint/parser@latest
? Would you like to install them now with npm? Yes

}
Após executar remover package.lock.json e rodar o comando yarn na pasta

configurar o arquivo eslintrc.js
module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": [
        "airbnb-base"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "class-methods-use-this": "off",
        "no-param-reassign": "off",
        "camelcase": "off",
        "no-unused-vars": ["error", { "argsIgnorePattern": "next" }],
    },
};

Prettier:
yarn add prettier eslint-config-prettier eslint-plugin-prettier -D

alterar o eslintrc.js
    "extends": [
        "airbnb-base",
        "prettier"
    ],
    "plugins": ['prettier'],
    "rules": {
        "prettier/prettier": "error", ......

criar e configurar .prettierrc
{
   "singleQuote": true,
   "trailingComma": "es5"
}

EditorConfig
após instalar a extensão clicar com o botão ditero na rais e ir na opção generate .editorConfig, e colocar o seguinte conteudo:
root = true

[*]
indent_style = space
indent_size = 3
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true





Sequelize (Utilize PostgreSQL ou MySQL);
