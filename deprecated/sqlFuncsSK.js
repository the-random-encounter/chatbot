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
const promSql = require('mysql2')
const ComfyJS = require('comfy.js');

// Connect to SQL Server
const execDB = promSql.createConnection({
	host: process.env.SQL_HOSTNAME,
	user: process.env.SQL_USERNAME,
	password: process.env.SQL_PASSWORD,
	database: process.env.SQL_DATABASE,
});

function connectSQL() {
	execDB.connect(function (err) {
		if (err) {
			return console.error('error: ' + err.message);
		}

		console.log('Connected to MySQL server.');
	});
}

function disconnect() {
	return promSql.end();
}

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

const execQuery = async (functionName, queryData) => {
	const functions = {
		getAdjective: {
			query: 'SELECT random_adjective AS item FROM userinfo WHERE user_name = (?)',
			response: (value) => { return value; },
			field: 'random_adjective'
		},
		addUser: {
			query: 'INSERT INTO userinfo (user_name,first_seen,last_seen,is_broadcaster,is_moderator,is_founder,is_vip,is_subscriber,random_adjective) VALUES (?,?,?,?,?,?,?,?,?)',
			response: () => true,
		},
		checkForUser: {
			query: 'SELECT * FROM userinfo WHERE user_name = ?',
			response: () => true,
		},
		updateLastSeen: {
			query: 'UPDATE userinfo SET last_seen = ? WHERE user_name = ?',
			response: () => true,
			field: 'last_seen'
		},
		getLastSeen: {
			query: 'SELECT last_seen FROM userinfo WHERE user_name = ?',
			response: () => true,
			field: 'last_seen'
		},
		getTokens: {
			query: 'SELECT casino_tokens FROM userinfo WHERE user_name = ?',
			response: (value) => { return value; },
			field: 'casino_tokens'
		},
		updateTokens: {
			query: 'UPDATE userinfo SET casino_tokens = ? WHERE user_name = ?',
			response: () => true,
			field: 'casino_tokens'
		},
		getUserFlags: {
			query: 'SELECT is_broadcaster,is_moderator,is_founder,is_vip,is_subscriber FROM userinfo WHERE user_name = ?',
			response: (value) => { return value; },
			field: [
				'is_broadcaster',
				'is_moderator',
				'is_founder',
				'is_vip',
				'is_subscriber'
			]
		},
		getMsgCount: {
			query: 'SELECT msgs_sent FROM userinfo WHERE user_name = ?',
			response: (value) => { return value; },
			field: 'msgs_sent'
		},
		updateMsgCount: {
			query: 'UPDATE userinfo SET msgs_sent = ? WHERE user_name = ?',
			response: () => true,
			field: 'msgs_sent'
		},
		addCmd: {
			query: 'INSERT INTO commands (command,syntax,creator,create_date,modlvl) VALUES (?,?,?,?,?)',
			response: () => true,
			field: [
				'command',
				'syntax',
				'creator',
				'create_date',
				'modlvl'
			]
		},
		getCmd: {
			query: 'SELECT (syntax,times_used) FROM commands WHERE command = ?',
			response: (value) => { return value; },
			field: [
				'syntax',
				'times_used'
			]
		},
		getCmdUsage: {
			query: 'SELECT times_used FROM commands WHERE command = ?',
			response: (value) => { return value; },
			field: 'times_used'
		},
		updateCmdUsage: {
			query: 'UPDATE commands SET times_used = ? WHERE command = ?',
			response: () => true,
			field: 'times_used'
		},
		removeCmd: {
			query: 'DELETE FROM commands WHERE cmd = ?',
			response: () => true,
		},
		getCmdModLvl: {
			query: 'SELECT modlvl FROM commands WHERE cmd = ?',
			response: (value) => { return value; },
			field: 'modlvl'
		},
		getStreamCount: {
			query: 'SELECT streams_attended FROM userinfo WHERE user_name = ?',
			response: (value) => { return value; },
			field: 'streams_attended'
		},
		updateStreamCount: {
			query: 'UPDATE userinfo SET streams_attended = ? WHERE user_name = ?',
			response: () => true,
			field: 'streams_attended'
		},
	};

	const querySQL = functions?.[functionName]?.query;
	const queryField = functions?.[functionName]?.field;

	try {
		
		console.log(`SK  LOG`, { querySQL, queryData, queryReturn: execDB.execute(querySQL, queryData) });
		const queryReturn = execDB.execute(querySQL, queryData);
	  /*queryReturn
		  .on('error', function (err) {
			  return console.error(err);
  		}) 
	  	.on('results', function (row) {
				return row[0].queryField;
			})*/

		if (!queryReturn || !queryReturn.length) {
			console.log(` SQL LOG: execQuery returned FALSE for ${querySQL}`);
			return false;
		}

		const value = queryReturn[0].functionName;

		console.log(`DEBUG LOG: execQuery(${functionName}, ${JSON.stringify(queryData)}) ${value}`);

		functions?.[functionName]?.response(value);
		return value;
	} catch (e) {
		console.error(e);
		console.error(`ERROR LOG: execQuery THREW ERROR '${e.message}' (SQL Query: ${querySQL})`);
		return false;
	}
};

