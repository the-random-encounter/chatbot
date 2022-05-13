// RANDOM ENCOUNTER TWITCH CHAT BOT
// SQL FUNCTIONS FILE
// Database: userinfodb
// Tables: userinfo, commands
// v0.1.5 - 04/26/2022
// by The Random Encounter
// https://github.com/the-random-encounter/randomencounterbot.git
// https://www.twitch.tv/the_random_encounter
// https://www.facebook.com/random.encounter.dj
// E-Mail: talent@random-encounter.net
// Secondary: contact@random-encounter.net

// MODULE EXPORT DEFINITIONS
module.exports.connect = connectSQL;
module.exports.disconnect = disconnectSQL;
module.exports.genAdj = generateRandomAdjective;
module.exports.getDate = getCurrentDate;
module.exports.addUser = databaseAddUser;
module.exports.checkForUser = databaseCheckExists;
module.exports.updateLastSeen = databaseUpdateLastSeen;
module.exports.getAdjective = databaseGetAdjective;
module.exports.displayTokens = databaseDisplayTokens;
module.exports.updateTokens = databaseUpdateTokens;
module.exports.getTokens = databaseGetTokens;
module.exports.updateUser = databaseUpdateUser;
module.exports.updateMsgCount = databaseIncrementChatCounter;
module.exports.addCmd = databaseAddCommand;
module.exports.getCmd = databaseGetCommand;
module.exports.removeCmd = databaseRemoveCommand;

// CONST requirement declarations
const mysql = require('mysql2');
const ComfyJS = require('comfy.js');
const { mod } = require('tmi.js/lib/commands');
const { toNumber } = require('tmi.js/lib/utils');
const { query } = require('express');

const connectDB = mysql.createConnection({
	host: process.env.SQL_HOSTNAME,
	user: process.env.SQL_USERNAME,
	password: process.env.SQL_PASSWORD,
	database: process.env.SQL_DATABASE,
});

// Connect to SQL Server
function connectSQL() {
	connectDB.connect(function (err) {
		if (err) {
			return console.error('error: ' + err.message);
		}

		console.log('Connected to MySQL server.');
	});
}

// Disconnect from SQL Server
function disconnectSQL() {
	connectDB.end(function (err) {
		if (err) {
			return console.log('error: ' + err.message);
		}

		console.log('Close the database connection.');
	});
}

// Generate a random adjective from array and return
function generateRandomAdjective() {
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
	let listSize = adjList.length;
	let arrayLoc = Math.floor(Math.random() * listSize);

	let chosenAdj = adjList[arrayLoc];

	return chosenAdj;
}

// Create date in YYYY-MM-DD format for storage in SQL database
function getCurrentDate() {
	let today = new Date();
	let dd = String(today.getDate()).padStart(2, '0');
	let mm = String(today.getMonth() + 1).padStart(2, '0');
	let yyyy = today.getFullYear();

	today = yyyy + '-' + mm + '-' + dd;

	return today;
}

// Check database for existing user and create entry if none exists
function databaseAddUser(userDataObj) {
	const insertQuery =
		'INSERT INTO userinfo (user_name,first_seen,last_seen,is_broadcaster,is_moderator,is_founder,is_vip,is_subscriber,random_adjective) VALUES (?,?,?,?,?,?,?,?,?)';
	const checkQuery = 'SELECT * FROM userinfo WHERE user_name = (?)';
	const idQuery = 'SELECT user_id FROM userinfo WHERE user_name = (?)';

	const randomAdjective = generateRandomAdjective();
	const todaysDate = getCurrentDate();
	const username = userDataObj.username;

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
	const checkData = [userDataObj.username];

	connectDB.query(checkQuery, checkData, (err, row) => {
		// Query userinfo table for user's existence
		if (err) {
			return console.error(
				'FUNC databaseAddUser ERROR RESPONSE: ' + err.message
			);
		} else {
			if (row && row.length) {
				// If exists, query table for user's user_id value
				console.log(
					` SQL LOG: User '${username}' already exists. User ID: ${row[0].insertId}`
				);
				return false;
			} else {
				console.log(
					` SQL LOG: User '${username}' does not exist. Attempting to add...`
				);
				connectDB.query(insertQuery, insertData, (err, results) => {
					// If does not exist, create new user entry
					if (err) {
						return console.error(
							'FUNC databaseAddRow ERROR RESPONSE: ' + err.message
						);
					} else {
						console.log(
							`SQL LOG: New user row created. Data= user_id: ${row[0].user_id}, username: ${insertData[0]}, first/last_seen: ${insertData[1]}, is_broadcaster: ${insertData[3]}, is_moderator: ${insertData[4]}, is_vip: ${insertData[5]}, is_founder: ${insertData[6]}, is_subscriber: ${insertData[7]}, random_adjective: ${insertData[8]}.`
						);
						return true;
					}
				});
			}
		}
	});
}

