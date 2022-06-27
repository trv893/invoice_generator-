// npm module that loads enviroment variables from a .env file
const evnvar =require('dotenv').config()

const myconfig ={
      "host" : evnvar.parsed.DB_HOST,
      "database": evnvar.parsed.DB_NAME,
      "username": evnvar.parsed.DB_USER,
      "password": evnvar.parsed.DB_PW,
      "use_env_variable": false,
      "dialect": "mysql",
      "authRedirectUri": evnvar.parsed.AUTH_0_REDIRECT
  };


module.exports = myconfig 