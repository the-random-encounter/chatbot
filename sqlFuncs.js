// RANDOM ENCOUNTER TWITCH CHAT BOT
// SQL FUNCTIONS MODULE
// Database: userinfodb
// Tables: userinfo, commands
// v0.3.1 - 05/13/2022
// by The Random Encounter
// Refactor by Spinboi
// https://github.com/the-random-encounter/randomencounterbot.git
// https://www.twitch.tv/the_random_encounter
// https://www.facebook.com/random.encounter.dj
// E-Mail: talent@random-encounter.net
// Secondary: contact@random-encounter.net



// CONST library requirement declarations
const asyncSQL = require('mysql2-async').default;
const ComfyJS = require('comfy.js');

// Create async SQL database object
const execDB = new asyncSQL({
	host: process.env.SQL_HOSTNAME,
	user: process.env.SQL_USERNAME,
	password: process.env.SQL_PASSWORD,
	database: process.env.SQL_DATABASE,
	skiptzfix: true
});

//
// Basic data functions
//


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

//
// Primary SQL query function
//

const execQuery = async (functionName, queryData) => {
	const functions = {
		getAdjective: {
			query: 'SELECT random_adjective AS item FROM userinfo WHERE user_name = (?)',
			response: (value) => { return value; },
			type: 'get'
		},
		addUser: {
			query: 'INSERT INTO userinfo (user_name,first_seen,last_seen,is_broadcaster,is_moderator,is_founder,is_vip,is_subscriber,random_adjective) VALUES (?,?,?,?,?,?,?,?,?)',
			response: () => true,
			type: 'set'
		},
		checkForUser: {
			query: 'SELECT * FROM userinfo WHERE user_name = ?',
			response: () => true,
			type: 'get'
		},
		updateLastSeen: {
			query: 'UPDATE userinfo SET last_seen = ? WHERE user_name = ?',
			response: () => true,
			type: 'set'
		},
		getLastSeen: {
			query: 'SELECT last_seen FROM userinfo WHERE user_name = ?',
			response: () => true,
			type: 'get'
		},
		getTokens: {
			query: 'SELECT casino_tokens FROM userinfo WHERE user_name = ?',
			response: (value) => { return value; },
			type: 'get'
		},
		updateTokens: {
			query: 'UPDATE userinfo SET casino_tokens = ? WHERE user_name = ?',
			response: () => true,
			type: 'set'
		},
		getUserFlags: {
			query: 'SELECT is_broadcaster,is_moderator,is_founder,is_vip,is_subscriber FROM userinfo WHERE user_name = ?',
			response: (value) => { return value; },
			type: 'get'
		},
		getMsgCount: {
			query: 'SELECT msgs_sent FROM userinfo WHERE user_name = ?',
			response: (value) => { return value; },
			type: 'get'
		},
		updateMsgCount: {
			query: 'UPDATE userinfo SET msgs_sent = ? WHERE user_name = ?',
			response: () => true,
			type: 'set'
		},
		addCmd: {
			query: 'INSERT INTO commands (command,syntax,creator,create_date,modlvl) VALUES (?,?,?,?,?)',
			response: () => true,
			type: 'set'
		},
		getCmd: {
			query: 'SELECT syntax FROM commands WHERE command = ?',
			response: (value) => { return value; },
			type: 'get'
		},
		getCmdUsage: {
			query: 'SELECT times_used FROM commands WHERE command = ?',
			response: (value) => { return value; },
			type: 'get'
		},
		updateCmdUsage: {
			query: 'UPDATE commands SET times_used = ? WHERE command = ?',
			response: () => true,
			type: 'set'
		},
		removeCmd: {
			query: 'DELETE FROM commands WHERE cmd = ?',
			response: () => true,
			type: 'set'
		},
		getCmdModLvl: {
			query: 'SELECT modlvl FROM commands WHERE cmd = ?',
			response: (value) => { return value; },
			type: 'get'
		},
		getStreamCount: {
			query: 'SELECT streams_attended FROM userinfo WHERE user_name = ?',
			response: (value) => { return value; },
			type: 'get'
		},
		updateStreamCount: {
			query: 'UPDATE userinfo SET streams_attended = ? WHERE user_name = ?',
			response: () => true,
			type: 'set'
		},
	};
	
	const querySQL = functions?.[functionName]?.query;

	try {
		

		const result = await execDB.query(querySQL, queryData);

		if (functions?.[functionName]?.type == 'get') {
			
			const resObj = result[0];
			const key = Object.keys(resObj)[0];
			const value = resObj[key];
			
			if (!result || !result.length) {
				console.log(` SQL LOG: execQuery returned FALSE for ${querySQL}`);
				return false;
			}

			return functions?.[functionName]?.response(value);

		} else if (functions?.[functionName]?.type == 'set') {
			if (result.affectedRows > 0) {
				return functions?.[functionName]?.response;
			}
			else {
				console.log(` SQL LOG: Result Header Info: ${result.info}`);
				return false;
			}
		} else {
			console.error(` SQL LOG: Returned unknown functionName type property error`);
			return false;
		}
	} catch (e) {
		console.error(` SQL LOG: Error catch for query '${querySQL}' - Error: ${e.message}`);
		return false;
	}
};


