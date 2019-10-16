'use strict'

var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('test_db');

db.getAsync = function (sql) {
    var that = this;
    return new Promise(function (resolve, reject) {
        that.get(sql, function (err, row) {
            if (err)
                reject(err);
            else
                resolve(row);
        });
    });
};

db.allAsync = function (sql) {
    var that = this;
    return new Promise(function (resolve, reject) {
        that.all(sql, function (err, rows) {
            if (err)
                reject(err);
            else
                resolve(rows);
        });
    });
};

db.runAsync = function (sql) {
    var that = this;
    return new Promise(function (resolve, reject) {
        that.run(sql, function(err) {
            if (err)
                reject(err);
            else
                resolve();
        });
    })
};

function voteAsync(voter) {
    var val;
    var getStmt = `SELECT Name, Count FROM Voters WHERE Name="${voter}"`;
    console.log(getStmt);
    return db.getAsync(getStmt).then((row) => {
        if (!row) {
            console.log("VOTER NOT FOUND");
            var insertSql = `INSERT INTO Voters (Name, Count) VALUES ("${voter}", 1)`;

            val = 1;
            return db.runAsync(insertSql);
        }
        else {
            val = row["Count"];
            console.log(`COUNT = ${val}`);
            val += 1;

            // update
            var updateSql = `UPDATE Voters SET Count = ${val} WHERE Name = "${voter}"`;
            console.log(updateSql);
            return db.runAsync(updateSql);
        }
    }).then(() => {
        return val;
    });
}

console.log('sqlite3...');
var stmt = "CREATE TABLE Voters IF NOT EXISTS (Name TEXT, Count int)";
console.log(stmt);
db.runAsync(stmt).then(() => {
    return voteAsync("john doe");
}).then((val) => {
    console.log(`New vote for John Doe is ${val}`);
}).catch((err) => {
    console.log(JSON.stringify(err));
});    
