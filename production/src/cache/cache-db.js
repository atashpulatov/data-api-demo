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
   * @param {Object} stores where each key represents the name of an object
   * store and each value represents the primary and secondary indexes
   */
  constructor(dbName = 'cache', stores = { cache: '$$uuid,type' }) {
    if (!dbName) { return; }
    this.db = new Dexie(window.location.host + dbName);
    this.db.version(1).stores(stores);
    this.db.on('blocked', console.error);
    this.dbName = dbName;
  }

  /**
  * Get name of the database
  *
  * @returns {String} Database name
  */
  get name() {
    return this.dbName;
  }

  /**
  * Get database instance
  *
  * @returns {Object} Database instance
  */
  get instance() {
    return this.db;
  }

  /**
  * Closes any open connection to the underlying storage
  * and frees memory (event listeners) the database may be using.
  *
  * @returns {Promise} Close promise
  */
  close() {
    return this.db.close();
  }

  /**
  * Listen to database changes and calls the passed function
  *
  * @param {Function} callback Function called on change
  * @param {boolean} isRefresh representing whether refresh is in progress
  * @param {String} table name of the table in DB
  */
  onChange(callback, isRefresh = false, table = 'cache') {
    if (!isRefresh) {
      this.db[table].toArray(results => {
        results.forEach(callback);
      }).catch(console.error);
      // this.db[table].each(callback); TODO: double check whether
      // reading from cache sequentially will improve the performance
    }
    this.db.on('changes', (changes) => {
      changes.forEach(({ obj }) => {
        callback(obj);
      });
    });
    return this.db.open();
  }

  /**
   * Delete the current database
   *
   * @returns {Promise} Promise containing response of deletion
   */
  delete() {
    return this.db.delete();
  }

  /**
   * Delete all objects from table
   *
   * @param {String} table name of the table that should be cleared
   * @returns {Promise} Promise containing response of deletion
   */
  clearTable(table = 'cache') {
    return this.db[table].clear();
  }

  /**
   * Takes data to put() into the database specified id
   *
   * @param {String} type type of data
   * @param {Object} data Object to store in the DB
   * @param {String} table name of the table where the data should be stored
   * @returns {Promise} Promise containing result of put operation
   */
  putData(type, data, table = 'cache') {
    return this.db[table].put({ type, data });
  }

  /**
   * Takes data to update() into the database specified id
   *
   * @param {String} type type of data
   * @param {Object} data Object to store in the DB
   * @param {String} table name of the table where the data should be updated
   * @returns {Promise} Promise containing result of update operation
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
   */
  callIfTableEmpty(callback, table = 'cache') {
    return this.db[table].count().then((count) => {
      if (count === 0) { callback(); }
    });
  }

  /**
   * Checks indexedDB for all dbs and deletes them if the name
   * is not the one provided. Used when changing users after session expires.
   *
   * @static
   * @param {String} dbToKeep Current authenticated user
   * @returns {Promise} Promise results of deleting dbs not of the auth. user
   */
  static purge(dbToKeep) {
    return Dexie.getDatabaseNames((dbs) => {
      const dbsToDelete = dbs.filter((db) => db.includes(window.location.host) && !db.includes(dbToKeep));
      return Promise.all(dbsToDelete.map(Dexie.delete));
    });
  }

  /**
   * Check if browser supports indexed DB.
   * Set to false to completely disable the cache (!)
   *
   * @static
   * @returns {boolean} representing whether IndexedDB is supported
   */
  static getIndexedDBSupport() {
    return !!window.indexedDB;
  }
}