const dbCheckForUser = async (username) => {
	
	const queryResponse = await execQuery('checkForUser', username)?.response;

	if (!queryResponse) {
		console.log(` SQL LOG: Query 'checkForUser' returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query 'checkForUser' returned TRUE for data payload '${username}'.`);
    console.log(` SQL LOG: Query '`)
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

	const [existsResponse] = await execQuery('checkForUser', userDataObj.username)?.response;
	
	if (!existsResponse) {
		const [queryResponse] = await execQuery('addUser', insertData)?.value;
		
		if (!queryResponse) {
		  console.log(` SQL LOG: Query 'addUser' returned FALSE for data payload '${insertData[0]}'.`);
		  return false;
	  } else if (queryResponse) {
		  console.log(` SQL LOG: Query 'addUser' returned TRUE for data payload '${insertData[0]}'.`);
		  console.log(` SQL LOG: Query 'addUser' valued returned '${queryValue}'.`);
		  return true;
	  }
	}	
};

const dbGetAdjective = async (username) => {
	
	const queryResponse = await execQuery('getAdjective', username)?.value;

	if (!queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.functions.getAdjective.query}' returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.functions.getAdjective.query}' returned TRUE for data payload '${username}'.`);
		return true;
	}
};

const dbUpdateLastSeen = async (username) => {

	const todaysDate = getCurrentDate();
	const insertData = [
		todaysDate,
		username
	];
	const queryResponse = await execQuery('updateLastSeen', insertData)?.response;

	if (!queryResponse) {
		console.log(` SQL LOG: Query 'updateLastSeen' returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query 'updateLastSeen' returned TRUE for data payload '${username}'.`);
		return true;
	}
};

const dbGetLastSeen = async (username) => {

	const queryResponse = await execQuery('getLastSeen', username)?.value;

	if (!queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.functions.getLastSeen.query}' returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.functions.getLastSeen.query}' returned TRUE for data payload '${username}'.`);
		return true;
	}
};

const dbGetTokens = async (username) => {

	const queryResponse = await execQuery('getTokens', username)?.value;

	if (!queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.functions.getTokens.query}' returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.functions.getTokens.query}' returned TRUE for data payload '${username}'.`);
		return true;
	}
};

const dbUpdateTokens = async (username, betResult) => {

	const queryResponse = await execQuery('getTokens', username)?.value;

	if (!queryResponse) {
		console.log(` SQL LOG: Query '${await execQuery('getTokens').query} returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.functions.getTokens.query} returned TRUE for data payload '${username}'.`);

		const newAmt = queryResponse + betResult;
		const insertData = [
			newAmt,
			username
		];

		const updateResponse = await execQuery('updateTokens', insertData)?.value;

		if (!updateResponse) {
			console.log(` SQL LOG: Query '${execQuery.functions.updateTokens.query} returned FALSE for data payload '${insertData[1]}'.`);
			return false;
		} else if (updateResponse) {
			console.log(` SQL LOG: Query '${execQuery.functions.updateTokens.query} returned TRUE for data payload '${insertData[1]}'.`);
			return true;
		}
	}
};

