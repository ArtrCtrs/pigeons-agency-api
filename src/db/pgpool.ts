let pg = require('pg');
const { Pool, Client } = require('pg');

let pool: any;

let config: any;

try {
  config = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'test',
    password: 'iguane',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000,
  });
} catch(err) {
  console.error(err);
}
let db:any=null;
 try{


db = {
  getPool: () => {
    if (pool) return pool;
    pool = new pg.Pool(config);
    return pool;
  }
};
}catch(e){
  console.log(e);
}
export default db; 