// Check database for existing user only
function databaseCheckExists(username) {
	let checkQuery = 'SELECT * FROM userinfo WHERE user_name = (?)';
	let checkData = [username];

	connectDB.query(checkQuery, checkData, (err, row) => {
		// Query userinfo table for user's existence
		if (err) {
			return console.error('FUNC databaseCheckExists ERROR RESPONSE: ' + err.message);
		} else {
			if (row && row.length) {
				console.log(` SQL LOG: User '${username}' already exists.`);
				return true;
			} else {
				console.log(` SQL LOG: User '${username}' does not exist.`);
				return false;
			}
		}
	});
}

// Get stored adjective for given user
function databaseGetAdjective(username) {
	const adjQuery =
		'SELECT random_adjective FROM userinfo WHERE user_name = (?)';
	const adjData = [username];

	let adjective = '';

	connectDB.query(adjQuery, adjData, (err, results) => {
		// Query userinfo table for user's random adjective
		if (err) {
			return console.error(
				'FUNC databaseGetAdjective ERROR RESPONSE: ' + err.message
			);
		} else {
			adjective = JSON.stringify(results[0].random_adjective);
			console.log(`SQL DEBUG: dbGetAdj>> var adjective = ${adjective}`);
		}

		ComfyJS.Say(
			`@${username},your RANDOM ADJECTIVE is ${adjective}! And you're stuck with it for good!`
		);
		return adjective;
	});
}

// Get and broadcast casino tokens for given user
function databaseDisplayTokens(username) {
	const tokenQuery = 'SELECT casino_tokens FROM userinfo WHERE user_name = (?)';
	const tokenData = [username];

	let returnAmt = 0;

	connectDB.query(tokenQuery, tokenData, (err, results) => {
		// Query userinfo table for user's token count
		if (err) {
			return console.error(
				'FUNC databaseGetTokens ERROR RESPONSE: ' + err.message
			);
		} else {
			returnAmt = JSON.stringify(results[0].casino_tokens);
			ComfyJS.Say(
				`@${username},you currently have ${returnAmt} casino tokens remaining.`
			);
			console.log(
				`Checked casino token amount for user ${username},returned ${returnAmt}`
			);
		}
	});

	return; //returnAmt;
}

// Get casino tokens for given user
function databaseGetTokens(username) {
	const tokenQuery = 'SELECT casino_tokens FROM userinfo WHERE user_name = (?)';
	const tokenData = [username];

	let returnAmt = 0;

	connectDB.query(tokenQuery, tokenData, (err, results, fields) => {
		// Query userinfo table for user's token count
		if (err) {
			return console.error(
				'FUNC databaseGetTokens ERROR RESPONSE: ' + err.message
			);
		} else {
			returnAmt = results[0].casino_tokens;
			console.log(`SQL DEBUG: dbgetTokens>> var returnAmt = ${returnAmt}`);
			ComfyJS.Say(
				`You have ${results[0].casino_tokens} tokens available,${username}.`
			);
			return returnAmt;
		}
		//console.log(`SQL DEBUG: dbGetTokens>> results = ${results} - fields = ${fields}`);
		//console.log(`Checked casino token amount for user ${username},returned ${returnAmt}`);
	});

	//console.log(returnAmt);
	//return returnAmt;
}

