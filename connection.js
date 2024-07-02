const mysql = require('mysql');

const conn= mysql.createConnection({
  /*host: 'localhost',
  user: 'root',
  password: '',
  database: 'shopify' */
 
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PAASWORD,
  database: process.env.DATABASE,

  
});


module.exports=conn;