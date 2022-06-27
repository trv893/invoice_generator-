// npm module that loads enviroment variables from a .env file
require('dotenv').config()

const myconfig ={
      "host" : process.env.DB_HOST,
      "database": process.env.DB_NAME,
      "username": process.env.DB_USER,
      "password": process.env.DB_PW,
      "use_env_variable": false,
      "dialect": "mysql",
      "authRedirectUri":process.env.AUTH_0_REDIRECT
  };


module.exports = myconfig 