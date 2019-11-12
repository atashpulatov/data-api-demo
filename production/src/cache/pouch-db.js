/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */

import PouchDB from 'pouchdb';

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
  constructor(dbName = 'cache') {
    this.db = new PouchDB(dbName, { revs_limit: 1, auto_compaction: true });
    this.dbName = dbName;
    this.putObjects = this.putObjects.bind(this);
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
  * Get database info promise
  *
  * @returns {Promise} Database info
  * @memberof DB
  */
  info() {
    return this.db.info();
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
    return this.db.changes({ include_docs: true, live: true })
      .on('change', (change) => {
        callback(change);
      }).on('complete', (info) => {
        console.log(info);
      }).on('error', (err) => {
        console.log(err);
      });
  }

  /**
   * Delete the current database and create a new instance with the same name
   *
   * @returns {Promise} Promise containing response of deletion
   * @memberof DB
   */
  reset() {
    return this.db.destroy().then((res) => {
      if (res.ok) {
        this.db = new PouchDB(this.dbName);
        return res;
      }
      throw res;
    });
  }

  /**
   * Delete the current database
   *
   * @returns {Promise} Promise containing response of deletion
   * @memberof DB
   */
  clear() {
    return this.db.destroy();
  }

  /**
   * Takes data to put() into the database specified id
   *
   * @param {String} _id Document id in the database
   * @param {Object} data Object to store in the document
   * @param {Boolean} append Flag to append new data to array
   * @returns {Promise} Promise containing result of put operation
   * @memberof DB
   */
  putData(_id, data, append = false) {
    return this.db.get(_id)
      .then((doc) => {
        if (append) data = doc.data.concat(data);
        return this.db.put({ _id, _rev: doc._rev, data });
      })
      .catch((err) => {
        if (err.name === 'not_found') {
          return this.db.put({ _id, data });
        }
        throw err;
      });
  }

  /**
   * Takes a list of documents that you want to put() into the database
   *
   * @param {MSTR} objects MicroStrategy object array
   * @param {Object} projects Dictionary with project id and name
   * @returns {Promise} Promise containing result of bulkDocs operation
   * @memberof DB
   */
  putObjects(documents) {
    return this.db.bulkDocs(documents);
  }

  /**
   * Get all db documents
   *
   * @returns {Promise} allDocs promise operation
   * @memberof DB
   */
  getAllObjects() {
    return this.db.allDocs({ include_docs: true });
  }

  /**
   * Get a single db document by ID
   *
   * @param {String} id Name of db key
   * @returns {Promise} get promise operation
   * @memberof DB
   */
  get(id) {
    return this.db.get(id);
  }

  /**
   * Checks if DB is empty and if yes executes the callback fn
   *
   * @param {MSTR} callback Function that fetches documents
   * @param {Object} projects Dictionary with project id and name
   * @returns {Promise} Promise
   * @memberof DB
   */
  callIfEmpty(callback) {
    return this.info().then((info) => {
      if (!info.doc_count) return callback();
      return Promise.resolve();
    });
  }

  /**
   * Checks IndexedDB for all PouchDBs and deletes them if the username
   * is not the one provided. Used when changing users after session expires.
   *
   * @static
   * @param {String} usernameToKeep Current authenticated user
   * @returns
   * @memberof DB
   */
  static purgePouchDB(usernameToKeep) {
    if (window.indexedDB && window.indexedDB.databases) {
      return window.indexedDB.databases()
        .then((dbs) => dbs.filter((db) => (db.name.includes('_pouch_') && (!usernameToKeep || !db.name.includes(usernameToKeep)))))
        .then((pouchDBS) => Promise.all(pouchDBS.map((pouchDB) => window.indexedDB.deleteDatabase(pouchDB.name))))
        .catch(console.error);
    }
    return false;
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
