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
  constructor(dbName) {
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
    console.log('Destroy DB');
    return this.db.destroy();
  }

  /**
   * Takes a list of documents that you want to put() into the database and
   * adds the PouchDB required _id key
   *
   * @param {MSTR} objects MicroStrategy object array
   * @returns {Promise} Promise containing result of bulkDocs operation
   * @memberof DB
   */
  putObjects(objects) {
    // Map PouchDB _id to MicroStrategy object.id
    const documents = objects.map((object) => ({ ...object, _id: String(object.id) }));
    return this.db.bulkDocs(documents);
  }

  /**
   * Checks if DB is empty and if yes executes the callback fn with DB.putObjects()
   *
   * @param {MSTR} callback Function that fetches documents
   * @returns {Promise} Promise containing result of bulkDocs operation
   * @memberof DB
   */
  addObjectsAsync(callback) {
    return this.info().then((info) => {
      if (!info.doc_count) callback(this.putObjects);
    });
  }
}
