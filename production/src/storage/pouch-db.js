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
    this.db = new PouchDB(dbName, { revs_limit: 2 });
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
    return this.instance.info();
  }

  /**
   * Delete the current database and create a new instance with the same name
   *
   * @returns {Promise} Promise containing response of deletion
   * @memberof DB
   */
  reset() {
    return this.db.destroy().then((res) => {
      if (res.ok) this.db = new PouchDB(this.dbName);
      return res;
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
   * Takes a list of documents that you want to put() into the database and
   * adds the PouchDB required _id key and projectName
   *
   * @param {MSTR} objects MicroStrategy object array
   * @param {Object} projects Dictionary with project id and name
   * @returns {Promise} Promise containing result of bulkDocs operation
   * @memberof DB
   */
  putObjects(objects, projects) {
    // Map PouchDB _id to MicroStrategy object.id
    const documents = objects.map((object) => ({ ...object, _id: String(object.id), projectName: projects[object.projectId] || '', ownerName: object.owner.name, ownerId: object.owner.id, certified: object.certifiedInfo.certified }));
    return this.db.bulkDocs(documents);
  }

  /**
   * Checks if DB is empty and if yes executes the callback fn with DB.putObjects()
   *
   * @param {MSTR} callback Function that fetches documents
   * @param {Object} projects Dictionary with project id and name
   * @returns {Promise} Promise containing result of bulkDocs operation
   * @memberof DB
   */
  addObjectsAsync(callback, projects) {
    return this.info().then((info) => {
      if (!info.doc_count) callback((objects) => this.putObjects(objects, projects));
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
    if (window.indexedDB) {
      return window.indexedDB.databases()
        .then((dbs) => dbs.filter((db) => (db.name.includes('_pouch_') && !db.name.includes(usernameToKeep))).map((e) => e.name))
        .then((pouchDBS) => pouchDBS.forEach((pouchDB) => window.indexedDB.deleteDatabase(pouchDB)))
        .catch(console.error);
    }
    return false;
  }
}
