// RANDOM ENCOUNTER TWITCH CHAT BOT
// SQL FUNCTIONS FILE
// Database: userinfodb
// Tables: userinfo, commands
// v0.2.0 - 05/02/2022
// by The Random Encounter
// https://github.com/the-random-encounter/randomencounterbot.git
// https://www.twitch.tv/the_random_encounter
// https://www.facebook.com/random.encounter.dj
// E-Mail: talent@random-encounter.net
// Secondary: contact@random-encounter.net

// CONST requirement declarations
const mysql = require('mysql2');
const ComfyJS = require('comfy.js');

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

const execQuery = async (functionIndex, queryData) => {
	const functions = {
		getAdjective: {
			query: 'SELECT random_adjective AS item FROM userinfo WHERE user_name = (?)',
			response: (value) => { return value; },
		},
		addUser: {
			query: 'INSERT INTO userinfo (user_name,twitch_id,first_seen,last_seen,is_broadcaster,is_moderator,is_founder,is_vip,_is_subscriber,random_adjective) VALUES (?,?,?,?,?,?,?,?,?,?)',
			response: () => true,
		},
		checkForUser: {
			query: 'SELECT * FROM userinfo WHERE user_name = ?',
			response: () => true,
		},
		updateLastSeen: {
			query: 'UPDATE userinfo SET last_seen = ? WHERE user_name = ?',
			response: () => true,
		},
		getLastSeen: {
			query: 'SELECT last_seen FROM userinfo WHERE user_name = ?',
			response: () => true,
		},
		getTokens: {
			query: 'SELECT casino_tokens FROM userinfo WHERE user_name = ?',
			response: (value) => { return value; },
		},
		updateTokens: {
			query: 'UPDATE userinfo SET casino_tokens = ? WHERE user_name = ?',
			response: () => true,
		},
		getUserFlags: {
			query: 'SELECT is_broadcaster,is_moderator,is_founder,is_vip,is_subscriber FROM userinfo WHERE user_name = ?',
			response: (value) => { return value; },
		},
		getMsgCount: {
			query: 'SELECT msgs_sent FROM userinfo WHERE user_name = ?',
			response: (value) => { return value; },
		},
		updateMsgCount: {
			query: 'UPDATE userinfo SET msgs_sent = ? WHERE user_name = ?',
			response: () => true,
		},
		addCmd: {
			query: 'INSERT INTO commands (command,syntax, creator, create_date, modlvl) VALUES (?,?,?,?,?)',
			response: () => true,
		},
		getCmd: {
			query: 'SELECT syntax FROM commands WHERE command = ?',
			response: (value) => { return value; },
		},
		getCmdUsage: {
			query: 'SELECT times_used FROM commands WHERE command = ?',
			response: (value) => { return value; },
		},
		updateCmdUsage: {
			query: 'UPDATE commands SET timed_used = ? WHERE command = ?',
			response: () => true,
		},
		removeCmd: {
			query: 'DELETE FROM commands WHERE cmd = ?',
			response: () => true,
		},
		getCmdModLvl: {
			query: 'SELECT modlvl FROM commands WHERE cmd = ?',
			response: (value) => { return value; },
		},
		getStreamCount: {
			query: 'SELECT streams_attended FROM userinfo WHERE user_name = ?',
			response: (value) => { return value; },
		},
		updateStreamCount: {
			query: 'UPDATE userinfo SET streams_attended = ? WHERE user_name = ?',
			response: () => true,
		},
	};

	const querySQL = functions?.[functionIndex]?.query;

	try {
		const [queryReturn] = await sql.query(querySQL, queryData);
		console.dir(queryReturn);
		if (!queryReturn || !queryReturn.length) {
			console.log(` SQL LOG: execQuery returned FALSE for ${querySQL}`);
			return false;
		}

		const value = queryReturn[0].functionIndex;

		console.log(
			` DEBUG LOG: execQuery(${functionIndex}, ${JSON.stringify(queryData)}) ${value}`);

		functions?.[functionIndex]?.response(value);
		return value;
	} catch (e) {
		console.error(`ERROR LOG: execQuery THREW ERROR '${e.message}' (SQL Query: ${querySQL})`);
		return false;
	}
};

const dbCheckForUser = async (username) => {
	const queryResponse = (await execQuery('checkForUser', username))?.value;

	if (!queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.checkForUser.query} returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.checkForUser.query} returned TRUE for data payload '${username}'.`);
		return true;
	}
};

const dbAddUser = async (userDataObj) => {
	
	const todaysDate = getCurrentDate();
	const randomAdjective = generateRandomAdjective();
	const insertData = [
		userDataObj.username,
		userDataObj.twitchID,
		todaysDate,
		todaysDate,
		userDataObj.broadcaster,
		userDataObj.moderator,
		userDataObj.founder,
		userDataObj.vip,
		userDataObj.subscriber,
		randomAdjective,
	];

	const queryResponse = (await execQuery('addUser', insertData))?.value;

	if (!queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.addUser.query}' returned FALSE for data payload '${insertData[0]}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.addUser.query}' returned TRUE for data payload '${insertData[0]}'.`);
		return true;
	}
};

const dbGetAdjective = async (username) => {
	
	const queryResponse = (await execQuery('getAdjective', username))?.value;

	if (!queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.getAdjective.query}' returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.getAdjective.query}' returned TRUE for data payload '${username}'.`);
		return true;
	}
};

const dbUpdateLastSeen = async (username) => {

	const queryResponse = (await execQuery('updateLastSeen', username))?.value;

	if (!queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.updateLastSeen.query}' returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.updateLastSeen.query}' returned TRUE for data payload '${username}'.`);
		return true;
	}
};

