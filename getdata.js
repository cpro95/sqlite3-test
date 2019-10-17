var sqldb = require("./sqldb");
var db = sqldb.db;
var sqlFilterXml2Json = sqldb.sqlFilterXml2Json;
var db_close = sqldb.db_close;

const getData = (query) => {
    var stmt = `select idMovie, c00, c01, c03, c08, c16, c19, c20, premiered, strPath,rating, uniqueid_value from movie_view where c00 like '%${query}%' order by idMovie desc`;
    console.log(stmt);
    db.allAsync(stmt)
      .then(val => {
        return sqlFilterXml2Json(val);
      })
      .then(val => {
        console.log("Count : ", val.length);
        console.log(val);
      })
      .then(() => {
        db_close();
      })
      .catch(err => {
        console.log(JSON.stringify(err));
        db_close();
      });
}

module.exports = getData;