//
// SQL database logic functions
//

const dbCheckForUser = async (username) => {
	
	const queryResponse = await execQuery('checkForUser', [username]);

	if (!queryResponse) {
		console.log(` SQL LOG: Query 'checkForUser' returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query 'checkForUser' returned TRUE for data payload '${username}'.`);
		return true;
	}
};

const dbAddUser = async (userDataObj) => {
	
	const todaysDate = getCurrentDate();
	const randomAdjective = generateRandomAdjective();
	const insertData = [
		userDataObj.username,
		//userDataObj.twitchID,
		todaysDate,
		todaysDate,
		userDataObj.broadcaster,
		userDataObj.moderator,
		userDataObj.founder,
		userDataObj.vip,
		userDataObj.subscriber,
		randomAdjective,
	];

	const existsResponse = await execQuery('checkForUser', [userDataObj.username]);
	
	if (!existsResponse) {
		
		const queryResponse = await execQuery('addUser', insertData);
		
		if (!queryResponse) {
		  console.log(` SQL LOG: Query 'addUser' returned FALSE for data payload '${insertData[0]}'.`);
		  return false;
	  } else if (queryResponse) {
		  console.log(` SQL LOG: Query 'addUser' returned TRUE for data payload '${insertData[0]}'.`);
		  return true;
	  }
	}	
};

const dbGetAdjective = async (username) => {
	
	const queryResponse = await execQuery('getAdjective', [username]);

	if (!queryResponse) {
		console.log(` SQL LOG: Query 'getAdjective' returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query 'getAdjective' returned TRUE for data payload '${username}'.`);
		return queryResponse;
	}
};

const dbUpdateLastSeen = async (username) => {

	const todaysDate = getCurrentDate();
	const insertData = [
		todaysDate,
		username
	];
	const queryResponse = await execQuery('updateLastSeen', insertData);

	if (!queryResponse) {
		console.log(` SQL LOG: Query 'updateLastSeen' returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query 'updateLastSeen' returned TRUE for data payload '${username}'.`);
		return true;
	}
};

const dbGetLastSeen = async (username) => {

	const queryResponse = await execQuery('getLastSeen', [username]);

	if (!queryResponse) {
		console.log(` SQL LOG: Query 'getLastSeen' returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query 'getLastSeen' returned TRUE for data payload '${username}'.`);
		return queryResponse;
	}
};

const dbGetTokens = async (username) => {

	const queryResponse = await execQuery('getTokens', [username]);

	if (!queryResponse) {
		console.log(` SQL LOG: Query 'getTokens' returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query 'getTokens' returned TRUE for data payload '${username}'.`);
		return queryResponse;
	}
};

const dbUpdateTokens = async (username, betResult) => {

	const queryResponse = await execQuery('getTokens', [username]);

	if (!queryResponse) {
		return false;
	} else if (queryResponse) {

		const newAmt = queryResponse + betResult;
		const insertData = [
			newAmt,
			username
		];

		const updateResponse = await execQuery('updateTokens', insertData);
		if (!updateResponse) {
			console.log(` SQL LOG: Query 'updateTokens' returned FALSE for data payload '${insertData[1]}'.`);
			return false;
		} else if (updateResponse) {
			console.log(` SQL LOG: Query 'updateTokens' returned TRUE for data payload '${insertData[1]}'.`);
			return updateResponse;
		}
	}
};