// Update casino tokens for given user based on previous amount
function databaseUpdateTokens(username, newTokens) {
	const tokenQuery = 'SELECT casino_tokens FROM userinfo WHERE user_name = (?)';
	const updateQuery =
		'UPDATE userinfo SET casino_tokens = ? WHERE user_name = ?';

	connectDB.query(tokenQuery, username, (err, result) => {
		// Query userinfo table for user's current casino token count
		if (err) {
			return console.error(
				'FUNC databaseUpdateTokens ERROR RESPOSNE ' + err.message
			);
		} else {
			let originalTokens = result[0].casino_tokens;
			let newAmt = originalTokens + newTokens;
			const updateData = [newAmt, username];

			connectDB.query(updateQuery, updateData, (err, results) => {
				// Combine old token amount with loss or payout & update table
				if (err) {
					return console.error(
						'FUNC databaseUpdateTokens ERROR RESPONSE: ' + err.message
					);
				} else {
					console.log(
						`FUNC databaseUpdateTokens UPDATED ${username} TOKENS TO ${results[0].casino_tokens}`
					);
					return;
				}
			});
		}
	});
}

// Update last seen date entry for given user
function databaseUpdateLastSeen(username) {
	const updateQuery = 'UPDATE userinfo SET last_seen = ? WHERE user_name = ?';
	const currDate = getCurrentDate();

	const updateData = [currDate, username];

	connectDB.query(updateQuery, updateData, (error, results, fields) => {
		// Update user's last_seen date with today's date
		if (error) {
			return console.error(
				'FUNC databaseUpdateLastSeen ERROR RESPONSE: ' + error.message
			);
		} else {
			console.log(
				` SQL LOG: User '${username}' has been set to last seen today (${currDate}).`
			);
			return true;
		}
	});
}

// Full user creation/data update routine -- STILL TESTING, NOT IMPLEMENTED
function databaseUpdateUser(username, streamFlag, secondStreamFlag) {
	const newUser =
		'INSERT INTO userinfo (user_name,first_seen,last_seen,random_adjective) VALUES (?,?,?,?)';
	const checkUser = 'SELECT * FROM userinfo WHERE user_name = (?)';
	const updateStreams =
		'UPDATE userinfo SET streams_attended = ? WHERE user_name = ?';
	const updateLastSeen =
		'UPDATE userinfo SET last_seen = ? WHERE user_name = ?';
	const getStreams =
		'SELECT streams_attended FROM userinfo WHERE user_name = ?';
	const getLastSeen = 'SELECT last_seen FROM userinfo WHERE user_name = ?';
	const currDate = getCurrentDate();
	const randomAdjective = generateRandomAdjective();
	const newUserData = [username, todaysDate, todaysDate, randomAdjective];
	let newStreamsCount = 0;

	connectDB.query(checkUser, username, (error, row) => {
		// Query userinfo table for existence of user
		if (error) {
			return console.error(
				'FUNC databaseUpdateUser CHECK USER EXISTS ERROR RESPONSE: ' +
					error.message
			);
		} else {
			if (row && row.length) {
				console.log(
					`FUNC databaseUpdateUser RESPONSE: Found user '${username}'. Proceeding with update...`
				);
				connectDB.query(getLastSeen, username, (error, results1) => {
					// If user exists, query table for date user was last seen in chat
					if (error) {
						return console.error(
							'FUNC databaseUpdateUser GET last_seen ERROR RESPONSE: ' +
								error.message
						);
					} else {
						let userLastSeen = results1[0].last_seen;
						if (userLastSeen == currDate && secondStreamFlag == false)
							return console.log(
								`SQL LOG: User '${username}' last seen today (${currDate}). No need to update last_seen or streams_attended.`
							);
						else {
							connectDB.query(getStreams, username, (error, res) => {
								// If user was not seen today or most recent stream, query table for user's streams_attended count
								if (error) {
									return console.error(
										'FUNC databaseUpdateUser GET streams_attended ERROR RESPONSE: ' +
											error.message
									);
								} else {
									newStreamsCount = res[0].streams_attended + 1;
									let updateData = [newStreamsCount, username];

									if (streamFlag == true) {
										connectDB.query(updateStreams, updateData, (error) => {
											// Increment streams_attended counter and update table row with new result
											if (error) {
												return console.error(
													'FUNC databaseUpdateUser UPDATE streams_attended ERROR RESPONSE: ' +
														error.message
												);
											} else {
												console.log(
													`SQL LOG: User '${username} not seen today (${currDate}). Updated streams_attended (new value: ${newStreamsCount}).`
												);
											}
										});
									}
								}
							});
							if (userLastSeen == currDate) {
								// If user was last seen today, abort modification
								return console.log(
									`SQL LOG: User '${username}' has already has their last_seen field updated for today. No need to modify.`
								);
							}

							if (streamFlag == true) {
								let updateData = [currDate, username];
								connectDB.query(updateLastSeen, updateData, (error) => {
									// If stream flag is active, update last seen date for user
									if (error) {
										return console.error(
											'FUNC databaseUpdateUser UPDATE last_seen ERROR RESPONSE: ' +
												error.message
										);
									} else {
										console.log(
											`SQL LOG: User '${username} updated last_seen to current date (${currDate}).`
										);
									}
								});
							} else {
								// Abort modification if no stream is active
								return console.log(
									`SQL LOG: User '${username} is present,but no stream is active. No update to last_seen performed.`
								);
							}
						}
					}
				});
			} else {
				console.log(
					`FUNC databaseUpdateUser RESPONSE: No result for user '${username}'. Generating new user...`
				);
				connectDB.query(newUser, newUserData, (err, results) => {
					// If query for user existence returns false, create new user entry
					if (err) {
						return console.error(
							'FUNC databaseUpdateUser ADD NEW USER ERROR RESPONSE: ' +
								err.message
						);
					} else {
						console.log(
							'SQL LOG: New User Entry ID: ' +
								results.insertId +
								`. Username: ${username},added on ${todaysDate}`
						);
						entryAdded = true;
					}
				});
			}
		}
	});

	return;
}

