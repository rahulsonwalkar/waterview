/* Creates new DB and forwards all other */
const fs = require('fs');
const jsonfile = require('jsonfile');
const dir = require('./path_dir').production();
const rimraf = require('rimraf');

const Database = require('./Database');
const Collection = require('./Collection');

let db = JSON.parse(fs.readFileSync(`${dir}/config.json`));

/**
 * Creates a new collection under the connected database.
 * @async
 * @param {string} name - Name of the collection
 * @param {string} callback - An optional callback function
 * @example
 * waterview.createCollection('users', function(err){
 *      if(err)
 *        console.log(err);
 *      //Do something after creating the collection
 * })
 */

const createCollection = function(name, callback){
  Collection.create({
    dir: dir,
    db: db,
    name: name,
    callback: callback
  });
}

/**
 * Creates a new database and connects to it by default.
 * @async
 * @param {string} name - Name of the database
 * @param {string} callback - An optional callback function
 * @example
 * waterview.createDatabase('myDatabase', function(err){
 *      if(err)
 *        console.log(err);
 *      //Do something after creating the database
 * })
 */

const createDatabase = function(name, callback){
  Database.create({
    dir: dir,
    db: db,
    name: name,
    callback: callback
  });
}

/**
 * Connect to an existing database.
 * @async
 * @param {string} name - Name of the database
 * @param {string} callback - An optional callback function
 * @example
 * waterview.connect('myAnotherDatabase', function(err){
 *      if(err)
 *        console.log(err);
 *      //Do something after connecting to the database
 * })
 */

const connect = function(name, callback){
  Database.connect({
    dir: dir,
    db: db,
    name: name,
    callback: callback
  });
}

/**
 * Insert an entity into a collection.
 * @async
 * @param {string} name - Name of the collection.
 * @param {object} value - Entity to be inserted.
 * @param {string} callback - An optional callback function.
 * @example
 * waterview.insert('users', {
 *  "name" : "Rahul Sonwalkar",
 *  "email" : "rahul@example.com",
 *  "age" : 20,
 *  "drivers_license" : true
 * }, callback)
 */

const insert =  function(collection, value, callback){
  Collection.insert.one({
    dir: dir,
    db: db,
    collection: collection,
    value: value,
    callback: callback
  });
}

/**
 * Insert a multiple entities into a collection.
 * @async
 * @param {string} name - Name of the collection.
 * @param {array} values - Array of entity to be inserted.
 * @param {string} callback - An optional callback function.
 * @example
 * waterview.insert('users', [
 *  {
 *   "name" : "Rahul Sonwalkar",
 *   "email" : "rahul@example.com",
 *   "age" : 20,
 *   "drivers_license" : true
 *  },
 *  {
 *   "name" : "John Doe",
 *   "email" : "johndoe@mail.com",
 *   "age" : 41,
 *   "drivers_license" : false
 *  },
 *  {
 *   "name" : "Gordon Ramsay",
 *   "email" : "ramsay@mail.com",
 *   "age" : 55,
 *   "drivers_license" : true
 *  }
 *])
 */

const insertAll =  function(collection, values, callback){
  Collection.insert.many({
    dir: dir,
    db: db,
    collection: collection,
    values: values,
    callback: callback
  });
}

/**
 * Retrives all entities in a collection
 * @async
 * @param {string} collection - Name of the collection
 * @param {string} callback - An optional callback function
 * @yields {array} Yields an array of all entities in the collection.
 * @example
 * waterview.getAll('users', callback)
 */

const getAll = function(collection, callback){
  Collection.get.all({
    dir: dir,
    db: db,
    collection: collection,
    callback: callback
  })

}

/**
 * Retrives the first entity from a collection that satisfies all the conditions
 * @async
 * @param {string} collection - Name of the collection
 * @param {object} conditions
 * @param {string} callback - An optional callback function
 * @yields {array} Yields an object from the collection that satisfies all the conditions
 * @example
 * waterview.getWhere('users', {
 *  "name" : "Rahul Sonwalkar",
 *  "age" : 20
 * }, callback)
 *
 * //Returns the first object from collections users where name = "Rahul Sonwalkar" and age = 20
 */

const getWhere = function(collection, conditions, callback){

  Collection.get.where({
    dir: dir,
    db: db,
    collection: collection,
    conditions: conditions,
    callback: callback
  })

}

const deleteCollection = function(collection, database){
  if(!database)
    database = db.name;

  console.log(database);

  rimraf(`./${db}/${collection}`, function(err){
    if(err)
      console.log(err);
    console.log(`SUCCESS! Collection ${collection} of Database ${database} removed`);
  })

}

const printDB = function(){
  console.log(`${db.name} ->`)
  console.log(`${db.collections}`);
}

const printCollection = function(collection){
  let path = `${dir}/${db.name}/${collection}`;
  let data = JSON.parse(fs.readFileSync(`${path}/data.json`));

  console.log(`${collection} of DB ${db.name} ->`)
  console.log(data);
}

// createDatabase('testDB', ()=>{
//   createCollection('testCollection', ()=>{
//     connect('testDB');
//   });
// });

// insert('testCollection', {
//   name: "Rahul",
//   age: "20",
//   sex: "male"
// });

// insert('testCollection', {
//   name: "John",
//   age: "30",
//   sex: "male"
// });

// getWhere('testCollection', {
//   age: 20
// }, (data) => {
//   console.log(data);
// })
//exports.createCollection = createCollection
//createCollection('loggers')

//createDatabase("Diljit")
//cdcreateCollection("balu")

const print = function(input){
  input = input.split("/");

  if(input.length == 0){
    // List of DB
  }
  else if(input.length == 1){
    // List of collections
  }
  else if (input.length == 2){
    // Data in collections
  }

}
module.exports = {
  createCollection,
  createDatabase,
  connect,
  insert,
  getAll,
  getWhere,
  insertAll,
  deleteCollection,
  printDB,
  printCollection,
  print
};
