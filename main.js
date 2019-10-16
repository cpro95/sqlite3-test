console.log('main');
var sqldb = require('./sqldb');
var db = sqldb.db;
var sqlFilterXml2Json = sqldb.sqlFilterXml2Json;

var stmt = `select idMovie, c00, c08, c20 from movie where c00 like '%star%' order by idMovie desc limit 2`;
console.log(stmt);
db.allAsync(stmt)
  .then(val => {
    return sqlFilterXml2Json(val);
  })
  .then(val => {
    console.log(val);
  })
  .catch(err => {
    console.log(JSON.stringify(err));
  });