// Update chat counter for given user
function databaseIncrementChatCounter(username) {
	const getCountQuery = 'SELECT msgs_sent FROM userinfo WHERE user_name = ?';
	const updateCountQuery =
		'UPDATE userinfo SET msgs_sent = ? WHERE user_name = ?';
	const checkQuery = 'SELECT * FROM userinfo WHERE user_name = (?)';

	let startCount;
	let newCount;

	const getCountData = [username];
	const checkData = [username];

	connectDB.query(checkQuery, checkData, (err, row) => {
		// Query userinfo table for user's existence
		if (err) {
			return console.error(
				'FUNC databaseIncrementChatCounter ERROR RESPONSE: ' + err.message
			);
		} else {
			if (row && row.length) {
				connectDB.query(getCountQuery, getCountData, (err, results) => {
					// If user exists, query userinfo table for the user's current chat counter
					if (err) {
						return console.error(
							'FUNC databaseIncrementChatCounter ERROR RESPONSE: ' + err.message
						);
					} else {
						startCount = results[0].msgs_sent;
						newCount = startCount + 1;

						const updateCountData = [newCount, username];

						connectDB.query(updateCountQuery, updateCountData, (err) => {
							// Increment counter and update row with new chat counter
							if (err) {
								return console.error(
									'FUNC databaseIncrementChatCounter ERROR RESPONSE: ' +
										err.message
								);
							} else {
								console.log(
									`SQL LOG: Set user '${username}' chat message counter to ${newCount} successfully.`
								);
								return newCount;
							}
						});
					}
				});
			} else {
				return;
			}
		}
	});
}

// Create new custom command from chat
function databaseAddCommand(cmd, syntax, creator, adminLvl) {
	const cmdQuery = `INSERT INTO commands (command,syntax, creator, create_date, modlvl) VALUES (?,?,?,?,?)`;
	const checkQuery = 'SELECT * FROM commands WHERE command = ?';
	const todaysDate = getCurrentDate();
	const cmdData = [cmd, syntax, creator, todaysDate, adminLvl];

	connectDB.query(checkQuery, cmd, (err, result) => {
		// Query commands table for existence of new command already
		if (err) {
			return console.error(
				'FUNC databaseAddCommand ERROR RESPONSE: ' + err.message
			);
		} else {
			if (result && result.length) {
				// Deny creation if command already exists.
				console.log(
					` SQL LOG: Attempt to add command '${cmd}' failed, already exists.`
				);
				ComfyJS.Say(
					`Add Command request failed! Command '${cmd}' already exists!`
				);
				return;
			} else {
				connectDB.query(cmdQuery, cmdData, (err, results) => {
					// Create new command entry
					if (err) {
						return console.error(
							'FUNC databaseAddCommand ERROR RESPOSNE: ' + err.message
						);
					} else {
						console.log(
							` SQL LOG: New commanded added to database: ID: ${results.insertId} - CREATOR: ${creator} - CMD: ${cmd} - SYNTAX: ${syntax}`
						);
						ComfyJS.Say(`Success! Command '${cmd}' added! Try it out!`);
						return;
					}
				});
			}
		}
	});
}

