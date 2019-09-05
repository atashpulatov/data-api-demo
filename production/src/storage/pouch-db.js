import PouchDB from 'pouchdb';

export default class DB {
  constructor(dbName) {
    this.db = new PouchDB(dbName, { revs_limit: 2 });
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
   * Takes a list of documents that you want to put() into the database
   *
   * @param {MSTR} objects MicroStrategy object array
   * @returns {Promise} Promise containing result of bulkDocs operation
   * @memberof DB
   */
  putObjects(objects) {
    // Map PouchDB _id to MicroStrategy object.id
    const documents = objects.map((object) => ({ ...object, _id: String(object.id) }));
    console.log(documents);
    return this.db.bulkDocs(documents);
  }
}
