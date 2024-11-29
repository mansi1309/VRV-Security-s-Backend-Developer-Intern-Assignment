require("dotenv").config();
//create connection to mongodb
const { MongoClient } = require("mongodb");
const uri = process.env.DB_URL;

const client = new MongoClient(uri);

let obj = {
  db: null,
};

let connection = async function () {
  try {
    await client.connect();
    console.log("DB Connection Successful");
    const database = client.db(process.env.DB_NAME);

    if (database) {
      obj.db = database;
    } else {
      throw "database not get";
    }
  } catch (e) {
    console.log("failed" + e);
  } finally {
  }
};

module.exports.get = function () {
  return obj.db;
};

module.exports.connect = connection;