// Execute custom command from chat
function databaseGetCommand(cmd, user) {
	const cmdQuery = 'SELECT syntax FROM commands WHERE command = ?';
	const cmdUseQuery = 'SELECT times_used FROM commands WHERE command = ?';
	const updateQuery = 'UPDATE commands SET timed_used = ? WHERE command = ?';

	connectDB.query(cmdQuery, cmd, (err, results) => {
		// Query commands table for syntax for cmd used
		if (err) {
			return console.error(
				'FUNC databaseGetCommand ERROR RESPONSE: ' + err.message
			);
		} else {
			if (results && results.length) {
				ComfyJS.Say(`${results[0].syntax}`);

				connectDB.query(cmdUseQuery, cmd, (err, result) => {
					// If cmd executed successfully, query table for times cmd has been used
					if (err) {
						return console.error(
							'FUNC databaseGetCommand ERROR RESPONSE: ' + err.message
						);
					} else {
						let newUseCount = result[0].times_used + 1;
						const updateData = [newUseCount, cmd];

						connectDB.query(updateQuery, updateData, (err, res) => {
							// Update times_used, increment by 1 after successful usage
							if (err) {
								return console.error(
									'FUNC databaseGetCommand ERROR RESPONSE: ' + err.message
								);
							} else {
								console.log(
									` SQL LOG: Command '${cmd} has now been used ${res[0].times_used} times, latest user: ${user}`
								);
								return;
							}
						});
					}
				});
				return;
			} else {
				ComfyJS.Say(
					`Unrecognized command, @${user}. Try !commands or !help for assistance with what I can do! You can also add this command yourself with !addcmd`
				);
				return;
			}
		}
	});
}

// Remove custom command from command list
function databaseRemoveCommand(cmd, adminLvl) {
	const cmdQuery = 'DELETE FROM commands WHERE cmd = ?';
	const adminQuery = 'SELECT modlvl FROM commands WHERE cmd = ?';
	const cmdData = [cmd];
	let cmdModLvl;

	connectDB.query(adminQuery, cmdData, (err, results) => {
		// Query table for the modlvl of the command's creator
		if (err) {
			console.error(
				'FUNC databaseRemoveCommand ERROR RESPONSE: ' + err.message
			);
			return false;
		} else {
			cmdModLvl = results[0].modlvl;

			if (results[0].modlvl > adminLvl) {
				// Deny deletion request if cmd user's modlvl is lower than creator's
				ComfyJS.Say(`Cannot remove command '${cmd}', @${user}. You are a lower level user compared to the command's creator. (Subscriber > VIP > Founder > Moderator > Broadcaster)`
				);
				console.log(` SQL LOG: Command removal request denied due to lack of approrpiate user mod level. ${user} is ${adminLvl}, command creator is ${cmdModLvl}.`
				);
				return false;
			} else {
				connectDB.query(cmdQuery, cmdData, (err, result) => {
					// Delete command from table if user's modlvl is equal to or higher than creator's
					if (err) {
						console.error('FUNC databaseRemoveCommand ERROR RESPONSE: ' + err.message);
						return false;
					} else {
						console.log(` SQL LOG: Command removal successful, ${user} removed command '${cmd}.`);
						ComfyJS.Say(`@${user}, you successfully removed the custom command '${cmd}'. May it rest in peace.`);
						return true;
					}
				});
			}
		}
	});
}


