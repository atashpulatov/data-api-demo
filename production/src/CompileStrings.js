/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs-extra');
const sql = require('mssql');
const path = require('path');

const STRING_SERVER = '10.27.10.36'; // TS_SPHINX
const HASH_DSN_DB = { LOCALIZATION_WEB: 'STRING_WEB', };

const fetchStrings = async (database, password, sqlString) => {
  // const pool = await sql.connect('mssql://username:password@localhost/database')
  // const result = await sql.query`select * from mytable where id = ${value}`

  const config = {
    user: process.env.STRING_DB_USERNAME,
    password,
    server: STRING_SERVER,
    database,
    options: { encrypt: false, },
  };


  const pool = await sql.connect(config);
  const result = await pool.request().query(sqlString);
  sql.close();
  return result.recordset;
};

const getObjectFromRow = (row, columnPostfix) => {
  const engMessage = row.String_English;

  const columnName = `String_${columnPostfix}`;
  // For the language that owned by one DB but not another
  const msg = (columnName in row) ? row[columnName] : (`*${engMessage}*`);

  // Really not sure why messages in DB has '&' everywhere...
  if (!msg) {
    return null;
  }

  return {
    key: engMessage,
    v: msg,
  };
};

const exportToResourceFile = async (outputFileFolder) => {
  // TODO ryu: Check if file exists before this?
  // const file = await fs.readFile(path.join(__dirname, '/../files/pwd.txt'))
  const password = process.env.STRING_DB_PASSWORD;

  const sqlWeb = 'SELECT * FROM Office_Strings ORDER BY ID';
  console.log(sqlWeb);
  try {
    const webRows = await fetchStrings(HASH_DSN_DB.LOCALIZATION_WEB, password, sqlWeb);
    // There are inconsistencies between gui and web DB. We use | to separate them here.
    const acceptLanguageDict = {
      'da-DK': 'Danish',
      'de-DE': 'Deutsch',
      // 'en-GB': 'English_UK|English',
      'en-US': 'English',
      // 'en': 'English',
      'es-ES': 'Espanol_Espana|Espanol',
      'fr-FR': 'Francais',
      'it-IT': 'Italiano',
      'ja-JP': 'Japanese',
      'ko-KR': 'Korean',
      'nl-NL': 'Dutch',
      // 'pl': 'Polish',
      'pt-BR': 'Portuguese_Brazil|Portuguese',
      // 'ru': 'Russian',
      'sv-SE': 'Svenska',
      'zh-TW': 'Trad_Chinese|ChineseTraditional',
      // 'zh': 'Chinese|ChineseSimplified',
      'zh-CN': 'Chinese|ChineseSimplified',
    };

    const wholeDescriptors = {};
    for (const [language, colPostfixes] of Object.entries(acceptLanguageDict)) {
      const descriptors = {};
      const colPostfixList = colPostfixes.split('|');

      let webPostfix = '';
      if (colPostfixList.length === 1) {
        webPostfix = colPostfixes;
      } else {
        [webPostfix] = colPostfixList;
      }
      for (const row of webRows) {
        const obj = getObjectFromRow(row, webPostfix);
        if (obj) {
          descriptors[obj.key] = obj.v;
        }
      }

      wholeDescriptors[language] = descriptors;
    }

    await fs.ensureDir(outputFileFolder);
    await Promise.all(Object.keys(acceptLanguageDict).map(
      (locale) => fs.writeFile(path.join(outputFileFolder, `${locale}.json`),
        JSON.stringify(wholeDescriptors[locale], null, 2), 'utf8')
    ));
    console.log(`Completed exporting all resources files to ${outputFileFolder}!`);
  } catch (e) {
    console.log('No connection to strings DB. Skipping this step');
  }
};

exportToResourceFile('./src/locales/');