const dbGetUserFlags = async (username) => {

	const queryResponse = await execQuery('getUserFlags', [username]);

	if (!queryResponse) {
		console.log(` SQL LOG: Query 'getUserFlags' returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query 'getUserFlags' returned TRUE for data payload '${username}'.`);
		return true;
	}
};

const dbGetMsgCount = async (username) => {
	
	const queryResponse = await execQuery('getMsgCount', [username]);

	if (!queryResponse) {
		console.log(` SQL LOG: Query 'getMsgCount' returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query 'getMsgCount' returned TRUE for data payload '${username}'.`);
		return queryResponse;
	}
};

const dbUpdateMsgCount = async (username) => {

	let oldMsgCount = await dbGetMsgCount(username);
	const newCount = oldMsgCount + 1;
	const insertData = [
		newCount,
		username
	];
	
	const queryResponse = await execQuery('updateMsgCount', insertData);

	if (!queryResponse) {
		console.log(` SQL LOG: Query 'updateMsgCount' returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query 'updateMsgCount' returned TRUE for data payload '${username}'.`);
		return queryResponse;
	}
};

const dbAddCmd = async (cmdDataObj) => {

	const todaysDate = getCurrentDate();
	const insertData = [
		cmdDataObj.command,
		cmdDataObj.syntax,
		cmdDataObj.creator,
		todaysDate,
		cmdDataObj.modLvl
	]

	const queryResponse = await execQuery('addCmd', insertData);

	if (!queryResponse) {
		console.log(` SQL LOG: Query 'addCmd' returned FALSE for data payload '${insertData[0]}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query 'addCmd' returned TRUE for data payload '${insertData[0]}'.`);
		return true;
	}
};

const dbGetCmd = async (cmd) => {

	const queryResponse = await execQuery('getCmd', [cmd]);

	if (!queryResponse) {
		console.log(` SQL LOG: Query 'getCmd' returned FALSE for data payload '${cmd}'.`);
		return false;
	} else if (queryResponse) {

		ComfyJS.Say(`${queryResponse}`);
		console.log(` SQL LOG: Query 'getCmd' returned TRUE for data payload '${cmd}'.`);

		const cmdUseCount = await execQuery('getCmdUsage', [cmd]);
		const newUsage = cmdUseCount + 1;
		const insertData = [
			newUsage,
			cmd
		];

		const updateResponse = await execQuery('updateCmdUsage', insertData);

			if (!updateResponse) {
				console.log(` SQL LOG: Query 'updateCmdUsage' returned FALSE for data payload '${insertData[1]}'.`);
				return false;
			} else if (updateResponse) {
				console.log(` SQL LOG: Query 'updateCmdUsage' returned TRUE for data payload '${insertData[1]}'.`);
				return true;
			}
	}
};

const dbRemoveCmd = async (cmd, username, userModLvl) => {

	const modLvlResponse = await execQuery('getCmdModLvl', [cmd]);
	if (!modLvlResponse) {
		console.log(` SQL LOG: Query 'getCmdModLvl' returned FALSE for data payload '${cmd}'.`);
		return false;
	} else if (modLvlResponse) {
		console.log(` SQL LOG: Query 'getCmdModLvl' returned TRUE for data payload '${cmd}'.`);
		
		if (modLvlResponse > userModLvl) {
			ComfyJS.Say(`Sorry, @${username}, but you are not allowed to delete this command due to having a lower user privilege level than its creator (${userModLvl} versus ${modLvlResponse}).`);
			console.log(` SQL LOG: User '${username} attempted to remove custom command '${cmd}' but failed due to a lower privilege level (${userModLvl} versus ${modLvlResponse}).`);
			return false;
		} else {

			const queryResponse = await execQuery('removeCmd', [cmd]);

			if (!queryResponse) {
				ComfyJS.Say(`Sorry, @${username}, but I encountered an unknown error while removing the command. Feel free to try again.`);
				console.log(` SQL LOG: Query 'removeCmd' returned FALSE for data payload '${cmd}'.`);
				return false;
			} else if (queryResponse) {
				ComfyJS.Say(`Custom command '${cmd}' successfully deleted, @${username}. Honor its memory.`);
				console.log(` SQL LOG: Query 'removeCmd' returned TRUE for data payload '${cmd}'.`);
				return true;
			}
		}
	}
};


//
// Module exports
//

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