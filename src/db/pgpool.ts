let pg = require('pg');
const { Pool, Client } = require('pg');
import config from '../config/config.json';

let pool: any;
let connconfig: any;

try {
  connconfig = {
    user: config.dbuser,
    host: 'localhost',
    database: 'pigeonagency',
    password: config.dbpwd,
    port: 5432,
    max: 10,
    idleTimeoutMillis: 5000,
  }
} catch(err) {
  console.error(err);
}
let db:any=null;
 try{


db = {
  getPool: () => {
    if (pool) return pool;
    pool = new pg.Pool(connconfig);
    return pool;
  }
};
}catch(e){
  console.log(e);
}
export default db; 