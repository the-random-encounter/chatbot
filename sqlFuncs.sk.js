// @ts-check


const mysql = require('mysql2/promise');
const ComfyJS = require('comfy.js');
const { mod } = require('tmi.js/lib/commands');
const { toNumber } = require('tmi.js/lib/utils');

const { getReadonlyRewards } = require('./src/twitch-api.lowlev.mjs'); // Not sure what this is supposed to be? I installed the twitch-api library, but couldn't find twitch-api.lowlev, or anything like that.

const getConnection = async () => {
  const {
    SQL_HOSTNAME: host,
    SQL_USERNAME: user,
    SQL_PASSWORD: password,
    SQL_DATABASE: database,
  } = process.env;
  try {
    const sql = await mysql.createConnection({
      host,
      user,
      password,
      database,
    });
    return sql;
  } catch (e) {
    console.error('Database connection failed.', e);
  }
};
const sql = getConnection();

const generateRandomAdjective = () => {
  let adjList = [
    'adorable',
    'adventurous',
    'aggressive',
    'agreeable',
    'alert',
    'alive',
    'amused',
    'angry',
    'annoyed',
    'annoying',
    'anxious',
    'arrogant',
    'ashamed',
    'attractive',
    'average',
    'awful',
    'bad',
    'beautiful',
    'better',
    'bewildered',
    'black',
    'bloody',
    'blue',
    'blue-eyed',
    'blushing',
    'bored',
    'brainy',
    'brave',
    'breakable',
    'bright',
    'busy',
    'calm',
    'careful',
    'cautious',
    'charming',
    'cheerful',
    'clean',
    'clear',
    'clever',
    'cloudy',
    'clumsy',
    'colorful',
    'combative',
    'comfortable',
    'concerned',
    'condemned',
    'confused',
    'cooperative',
    'courageous',
    'crazy',
    'creepy',
    'crowded',
    'cruel',
    'curious',
    'cute',
    'dangerous',
    'dark',
    'dead',
    'defeated',
    'defiant',
    'delightful',
    'depressed',
    'determined',
    'different',
    'difficult',
    'disgusted',
    'distinct',
    'disturbed',
    'dizzy',
    'doubtful',
    'drab',
    'dull',
    'eager',
    'easy',
    'elated',
    'elegant',
    'embarrassed',
    'enchanting',
    'encouraging',
    'energetic',
    'enthusiastic',
    'envious',
    'evil',
    'excited',
    'expensive',
    'exuberant',
    'fair',
    'faithful',
    'famous',
    'fancy',
    'fantastic',
    'fierce',
    'filthy',
    'fine',
    'foolish',
    'fragile',
    'frail',
    'frantic',
    'friendly',
    'frightened',
    'funny',
    'gentle',
    'gifted',
    'glamorous',
    'gleaming',
    'glorious',
    'good',
    'gorgeous',
    'graceful',
    'grieving',
    'grotesque',
    'grumpy',
    'handsome',
    'happy',
    'healthy',
    'helpful',
    'helpless',
    'hilarious',
    'homeless',
    'homely',
    'horrible',
    'hungry',
    'hurt',
    'ill',
    'important',
    'impossible',
    'inexpensive',
    'innocent',
    'inquisitive',
    'itchy',
    'jealous',
    'jittery',
    'jolly',
    'joyous',
    'kind',
    'lazy',
    'light',
    'lively',
    'lonely',
    'long',
    'lovely',
    'lucky',
    'magnificent',
    'misty',
    'modern',
    'motionless',
    'muddy',
    'mushy',
    'mysterious',
    'nasty',
    'naughty',
    'nervous',
    'nice',
    'nutty',
    'obedient',
    'obnoxious',
    'odd',
    'old-fashioned',
    'open',
    'outrageous',
    'outstanding',
    'panicky',
    'perfect',
    'plain',
    'pleasant',
    'poised',
    'poor',
    'powerful',
    'precious',
    'prickly',
    'proud',
    'putrid',
    'puzzled',
    'quaint',
    'real',
    'relieved',
    'repulsive',
    'rich',
    'scary',
    'selfish',
    'shiny',
    'shy',
    'silly',
    'sleepy',
    'smiling',
    'smoggy',
    'sore',
    'sparkling',
    'splendid',
    'spotless',
    'stormy',
    'strange',
    'stupid',
    'successful',
    'super',
    'talented',
    'tame',
    'tasty',
    'tender',
    'tense',
    'terrible',
    'thankful',
    'thoughtful',
    'thoughtless',
    'tired',
    'tough',
    'troubled',
    'ugliest',
    'ugly',
    'uninterested',
    'unsightly',
    'unusual',
    'upset',
    'uptight',
    'vast',
    'victorious',
    'vivacious',
    'wandering',
    'weary',
    'wicked',
    'wide-eyed',
    'wild',
    'witty',
    'worried',
    'worrisome',
    'wrong',
    'zany',
    'zealous',
  ];
  const listSize = adjList.length;
  const arrayLoc = Math.floor(Math.random() * listSize);

  const chosenAdj = adjList[arrayLoc];

  return chosenAdj;
};

