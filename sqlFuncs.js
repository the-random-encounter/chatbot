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
module.exports.doesExist = databaseCheckExists;
module.exports.lastSeen = databaseUpdateLastSeen;
module.exports.getAdj = databaseGetAdjective;
module.exports.displayTokens = databaseDisplayTokens;
module.exports.updateTokens = databaseUpdateTokens;
module.exports.getTokens = databaseGetTokens;
module.exports.updateUser = databaseUpdateUser;
module.exports.incChats = databaseIncrementChatCounter;
module.exports.addCmd = databaseAddCommand;
module.exports.getCmd = databaseGetCommand;

// CONST requirement declarations
const mysql = require('mysql2');
const ComfyJS = require('comfy.js');
const { mod } = require('tmi.js/lib/commands');
const { toNumber } = require('tmi.js/lib/utils');

const connectDB = mysql.createConnection({
    host: process.env.SQL_HOSTNAME,
    user: process.env.SQL_USERNAME,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE
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
    })

}

// Generate a random adjective from array and return
function generateRandomAdjective() {

    let adjList = [
        "adorable",
        "adventurous",
        "aggressive",
        "agreeable",
        "alert",
        "alive",
        "amused",
        "angry",
        "annoyed",
        "annoying",
        "anxious",
        "arrogant",
        "ashamed",
        "attractive",
        "average",
        "awful",
        "bad",
        "beautiful",
        "better",
        "bewildered",
        "black",
        "bloody",
        "blue",
        "blue-eyed",
        "blushing",
        "bored",
        "brainy",
        "brave",
        "breakable",
        "bright",
        "busy",
        "calm",
        "careful",
        "cautious",
        "charming",
        "cheerful",
        "clean",
        "clear",
        "clever",
        "cloudy",
        "clumsy",
        "colorful",
        "combative",
        "comfortable",
        "concerned",
        "condemned",
        "confused",
        "cooperative",
        "courageous",
        "crazy",
        "creepy",
        "crowded",
        "cruel",
        "curious",
        "cute",
        "dangerous",
        "dark",
        "dead",
        "defeated",
        "defiant",
        "delightful",
        "depressed",
        "determined",
        "different",
        "difficult",
        "disgusted",
        "distinct",
        "disturbed",
        "dizzy",
        "doubtful",
        "drab",
        "dull",
        "eager",
        "easy",
        "elated",
        "elegant",
        "embarrassed",
        "enchanting",
        "encouraging",
        "energetic",
        "enthusiastic",
        "envious",
        "evil",
        "excited",
        "expensive",
        "exuberant",
        "fair",
        "faithful",
        "famous",
        "fancy",
        "fantastic",
        "fierce",
        "filthy",
        "fine",
        "foolish",
        "fragile",
        "frail",
        "frantic",
        "friendly",
        "frightened",
        "funny",
        "gentle",
        "gifted",
        "glamorous",
        "gleaming",
        "glorious",
        "good",
        "gorgeous",
        "graceful",
        "grieving",
        "grotesque",
        "grumpy",
        "handsome",
        "happy",
        "healthy",
        "helpful",
        "helpless",
        "hilarious",
        "homeless",
        "homely",
        "horrible",
        "hungry",
        "hurt",
        "ill",
        "important",
        "impossible",
        "inexpensive",
        "innocent",
        "inquisitive",
        "itchy",
        "jealous",
        "jittery",
        "jolly",
        "joyous",
        "kind",
        "lazy",
        "light",
        "lively",
        "lonely",
        "long",
        "lovely",
        "lucky",
        "magnificent",
        "misty",
        "modern",
        "motionless",
        "muddy",
        "mushy",
        "mysterious",
        "nasty",
        "naughty",
        "nervous",
        "nice",
        "nutty",
        "obedient",
        "obnoxious",
        "odd",
        "old-fashioned",
        "open",
        "outrageous",
        "outstanding",
        "panicky",
        "perfect",
        "plain",
        "pleasant",
        "poised",
        "poor",
        "powerful",
        "precious",
        "prickly",
        "proud",
        "putrid",
        "puzzled",
        "quaint",
        "real",
        "relieved",
        "repulsive",
        "rich",
        "scary",
        "selfish",
        "shiny",
        "shy",
        "silly",
        "sleepy",
        "smiling",
        "smoggy",
        "sore",
        "sparkling",
        "splendid",
        "spotless",
        "stormy",
        "strange",
        "stupid",
        "successful",
        "super",
        "talented",
        "tame",
        "tasty",
        "tender",
        "tense",
        "terrible",
        "thankful",
        "thoughtful",
        "thoughtless",
        "tired",
        "tough",
        "troubled",
        "ugliest",
        "ugly",
        "uninterested",
        "unsightly",
        "unusual",
        "upset",
        "uptight",
        "vast",
        "victorious",
        "vivacious",
        "wandering",
        "weary",
        "wicked",
        "wide-eyed",
        "wild",
        "witty",
        "worried",
        "worrisome",
        "wrong",
        "zany",
        "zealous"
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
function databaseAddUser(username) {

    const insertQuery = 'INSERT INTO userinfo (user_name,first_seen,last_seen,random_adjective) VALUES (?,?,?,?)';
    const checkQuery = 'SELECT * FROM userinfo WHERE user_name = (?)';
    const idQuery = 'SELECT user_id FROM userinfo WHERE user_name = (?)';

    const randomAdjective = generateRandomAdjective();
    const todaysDate = getCurrentDate();

    const insertData = [username, todaysDate, todaysDate, randomAdjective];
    const checkData = [username];

    connectDB.query(checkQuery, checkData, (err, row) => {
        if (err) {
            return console.error('FUNC databaseAddUser ERROR RESPONSE: ' + err.message);
        } else {
            if (row && row.length) {
                connectDB.query(idQuery, checkData, (err, results) => {
                    if (err) {
                        return console.error('FUNC databaseAddUser ERROR RESPONSE: ' + err.message);
                    } else {
                        console.log(` SQL LOG: User '${username}' already exists. User ID: ${results[0].user_id}`);
                        return false;
                    }
                });
            } else {
                console.log(` SQL LOG: User '${username}' does not exist. Attempting to add...`);
                connectDB.query(insertQuery, insertData, (err, results) => {
                    if (err) {
                        return console.error('FUNC databaseAddRow ERROR RESPONSE: ' + err.message);
                    } else {
                        console.log(' SQL LOG: New User Entry ID: ' + results.insertId + `. Username: ${username},added on ${todaysDate}`);
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
        if (err) {
            return console.error('FUNC databaseCheckExists ERROR RESPONSE: ' + err.message);
        } else {
            if (row && row.length) {
                connectDB.query(idQuery, checkData, (err, results) => {
                    if (err) {
                        return console.error('FUNC databaseCheckExists ERROR RESPONSE: ' + err.message);
                    } else {
                        console.log(` SQL LOG: User '${username}' already exists. User ID: ${results[0].user_id}`);
                        return true;
                    }
                });
            } else {
                console.log(` SQL LOG: User '${username}' does not exist.`);
                return false;
            }
        }
    });
}

// Get stored adjective for given user
function databaseGetAdjective(username) {

    const adjQuery = 'SELECT random_adjective FROM userinfo WHERE user_name = (?)';
    const adjData = [username];

    let adjective = '';

    connectDB.query(adjQuery, adjData, (err, results, fields) => {
        if (err) {
            return console.error('FUNC databaseGetAdjective ERROR RESPONSE: ' + err.message);
        } else {
            adjective = JSON.stringify(results[0].random_adjective);
            console.log(`SQL DEBUG: dbGetAdj>> var adjective = ${adjective}`);
        }

        ComfyJS.Say(`@${username},your RANDOM ADJECTIVE is ${adjective}! And you're stuck with it for good!`);
        return adjective;
    });
}

// Get and broadcast casino tokens for given user
function databaseDisplayTokens(username) {

    const tokenQuery = 'SELECT casino_tokens FROM userinfo WHERE user_name = (?)';
    const tokenData = [username];

    let returnAmt = 0;

    connectDB.query(tokenQuery, tokenData, (err, results, fields) => {
        if (err) {
            return console.error('FUNC databaseGetTokens ERROR RESPONSE: ' + err.message);
        } else {
            returnAmt = JSON.stringify(results[0].casino_tokens);
            ComfyJS.Say(`@${username},you currently have ${returnAmt} casino tokens remaining.`);
            console.log(`Checked casino token amount for user ${username},returned ${returnAmt}`);
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
        if (err) {
            return console.error('FUNC databaseGetTokens ERROR RESPONSE: ' + err.message);
        } else {
            returnAmt = results[0].casino_tokens;
            console.log(`SQL DEBUG: dbgetTokens>> var returnAmt = ${returnAmt}`);
            ComfyJS.Say(`You have ${results[0].casino_tokens} tokens available,${username}.`);
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
    const updateQuery = 'UPDATE userinfo SET casino_tokens = ? WHERE user_name = ?';

    connectDB.query(tokenQuery, username, (err, result) => {
        if (err) {
            return console.error('FUNC databaseUpdateTokens ERROR RESPOSNE ' + err.message);
        } else {
            let originalTokens = result[0].casino_tokens;
            let newAmt = originalTokens + newTokens;
            const updateData = [newAmt, username];

            connectDB.query(updateQuery, updateData, (err, results) => {
                if (err) {
                    return console.error('FUNC databaseUpdateTokens ERROR RESPONSE: ' + err.message);
                } else {
                    console.log(`FUNC databaseUpdateTokens UPDATED ${username} TOKENS TO ${results[0].casino_tokens}`);
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
        if (error) {
            return console.error('FUNC databaseUpdateLastSeen ERROR RESPONSE: ' + error.message);
        } else {
            console.log(` SQL LOG: User '${username}' has been set to last seen today (${currDate}).`);
            return true;
        }
    });
}

// Full user creation/data update routine -- STILL TESTING, NOT IMPLEMENTED
function databaseUpdateUser(username, streamFlag, secondStreamFlag) {

    const newUser = 'INSERT INTO userinfo (user_name,first_seen,last_seen,random_adjective) VALUES (?,?,?,?)';
    const checkUser = 'SELECT * FROM userinfo WHERE user_name = (?)';
    const updateStreams = 'UPDATE userinfo SET streams_attended = ? WHERE user_name = ?';
    const updateLastSeen = 'UPDATE userinfo SET last_seen = ? WHERE user_name = ?';
    const getStreams = 'SELECT streams_attended FROM userinfo WHERE user_name = ?';
    const getLastSeen = 'SELECT last_seen FROM userinfo WHERE user_name = ?';
    const currDate = getCurrentDate();
    const randomAdjective = generateRandomAdjective();
    const newUserData = [username, todaysDate, todaysDate, randomAdjective];
    let newStreamsCount = 0;

    connectDB.query(checkUser, username, (error, row) => {
        if (error) {
            return console.error('FUNC databaseUpdateUser CHECK USER EXISTS ERROR RESPONSE: ' + error.message);
        } else {
            if (row && row.length) {
                console.log(`FUNC databaseUpdateUser RESPONSE: Found user '${username}'. Proceeding with update...`);
                connectDB.query(getLastSeen, username, (error, results1) => {
                    if (error) {
                        return console.error('FUNC databaseUpdateUser GET last_seen ERROR RESPONSE: ' + error.message);
                    } else {
                        let userLastSeen = results1[0].last_seen;
                        if (userLastSeen == currDate && secondStreamFlag == false)
                            return console.log(`SQL LOG: User '${username}' last seen today (${currDate}). No need to update last_seen or streams_attended.`);
                        else {
                            connectDB.query(getStreams, username, (error, results) => {
                                if (error) {
                                    return console.error('FUNC databaseUpdateUser GET streams_attended ERROR RESPONSE: ' + error.message);
                                } else {
                                    newStreamsCount = results[0].streams_attended + 1;
                                    let updateData = [newStreamsCount, username];

                                    if (streamFlag == true) {
                                        connectDB.query(updateStreams, updateData, (error) => {
                                            if (error) {
                                                return console.error('FUNC databaseUpdateUser UPDATE streams_attended ERROR RESPONSE: ' + error.message);
                                            } else {
                                                console.log(`SQL LOG: User '${username} not seen today (${currDate}). Updated streams_attended (new value: ${newStreamsCount}).`);
                                            }
                                        });
                                    }
                                }
                            });
                            if (userLastSeen == currDate) {
                                return console.log(`SQL LOG: User '${username}' has already has their last_seen field updated for today. No need to modify.`);
                            }

                            if (streamFlag == true) {
                                let updateData = [currDate, username];
                                connectDB.query(updateLastSeen, updateData, (error) => {
                                    if (error) {
                                        return console.error('FUNC databaseUpdateUser UPDATE last_seen ERROR RESPONSE: ' + error.message);
                                    } else {
                                        console.log(`SQL LOG: User '${username} updated last_seen to current date (${currDate}).`);
                                    }
                                });
                            }
                            else {
                                return console.log(`SQL LOG: User '${username} is present,but no stream is active. No update to last_seen performed.`);
                            }
                        }
                    }
                });
            } else {
                console.log(`FUNC databaseUpdateUser RESPONSE: No result for user '${username}'. Generating new user...`);
                connectDB.query(newUser, newUserData, (err, results) => {
                    if (err) {
                        return console.error('FUNC databaseUpdateUser ADD NEW USER ERROR RESPONSE: ' + err.message);
                    } else {
                        console.log('SQL LOG: New User Entry ID: ' + results.insertId + `. Username: ${username},added on ${todaysDate}`);
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
    const updateCountQuery = 'UPDATE userinfo SET msgs_sent = ? WHERE user_name = ?';
    const checkQuery = 'SELECT * FROM userinfo WHERE user_name = (?)';

    let startCount;
    let newCount;

    const getCountData = [username];
    const checkData = [username];

    connectDB.query(checkQuery, checkData, (err, row) => {
        if (err) {
            return console.error('FUNC databaseIncrementChatCounter ERROR RESPONSE: ' + err.message);
        } else {
            if (row && row.length) {
                connectDB.query(getCountQuery, getCountData, (err, results) => {
                    if (err) {
                        return console.error('FUNC databaseIncrementChatCounter ERROR RESPONSE: ' + err.message);
                    } else {
                        startCount = results[0].msgs_sent;
                        newCount = startCount + 1;

                        const updateCountData = [newCount, username];

                        connectDB.query(updateCountQuery, updateCountData, (err) => {
                            if (err) {
                                return console.error('FUNC databaseIncrementChatCounter ERROR RESPONSE: ' + err.message);
                            } else {
                                console.log(`SQL LOG: Set user '${username}' chat message counter to ${newCount} successfully.`);
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
function databaseAddCommand(cmd, syntax, creator) {

    const cmdQuery = `INSERT INTO commands (command,syntax, creator, create_date) VALUES (?,?,?,?)`;
    const checkQuery = 'SELECT * FROM commands WHERE command = ?';
    const todaysDate = getCurrentDate();
    const cmdData = [cmd, syntax, creator, todaysDate];

    connectDB.query(checkQuery, cmd, (err, result) => {
        if (err) {
            return console.error('FUNC databaseAddCommand ERROR RESPONSE: ' + err.message);
        } else {
            if (result && result.length) {
                console.log(` SQL LOG: Attempt to add command '${cmd}' failed, already exists.`);
                ComfyJS.Say(`Add Command request failed! Command '${cmd}' already exists!`);
                return;
            }
            else {
                connectDB.query(cmdQuery, cmdData, (err, results) => {
                    if (err) {
                        return console.error('FUNC databaseAddCommand ERROR RESPOSNE: ' + err.message);
                    } else {
                        console.log(` SQL LOG: New commanded added to database: ID: ${results.insertId} - CREATOR: ${creator} - CMD: ${cmd} - SYNTAX: ${syntax}`);
                        ComfyJS.Say(`Success! Command '${cmd}' added! Try it out!`);
                        return;
                    }
                });
            }
        }
    });
}

// Execute custom command from chat
function databaseGetCommand(cmd) {

    const cmdQuery = 'SELECT syntax FROM commands WHERE command = ?';

    connectDB.query(cmdQuery, cmd, (err, results) => {
        if (err) {
            return console.error('FUNC databaseGetCommand ERROR RESPONSE: ' + err.message);
        } else {
            if (results && results.length) {
                ComfyJS.Say(`${results[0].syntax}`);
                return;
            } else {
                ComfyJS.Say(`Unrecognized command, @${user}. Try !commands or !help for assistance with what I can do! You can also add this command yourself with !addcmd`);
                return;
            }
        }
    });
}