// START OF REFACTOR TEST
/*
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
	const queryResponse = await xecQuery('checkForUser', username);

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

	const queryResponse = await execQuery('addUser', insertData);

	if (!queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.addUser.query}' returned FALSE for data payload '${insertData[0]}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.addUser.query}' returned TRUE for data payload '${insertData[0]}'.`);
		return true;
	}
};

const dbGetAdjective = async (username) => {
	
	const queryResponse = await execQuery('getAdjective', username);

	if (!queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.getAdjective.query}' returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.getAdjective.query}' returned TRUE for data payload '${username}'.`);
		return true;
	}
};

const dbUpdateLastSeen = async (username) => {

	const queryResponse = await execQuery('updateLastSeen', username);

	if (!queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.updateLastSeen.query}' returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.updateLastSeen.query}' returned TRUE for data payload '${username}'.`);
		return true;
	}
};

const dbGetLastSeen = async (username) => {

	const queryResponse = await execQuery('getLastSeen', username);

	if (!queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.getLastSeen.query}' returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.getLastSeen.query}' returned TRUE for data payload '${username}'.`);
		return true;
	}
};

const dbGetTokens = async (username) => {

	const queryResponse = await execQuery('getTokens', username);

	if (!queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.getTokens.query}' returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.getTokens.query}' returned TRUE for data payload '${username}'.`);
		return true;
	}
};

const dbUpdateTokens = async (username) => {

	const queryResponse = await execQuery('updateTokens', username);

	if (!queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.updateTokens.query} returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.updateTokens.query} returned TRUE for data payload '${username}'.`);
		return true;
	}
};

const dbGetUserFlags = async (username) => {

	const queryResponse = await execQuery('getUserFlags', username);

	if (!queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.getUserFlags.query}' returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.getUserFlags.query}' returned TRUE for data payload '${username}'.`);
		return true;
	}
};

const dbGetMsgCount = async (username) => {
	
	const queryResponse = await execQuery('getMsgCount', username);

	if (!queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.getMsgCount.query}' returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.getMsgCount.query}' returned TRUE for data payload '${username}'.`);
		return true;
	}
};

const dbUpdateMsgCount = async (username) => {

	const queryResponse = await execQuery('updateMsgCount', username);

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

	const queryResponse = await execQuery('addCmd', insertData);

	if (!queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.addCmd.query}' returned FALSE for data payload '${insertData[0]}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.addCmd.query}' returned TRUE for data payload '${insertData[0]}'.`);
		return true;
	}
};

const dbGetCmd = async (cmd) => {

	const queryResponse = await execQuery('getCmd', cmd);

	if (!queryResponse) {
		console.log(` SQL LOG: Query '${execQuery.getCmd.query}' returned FALSE for data payload '${cmd}'.`);
		return false;
	} else if (queryResponse) {

		ComfyJS.Say(`${queryResponse.value}`);
		console.log(` SQL LOG: Query '${execQuery.getCmd.query}' returned TRUE for data payload '${cmd}'.`);

		const usageResponse = await execQuery('getCmdUsage', cmd);

		if (!usageResponse) {
			console.log(` SQL LOG: Query '${execQuery.getCmdUsage}' returned FALSE for data payload '${cmd}'.`);
			return false;
		} else if (usageResponse) {
			console.log(` SQL LOG: Query '${execQuery.getCmdUsage}' returned TRUE for data payload '${cmd}'.`);

			const newUsage = usageResponse.value + 1;
			const insertData = [
				newUsage,
				cmd
			];

			const updateResponse = await execQuery('updateCmdUsage', insertData);

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

	const modLvlResponse = await execQuery('getCmdModLvl', cmd);

	if (!modLvlResponse) {
		console.log(` SQL LOG: Query '${execQuery.getCmdModLvl.query}' returned FALSE for data payload '${cmd}'.`);
		return false;
	} else if (modLvlResponse) {
		console.log(` SQL LOG: Query '${execQuery.getCmdModLvl.query}' returned TRUE for data payload '${cmd}'.`);
		
		if (modLvlResponse.value > cmdDataObj.modLvl) {
			//Chat response
			//Log response
			return false;
		} else {

			const queryResponse = await execQuery('removeCmd', cmdDataObj.cmd);

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

*/