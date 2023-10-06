import Dexie from 'dexie';

const db = new Dexie('OfficeDB');

db.version(1).stores({ promptAnswers: 'key' });

export default db;
