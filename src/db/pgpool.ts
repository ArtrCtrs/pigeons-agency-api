let pg = require('pg');
const { Pool, Client } = require('pg');
import config from '../config/config.json';

let pool: any;
let connconfig: any;

try {
  connconfig = {
    user: config.dbuser,
    host: config.dbhost,
    database: config.dbdatabase,
    password: config.dbpwd,
    port: config.dbport,
    max: config.dbmax,
    idleTimeoutMillis: config.dbidle,
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