const dbGetUserFlags = async (username) => {

	const queryResponse = await execQuery('getUserFlags', username)?.value;

	if (!queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.functions.getUserFlags.query}' returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.functions.getUserFlags.query}' returned TRUE for data payload '${username}'.`);
		return true;
	}
};

const dbGetMsgCount = async (username) => {
	
	const queryResponse = await execQuery('getMsgCount', username)?.response;

	if (!queryResponse) {
		console.log(` SQL LOG: Query 'getMsgCount' returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query 'getMsgCount' returned TRUE for data payload '${username}'.`);
		return queryResponse[0].msgs_sent;
	}
};

const dbUpdateMsgCount = (username) => {

	let oldMsgCount = dbGetMsgCount(username);
	const newCount = oldMsgCount + 1;
	const insertData = [
		newCount,
		username
	];
	const queryResponse = execQuery('updateMsgCount', insertData)?.response;

	if (!queryResponse) {
		console.log(` SQL LOG: Query 'updateMsgCount' returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query 'updateMsgCount' returned TRUE for data payload '${username}'.`);
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

	const queryResponse = await execQuery('addCmd', insertData)?.value;

	if (!queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.functions.addCmd.query}' returned FALSE for data payload '${insertData[0]}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.functions.addCmd.query}' returned TRUE for data payload '${insertData[0]}'.`);
		return true;
	}
};

const dbGetCmd = async (cmd) => {

	const [queryResponse, cmdUseCount] = await execQuery('getCmd', cmd)?.value;

	if (!queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.functions.getCmd.query}' returned FALSE for data payload '${cmd}'.`);
		return false;
	} else if (queryResponse) {

		ComfyJS.Say(`${queryResponse}`);
		console.log(` SQL LOG: Query '${execQuery.functions.getCmd.query}' returned TRUE for data payload '${cmd}'.`);

		//const usageResponse = (await execQuery('getCmdUsage', cmd))?.value;

		/* if (!usageResponse) {
			console.log(` SQL LOG: Query '${execQuery.functions.getCmdUsage}' returned FALSE for data payload '${cmd}'.`);
			return false;
		} else if (usageResponse) {
			console.log(` SQL LOG: Query '${execQuery.functions.getCmdUsage}' returned TRUE for data payload '${cmd}'.`);
		*/
			const newUsage = cmdUseCount + 1;
			const insertData = [
				newUsage,
				cmd
			];

			const updateResponse = await execQuery('updateCmdUsage', insertData)?.value;

			if (!updateResponse) {
				console.log(` SQL LOG: Query '${execQuery.functions.updateCmdUsage.query}' returned FALSE for data payload '${insertData[1]}'.`);
				return false;
			} else if (updateResponse) {
				console.log(` SQL LOG: Query '${execQuery.functions.updateCmdUsage.query}' returned TRUE for data payload '${insertData[1]}'.`);
				return true;
			}
	}
};

const dbRemoveCmd = async (cmd, username, userModLvl) => {

	const modLvlResponse = await execQuery('getCmdModLvl', cmd)?.value;
	if (!modLvlResponse) {
		console.log(` SQL LOG: Query '${execQuery.functions.getCmdModLvl.query}' returned FALSE for data payload '${cmd}'.`);
		return false;
	} else if (modLvlResponse) {
		console.log(` SQL LOG: Query '${execQuery.functions.getCmdModLvl.query}' returned TRUE for data payload '${cmd}'.`);
		
		if (modLvlResponse > userModLvl) {
			ComfyJS.Say(`Sorry, @${username}, but you are not allowed to delete this command due to having a lower user privilege level than its creator (${userModLvl} versus ${modLvlResponse}).`);
			console.log(` SQL LOG: User '${username} attempted to remove custom command '${cmd}' but failed due to a lower privilege level (${userModLvl} versus ${modLvlResponse}).`);
			return false;
		} else {

			const queryResponse = await execQuery('removeCmd', cmd)?.value;

			if (!queryResponse) {
				ComfyJS.Say(`Sorry, @${username}, but I encountered an unknown error while removing the command. Feel free to try again.`);
				console.log(` SQL LOG: Query '${execQuery.functions.removeCmd.query}' returned FALSE for data payload '${cmd}'.`);
				return false;
			} else if (queryResponse) {
				ComfyJS.Say(`Custom command '${cmd}' successfully deleted, @${username}. Honor its memory.`);
				console.log(` SQL LOG: Query '${execQuery.functions.removeCmd.query}' returned TRUE for data payload '${cmd}'.`);
				return true;
			}
		}
	}
};

module.exports.connect = connectSQL;
module.exports.disconnect = disconnect;
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