const dbGetLastSeen = async (username) => {

	const queryResponse = (await execQuery('getLastSeen', username))?.value;

	if (!queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.getLastSeen.query}' returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.getLastSeen.query}' returned TRUE for data payload '${username}'.`);
		return true;
	}
};

const dbGetTokens = async (username) => {

	const queryResponse = (await execQuery('getTokens', username))?.value;

	if (!queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.getTokens.query}' returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.getTokens.query}' returned TRUE for data payload '${username}'.`);
		return true;
	}
};

const dbUpdateTokens = async (username) => {

	const queryResponse = (await execQuery('updateTokens', username))?.value;

	if (!queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.updateTokens.query} returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.updateTokens.query} returned TRUE for data payload '${username}'.`);
		return true;
	}
};

const dbGetUserFlags = async (username) => {

	const queryResponse = (await execQuery('getUserFlags', username))?.value;

	if (!queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.getUserFlags.query}' returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.getUserFlags.query}' returned TRUE for data payload '${username}'.`);
		return true;
	}
};

const dbGetMsgCount = async (username) => {
	
	const queryResponse = (await execQuery('getMsgCount', username))?.value;

	if (!queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.getMsgCount.query}' returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.getMsgCount.query}' returned TRUE for data payload '${username}'.`);
		return true;
	}
};

const dbUpdateMsgCount = async (username) => {

	const queryResponse = (await execQuery('updateMsgCount', username))?.value;

	if (!queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.updateMsgCount.query}' returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.updateMsgCount.query}' returned TRUE for data payload '${username}'.`);
		return true;
	}
};

const dbAddCmd = async (cmdDataObj) => {

	const todaysDate = getCurrentDate();
	const insertData = [
		cmdDataObj.username,
		cmdDataObj.syntax,
		cmdDataObj.creator,
		todaysDate,
		cmdDataObj.modLvl
	]

	const queryResponse = (await execQuery('addCmd', insertData))?.value;

	if (!queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.addCmd.query}' returned FALSE for data payload '${insertData[0]}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.addCmd.query}' returned TRUE for data payload '${insertData[0]}'.`);
		return true;
	}
};

const dbGetCmd = async (cmd) => {

	const queryResponse = (await execQuery('getCmd', cmd))?.value;

	if (!queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.getCmd.query}' returned FALSE for data payload '${cmd}'.`);
		return false;
	} else if (queryResponse) {

		ComfyJS.Say(`${queryResponse}`);
		console.log(` SQL LOG: Query '${execQuery.getCmd.query}' returned TRUE for data payload '${cmd}'.`);

		const usageResponse = (await execQuery('getCmdUsage', cmd))?.value;

		if (!usageResponse) {
			console.log(` SQL LOG: Query '${execQuery.getCmdUsage}' returned FALSE for data payload '${cmd}'.`);
			return false;
		} else if (usageResponse) {
			console.log(` SQL LOG: Query '${execQuery.getCmdUsage}' returned TRUE for data payload '${cmd}'.`);

			const newUsage = usageResponse + 1;
			const insertData = [
				newUsage,
				cmd
			];

			const updateResponse = (await execQuery('updateCmdUsage', insertData))?.value;

			if (!updateResponse) {
				console.log(` SQL LOG: Query '${execQuery.updateCmdUsage.query}' returned FALSE for data payload '${insertData[1]}'.`);
				return false;
			} else if (updateResponse) {
				console.log(` SQL LOG: Query '${execQuery.updateCmdUsage.query}' returned TRUE for data payload '${insertData[1]}'.`);
				return true;
			}
		}
	}
};

const dbRemoveCmd = async (cmdDataObj) => {

	const modLvlResponse = (await execQuery('getCmdModLvl', cmd))?.value;
	if (!modLvlResponse) {
		console.log(` SQL LOG: Query '${execQuery.getCmdModLvl.query}' returned FALSE for data payload '${cmd}'.`);
		return false;
	} else if (modLvlResponse) {
		console.log(` SQL LOG: Query '${execQuery.getCmdModLvl.query}' returned TRUE for data payload '${cmd}'.`);
		
		if (modLvlResponse > cmdDataObj.modLvl) {
			//Chat response
			//Log response
			return false;
		} else {

			const queryResponse = (await execQuery('removeCmd', cmdDataObj.cmd))?.value;

			if (!queryResponse) {
				//Chat response
				console.log(` SQL LOG: Query '${execQuery.removeCmd.query}' returned FALSE for data payload '${cmd}'.`);
				return false;
			} else if (queryResponse) {
				//Chat response
				console.log(` SQL LOG: Query '${execQuery.removeCmd.query}' returned TRUE for data payload '${cmd}'.`);
				return true;
			}
		}
	}
};


module.exports.checkForUser = dbCheckForUser;
module.exports.addUser = dbAddUser;
module.exports.getAdjective = dbGetAdjective;
module.exports.updateLastSeen = dbUpdateLastSeen;
module.exports.getLastSeen = dbGetLastSeen;
module.exports.getTokens = dbGetTokens;
module.exports.updateTokens = dbUpdateTokens;
module.exports.getUserFlags = dbGetUserFlags;
module.exports.getMsgCount = dbGetMsgCount;
module.exports.updateMsgCount = dbUpdateMsgCount;
module.exports.addCmd = dbAddCmd;
module.exports.getCmd = dbGetCmd;
module.exports.removeCmd = dbRemoveCmd;
