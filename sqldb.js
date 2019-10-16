const sqlite3 = require('sqlite3').verbose();
const dbFileName = require('./config');

// declare global db
var db;

// open the database connection
const db_open = () => {
  db = new sqlite3.Database(dbFileName, sqlite3.OPEN_READONLY, err => {
    if (err) {
      return console.error(err.message);
    } else {
      console.log('Connected to the ' + dbFileName);
    }
  });
};

// close the database connection
const db_close = () => {
  db.close(err => {
    if (err) {
      return console.error(err.message);
    } else {
      console.log('Close the database connection');
    }
  });
};

console.log('sqlite3 test starting...');
db_open();

db.getAsync = function(sql) {
  var that = this;
  return new Promise(function(resolve, reject) {
    that.get(sql, function(err, row) {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

db.allAsync = function(sql) {
  var that = this;
  return new Promise(function(resolve, reject) {
    that.all(sql, function(err, rows) {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

db.runAsync = function(sql) {
  var that = this;
  return new Promise(function(resolve, reject) {
    that.run(sql, function(err) {
      if (err) reject(err);
      else resolve();
    });
  });
};

const sqlFilterXml2Json = movies => {
  // movies.c08, c20 is the type of xml
  // movies is array
  // if movies is object, below is error

  const parser = require('xml2json-light');

  // movies 가 object일 때, 즉 db.get 은 한개만 리턴한다.
  if (Array.isArray(movies) === false) {
    // console.log('variable movies : type object');

    ///////////////////////
    // poster xml parsing
    ///////////////////////
    var poster = parser.xml2json(movies.c08);
    //   console.log(poster);
    var poster_temp = [];

    if (Array.isArray(poster.thumb)) {
      poster.thumb.map(i => {
        if (i.aspect === 'poster') {
          poster_temp.push(i);
        } else if (i.aspect === undefined) {
          poster_temp.push(i);
        }
        //   console.log(poster_temp);
      });
    } else {
      poster_temp.push(poster.thumb);
    }

    // c08에 poster 첫번째 url 주소를 지정한다.
    movies.c08 = poster_temp[0].preview;

    ///////////////////////
    // fanart xml parsing
    ///////////////////////
    if (movies.c20 !== '') {
      var fanart = parser.xml2json(movies.c20);
      //   console.log(fanart);
      var fanart_temp = [];

      if (Array.isArray(fanart.fanart.thumb)) {
        fanart.fanart.thumb.map(i => {
          if (i.aspect === 'fanart') {
            fanart_temp.push(i);
          } else if (i.aspect === undefined) {
            fanart_temp.push(i);
          }
        });
      } else {
        fanart_temp.push(fanart.fanart.thumb);
      }

      // console.log(fanart_temp);

      // c20에 fanart 첫번째 url 주소를 지정한다.
      movies.c20 = fanart_temp[0].preview;
    }

    // movies 가 array 일때
  } else {
    movies.forEach(row => {
      //   console.log(row);
      //   const parser = require('xml2json-light');

      if (row.c08 !== '') {
        var poster = parser.xml2json(row.c08);
        // console.log(poster);
        var poster_temp = [];

        if (Array.isArray(poster.thumb)) {
          poster.thumb.map(i => {
            if (i.aspect === 'poster') {
              poster_temp.push(i);
            } else if (i.aspect === undefined) {
              poster_temp.push(i);
            }
            // console.log(poster_temp);
          });
        } else {
          poster_temp.push(poster.thumb);
        }

        row.c08 = poster_temp[0].preview;
      }

      if (row.c20 !== '') {
        var fanart = parser.xml2json(row.c20);
        // console.log(fanart);
        var fanart_temp = [];

        if (Array.isArray(fanart.fanart.thumb)) {
          fanart.fanart.thumb.map(i => {
            if (i.aspect === 'fanart') {
              fanart_temp.push(i);
            } else if (i.aspect === undefined) {
              fanart_temp.push(i);
            }
          });
        } else {
          fanart_temp.push(fanart.fanart.thumb);
        }

        // console.log(fanart_temp);
        row.c20 = fanart_temp[0].preview;
      }
    });
  }

  if (Object.keys(movies).length === 0) {
    console.log('No data found');
  } else {
    // console.log('return movies');
    return movies;

    // 아래 코드는 파일로 쓰는 코드이다.
    // let data = JSON.stringify(movies);
    // fs.writeFileSync("movies-data.json", data);
  }
};

module.exports = {
  db,
  sqlFilterXml2Json
};
