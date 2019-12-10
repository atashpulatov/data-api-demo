/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */

import Dexie from 'dexie';
import 'dexie-observable';


/**
 * Helper class to create, reset and add MicroStrategy objects into the db
 *
 * @export
 * @class DB
 */
export default class DB {
  /**
   * Creates an instance of PouchDB with limited revision history.
   *
   * @param {String} dbName Name of db
   * @memberof DB
   */
  constructor(dbName = 'cache', stores = { cache: '$$uuid,type' }) {
    this.db = new Dexie(dbName);
    this.db.version(1).stores(stores);
    this.dbName = dbName;
  }

  /**
  * Get name of the database
  *
  * @returns {String} Database name
  * @memberof DB
  */
  get name() {
    return this.dbName;
  }

  /**
  * Get database instance
  *
  * @returns {Object} Database instance
  * @memberof DB
  */
  get instance() {
    return this.db;
  }

  /**
  * Closes any open connection to the underlying storage
  * and frees memory (event listeners) the database may be using.
  *
  * @returns {Promise} Close promise
  * @memberof DB
  */
  close() {
    return this.db.close();
  }

  /**
  * Listen to database changes and calls the passed function
  *
  * @param {Function} callback Function called on change
  * @memberof DB
  */
  onChange(callback) {
    this.db.on('changes', (changes) => {
      console.log(changes);
      callback(changes);
    });
  }

  /**
   * Delete the current database
   *
   * @returns {Promise} Promise containing response of deletion
   * @memberof DB
   */
  delete() {
    return this.db.delete();
  }

  /**
   * Delete all objects from table
   *
   * @returns {Promise} Promise containing response of deletion
   * @memberof DB
   */
  clearTable(table = 'cache') {
    return this.db[table].clear();
  }

  /**
   * Takes data to put() into the database specified id
   *
   * @param {Object} data Object to store in the document
   * @param {Boolean} append Flag to append new data to array
   * @returns {Promise} Promise containing result of put operation
   * @memberof DB
   */
  putData(type, data, table = 'cache') {
    return this.db[table].put({ type, data });
  }

  /**
   * Takes data to update() into the database specified id
   *
   * @param {Object} data Object to store in the document
   * @param {Boolean} append Flag to append new data to array
   * @returns {Promise} Promise containing result of put operation
   * @memberof DB
   */
  updateData(type, data, table = 'cache') {
    return this.db[table].get({ type })
      .then((entry) => this.db[table].update(entry.uuid, { type, data }))
      .catch(() => this.putData(type, data));
  }

  /**
   * Checks if DB table is empty and if yes executes the callback fn
   *
   * @param {MSTR} callback Function that fetches documents
   * @param {Object} table Table to check if empty
   * @returns {Promise} Promise
   * @memberof DB
   */
  callIfTableEmpty(callback, table = 'cache') {
    return this.db[table].count().then((count) => {
      console.log('countantaotuanotu', count);
      if (count === 0) return callback();
      return Promise.resolve();
    });
  }

  /**
   * Checks indexedDB for all dbs and deletes them if the name
   * is not the one provided. Used when changing users after session expires.
   *
   * @static
   * @param {String} dbToKeep Current authenticated user
   * @returns
   * @memberof DB
   */
  static purge(dbToKeep) {
    return Dexie.getDatabaseNames((dbs) => {
      console.log(dbToKeep);
      console.log(dbs);
      dbs.filter((db) => db !== dbToKeep);
      console.log(dbs);
      return Promise.all(dbs.map(Dexie.delete));
    });
  }

  /**
   * Check if browser supports indexed DB.
   * Set to false to completely disable the cache (!)
   *
   * @static
   * @returns Boolean
   * @memberof DB
   */
  static getIndexedDBSupport() {
    return window.indexedDB;
  }
}
