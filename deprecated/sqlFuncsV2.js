require('dotenv').config();
const asyncSQL = require('mysql2-async').default;
const ComfyJS = require('comfy.js');

const execDB = new asyncSQL({
	host: process.env.SQL_HOSTNAME,
	user: process.env.SQL_USERNAME,
	password: process.env.SQL_PASSWORD,
	database: process.env.SQL_DATABASE
});
async function main(sqlFunction, sqlData) {
  // get the client
	//const mysql = require('mysql2/promise');
  // query database
  
	/*const connection = mysql.createConnection({
	host: process.env.SQL_HOSTNAME,
	user: process.env.SQL_USERNAME,
	password: process.env.SQL_PASSWORD,
	database: process.env.SQL_DATABASE,
});*/
	//console.log(await connection.execute('SELECT * FROM userinfo'));
	//const [rows, fields] = await connection.execute('SELECT msgs_sent FROM userinfo WHERE user_name = ?', ['the_random_encounter']);
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

	const querySQL = functions?.[sqlFunction]?.query;
	console.log(`const querySQL = functions?.[sqlFunction]?.query; ${querySQL} = ${functions?.[sqlFunction]?.query}`);

	const [rows] = await connection.execute(querySQL, sqlData);
	console.log(`const [rows] = await connectDB.execute(querySQL, sqlData);`);
	console.log(`console.dir(rows);`);
	console.dir(rows);
	
	let resObj = rows[0];
	console.log(`let resObj = rows[0]; ${resObj} = ${rows[0]}`);
	let key = Object.keys(resObj)[0];
	console.log(`let key = Object.keys(resObj)[0]; ${key} = ${Object.keys(resObj)[0]}`);
	let resValue = resObj[key];
	console.log(`let resValue = resObj[key]; ${resValue} = ${resObj[key]}`);

	const returnValue = resValue;

	functions?.[sqlFunction]?.response(resValue);
	console.log(`functions?.[sqlFunction]?.response(resValue);`);


	//console.dir(rows);
	//console.dir(rows[0]);


	//console.dir(fields);

	
	
}

const dbCheckForUser = async (username) => {
	
	const returnVal = execDB.
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

	const [existsResponse] = execQuery('checkForUser', [userDataObj.username])?.response;
	
	if (!existsResponse) {
		const [queryResponse] = execQuery('addUser', insertData)?.value;
		
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
	
	const queryResponse = execQuery('getAdjective', [username])?.value;

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
	const queryResponse = execQuery('updateLastSeen', insertData)?.response;

	if (!queryResponse) {
		console.log(` SQL LOG: Query 'updateLastSeen' returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query 'updateLastSeen' returned TRUE for data payload '${username}'.`);
		return true;
	}
};

const dbGetLastSeen = async (username) => {

	const queryResponse = execQuery('getLastSeen', [username])?.value;

	if (!queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.functions.getLastSeen.query}' returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.functions.getLastSeen.query}' returned TRUE for data payload '${username}'.`);
		return true;
	}
};

const dbGetTokens = async (username) => {

	const queryResponse = execQuery('getTokens', [username])?.value;

	if (!queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.functions.getTokens.query}' returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.functions.getTokens.query}' returned TRUE for data payload '${username}'.`);
		return true;
	}
};

const dbUpdateTokens = async (username, betResult) => {

	const queryResponse = execQuery('getTokens', [username])?.value;

	if (!queryResponse) {
		console.log(` SQL LOG: Query '${execQuery('getTokens').query} returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.functions.getTokens.query} returned TRUE for data payload '${username}'.`);

		const newAmt = queryResponse + betResult;
		const insertData = [
			newAmt,
			username
		];

		const updateResponse = execQuery('updateTokens', insertData)?.value;

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

	const queryResponse = execQuery('getUserFlags', [username])?.value;

	if (!queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.functions.getUserFlags.query}' returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.functions.getUserFlags.query}' returned TRUE for data payload '${username}'.`);
		return true;
	}
};

const dbGetMsgCount = async (username) => {
	
	const queryResponse = execQuery('getMsgCount', [username])?.response;

	if (!queryResponse) {
		console.log(` SQL LOG: Query 'getMsgCount' returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query 'getMsgCount' returned TRUE for data payload '${username}'.`);
		return queryResponse[0].msgs_sent;
	}
};

const dbUpdateMsgCount = (username) => {

	let oldMsgCount = dbGetMsgCount(username)?.value;
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

	const queryResponse = execQuery('addCmd', insertData)?.value;

	if (!queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.functions.addCmd.query}' returned FALSE for data payload '${insertData[0]}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.functions.addCmd.query}' returned TRUE for data payload '${insertData[0]}'.`);
		return true;
	}
};

const dbGetCmd = async (cmd) => {

	const [queryResponse, cmdUseCount] = execQuery('getCmd', [cmd])?.value;

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

			const updateResponse = execQuery('updateCmdUsage', insertData)?.value;

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

	const modLvlResponse = execQuery('getCmdModLvl', [cmd])?.value;
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

			const queryResponse = execQuery('removeCmd', [cmd])?.value;

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

main('getMsgCount', ['the_random_encounter']);