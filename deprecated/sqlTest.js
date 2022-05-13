require('dotenv').config();

async function main(sqlFunction, sqlData) {
  // get the client
	const mysql = require('mysql2/promise');
  // query database
  
	const connectDB = mysql.createConnection({
	host: process.env.SQL_HOSTNAME,
	user: process.env.SQL_USERNAME,
	password: process.env.SQL_PASSWORD,
	database: process.env.SQL_DATABASE,
});
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

	const [rows] = await connectDB.execute(querySQL, sqlData);
	
	let resObj = rows[0];
  let key = Object.keys(resObj)[0];
	let resValue = resObj[key];
	console.log(resValue);

	const returnValue = resValue;
	//console.dir(rows);
	//console.dir(rows[0]);


	//console.dir(fields);

	
	
}

main();