const getCurrentDate = () => {
  const date = new Date();
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();

  const today = yyyy + '-' + mm + '-' + dd;

  return today;
};

const runQuery = async (item, data) => {
  const items = {
    adjective: {
      query:
        'SELECT random_adjective AS item FROM userinfo WHERE user_name = (?)',
      response: (value) => 
        ComfyJS.Say(`TEST: Adjective for user @${data[0]} is '${value}'`), // Not sure why these ComfyJS.Say commands are throwing errors?
    },
    addUser: {
      query:
        'INSERT INTO userinfo (user_name,first_seen,last_seen,random_adjective) VALUES (?,?,?,?)',
      response: () => true,
    },
    lastSeen: {
      query: 'UPDATE userinfo SET last_seen = ? WHERE user_name = ?',
      response: () => true,
    },
    getLastSeen: {
      query: 'SELECT last_seen FROM userinfo WHERE user_name = ?';
      response: (value) => console.log(`SQL LOG: User '${data[0]}' last seen = ${value}`),
    },
    getTokens: {
      query: 'SELECT casino_tokens AS item FROM userinfo WHERE user_name = (?)',
      response: (value) => ComfyJS.Say(`TEST: Casino Tokens: ${value}`),
    },
    updateTokens: {
      query: 'UPDATE userinfo SET casino_tokens = ? WHERE user_name = ?',
      response: () => true,
    },
    userInfo: {
      query: 'SELECT * FROM userinfo WHERE user_name = (?)',
      response: () => true,
    },
    getChats: {
      query: 'SELECT msgs_sent FROM userinfo WHERE user_name = ?',
      response: (value) => console.log(`SQL LOG: Message count for user '${data[0]}' is ${value}.`),
    },
    updateChats: {
      query: 'UPDATE userinfo SET msgs_sent = ? WHERE user_name = ?',
      response: () => true,
    }
  };
  const query = items?.[item]?.query;

  try {
    const [rows] = await sql.query(query, data);
    if (!rows || !rows.lengh) {
      console.log(`FUNC runQuery RESPONSE: Returned False`, query);
      return false;
    }
    const value = rows[0].item;
    console.log(
      `SQL DEBUG: runQuery(${item}, ${JSON.stringify(data)}) ${value}`
    );
    items?.[item]?.response(value);
    return value;
  } catch (e) {
    console.error(`FUNC runQuery ERROR`, query, e.message);
    return false;
  }
};

const databaseCheckExists = async (username) => {
  const userInfo = await runQuery('userInfo', username);
  if (!userInfo) {
    console.log(
      `FUNC databaseCheckExists RESPONSE: Returned False for user ${username}`
    );
    return false;
  }
  console.log(
    `FUNC databaseCheckExists RESPONSE: Returned True for user ${username}`
  );
  return true;
};

const databaseAddUser = async (username) => {
  if (await databaseCheckExists(username)) {
    return false;
  }
  const todaysDate = getCurrentDate();
  return await runQuery('addUser', [
    username,
    todaysDate,
    todaysDate,
    generateRandomAdjective(),
  ]);
};

const databaseGetAdjective = async (username) =>
  await runQuery('adjective', username);

const databaseGetTokens = async (username) =>
  await runQuery('getTokens', username);

const databaseUpdateLastSeen = async (username) =>
  await runQuery('lastSeen', [getCurrentDate(), username]);

const databaseGetLastSeen = async (username) =>
  await runQuery('getLastSeen', username);

const databaseGetChatCount = async (username) =>
  await runQuery('getChats', username);

const databaseUpdateChatCount = async (username) => {
  const startCount = await runQuery('getChats', username);
  let newCount = startCount + 1;

  return await runQuery('updateChats', [newCount, username]);
}

const disconnectSQL = async () => {
  try {
    await sql.end();
    console.log('Close the database connection.');
  } catch (e) {
    return console.error(e.message);
  }
};

module.exports.connect = getConnection;
module.exports.disconnect = disconnectSQL;
module.exports.genAdj = generateRandomAdjective;
module.exports.getDate = getCurrentDate;
module.exports.addUser = databaseAddUser;
module.exports.doesExist = databaseCheckExists;
module.exports.updateLastSeen = databaseUpdateLastSeen;
module.exports.getLastSeen = databaseGetLastSeen
module.exports.getAdj = databaseGetAdjective;
module.exports.getTokens = databaseGetTokens;
module.exports.getChats = databaseGetChatCount;
module.exports.updateChats = databaseUpdateChatCount;