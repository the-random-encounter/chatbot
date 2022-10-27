// RANDOM ENCOUNTER TWITCH CHAT BOT
// MAIN FUNCTIONS FILE
// v0.3.3 - 09/13/2022
// by The Random Encounter
// https://github.com/the-random-encounter/randomencounterbot.git
// https://www.twitch.tv/the_random_encounter
// https://www.facebook.com/random.encounter.dj
// E-Mail: talent@random-encounter.net
// Secondary: contact@random-encounter.net


//
// ---- IMPORTS & REQUIRES ----
//


// Import Environment variables & configure event emitter listeners
require('dotenv').config();
require('events').EventEmitter.prototype._maxListeners = 100;

// Declare CONST library requirements
const ComfyJS = require('comfy.js');
const nodemailer = require('nodemailer');
const userDB = require('./sqlFuncs.js');
const expServer = require('./app.js');
const needle = require('needle');
const botMailTransporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL_USERNAME,
		pass: process.env.EMAIL_PASSWORD
	}
});

const fs = require('fs');
const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const overlayIO = new Server(3002);

/* Client/Server Requirements

const EventEmitter = require('tmi.js/lib/events');


const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const io = socketio(server);
*/

overlayIO.on("connection", socket => {
	console.log(`Socket IO Connection Established (Socket ID: ${socket.id})`);
});

//
// ---- GLOBAL VARIABLES ----
//


// Script timing variable
var scriptStart = new Date().getTime();

// User tracking list arrays
let currentUsersList = [];
let updatedUsersList = [];
let updatedUserFlagsList = [];
let raidersArray = [];
let hostersArray = [];
let blUserArray = [];
let bannedUsers = [];
let botList = [];
let ignoredUsers = [];
let modsList = [];
let vipList = [];
let founderList = [];
let editorsList = [];

// Stream-tracking flags
let streamActive = false;
let secondDailyStream = false;

// Various global counters & flags

let rouletteSpinFlag = false;
let rouletteBetArray = [];
let cmdMemArray = [];
let tipsGiven = [];
let vipCounter = 0;
let vipFlag = false;
let tipLaps = 0;
let vipLaps = 0;
let routletteUpcoming = false;

/* Init WebSocket Events
io.on('connection', socket => {
	console.log(`HTML Logger Page Connected!`);
});
io.on('logEvent', socket function (logData) {
	socket.send(logData);
	})

// Start OBS Logger Websocket Server
server.listen(3000, () => { console.log(`Websocket server started on port 3000`); });
*/

/* Currently unused chatserver websocket logic
const path = require('path');

const PORT = 3001;

const http2 = require('http');
const express2 = require('express');
const socketio = require('socket.io');
const formatMessage = require('./helpers/formatDate');
const {
    getActiveUser,
    exitRoom,
    newUser,
    getIndividualRoomUsers
} = require('./helpers/userHelper');
const { cp } = require('fs');

const app2 = express2();
const chatServer = http2.createServer(app2);
const io = socketio(chatServer);

//chatServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Set public folder
//app2.use(express.static(path.join(__dirname, 'public')));

// this block will run when the client connects
/*
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user1 = newUser(socket.id, username, room);

        socket.join(user1.room);

        // General welcome
        socket.emit('message', formatMessage("Twitch Chat Backend", 'Messages are limited to this room! '));

        // Broadcast everytime users connects
        socket.broadcast
            .to(user1.room)
            .emit(
                'message',
                formatMessage("Twitch Chat Backend", `${user1.username} has joined the room`)
            );

        // Current active users and room name
        io.to(user1.room).emit('roomusers', {
            room: user1.room,
            users: getIndividualRoomUsers(user1.room)
        });
    });

    // Listen for client message
    socket.on('chatMessage', msg => {
        const user1 = getActiveUser(socket.id);

        io.to(user1.room).emit('message', formatMessage(user1.username, msg));
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user1 = exitRoom(socket.id);

        if (user1) {
            io.to(user1.room).emit(
                'message',
                formatMessage("Twitch Chat Backend", `${user1.username} has left the room`)
            );

            // Current active users and room name
            io.to(user1.room).emit('roomusers', {
                room: user1.room,
                users: getIndividualRoomUsers(user1.room)
            });
        }
    });
});
*/


// Read in tracked user lists from JSON data
console.log(`BOOT LOG (${time()}): Reading in user JSON data...`);
const trackedUsers = JSON.parse(fs.readFileSync('trackedUsers.json'));
trackedUsers.blacklisted.forEach(function (curVal) { blUserArray.push(curVal); });
trackedUsers.bots.forEach(function (curVal) { botList.push(curVal); });
trackedUsers.banned.forEach(function (curVal) { bannedUsers.push(curVal.name) });
trackedUsers.mods.forEach(function (curVal) { modsList.push(curVal); });
trackedUsers.vips.forEach(function (curVal) { vipList.push(curVal); });
trackedUsers.founders.forEach(function (curVal) { founderList.push(curVal); });
trackedUsers.editors.forEach(function (curVal) { editorsList.push(curVal); });
ignoredUsers = [].concat(blUserArray, botList);
console.log(`BOOT LOG (${time()}): User data read complete. Arrays loaded. Current user lists are as follows:`);
console.log(`BOOT LOG (${time()}): Blacklisted Users: ` + blUserArray);
console.log(`BOOT LOG (${time()}): Bot List: ` + botList);
console.log(`BOOT LOG (${time()}): Ignored Users List: ` + ignoredUsers);
console.log(`BOOT LOG (${time()}): Banned Users: ` + bannedUsers);
console.log(`BOOT LOG (${time()}): Mod List: ` + modsList);
console.log(`BOOT LOG (${time()}): VIP List: ` + vipList);
console.log(`BOOT LOG (${time()}): Founders List: ` + founderList);
console.log(`BOOT LOG (${time()}): Editors List: ` + editorsList);

// Init Twitch IRC Server Connection
ComfyJS.Init(process.env.TWITCH_USERNAME, process.env.TWITCH_OAUTH, process.env.TWITCH_CHANNEL, true);

// Announcement Function Declarations
const subathonAnnounce = () => { ComfyJS.Say(`Hey ravers and lovers and good-time-facilitators! Random Encounter is running a subathon today, hoping to get some funds to replace a bunch of stolen studio equipment. MIDI controllers, speakers, and more... all gone... It'd be awesome if you can help out. We'd both appreciate your generousity greatly!`); }
const raidTrainAnnounce = () => { ComfyJS.Say(``); }
const tipAnnounce = () => { ComfyJS.Say(`Consider supporting the stream! Subscriptions, bits, or even direct tips are immensely helpful, and go towards new music, new gear, or other stream/studio-related items. Tip directly at https://streamelements.com/the_random_encounter/tip`); }
const marathonAnnounce = () => { ComfyJS.Say(``); }
const payoutAnnounce = () => { ComfyJS.Say(`Hey guys, we're pushing to get 4 or 5 additional subs in the next two days in order to get a payout from Twitch this month. We are embarassed to ask, but we had to break the bank this month, and being able to get that payout would help us out immensely. Don't forget that subscribing entitles you to being entered into our monthly $25 Twitch gift card drawing, too! Thank you for your support!`); };

helpTipsGlobalInit = setInterval(generateTip, 900000);


//
// ---- TWITCH EVENT HANDLERS ----
//


ComfyJS.onChat = async (user, message, flags, self, extra) => {
	/* onMsg extra parameters
			id: string
		  channel: string
		  roomId: string
  		messageType: string
		  messageEmotes: EmoteSet
		  isEmoteOnly: boolean
  		userId: string
  		username: string
		  displayName: string
	  	userColor: string
  		userBadges: Badges
	  	customRewardId: string
  		flags: any
			timestamp: string
	*/

	await userDB.addUser(user);
	
	const logType = 'CHAT';
	
	// Logs all messages being sent to Twitch chat
	
	logXmit(message, logType, user);

	let userPOS = currentUsersList.indexOf(user);

	if (!currentUsersList.includes(user) && !blUserArray.includes(user)) { currentUsersList.push(user); }

	if (userPOS == -1 && !blUserArray.includes(user)) {
		console.log(`CHAT LOG (${time()}): New user ${user} is chatting, but not on user list. Appending to users list.`);
		logXmit(`New user ${user} is chatting, but not on user list. Appending to users list.`);
	
		if (await !userDB.checkForUser(user)) {
			const userDataObj = {
				"username": user,
				"broadcaster": flags.broadcaster,
				"moderator": flags.mod,
				"founder": flags.founder,
				"vip": flags.vip,
				"subscriber": flags.subscriber
			};
			await userDB.addUser(user);
			await userDB.updateUserFlags(userDataObj);
			updatedUserFlagsList.push(user);
			updatedUsersList.push(user);
			
		} else {
			
			if (!updatedUsersList.includes(user)) {
				await userDB.updateLastSeen(user);
				updatedUsersList.push(user);
			}
			if (!updatedUserFlagsList.includes(user)) {
				
				const userDataObj = {
				"username": user,
				"broadcaster": flags.broadcaster,
				"moderator": flags.mod,
				"founder": flags.founder,
				"vip": flags.vip,
				"subscriber": flags.subscriber
				};
				const flagUpdate = await userDB.updateUserFlags(userDataObj);

				if (flagUpdate) {
					updatedUserFlagsList.push(user);
					console.log(`USER LOG (${time()}): Successfully updated user '${user}' access flags. B: ${flags.broadcaster}, M: ${flags.mod}, F: ${flags.founder}, V: ${flags.vip}, S: ${flags.subscriber}`);
				}
			}
		}
	}

	if (user === 'randomencounterbot') {
		return;
	} else {
		const msgCount = await userDB.updateMsgCount(user);
		console.log(`CHAT LOG (${time()}): ${user}: ${message} | Msg Count: ${msgCount}`);

		switch (msgCount) {
			case 1:
				ComfyJS.Say(`Congratulations on your first time messaging in here, @${user}! At least, the first time since I've seen you! Either way, we're off to a great start!`);
				break;
			case 100:
				ComfyJS.Say(`And with that, @${user}, you've sent your hundredth chat message in Random Encounter's stream! Thank you for your engagement and hype! Keep up the energy!`);
				break;
			case 250:
				ComfyJS.Say(`Wow, @${user}! That's your 250th message sent in the channel! Such continued support, much engagement! As your robot overlord, I thank you!`);
				break;
			case 500:
				ComfyJS.Say(`An incredible feat! @${user} has reached their 500th chat message sent! Bow to the engagement master!`);
				break;
			case 1000:
				ComfyJS.Say(`And there goes the ONE THOUSANDTH CHAT MESSAGE, sent by the chat master ${user}! Everyone else, ya'll could learn a thing or two from them! Thank you for your continued support and hype, friend!`);
				break;
		}
	}

	//console.log('CHAT LOG (${time()}): ' + user + ': ' + message);
	
}

ComfyJS.onCommand = async (user, command, message, flags, extra) => {
	/* onCommand extra parameters 
			id: string
		  channel: string
  		roomId: string
  		messageType: string
  		messageEmotes: EmoteSet
		  isEmoteOnly: boolean
	  	userId: string
  		username: string
	  	displayName: string
  		userColor: string
		  userBadges: Badges
	  	customRewardId: string
	  	flags: any
  		timestamp: string
		  sinceLastCommand: CommandTimePeriod
	*/
	
	const cmdSuccess = await cmdExec(user, command, message, flags, extra);

	let userPOS = currentUsersList.indexOf(user);

	if (!currentUsersList.includes(user) && !blUserArray.includes(user)) { currentUsersList.push(user); }

	if (userPOS == -1 && !blUserArray.includes(user)) {
		console.log(`CHAT LOG (${time()}): New user ${user} is chatting, but not on user list. Appending to users list.`);
		logXmit(`New user ${user} is chatting, but not on user list. Appending to users list.`);
		if (await !userDB.checkForUser(user)) {
			const userDataObj = {
				"username": user,
				"broadcaster": flags.broadcaster,
				"moderator": flags.mod,
				"founder": flags.founder,
				"vip": flags.vip,
				"subscriber": flags.subscriber
			};
			await userDB.addUser(user);
			await userDB.updateUserFlags(userDataObj);
			updatedUserFlagsList.push(user);
			updatedUsersList.push(user);
		} else {
			if (!updatedUsersList.includes(user)) {
				await userDB.updateLastSeen(user);
				updatedUsersList.push(user);
			}
			if (!updatedUserFlagsList.includes(user)) {
				const userDataObj = {
					"username": user,
					"broadcaster": flags.broadcaster,
					"moderator": flags.mod,
					"founder": flags.founder,
					"vip": flags.vip,
					"subscriber": flags.subscriber
				};
				const flagUpdate = await userDB.updateUserFlags(userDataObj);
				if (flagUpdate) {
					updatedUserFlagsList.push(user);
					console.log(`USER LOG (${time()}): Successfully updated user '${user}' access flags. B: ${flags.broadcaster}, M: ${flags.mod}, F: ${flags.founder}, V: ${flags.vip}, S: ${flags.subscriber}`);
				}
			}
		}
	}

	if (cmdSuccess) {
		const cmdCount = await userDB.updateCmdsSent(user);
		console.log(` CMD LOG (${time()}): ${user}: !${command} ${message} | Command Count: ${cmdCount}`);
	}

}

ComfyJS.onWhisper = (user, message, flags, self, extra) => {

	let msgIndexer = message.indexOf(':');
	let msgStart = message.substring(0, msgIndexer);
	let msgContent = message.substring(msgIndexer + 1);
	

	if (user.toLowerCase() != 'the_random_encounter') {
		const mailOptions = {
			from: 'talent@random-encounter.net',
			to: 'danvisibleman@gmail.com',
			subject: `TWITCH BOT PM FROM '${user}'`,
			text: message
		};

	botMailTransporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log(`WHISPER LOG (${time()}): User '${user}' sent a message. E-mailed successfully. (${info.response})`);
		}
	});
		
	} else if (flags.broadcaster || user.toLowerCase() == "the_random_encounter") {
			
		const cmdIndex = cmdContent.indexOf(' ');
		const command = cmdContent.substring(0, cmdIndex);
		const message = cmdContent.substring(cmdIndex + 1);
		const cmd = command;
		
		cmdExec(user, command, message, flags, extra);

	} else {
		ComfyJS.Whisper(`Default response!`, user);
	}
}


ComfyJS.onJoin = async (user, self, extra) => {
	//if (typeof extra.userId !== 'undefined') { console.log(extra.userId) };

	

	if (ignoredUsers.includes(user)) { return; }

	await userDB.addUser(user);
	var scriptRuntime = new Date().getTime();
	var timeSinceBegin = scriptRuntime - scriptStart;
	let runTimeMinutes = timeSinceBegin / 60000;
	let upTime = msToTime(timeSinceBegin);
	let runTime = `Script Runtime: ${upTime} (${timeSinceBegin}ms)`;
	const logType = 'JOIN';
	let logMsg;

	let userPOS = currentUsersList.indexOf(user);
	let userUpdatedPOS = updatedUsersList.indexOf(user);
	
	if (currentUsersList.includes(user)) {
		logMsg = `User '${user}' has joined channel, but is already on user list. ${runTime}`;
		console.log(`JOIN LOG (${time()}): ` + logMsg);
		logXmit(logMsg, logType);
	} else if (!currentUsersList.includes(user)) {
		logMsg = `User '${user}' has joined channel, adding to current user list. ${runTime}`;
		console.log(`JOIN LOG (${time()}): ` + logMsg);
		logXmit(logMsg, logType);
		currentUsersList.push(user);
	} else {
		logMsg = `Unknown exception regarding user '${user}' leaving channel. UserPOS variable not -1 or above 1. Leaving alone. ${runTime}`;
		console.log(`JOIN LOG (${time()}): ` + logMsg);
		logXmit(logMsg, logType);
	}

	if (!updatedUsersList.includes(user)) {
		if (await !userDB.checkForUser(user)) {
			await userDB.addUser(user);
			updatedUsersList.push(user);
			console.log(`JOIN LOG (${time()}): New user '${user}' has been successfully added.`);
			logXmit(`New user '${user}' has been successfully added.`, logType);
		} else {
			updatedUsersList.push(user);
			await userDB.updateLastSeen(user);
			console.log(`JOIN LOG (${time()}): User '${user}' has been updated and added to updated users list.`);
			logXmit(`User '${user}' has been updated and added to updated users list.`, logType);
		}
	} else {
		console.log(`JOIN LOG (${time()}): User '${user} present on updated users list (Index: ${userUpdatedPOS}). No action taken.`);
		logXmit(`User '${user} present on updated users list (Index: ${userUpdatedPOS}). No action taken.`, logType);
	}
	
}

ComfyJS.onPart = async (user, self, extra) => {

	

	if (ignoredUsers.includes(user)) { return; }

  var scriptRuntime = new Date().getTime();
  var timeSinceBegin = scriptRuntime - scriptStart;
  let upTime = msToTime(timeSinceBegin);
  let runTime = `Script Runtime: ${upTime} (${timeSinceBegin}ms)`;
  const logType = 'PART';
  let logMsg;

	let userPOS = currentUsersList.indexOf(user);
	let userUpdatedPOS = updatedUsersList.indexOf(user);
	
	if (currentUsersList.includes(user)) {
		currentUsersList.splice(userPOS, 1);
		logMsg = `User '${user}' has left channel, pruned username from active users list. ${runTime}`;
		console.log(`PART LOG (${time()}): ` + logMsg);
		logXmit(logMsg, logType);
	} else if (!currentUsersList.includes(user)) {
		logMsg = `User '${user}' left channel, but was not on users list beforehand. Leaving alone. ${runTime}`;
		console.log(`PART LOG (${time()}): ` + logMsg);
		logXmit(logMsg, logType);
	} else {
		logMsg = `Unknown exception regarding user '${user}' leaving channel. UserPOS variable not -1 or above 1. Leaving alone. ${runTime}`;
		console.log(`PART LOG (${time()}): ` + logMsg);
		logXmit(logMsg, logType);
	}

	if (!updatedUsersList.includes(user)) {
		if (await !userDB.checkForUser(user)) {
			await userDB.addUser(user);
			updatedUsersList.push(user);
			console.log(`PART LOG (${time()}): New user '${user}' has been successfully added.`);
			logXmit(`New user '${user}' has been successfully added.`, logType);
		} else {
			updatedUsersList.push(user);
			await userDB.updateLastSeen(user);
			console.log(`PART LOG (${time()}): User '${user}' has been updated and added to updated users list.`);
			logXmit(`User '${user}' has been updated and added to updated users list.`, logType);
		}
	} else {
		console.log(`PART LOG (${time()}): User '${user} present on updated users list (Index: ${userUpdatedPOS}). No action taken.`);
		logXmit(`User '${user} present on updated users list (Index: ${userUpdatedPOS}). No action taken.`, logType);
	}
	
}

ComfyJS.onCheer = async (user, message, bits, flags, extra) => {
	/* onCheer extra parameters:
	  	channel: string
  		roomId: string
		  userId: string
  		username: string
		  userColor: string
	  	userBadges: Badges
	  	displayName: string
  		messageEmotes: EmoteSet
		  subscriber: string
	*/

	

	console.log(` BIT LOG (${time()}): ${user} cheered a total of ${bits} bits. Message: ${message}`);
	 ComfyJS.Say(`@${user} just blasted @the_random_encounter with ${bits} of the MOISTEST, JUICIEST BITS POSSIBLE! Holy shit! Thank you SO MUCH, @${user}. Your generosity is ***MUCH*** appreciated!!!`);
	
	await userDB.updateBits(user, bits);
	await userDB.updateTimesCheered(user);

	return;
}

ComfyJS.onSub = async (user, message, subTierInfo, extra) => {

	console.log(` SUB LOG (${time()}): ${user} subbed at tier ${subTierInfo}.`);
	
	ComfyJS.Say(`Wow! Thank you so much for ${(subTierInfo.plan === 'Prime') ? `using your Prime sub here` : `subscribing at tier ${subTier}`}, @${user}! Much appreciated, and much love!`);

	const subInfo = {
		"isSub": 1 || false,
		"monthsSubbed": 1 || false,
		"subTier": subTierInfo || false,
		"subStreak": false
	};

	await userDB.updateSub(username, subInfo);
}

ComfyJS.onResub = async (user, message, streakMonths, cumulativeMonths, subTierInfo, extra) => {

	

	console.log(` SUB LOG (${time()}): ${user} resubbed at tier ${subTierInfo}. Streak: ${streakMonths}, Cumulative: ${cumulativeMonths}`);
	 ComfyJS.Say(`Thank you for resubbing at tier ${subTierInfo}, @${user}! They now have a sub streak of ${streakMonths}, with ${cumulativeMonths} months total! Much appreciated, much love!`);
		const subInfo = {
		"isSub": true,
		"monthsSubbed": cumulativeMonths || false,
		"subStreak": streakMonths || false,
		"subTier": subTierInfo || false
	};
	
	await userDB.updateSub(user, subInfo);
}

ComfyJS.onSubGift = async (gifterUser, streakMonths, recipientUser, senderCount, subTierInfo, extra) => {

	

	console.log(` SUB LOG (${time()}): ${gifterUser} purchased ${senderCount} tier ${subTierInfo} gift subs for ${recipientUser}, giving them a streak of ${streakMonths}.`);
	
	const subInfo = {
		"subStreak": streakMonths || false,
		"subTier": subTierInfo || false,
		"monthsSubbed": false,
		"senderCount": senderCount,
		"giftedBy": gifterUser
	};

	const subGiftInfo = {
		"senderCount": senderCount,
		"subTier": subTierInfo,
		"giftedTo": recipientUser,
		"giftedBy": senderUser
	};

	await userDB.updateGiftSubs(subGiftInfo);
	await userDB.updateSub(recipientUser, subInfo);
}

ComfyJS.onSubMysteryGift = (gifterUser, numbOfSubs, senderCount, subTierInfo, extra) => {

	

	console.log(` SUB LOG (${time()}): ${gifterUser} mystery purchased ${numbOfSubs} tier ${subTierInfo}. senderCount: ${senderCount}.`);
	//  ComfyJS.Say('A mystery gifter just gifted ' + numbOfSubs + ' subs! Thank you for your tall, dark, and mysterious gifts!');
}

ComfyJS.onGiftSubContinue = (user, sender, extra, userstate) => {

	

	console.dir(userstate);
	console.log(` SUB LOG (${time()}): ${user} continued their sub via a gift sub from ${sender}.`);
	//  ComfyJS.Say(`Thank you for continuing your subscription, @${user}! Be sure to thank @${sender} for the gift! Much love to you both!`);
}

ComfyJS.onRaid = async (user, viewers, extra) => {

	

	console.log(`RAID LOG (${time()}): ${user} raided the channel with ${viewers} in tow.`);
	 ComfyJS.Say(`Incoming raid from @${user} with ${viewers} viewers in tow! Welcome raiders! Please refresh your browsers once you are loaded in. Glad to have you! https://www.twitch.tv/the_random_encounter`);
	raidersArray.push(user);

	await userDB.incRaidCount(user);
	await userDB.updateRaidSize(user, viewers);
}

ComfyJS.onHosted = async (user, viewers, autohost, extra) => {

	

	console.log(`HOST LOG (${time()}): ${user} hosted the channel with ${viewers} viewers. Authost: ${autohost}.`);
	 ComfyJS.Say(`@${user} is hosting the channel with ${viewers} viewers. Thanks for the support, and glad to have you guys!`);
	hostersArray.push(user);

	await userDB.incHostCount(user);
	await userDB.updateHostSize(user, viewers);
}


//
// ---- CUSTOM FUNCTION DEFINITIONS ----
//

function time() {

	const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

	return time;
}

async function cmdExec(user, command, message, flags, extra) {

  let cmd = command;
  var target = '';
  let logType = 'CMD';
  let FPPpayload = '';

	if (cmd[1] == '!') { cmd.substring(1); }
	command = cmd;

	logXmit(`!${cmd} ${message}`, logType, user);
	
  switch (cmd.toLowerCase()) {

		case 'blacklist':
			let blUser = message;
			if (flags.broadcaster || flags.mod) {
				if (blObject.blacklisted.includes(blUser)) {
					console.log(`Failed to added user to blacklist - user '${blUser}' already exists.`);
					 ComfyJS.Say(`Sorry, ${user}, but the user '${blUser}' is already blacklisted!`);
					break;
				} else {
					let blObject = JSON.parse(fs.readFileSync('trackedUsers.json'));
					blObject.blacklisted.push(blUser);
					fs.writeFile('trackedTest.json', JSON.stringify(blObject), err => {
						if (err) throw err;
						console.log(`New blacklisted user entry added (${blUser})`);
					});
					break;
				}
			} else {
				 ComfyJS.Say(`Sorry, ${user}, but you lack the privileges to access this command. Must be channel owner or a moderator.`);
				break;
			}
    case 'command':
    case 'commands':
       ComfyJS.Say(`Completed commands: !hello, !commands, !cheers/!toast, !so/!shoutout, !lurk, !hype/!rage, !kr, !botiq, !madlove, !hug/!kiss/!spank, !hugback/!kissback/!spankback, !doctor, !dice/!rolldice/!diceroll, !tuna/!tune, !whattune/!trackid/!tunename, !banger, !discord, !throwdown, !thrust, !tuesday, !wednesday, !red/!blue/!green/!yellow/!white/!cyan/!pink/!off, !lights, !addjoke/!newjoke, !addcmd, !remcmd, !tip, !adjective, !tokens`);
       ComfyJS.Say(`Commands under development/not fully implemented: !hugback, !removejoke, !bet`);
      break;

    case 'hello':
       ComfyJS.Say(`@${user}, it is good to see you! Hello!`);
      break;

    case 'byebyebot':
      if (flags.broadcaster || user.toLowerCase() == "the_random_encounter") {
         ComfyJS.Say(`Alright, I'm out! Bye Felicia!`);
      await userDB.disconnect();
        ComfyJS.Disconnect();
      } else {
         ComfyJS.Say(`You don't have permission to perform this command!`);
      }
      break;
        
    case 'bss':
    case 'beginstreamsilent':
      if (flags.broadcaster || user.toLowerCase() == "the_random_encounter") {

				clearTimeout(helpTipsGlobalInit);
        helpTipInterval = setInterval(generateTip, 300000); // Random tips every five minutes

        streamActive = true;
				updatedUsersList = [];
				cmdMemArray = [];

        console.log(` CMD LOG (${time()}): Broadcaster began stream timer. Time-delayed events and triggers active.`);

      } else {
         ComfyJS.Say(`You don't have permission to perform this command!`);
      }

      break;

		case 'bs':
    case 'beginstream':
      if (flags.broadcaster || user.toLowerCase() == "the_random_encounter") {

				clearTimeout(helpTipsGlobalInit);
        helpTipInterval = setInterval(generateTip, 300000); // Random tips every five minutes

        streamActive = true;
				updatedUsersList = [];
				cmdMemArray = [];

        console.log(` CMD LOG (${time()}): Broadcaster began stream timer. Time-delayed events and triggers active.`);
         ComfyJS.Say(`Done. Stream timer has begun.`);
        
			} else {
         ComfyJS.Say(`You don't have permission to perform this command!`);
      }

      break;

		case 'b2s':
    case 'begin2ndstream':
      if (flags.broadcaster || user.toLowerCase() == "the_random_encounter") {

				clearTimeout(helpTipsGlobalInit);
        helpTipInterval = setInterval(generateTip, 300000); // Random tips every five minutes

        streamActive = true;
        secondDailyStream = true;
				updatedUsersList = [];
				cmdMemArray = [];

        console.log(` CMD LOG (${time()}): Broadcaster began stream timer. Second stream flagged, time-delayed events and triggers active.`);
         ComfyJS.Say(`Done. Stream timer has begun. Second daily stream registered.`);
      } else {
         ComfyJS.Say(`You don't have permission to perform this command!`);
      }

      break;

    case 'es':
    case 'endstream':
      if (flags.broadcaster || user.toLowerCase() == "the_random_encounter") {

        clearTimeout(raidTrainInit);
        clearInterval(raidTrainInterval);

        clearTimeout(moneyTipInit);
      	clearInterval(moneyTipInterval);

				clearInterval(helpTipInterval);
				helpTipsGlobalInit = setInterval(generateTip, 600000);

        streamActive = false;
				secondDailyStream = false;
				cmdMemArray = [];

        console.log(` CMD LOG (${time()}): Broadcaster ended stream timer. Time-delayed events and triggers disabled.`);
         ComfyJS.Say(`Done. Stream timer ended.`);
      } else {
         ComfyJS.Say(`You don't have permission to perform this command!`);
			}
			
      break;

    case 'ess':
    case 'endstreamsilent':
      if (flags.broadcaster || user.toLowerCase() == "the_random_encounter") {

        clearTimeout(raidTrainInit);
 			  clearInterval(raidTrainInterval);

        clearTimeout(moneyTipInit);
        clearInterval(moneyTipInterval);

        clearInterval(helpTipInterval);

        streamActive = false;
				secondDailyStream = false;
				cmdMemArray = [];

        console.log(` CMD LOG (${time()}): Broadcaster ended stream timer. Time-delayed events and triggers disabled.`);
			} else {
				 ComfyJS.Say(`You don't have permission to perform this command!`);
			}
        break;

    case 'cheers':
		case 'toast':
			target = '';
			if (message == '') {
				 ComfyJS.Say(`@${user} wants to celebrate the good times with a toast! Cheers, ${user}`);
			} else {
				if (message[0] === '@') { target = message.substring(1); } else { target = message; };
				 ComfyJS.Say(`@${user} wants to celebrate the good times with you, @${target}! Cheers!`);
			}
			break;

    case 'so':
  	case 'shoutout':
			target = '';
      if (message[0] === '@') {
        target = message.substring(1);
      } else {
        target = message;
			}
			
			if (flags.broadcaster || flags.mod || flags.vip || flags.founder) {
				 ComfyJS.Say(`/announce @${user} wants to give a mad shoutout to the amazing @${target}! It takes less than ten seconds to click the link and follow their profile, and they deserve the recognition! https://www.twitch.tv/${target}/`);
			} else {
				 ComfyJS.Say(`Sorry, @${user}, but you need to be a broadcaster, moderator, VIP, or Founder to use this command.`);
			}
      break;

    case 'lurk':
       ComfyJS.Say(`@${user} has decided they have something better to do, receding into the shadows. Catch you later, wallflower!`);
      break;

    case 'hype':
    case 'rage':
			 ComfyJS.Say(`djbriskParty djbriskBass djbriskParty djbriskBass djbriskParty djbriskBass djbriskParty djbriskBass djbriskParty djbriskBass djbriskParty djbriskBass djbriskParty djbriskBass djBriskParty djbriskBass djbriskParty djbriskBass djbriskParty djbriskBass djbriskParty djbriskBass djbriskParty djbriskBass djBriskParty djbriskBass djbriskParty djbriskBass djbriskParty	djbriskBass djbriskParty djbriskBass djbriskParty djbriskBass	djbriskParty djbriskBass djbriskParty djbriskBass djbriskParty`);
      break;

    case 'kr':
    case 'knightsradiant':
    case 'stormlight':
			 ComfyJS.Say(`The hallowed oaths must again be spoken. Life before death. 
			Strength before weakness. Journey before destination. The Knights Radiant
			must stand again! @${user} must be a huge Cosmere nerd!`
			);
      break;

    case 'botiq':
			 ComfyJS.Say(`I know you don't think I'm very smart, @${user}. It's okay, 
			I know I ride the short bus everyday. I've come to terms with it.`
			);
      break;

    case 'madlove':
			 ComfyJS.Say(`AsexualPride boredrAversMadLove BisexualPride boredrAversMadLove GayPride boredrAversMadLove GenderFluidPride boredrAversMadLove IntersexPride boredrAversMadLove LesbianPride boredrAversMadLove NonbinaryPride boredrAversMadLove PansexualPride boredrAversMadLove TransgenderPride boredrAversMadLove`);
      break;

    case 'userdebug':
      if (flags.broadcaster || user.toLowerCase() == "the_random_encounter") {
				 ComfyJS.Say(`Performing user debug action. Check console logs for 
				further information.`
				);
        console.log(currentUsersList);
      } else if (!flags.broadcaster || user == 'KaytoPotato' || user == "The_Random_Encounter") {
				 ComfyJS.Say(`Access denied. This command is reserved for the channel broadcaster only.`);
				console.log(` CMD LOG (${time()}): User '${user}' attempted to access user debug list. Access denied.`);
      }
			break;
		
		case 'usrdbg':
		case 'usd':
			if (flags.broadcaster || user.toLowerCase() == "the_random_encounter") {
				console.log(`Current Users List (array 'currentUsersList'):`);
				console.dir(currentUsersList);
			} else {
				 ComfyJS.Say(`Access denied. This command is reserved for the channel broadcaster only.`);
				console.log(` CMD LOG (${time()}): User '${user}' attempted to access user debug list. Access denied.`);
			}
			break;
		
    case 'updatelistdebug':
      if (flags.broadcaster || user.toLowerCase() == "the_random_encounter") {
				 ComfyJS.Say(`Performing updated user list debug action. Check console 
				logs for further information.`
				);
        console.log(updatedUsersList);
      } else if (!flags.broadcaster || user == 'KaytoPotato' || user == "The_Random_Encounter") {
         ComfyJS.Say(`Access denied. You are not the broadcaster of this channel. Sorry, mate.`);
        console.log(` CMD LOG (${time()}): User '${user}' attempted to access user debug list. Access denied.`);
      }
			break;
		
		case 'uldbg':
		case 'updlstdbg':
		case 'uld':
			if (flags.broadcaster || user.toLowerCase() == "the_random_encounter") {

        console.log(updatedUsersList);
      } else {
         ComfyJS.Say(`Access denied. You are not the broadcaster of this channel. Sorry, mate.`);
        console.log(` CMD LOG (${time()}): User '${user}' attempted to access user debug list. Access denied.`);
      }
      break;
			
    case 'doctor':
       ComfyJS.Say(`Ah, @${user}, sounds like you need a doctor? Well, @doctorknight is the best I can offer. If it helps, he's my master's dad, so I can probably get you a good deal on some back alley surgery...`);
      break;

    case 'discord':
       ComfyJS.Say(`Join the Random discord and be a part of our growing community! https://discord.gg/2HyaWdpGGT`)
      break;

    case 'thrust':
      target = '';
      if (message[0] === '@') {
        target = message.substring(1);
      } else {
        target = message;
      }

       ComfyJS.Say(`@${target} is a member of the raid train crew Thrust Tuesday, streaming every Tuesday from 9:00AM PST/12:00PM EST/4:00PM GMT until 12:00AM PST/3:00AM EST/7:00AM GMT, or even later. Catch them at https://www.twitch.tv/${target} and The Throwdown's Linktree https://linktr.ee/ThrustTuesdays`);
      break;

    case 'tuesday':
       ComfyJS.Say(`Every Tuesday, @the_random_encounter is getting thrusty with the rest of the Thrust Tuesday crew. Catch him from 11:00PM PST/2:00AM EST/6:00AM GMT till he feels like closing it out. For the rest, check out the linktree link for all the information on line-ups and other cool stuff you could want! https://linktr.ee/ThrustTuesdays`);
      break;

    case 'omfg':
    case 'wednesday':
       ComfyJS.Say(`Every Wednesday, @the_random_encounter is waging war against hardcore! Catch him for an hour at 7:00PM-8:00PM PST/10:00PM-11:00PM EST/2:00AM-3:00AM GMT. For the rest, check out the linktree link for all the information on line-ups and other cool stuff you could want! https://linktr.ee/omfgweekly`);
      break;

    case 'omfglinktree':
       ComfyJS.Say(`OMFG Weekly Linktree: https://linktr.ee/omfgweekly`);
      break;

    case 'adjective':
			
			const adj = await userDB.getAdjective(user);		
			
			 ComfyJS.Say(`${user}, the adjective that best describes you is definitely '${adj}'!`);
			
      break;

    case 'checktokens':
    case 'tokens':
			let amt = await userDB.getTokens(user);
			 ComfyJS.Say(`@${user}, you currently have a total of '${amt}' tokens available.`);
      break;

    case 'dice':
    case 'rolldice':
		case 'diceroll':

			let [diceAmt, diceSize] = message.split(" ");

			if (diceAmt == '' || diceSize == '') {
				 ComfyJS.Say(`You must specify 1-10 dice and what kind of dice to roll (think D&D), ${user}. Try !dice 5 20 to roll 5 d20, for example.`);
				break;
			}

			diceSize = diceSize.replace(/\D/g, '');

			diceAmt = Number.parseInt(diceAmt, 10);
			diceSize = Number.parseInt(diceSize, 10);

			let rollResult = 0;
			let perDieResult = [];
			let diceAmtAsWord = ``;
			let failMessage = ``;
			let failMessage2 = ``;
			let failState = false;
			let failState2 = false;

			if (diceAmt == 0) {
				failMessage = `You cannot roll zero dice, @${user}.`;
				failState = true;
			} else if (diceAmt > 10) {
				failMessage = `You cannot roll more than ten dice, @${user}.`;
				failState = true;
			}

			if (diceSize == 3 || diceSize == 4 || diceSize == 6 || diceSize == 8 || diceSize == 10 || diceSize == 12 || diceSize == 20 || diceSize == 100) {
			} else {
				failMessage2 = `You must enter a standard number of sides for the dice. Accepted values are 3, 4, 6, 8, 10, 12, 20, or 100. Think D&D!.`;
				failState2 = true;
			}

			if (failState && failState2) { failMessage = failMessage + ` AND ALSO, `; }

			if (failState || failState2) {
				 ComfyJS.Say(`${failMessage}${failMessage2}`);
				break;
			} else {
				diceResults = diceRoll(diceAmt, diceSize);
				rollResult = diceResults[0];
				perDieResult = diceResults[1];
			}

			let lastDieRoll = perDieResult[perDieResult.length - 1];
			perDieResult.pop();
			let perDieResultAsString = perDieResult.join(', ');

			switch (Number.parseInt(diceAmt, 10)) {
				case 1:
					diceAmtAsWord = `one`;
					break;
				case 2:
					diceAmtAsWord = `two`;
					break;
				case 3:
					diceAmtAsWord = `three`;
					break;
				case 4:
					diceAmtAsWord = `four`;
					break;
				case 5:
					diceAmtAsWord = `five`;
					break;
				case 6:
					diceAmtAsWord = `six`;
					break;
				case 7:
					diceAmtAsWord = `seven`;
					break;
				case 8:
					diceAmtAsWord = `eight`;
					break;
				case 9:
					diceAmtAsWord = `nine`;
					break;
				case 10:
					diceAmtAsWord = `ten`;
					break;
				default:
					diceAmtAsWord = `unknown`;
					break;
			}

			if (diceAmt == 1) {
				 ComfyJS.Say(`@${user} rolled a single ${diceSize}-sided die. The result was ${rollResult}!`);
				break;
			} else if (diceAmt > 1) {
				 ComfyJS.Say(`@${user} rolled ${diceAmtAsWord} ${diceSize}-sided dice. The results were ${perDieResultAsString}, and ${lastDieRoll} for a total of ${rollResult}!`);
				break;
			} else {
				 ComfyJS.Say(`Something weird happened in my brain. The dice roll failed. Sorry, boss. Try again?`);
				break;
			}
			break;

    case 'banger':
       ComfyJS.Say(`@${user} thinks the current tune is a right royal banger! RAGE!!!`);
      break;

    case 'tuna':
    case 'tune':
       ComfyJS.Say(`@${user} is loving this helping of tuna. Maybe they want to hear more like it?`);
      break;

    case 'whattune':
    case 'trackname':
    case 'trackid':
    case 'tunename':
       ComfyJS.Say(`Hey, @the_random_encounter, your biggest fan, @${user}, wants to know the name of this track. Whoever knows, help 'em out!`);
      break;

    case 'hug':
      target = '';
      if (message[0] === '@') {
        target = message.substring(1);
      } else {
        target = message;
      }

       ComfyJS.Say(`@${user} runs over and gives @${target} a giant bear hug! FEEL THE LOVE!`);

			cmdMemArray.push(target);
			cmdMemArray.push('hug');
			cmdMemArray.push(user);		
      break;

    case 'hugback':
      
			var success = false;
			
			for (var i = 0; i < cmdMemArray.length; i + 3) {
				if (cmdMemArray[i] == user && cmdMemArray[i + 1] == 'hug') {
					let cmdTarget = cmdMemArray[i + 2];
					 ComfyJS.Say(`@${user} gives @${cmdTarget} a hug back that rivals the ferocity of ${cmdTarget}'s original monster hug! OOF!`);
					cmdMemArray.splice(i, 3);
					success = true;
					break;
				}
			}

			if (!success) {
				 ComfyJS.Say(`Sorry, @${user}, but it doesn't appear that anyone has given you a hug lately.`);
			}
			
			break;

    case 'kiss':
      target = '';
      if (message[0] === '@') {
        target = message.substring(1);
      } else {
        target = message;
      }

			 ComfyJS.Say(`@${user} plants a big fat kiss right on @${target} 's lips! So much love in the air!`);
			
			cmdMemArray.push(target);
			cmdMemArray.push('kiss');
			cmdMemArray.push(user);
      break;

		case 'kissback':

			var arrayTargetIndex = 0;
			var success = false;
			
			for (var i = 0; i < cmdMemArray.length; i + 3) {
				if (cmdMemArray[arrayTargetIndex] == user && cmdMemArray[arrayTargetIndex + 1] == 'kiss') {
					let cmdTarget = cmdMemArray[arrayTargetIndex + 2];
					 ComfyJS.Say(`@${user} gives @${cmdTarget} a return smooch that might make one's knees shake. Nice.`);
					cmdMemArray.splice(arrayTargetIndex, 3);
					success = true;
					break;
				}
			}

			if (!success) {
				 ComfyJS.Say(`Sorry, @${user}, but it doesn't appear that anyone has given you a kiss lately.`);
			}

			break;
		
    case 'spank':
      target = '';
			if (message[0] === '@') { target = message.substring(1); }
			else { target = message; }

			 ComfyJS.Say(`@${user} bends @${target} over their knee and gives them a good spanking! How risque!`);
			
			cmdMemArray.push(target);
			cmdMemArray.push('spank');
			cmdMemArray.push(user);
      break;

		case 'spankback':
			var arrayTargetIndex = 0;
			var success = false;

			for (var i = 0; i < cmdMemArray.length; i + 3) {
				if (cmdMemArray[arrayTargetIndex] == user && cmdMemArray[arrayTargetIndex + 1] == 'spank') {
					let cmdTarget = cmdMemArray[arrayTargetIndex + 2];
					 ComfyJS.Say(`@${user} grabs @${cmdTarget} and lays them over their knee, returning the spanking they got with thunderous peals. Was that naughty, or nice?`);
					cmdMemArray.splice(arrayTargetIndex, 3);
					success = true;
					break;
				}
			}

			if (!success) {
				 ComfyJS.Say(`Sorry, @${user}, but it doesn't appear that anyone has given you a good spanking lately.`);
			}

			break;
		
		case 'dance':

			if (message.length == 0) {
				ComfyJS.Say(`${user} takes a moment to express themselves through primal dance, moving across the floor like a cross between a swan and a quadraplegic.`);
			} else {
				target = (message[0] === '@') ? message.substring(1) : message;
				ComfyJS.Say(`${user} grabs ${target} and carries them across the room in a bizarre dance. Isn't nature beautiful?`);
			}
			break;
		
		case 'sing':
			
			if (message.length == 0) {
				ComfyJS.Say(`SingsMic SingsNote SingsMic SingsNote ${user} belts out the lyrics to the current song! SingsMic SingsNote SingsMic SingsNote`);	
			} else {
				target = (message[0] === '@') ? message.substring(1) : message;
				ComfyJS.Say(`SingsMic SingsNote SingsMic SingsNote ${user} grabs ${target} and pulls them into a beautiful duet! SingsMic SingsNote SingsMic SingsNote`);
			}
			break;
		
		case 'plur':
			 ComfyJS.Say(`.o0×X×0o. ρέα𝐜𝐄 ㄥ𝔬𝓋ε 𝐮𝔫ⓘŦч ⓡєsＰ乇ς𝔱 .o0×X×0o.`);
			 ComfyJS.Say(`Test`);
			break;
	
		case 'betroulette':

			if (rouletteSpinFlag == false) {
				rouletteSpinFlag = true;
				setTimeout(rouletteSpin, 300000);
			}

			let [rparam1, rparam2] = message.split(" ");
			let rouletteBet, rouletteTarget;
			if (isNaN(rparam1)) {
				if (rparam1.indexOf("%") != -1) {
					rouletteTarget = rparam1;
					rouletteBet = rparam2;
				}
			} else {
				rouletteTarget = rparam2;
				rouletteBet = rparam1;
			}

			rouletteBet = rouletteBet.replace('%', '');
			if (rouletteTarget != 'even' || rouletteTarget != 'odd' || rouletteTarget != 'red' || rouletteTarget != 'black' || rouletteTarget != '1st12' || rouletteTarget != '2nd12' || rouletteTarget != '3rd12' || rouletteTarget != '1to18' || rouletteTarget != '19to36' || rouletteTarget > 36) {
				ComfyJS.Say(`Sorry, ${user}. Your bet was rejected for an invalid bet target. You can bet on: even, odd, red, black, 1to12, 19to36, 1st12, 2nd12, 3rd12, or on a single number from 0 to 36.`);
				console.log(` BET DEBUG: User '${user}' tried to place a bet which was rejected for an invalid bet target of ${rouletteTarget}.`);
			} else if (rouletteTarget == '00') {
				ComfyJS.Say(`Sorry, ${user}, but you cannot bet on double zero. You can bet on: even, odd, red, black, 1to12, 19to36, 1st12, 2nd12, 3rd12, or on a single number from 0 to 36.`);
				console.log(` BET  DEBUG: User '${user}' tried to place an invalid bet on double zero. Bet was rejected.`);
			}
			const userTokenAmt = await userDB.getTokens(user);
			const rouletteBetAmt = userTokenAmt * (rouletteBet / 100);
			if (rouletteBetAmt <= 0) {
				ComfyJS.Say(`Sorry, ${user}, but you don't have enough tokens to bet with.`);
				console.log(` BET DEBUG: User '${user}' placed a bet which was rejected for not having enough tokens. They have ${userTokenAmt} tokens.`);
			}

			ComfyJS.Say(`Thank you for your bet, ${user}. It has been taken down for the next spin of the wheel. Good luck!`);
			console.log(` BET DEBUG: User '${user}' has placed a bet of ${rouletteBet}% of their tokens, totalling ${rouletteBetAmt}, on ${rouletteTarget}`)

			const rouletteBetObject = {
				"user": user,
				"bet": rouletteBetAmt
			};

			rouletteBetArray.push(rouletteBetObject);

			break;
    case 'bet': 

			let [gameType, betAmt] = message.split(" ");
			
			if (betAmt.indexOf("%") != -1) {
				const userTokens = await userDB.getTokens(user);
				let betPercent = Number(betAmt.substr(0, betAmt.indexOf("%")));
				betAmt = userTokens / betPercent;
			}

      let debugTokens = 100000;
      let payout;

      if (gameType == '' || betAmt == '') {
         ComfyJS.Say(`You need to specify a game type first, followed by your bet amount. Type !games for a list of playable games.`);
        break;
      }

      let userAvailableTokens = 0;

      if (userAvailableTokens < betAmt) {
         ComfyJS.Say(`Not enough tokens available to bet, ${user}. Try a lesser amount, and !checktokens to see how many you have.`);
				break;
      }

      switch (gameType) {
        case 'dice':

          let diceRoll = Math.floor(Math.random() * 6) + 1;

          if (diceRoll == 7) {
            let winnings = betAmt * 2;
            debugTokens = debugTokens + winnings;
             ComfyJS.Say(`The die came up '${diceRoll}'! You win! Your bet was '${betAmt}, total winnings are '${winnings}!`);
            break;
          } else {
             ComfyJS.Say(`The die came up '${diceRoll}'! You had to roll a 7 to win. Better luck next time! Your bet of '${betAmt} has been deducted from your tokens.`);
            debugTokens = debugTokens - betAmt;
            break;
          }
        case 'slots':

          const symbolList = [
            'VirtualHug',
            'SingsMic',
            'SingsNote',
            'TwitchUnity',
            'StinkyCheese',
            'MrDestructoid',
            'PJSalt',
            'duDudu',
            'KAPOW',
            'PopCorn'
          ]

          const rollOutcome = randInt(1, 9);

          if (rollOutcome > 4) {
            let listSize = symbolList.length;
            let arrayLoc = Math.floor(Math.random() * listSize);

            let chosenSymbol = symbolList[arrayLoc];
            let betModifier = arrayLoc * 1.25;

            payout = betAmt * betModifier;

             ComfyJS.Say(`Your spin: ${chosenSymbol} ${chosenSymbol} ${chosenSymbol} - WINNER! Bet modifier of result: ${betModifier} - Payout: ${payout} tokens!`);
          await userDB.updateTokens(user, payout);
          } else {

          }
          break;

				case 'roulette':
					
					if (routletteUpcoming == false) {
						rouletteUpcoming = true;
					}
					rouletteBetArray.push(user, betAmt);

          break;

        default:
          break;
      }
f
    	break;

		case 'betdev':
			
			let [param1, param2] = message.split(' ');
			let betAmount, betType, payoutRatio, betObj;

			if (isNaN(param1) && param1.indexOf('%') != -1) { // Param1 is NaN & has % sign
				let betPercent = param1.substring(0, param1.indexOf('%'));
				const userTokens = await userDB.getTokens(user);
				betAmount = userTokens / betPercent;
				betType = param2;
			} else if (isNaN(param2) && param2.indexOf('%') != -1) { // Param2 is not a number & has % sign
				let betPercent = param2.substring(0, param2.indexOf('%'));
				const userTokens = await userDB.getTokens(user);
				betAmount = userTokens / betPercent;
				betType = param1;
			} else if (isNumeric(param1)) { // Param1 is numeric
				betAmount = param1;
				betType = param2;
			} else if (isNumeric(param2)) { // Param2 is numeric
				betAmount = param2;
				betType = param1;
			}
			
			if (isNumeric(betAmount)) {
				switch (betType) {
					case '1stcol':
						payoutRatio = 2;
						betObj = {
							"user": user,
							"betType": betType,
							"payoutRatio": payoutRatio,
							"betAmount": betAmount
						}
						rouletteBetArray.push(betObj);
						break;
					case '2ndcol':
						payoutRatio = 2;
						betObj = {
							"user": user,
							"betType": betType,
							"payoutRatio": payoutRatio,
							"betAmount": betAmount
						};
						rouletteBetArray.push(betObj);
						break;
					case '3rdcol':
						payoutRatio = 2;
						betObj = {
							"user": user,
							"betType": betType,
							"payoutRatio": payoutRatio,
							"betAmount": betAmount
						};
						rouletteBetArray.push(betObj);
						break;
					case '1stdozen':
						payoutRatio = 2;
						betObj = {
							"user": user,
							"betType": betType,
							"payoutRatio": payoutRatio,
							"betAmount": betAmount
						}
						rouletteBetArray.push(betObj);
						break;
					case '2nddozen':
						payoutRatio = 2;
						betObj = {
							"user": user,
							"betType": betType,
							"payoutRatio": payoutRatio,
							"betAmount": betAmount
						}
						rouletteBetArray.push(betObj);
						break;
					case '3rddozen':
						payoutRatio = 2;
						betObj = {
							"user": user,
							"betType": betType,
							"payoutRatio": payoutRatio,
							"betAmount": betAmount
						}
						rouletteBetArray.push(betObj);
						break;
					case 'odd':
						payoutRatio = 1;
						betObj = {
							"user": user,
							"betType": betType,
							"payoutRatio": payoutRatio,
							"betAmount": betAmount
						}
						rouletteBetArray.push(betObj);
						break;
					case 'even':
						payoutRatio = 1;
						betObj = {
							"user": user,
							"betType": betType,
							"payoutRatio": payoutRatio,
							"betAmount": betAmount
						}
						rouletteBetArray.push(betObj);
						break;
					case 'red':
						payoutRatio = 1;
						betObj = {
							"user": user,
							"betType": betType,
							"payoutRatio": payoutRatio,
							"betAmount": betAmount
						}
						rouletteBetArray.push(betObj);
						break;
					case 'black':
						payoutRatio = 1;
						betObj = {
							"user": user,
							"betType": betType,
							"payoutRatio": payoutRatio,
							"betAmount": betAmount
						}
						rouletteBetArray.push(betObj);
						break;
					case '1-18':
						payoutRatio = 1;
						betObj = {
							"user": user,
							"betType": betType,
							"payoutRatio": payoutRatio,
							"betAmount": betAmount
						}
						rouletteBetArray.push(betObj);
						break;
					case '19-36':
						payoutRatio = 1;
						betObj = {
							"user": user,
							"betType": betType,
							"payoutRatio": payoutRatio,
							"betAmount": betAmount
						}
						rouletteBetArray.push(betObj);
						break;
					default:
						if (isNumeric(betType)) {
							payoutRatio = 35;
							betObj = {
								"user": user,
								"betType": betType,
								"payoutRatio": payoutRatio,
								"betAmount": betAmount
							}
							rouletteBetArray.push(betObj);
							break;
						} else {
							 ComfyJS.Say(`No bet registered. Try again, ${user}.`);
							break;
						}
						
				}
			}
			break;
			
    case 'tip':

       ComfyJS.Say(`Consider supporting the stream! Subscriptions, bits, or even direct tips are immensely helpful, and go towards new music, new gear, or other stream/studio-related items. Tip directly at https://streamelements.com/the_random_encounter/tip`);
      break;

    case 'addcmd':
    case 'addcommand':

      var index 		= message.indexOf(" ");  // Gets the first index where a space occours
      var newCmd 		= message.substr(0, index); // Gets the first part
      var cmdSyntax = message.substr(index + 1);  // Gets the text part
			var adminLvl;

			while (typeof adminLvl == 'undefined') {
				if (flags.broadcaster == true) {
					adminLvl = 5;
					break;
				}
				if (flags.mod == true) {
					adminLvl = 4;
					break;
				}
				if (flags.founder == true) {
					adminLvl = 3;
					break;
				}
				if (flags.vip == true) {
					adminLvl = 2;
					break;
				}
				if (flags.subscriber == true) {
					adminLvl = 1;
					break;
				}
				adminLvl = 0;
			}

      if (newCmd.charAt(0) == '!') { newCmd = newCmd.substr(1, newCmd.length); }

			let cmdDataObj = {
				"command": newCmd,
				"syntax": cmdSyntax,
				"creator": user,
				"modLvl": adminLvl
			};
            
			const addFlag = await userDB.addCmd(cmdDataObj);

			if (addFlag) {
				 ComfyJS.Say(`Successfully added command '!${newCmd}', courtesy of ${user}!`);
			} else {
				 ComfyJS.Say(`Failed to add command '!${newCmd}, ${user}. It probably exists already.`);
			}
      break;

    case 'remcmd':
    case 'removecommand':
    case 'remcommand':
    case 'removecmd':

			var adminLvl = 0;

			if (flags.subscriber == true)	{ adminLvl = 1; }
			if (flags.vip == true)					{ adminLvl = 2; }
      if (flags.founder == true) 		{ adminLvl = 3; }
			if (flags.mod == true) 	{ adminLvl = 4; }
			if (flags.broadcaster == true)	{ adminLvl = 5; }  

			if (message.charAt(0) == '!') { message = message.substr(1, message.length); }

			await userDB.removeCmd(message, user, adminLvl);
		
      break;

		case 'joke':

			break;
		
		case 'dadjoke':

			break;
		
		case 'riddle':

			break;
		
		case 'pun':

			break;
		
		case 'addjoke':

			const genericJoke = {
				"jokeData": message,
				"jokeType": "Generic",
				"username": user
			};
			var addJokeSuccess = await userDB.addJoke(genericJoke);

			if (addJokeSuccess) {
				const jokeCount = await userDB.getJokesCreated(user);
				ComfyJS.Say(`Your joke has been successfully added, @${user}! You've now created a total of ${jokeCount} jokes!`)
			} else {
				ComfyJS.Say(`Sorry, ${user}, but there was some unexpected error when adding your command. Try again later.`);
			}
			break;
		
		case 'adddadjoke':

			const dadJoke = {
				"jokeData": message,
				"jokeType": "Dad",
				"username": user
			};
			var addJokeSuccess = await userDB.addJoke(dadJoke);

			if (addJokeSuccess) {
				const jokeCount = await userDB.getJokesCreated(user);
				ComfyJS.Say(`Your joke has been successfully added, @${user}! You've now created a total of ${jokeCount} jokes!`)
			} else {
				ComfyJS.Say(`Sorry, ${user}, but there was some unexpected error when adding your command. Try again later.`);
			}
			break;
		
		case 'addriddle':

			const riddleJoke = {
				"jokeData": message,
				"jokeType": "Riddle",
				"username": user
			};
			var addJokeSuccess = await userDB.addJoke(riddleJoke);

			if (addJokeSuccess) {
				const jokeCount = await userDB.getJokesCreated(user);
				ComfyJS.Say(`Your joke has been successfully added, @${user}! You've now created a total of ${jokeCount} jokes!`)
			} else {
				ComfyJS.Say(`Sorry, ${user}, but there was some unexpected error when adding your command. Try again later.`);
			}
			break;
		
		case 'addpun':

			const punJoke = {
				"jokeData": message,
				"jokeType": "Pun",
				"username": user
			};
			var addJokeSuccess = await userDB.addJoke(punJoke);

			if (addJokeSuccess) {
				const jokeCount = await userDB.getJokesCreated(user);
				ComfyJS.Say(`Your joke has been successfully added, @${user}! You've now created a total of ${jokeCount} jokes!`)
			} else {
				ComfyJS.Say(`Sorry, ${user}, but there was some unexpected error when adding your command. Try again later.`);
			}
			break;
		
		case 'removejoke':
		case 'remjoke':

			break;
		
		case 'cmdtester':
				          
			//let sqlIndex = message.indexOf("|");  // Gets the first index where a space occours
			//let paramIndex = message.indexOf(",");  // Gets the first index where a space occours
      //let sqlQuery = message.substr(0, index); // Gets the first part
			//let sqlParams = message.substr(index + 1);  // Gets the text part
				
			//sqlParams = sqlParams.split(",");
			await userDB.sqlTest(sqlQuery, sqlParams);
			break;

		case 'lights':

			if (message.length <= 2) {
				 ComfyJS.Say(`Acceptable parameters are: red, green, blue, yellow, cyan, pink, white, strobe1, strobe2, pattern1, pattern2, and off! (e.g.: !lights strobe2)`);
				break;
			}
			switch (message) {
				case 'blue':
            
					FPPpayload = 'http://192.168.1.123/api/playlist/blue/start';
					needle('get', FPPpayload)
						.then((resp) => {
							ComfyJS.Say(`Changing the lights to ${message}!`);
							console.log(` CMD LOG (${time()}): User '${user}' changed the lighting color to '${message}'. Response: ${resp.body}`);
						})
						.catch((err) => {
							ComfyJS.Say(`Something went wrong, ${user}... Not sure what. Try again?`);
							console.error(` CMD LOG (${time()}): Error occurred when user '${user} issued command '${message}'. Error: ${err}`);
						})
					break;
				case 'red':
					FPPpayload = 'http://192.168.1.123/api/playlist/red/start';
					needle('get', FPPpayload)
						.then((resp) => {
							ComfyJS.Say(`Changing the lights to ${message}!`);
							console.log(` CMD LOG (${time()}): User '${user}' changed the lighting color to '${message}'. Response: ${resp.body}`);
						})
						.catch((err) => {
							ComfyJS.Say(`Something went wrong, ${user}... Not sure what. Try again?`);
							console.error(` CMD LOG (${time()}): Error occurred when user '${user} issued command '${message}'. Error: ${err}`);
						})
					break;
				case 'green':

					FPPpayload = 'http://192.168.1.123/api/playlist/green/start';
					needle('get', FPPpayload)
						.then((resp) => {
							ComfyJS.Say(`Changing the lights to ${message}!`);
							console.log(` CMD LOG (${time()}): User '${user}' changed the lighting color to '${message}'. Response: ${resp.body}`);
						})
						.catch((err) => {
							ComfyJS.Say(`Something went wrong, ${user}... Not sure what. Try again?`);
							console.error(` CMD LOG (${time()}): Error occurred when user '${user} issued command '${message}'. Error: ${err}`);
						})
					break;
				case 'yellow':

					FPPpayload = 'http://192.168.1.123/api/playlist/yellow/start';
					needle('get', FPPpayload)
						.then((resp) => {
							ComfyJS.Say(`Changing the lights to ${message}!`);
							console.log(` CMD LOG (${time()}): User '${user}' changed the lighting color to '${message}'. Response: ${resp.body}`);
						})
						.catch((err) => {
							ComfyJS.Say(`Something went wrong, ${user}... Not sure what. Try again?`);
							console.error(` CMD LOG (${time()}): Error occurred when user '${user} issued command '${message}'. Error: ${err}`);
						})
					break;
				case 'white':

					FPPpayload = 'http://192.168.1.123/api/playlist/white/start';
					needle('get', FPPpayload)
						.then((resp) => {
							ComfyJS.Say(`Changing the lights to ${message}!`);
							console.log(` CMD LOG (${time()}): User '${user}' changed the lighting color to '${message}'. Response: ${resp.body}`);
						})
						.catch((err) => {
							ComfyJS.Say(`Something went wrong, ${user}... Not sure what. Try again?`);
							console.error(` CMD LOG (${time()}): Error occurred when user '${user} issued command '${message}'. Error: ${err}`);
						})
					break;
				case 'cyan':

					FPPpayload = 'http://192.168.1.123/api/playlist/cyan/start';
					needle('get', FPPpayload)
						.then((resp) => {
							ComfyJS.Say(`Changing the lights to ${message}!`);
							console.log(` CMD LOG (${time()}): User '${user}' changed the lighting color to '${message}'. Response: ${resp.body}`);
						})
						.catch((err) => {
							ComfyJS.Say(`Something went wrong, ${user}... Not sure what. Try again?`);
							console.error(` CMD LOG (${time()}): Error occurred when user '${user} issued command '${message}'. Error: ${err}`);
						})
					break;
				case 'pink':

					FPPpayload = 'http://192.168.1.123/api/playlist/pink/start';
					needle('get', FPPpayload)
						.then((resp) => {
							ComfyJS.Say(`Changing the lights to ${message}!`);
							console.log(` CMD LOG (${time()}): User '${user}' changed the lighting color to '${message}'. Response: ${resp.body}`);
						})
						.catch((err) => {
							ComfyJS.Say(`Something went wrong, ${user}... Not sure what. Try again?`);
							console.error(` CMD LOG (${time()}): Error occurred when user '${user} issued command '${message}'. Error: ${err}`);
						})
					break;
				case 'black':
				case 'off':

					FPPpayload = 'http://192.168.1.123/api/playlist/off/start';
					needle('get', FPPpayload)
						.then((resp) => {
							ComfyJS.Say(`Changing the lights to ${message}!`);
							console.log(` CMD LOG (${time()}): User '${user}' changed the lighting color to '${message}'. Response: ${resp.body}`);
						})
						.catch((err) => {
							ComfyJS.Say(`Something went wrong, ${user}... Not sure what. Try again?`);
							console.error(` CMD LOG (${time()}): Error occurred when user '${user} issued command '${message}'. Error: ${err}`);
						})
					break;
				case 'strobe1':
				case 'strobe':
				case 'strobewhite':

					FPPpayload = 'http://192.168.1.123/api/playlist/white_strobe/start';
					needle('get', FPPpayload)
						.then((resp) => {
							ComfyJS.Say(`Changing the lights to white strobes!`);
							console.log(` CMD LOG (${time()}): User '${user}' changed the lighting color to '${message}'. Response: ${resp.body}`);
						})
						.catch((err) => {
							ComfyJS.Say(`Something went wrong, ${user}... Not sure what. Try again?`);
							console.error(` CMD LOG (${time()}): Error occurred when user '${user} issued command '${message}'. Error: ${err}`);
						})
					break;
				case 'strobe2':
				case 'strobergb':
				case 'rgbstrobe':
					FPPpayload = 'http://192.168.1.123/api/playlist/rgb_strobe/start';
					needle('get', FPPpayload)
						.then((resp) => {
							ComfyJS.Say(`Changing the lights to RGB strobes!`);
							console.log(` CMD LOG (${time()}): User '${user}' changed the lighting color to '${message}'. Response: ${resp.body}`);
						})
						.catch((err) => {
							ComfyJS.Say(`Something went wrong, ${user}... Not sure what. Try again?`);
							console.error(` CMD LOG (${time()}): Error occurred when user '${user} issued command '${message}'. Error: ${err}`);
						})
					break;
				case 'colorwash':
				case 'pattern1':

					FPPpayload = 'http://192.168.1.123/api/playlist/color_wash/start';
					needle('get', FPPpayload)
						.then((resp) => {
							ComfyJS.Say(`Changing the lights to RGB color wash!`);
							console.log(` CMD LOG (${time()}): User '${user}' changed the lighting color to '${message}'. Response: ${resp.body}`);
						})
						.catch((err) => {
							ComfyJS.Say(`Something went wrong, ${user}... Not sure what. Try again?`);
							console.error(` CMD LOG (${time()}): Error occurred when user '${user} issued command '${message}'. Error: ${err}`);
						})
					break;
				case 'colortrack':
				case 'pattern2':
					
					FPPpayload = 'http://192.168.1.123/api/playlist/color_track/start';
					needle('get', FPPpayload)
						.then((resp) => {
							ComfyJS.Say(`Changing the lights to RGB bars!`);
							console.log(` CMD LOG (${time()}): User '${user}' changed the lighting color to '${message}'. Response: ${resp.body}`);
						})
						.catch((err) => {
							ComfyJS.Say(`Something went wrong, ${user}... Not sure what. Try again?`);
							console.error(` CMD LOG (${time()}): Error occurred when user '${user} issued command '${message}'. Error: ${err}`);
						})
					break;
				default:
					ComfyJS.Say(`Unrecognized pattern, ${user}! Acceptable parameters are: red, green, blue, yellow, cyan, pink, white, strobe1, strobe2, pattern1, pattern2, and off!`);
					break;
			}
			break;
				
		
		case 'randomgif':

			const gifsRaveDirLength = fs.readdirSync('./gifs/rave').length;
							
			const raveGIFs = fs.readdirSync('./gifs/rave', function (error, files) {
				//let totalFiles = files.length; // return the number of files
				console.log(`Read in files in './gifs/rave/'... Total num: ${totalFiles}`); // print the total number of files 
				return files;
			});
			
			let randomGIF = (Number(Math.floor(Math.random() * gifsRaveDirLength).toFixed()));
			const chosenGIFPath = '/gifs/rave/' + raveGIFs[randomGIF];
			const filename = path.resolve('.' + chosenGIFPath);
			console.log(chosenGIFPath);
			console.log(filename);

			overlayIO.emit("GIF", filename);
		
			break;
		
		case 'testsetrecord':

			const randValue = Math.floor(Math.random() * 100);

			ComfyJS.Say(`Performing a test of Set Record function on stat '${message}' with value '${randValue}' and holder 'TESTER'...`)
			
			const testReturn = await userDB.testSetRecord(message, randValue, 'TESTER');

			ComfyJS.Say(`Function test returned ${testReturn}!`);
			
			break;
		
		case 'testgetrecord':

			ComfyJS.Say(`Performing a test of Get Record function on stat '${message}'...`);

			const returnArray = await userDB.testGetRecord(message);

			if (returnArray) {
				ComfyJS.Say(`Function test returned value '${returnArray[0]}', holder '${returnArray[1]}', and date '${returnArray[2]}'.`);
			} else {
				ComfyJS.Say(`Function test return false, failing somewhere along the way.`);
			}

			break;
		
		case 'emotepyramid':

			let msgIndexer = message.indexOf(' ');
			let emote = message.substring(0, msgIndexer);
			let height = message.substring(msgIndexer + 1);

			emotePyramid(emote, height);

			ComfyJS.Say(`Emote pyramid complete!`);
			break;
		
		default:

			const validCmd = await userDB.getCmd(cmd, user);
			logType = 'CUSTCMD';
			if (!validCmd) {
				 ComfyJS.Say(`Command not recognized, ${user}.`);
				break;
			}

  }
	
	return true;
}

function diceRoll(numDice, diceSize) {

	// Generates a dice roll given number of dice and size of dice

	let diceResult = 0;
	let perDieRoll = [];

	for (var i = 1; i <= numDice; i++) {

		let diceRoll = Math.floor(Math.random() * diceSize) + 1;

		perDieRoll.push(diceRoll);
		diceResult = diceResult + diceRoll;
	}

	return [diceResult, perDieRoll];
}

function randInt(floor, ceiling) {

	// Generates a random integer between the floor & ceiling provided

	return Math.floor(Math.random() * (ceiling - floor + 1) + floor);

}

function logXmit(data, logType, user) {

	// Transmits logging data to inline log table via Websocket server
	// Designed for viewing in OBS Studio

	const time = createTimeStamp();

	let logData = {
		timestamp: time,
		type: logType,
		sender: user,
		msg: data
	}

	if (typeof user == "undefined") { logData.sender = 'CONSOLE'; }
	if (typeof logType == "undefined") { logData.type = 'LOG'; }

	//console.dir(logData);

	
	//io.emit('logEvent', logData);

	return true;
}

function createTimeStamp() {

	// Creates the timestamp property used in logXmit function
	// Final Format: MM/DD/YYYY - HH:MM:SS AM/PM

	const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	const d = new Date();
	let AMPM = 'AM';
	let dayOfMonth = d.getDate();
	let monthOfYear = d.getMonth() + 1;
	let dayHours = d.getHours();
	let dayMinutes = d.getMinutes();
	let daySeconds = d.getSeconds();
	let fullYear = d.getFullYear();
	let dayOfWeek = days[d.getDay()];

	if (dayHours > 12) {
		dayHours = dayHours - 12;
		AMPM = 'PM';
	}
	if (dayHours < 10) { dayHours = '0' + dayHours; }
	if (dayMinutes < 10) { dayMinutes = '0' + dayMinutes; }
	if (daySeconds < 10) { daySeconds = '0' + daySeconds; }

	let timestamp = monthOfYear + '/' + dayOfMonth + '/' + fullYear + " - " + dayHours + ':' + dayMinutes + ':' + daySeconds + ` ${AMPM}`;

	return timestamp;
}

function padDigits(num) {
	// Just pads a digit with a leading zero
	return num.toString().padStart(2, '0');
} 

function msToTime(milliseconds) {

	// Converts time given in milliseconds to the format 'XXh XXm XXs'
	let seconds = Math.floor(milliseconds / 1000);
	let minutes = Math.floor(seconds / 60);
	let hours = Math.floor(minutes / 60);
	let AMPM = 'AM';

	seconds = seconds % 60;
	minutes = minutes % 60;

	hours = hours % 24;

	return `${padDigits(hours)}h ${padDigits(minutes)}m ${padDigits(seconds,)}s`;
}

function generateTip() {

  // Alternates between picking a random tip from the Tip List then the next sequential tip from the VIP Tip List
  // Function is ran on a timer interval, intialized at top of file
	var scriptRuntime = new Date().getTime();
  let upTime = msToTime(scriptRuntime - scriptStart);
  let runTime = `Script Runtime: ${upTime}`;
	
	const tipList = [
		`Did you know that the_random_encounter is creating me from scratch? Now over 6,000 lines of code! Pretty impressive really, even if he does say mean things about me.`,
		`Did you know you can send the_random_encounter an e-mail by sending me a whisper directly? I will forward anything you say to me in private to his e-mail. Nifty, huh?`,
		`Did you know that the_random_encounter has lots of cheeky ways to spend your channel points? Make yourself known and punish his hubris today!`,
		`Did you know that the_random_encounter is adding new features to me rather frequently? Gambling games coming soon! If you have any ideas for commands or features, whisper them to me and I will pass them on.`,
		`Did you know that the_kandi_kid_assassin is one of the_random_encounter's best friends, and a glorious DJ as well? If you aren't following him, you should! https://www.twitch.tv/the_kandi_kid_assassin`,	
		`Did you know you can create your own commands now? Try it out with the !addcmd command today, and make your mark on the channel forever!`,
		`Weekly streams, Tuesdays and Wednesdays! Catch Random Encounter closing out Thrust Tuesdays at 1am CST/6am GMT (yes, it's technically a Wednesday), and again Wednesday evening for The Throwdown at 9pm CST/2am GMT! We'd love to see ya there!`,
		`the_random_encounter is a resident DJ with spinspinsuper! You can catch him doing sets over at his channel from time to time, and if you haven't followed spinspinsuper already, you are not up with the current meta at all! https://www.twitch.tv/spinspinsuper/`,
		`Everyone gets their own adjective assigned to them when they first join the channel, did you know? It's random, of course, but some say that the adjective you get is chosen by the stars... Learn yours with the !adjective command today!`,
		`Did you know that you can control the_random_encounter's LED lighting with basic color commands? Use !lights to see the full pattern set, but basic colors usually work fine!`,
		`Hearing jokes can be done with !joke, !dadjoke, !riddle, or !basicjoke - Adding your own jokes works with '!addjoke <JokeName> <JokeType> <Joke Wording>' - don't include the brackets. Currently acceptable joke types are 'generic', 'dad', or 'riddle'.`,
	]
	
	const vipTipList = [
		`It's Subtember, and Twitch is giving 20% off for 1-month subscriptions, 25% & 30% for 3 & 6 month subs! I won't be outdone by Twitch, so 3 or 6 mo. sub will earn you that number of raffle tickets for the next gift card drawing! Your support is greatly appreciated!`,
		`Have you joined the Discord server yet? Its a great place to keep track of announcements, giveaways, promote yourself, get DJing/production help, and otherwise be a part of our growing circle. Check it out! https://discord.gg/2tmbtukkEF`,
		`We have started a charity to support The Trevor Project! If you can spare a dollar, please help us donate to this incredible group, doing unspeakably important work for people who need it the most. Check out the charity donation panel right above the chat pane!`,
		`Did you know that subscribers are automatically entered into a monthly raffle to win a $25 Twitch eGift Card on the 1st of every month? Join our Discord to learn more! https://discord.gg/2tmbtukkEF`,
		`It's Subtember, and Twitch is giving 20% off for 1-month subscriptions, 25% & 30% for 3 & 6 month subs! I won't be outdone by Twitch, so 3 or 6 mo. sub will earn you that number of raffle tickets for the next gift card drawing! Your support is greatly appreciated!`,
		`Interested in supporting the stream directly? Tips are greatly appreciated, and go 100% towards new tracks, new gear, and otherwise improving your streaming experience! https://streamelements.com/the_random_encounter/tip, or use his CashApp tag, $therandomencounter`,
		`Another way you can support the stream directly is by taking a look at the_random_encounter's Amazon wish list! All items are for streaming or studio work! https://www.amazon.com/hz/wishlist/ls/2QA8UOEUQVI00?ref_=wl_share`,
		`Check out the merch shack! Subscribers get automatic discounts (tier 1: 10%, tier 2: 15%, tier 3: 30%)! https://store.streamelements.com/the_random_encounter - Proceeds go towards supporting and improving the channel!`,
	]
	const listSize = tipList.length;
	const vipSize = vipTipList.length;
	let chosenTip = '';
	let arrayLoc;
	
	if (vipLaps >= 1) { vipFlag = false; }
	if (tipLaps >= 2) { vipFlag = true; }

	if (tipLaps >= 3) { tipLaps = 0; }
	if (vipLaps >= 2) { vipLaps = 0; }

	switch (vipFlag) {
		case true:			
			chosenTip = vipTipList[vipCounter];
			 ComfyJS.Say(`${chosenTip}`);
			vipCounter += 1;
			if ((vipCounter) == vipSize) {
				console.log(` BOT LOG (${time()}): Displayed VIP tip #${vipCounter} of ${vipSize}. Completed all ${vipSize} VIP tips, resetting to 0... ${runTime}`);
				vipCounter = 0;
				vipLaps++;
			} else {
					console.log(` BOT LOG (${time()}): Displayed VIP tip #${vipCounter} of ${vipSize}. ${runTime}`);
			}
			vipFlag = false;			
			break;
		case false:
			let tipFlag = false;
			while (tipFlag == false) {
				arrayLoc = (Number(Math.floor(Math.random() * listSize).toFixed()));
				if (!tipsGiven.includes(arrayLoc)) {
					tipFlag = true;
					break;	
				}
			}
			chosenTip = tipList[arrayLoc];
			 ComfyJS.Say(`${chosenTip}`);
			if (!tipsGiven.includes(arrayLoc)) { tipsGiven.push(arrayLoc); }
			if (tipsGiven.length == tipList.length) {
				console.log(` BOT LOG (${time()}): Displayed general tip #${arrayLoc + 1} of ${listSize}. Used all ${tipsGiven.length} tips, resetting to 0... ${runTime}`);
				tipsGiven = [];
				tipLaps++;
			} else {
				console.log(` BOT LOG (${time()}): Displayed general tip #${arrayLoc + 1} of ${listSize}, used ${tipsGiven.length} of ${tipList.length} tips in list. ${runTime}`);
			}
			vipFlag = true;
			break;
		default:
			break;
	}

	return;
}

function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

function rouletteSpin(betArray) {

	const winningNum = Math.floor(Math.random() * 38);
	let displayNum;

	const evenOddMod = 1;
	const redblackMod = 1;
	const topBottomHalfMod = 1;
	const anyDozenMod = 2;
	const zeroMod = 35;
	const straightUpMod = 35;
	const rowMod = 17;
	const basketMod = 6;
	const anyColumnMod = 2;

	let winningColor = '';
	let evenWinFlag = false;
	let oddWinFlag = false;
	let first12WinFlag = false;
	let second12WinFlag = false;
	let third12WinFlag = false;
	let redWinFlag = false;
	let blackWinFlag = false;
	let zeroWinFlag = false;
	let doubleZeroWinFlag = false;
	let rowWinFlag = false;
	let basketWinFlag = false;
	let firstColWinFlag = false;
	let secondColWinFlag = false;
	let thirdColWinFlag = false;
	let bottomHalfWinFlag = false;
	let topHalfWinFlag = false;


	switch (winningNum) {
		case 1:
			oddWinFlag = true;
			first12WinFlag = true;
			basketWinFlag = true;
			redWinFlag = true;
			bottomHalfWinFlag = true;
			firstColWinFlag = true;
			winningColor = 'red';
			break;
		case 2:
			evenWinFlag = true;
			first12WinFlag = true;
			basketWinFlag = true;
			blackWinFlag = true;
			bottomHalfWinFlag = true;
			secondColWinFlag = true;
			winningColor = 'black';
			break;
		case 3:
			oddWinFlag = true;
			first12WinFlag = true;
			basketWinFlag = true;
			redWinFlag = true;
			bottomHalfWinFlag = true;
			thirdColWinFlag = true;
			winningColor = 'red';
			break;
		case 4:
			evenWinFlag = true;
			first12WinFlag = true;
			blackWinFlag = true;
			bottomHalfWinFlag = true;
			firstColWinFlag = true;
			winningColor = 'black';
			break;
		case 5:
			oddWinFlag = true;
			first12WinFlag = true;
			redWinFlag = true;
			bottomHalfWinFlag = true;
			secondColWinFlag = true;
			winningColor = 'red';
			break;
		case 6:
			evenWinFlag = true;
			first12WinFlag = true;
			blackWinFlag = true;
			bottomHalfWinFlag = true;
			thirdColWinFlag = true;
			winningColor = 'black';
			break;
		case 7:
			oddWinFlag = true;
			first12WinFlag = true;
			redWinFlag = true;
			bottomHalfWinFlag = true;
			firstColWinFlag = true;
			winningColor = 'red';
			break;
		case 8:
			evenWinFlag = true;
			first12WinFlag = true;
			blackWinFlag = true;
			bottomHalfWinFlag = true;
			secondColWinFlag = true;
			winningColor = 'black';
			break;
		case 9:
			oddWinFlag = true;
			first12WinFlag = true;
			redWinFlag = true;
			bottomHalfWinFlag = true;
			thirdColWinFlag = true;
			winningColor = 'red';
			break;
		case 10:
			evenWinFlag = true;
			first12WinFlag = true;
			blackWinFlag = true;
			bottomHalfWinFlag = true;
			firstColWinFlag = true;
			winningColor = 'black';
			break;
		case 11:
			oddWinFlag = true;
			first12WinFlag = true;
			blackWinFlag = true;
			bottomHalfWinFlag = true;
			secondColWinFlag = true;
			winningColor = 'black';
			break;
		case 12:
			evenWinFlag = true;
			first12WinFlag = true;
			redWinFlag = true;
			bottomHalfWinFlag = true;
			thirdColWinFlag = true;
			winningColor = 'red';
			break;
		case 13:
			oddWinFlag = true;
			second12WinFlag = true;
			blackWinFlag = true;
			bottomHalfWinFlag = true;
			firstColWinFlag = true;
			winningColor = 'black';
			break;
		case 14:
			evenWinFlag = true;
			second12WinFlag = true;
			redWinFlag = true;
			bottomHalfWinFlag = true;
			secondColWinFlag = true;
			winningColor = 'red';
			break;
		case 15:
			oddWinFlag = true;
			second12WinFlag = true;
			blackWinFlag = true;
			bottomHalfWinFlag = true;
			thirdColWinFlag = true;
			winningColor = 'black';
			break;
		case 16:
			evenWinFlag = true;
			second12WinFlag = true;
			redWinFlag = true;
			bottomHalfWinFlag = true;
			firstColWinFlag = true;
			winningColor = 'red';
			break;
		case 17:
			oddWinFlag = true;
			second12WinFlag = true;
			blackWinFlag = true;
			bottomHalfWinFlag = true;
			secondColWinFlag = true;
			winningColor = 'black';
			break;
		case 18:
			evenWinFlag = true;
			second12WinFlag = true;
			redWinFlag = true;
			bottomHalfWinFlag = true;
			thirdColWinFlag = true;
			winningColor = 'red';
			break;
		case 19:
			oddWinFlag = true;
			second12WinFlag = true;
			redWinFlag = true;
			topHalfWinFlag = true;
			firstColWinFlag = true;
			winningColor = 'red';
			break;
		case 20:
			evenWinFlag = true;
			second12WinFlag = true;
			blackWinFlag = true;
			topHalfWinFlag = true;
			secondColWinFlag = true;
			winningColor = 'black';
			break;
		case 21:
			oddWinFlag = true;
			second12WinFlag = true;
			redWinFlag = true;
			topHalfWinFlag = true;
			thirdColWinFlag = true;
			winningColor = 'red';
			break;
		case 22:
			evenWinFlag = true;
			second12WinFlag = true;
			blackWinFlag = true;
			topHalfWinFlag = true;
			firstColWinFlag = true;
			winningColor = 'black';
			break;
		case 23:
			oddWinFlag = true;
			second12WinFlag = true;
			redWinFlag = true;
			topHalfWinFlag = true;
			secondColWinFlag = true;
			winningColor = 'red';
			break;
		case 24:
			evenWinFlag = true;
			second12WinFlag = true;
			blackWinFlag = true;
			topHalfWinFlag = true;
			thirdColWinFlag = true;
			winningColor = 'black';
			break;
		case 25:
			oddWinFlag = true;
			third12WinFlag = true;
			redWinFlag = true;
			topHalfWinFlag = true;
			firstColWinFlag = true;
			winningColor = 'red';
			break;
		case 26:
			evenWinFlag = true;
			third12WinFlag = true;
			blackWinFlag = true;
			topHalfWinFlag = true;
			secondColWinFlag = true;
			winningColor = 'black';
			break;
		case 27:
			oddWinFlag = true;
			third12WinFlag = true;
			redWinFlag = true;
			topHalfWinFlag = true;
			thirdColWinFlag = true;
			winningColor = 'red';
			break;
		case 28:
			evenWinFlag = true;
			third12WinFlag = true;
			blackWinFlag = true;
			topHalfWinFlag = true;
			firstColWinFlag = true;
			winningColor = 'black';
			break;
		case 29:
			oddWinFlag = true;
			third12WinFlag = true;
			blackWinFlag = true;
			topHalfWinFlag = true;
			secondColWinFlag = true;
			winningColor = 'black';
			break;
		case 30:
			evenWinFlag = true;
			third12WinFlag = true;
			redWinFlag = true;
			topHalfWinFlag = true;
			thirdColWinFlag = true;
			winningColor = 'red';
			break;
		case 31:
			oddWinFlag = true;
			third12WinFlag = true;
			blackWinFlag = true;
			topHalfWinFlag = true;
			firstColWinFlag = true;
			winningColor = 'black';
			break;
		case 32:
			evenWinFlag = true;
			third12WinFlag = true;
			redWinFlag = true;
			topHalfWinFlag = true;
			secondColWinFlag = true;
			winningColor = 'red';
			break;
		case 33:
			oddWinFlag = true;
			third12WinFlag = true;
			blackWinFlag = true;
			topHalfWinFlag = true;
			thirdColWinFlag = true;
			winningColor = 'black';
			break;
		case 34:
			evenWinFlag = true;
			third12WinFlag = true;
			redWinFlag = true;
			topHalfWinFlag = true;
			firstColWinFlag = true;
			winningColor = 'red';
			break;
		case 35:
			oddWinFlag = true;
			third12WinFlag = true;
			blackWinFlag = true;
			topHalfWinFlag = true;
			secondColWinFlag = true;
			winningColor = 'black';
			break;
		case 36:
			evenWinFlag = true;
			third12WinFlag = true;
			redWinFlag = true;
			topHalfWinFlag = true;
			thirdColWinFlag = true;
			winningColor = 'red';
			break;
		case 37:
			zeroWinFlag = true;
			rowWinFlag = true;
			basketWinFlag = true;
			displayNum = 0;
			winningColor = 'green';
			break;
		case 38:
			doubleZeroWinFlag = true;
			rowWinFlag = true;
			basketWinFlag = true;
			displayNum = '00';
			winningColor = 'green';
			break;
		default:
			break;
			
	}	

	ComfyJS.Say(`Roulette Wheel Spinning.... And the result is.... ${winningColor} ${displayNum}!`);

	// To figure out winners, use if statements for each true win flag, search the array for the bet key's appropriate value, add the name to an object with their payout (bet amt * payout mod) - pay out by parsing through that array and calling update tokens function
}

//
// ---- DEPRECATED / UNDER DEVELOPMENT FUNCTIONS ----
//


function emotePyramid(emote, height) {

	height = parseInt(height);
	const emoteSpace = emote + " ";
	let curPos = 1;
	let emoteSpeak = "";
	console.log(typeof height);

	if (height) {
		if (height <= 2) {
			ComfyJS.Say(`You entered a pyramid length of ${height} - that's too small!`);
			return;
		} else if (height > 0) {
			while (curPos <= height) {
				for (let i = 1; i < curPos; i++) {
					emoteSpeak = emoteSpeak + emoteSpace;
				}
				ComfyJS.Say(`${emoteSpeak}`);
				curPos += 1;
				emoteSpeak = "";
			}

			emoteSpeak = "";
			curPos = height - 1;

			while (curPos > 0) {
				for (let i = curPos; i > 0; i--) {
					emoteSpeak = emoteSpeak + emoteSpace;
				}
				ComfyJS.Say(`${emoteSpeak}`);
				curPos -= 1;
				emoteSpeak = "";
			}
		}

	}

}

function rouletteEvent(betArray) {

	const winningNum = Math.floor(Math.random() * 36);
	let redWin, blackWin, oddWin, evenWin = false;
	const redNums = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
	const blackNums = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
	const greenNums = [0, 00];


	if (winningNum % 2 == 0) {
		evenWin = true;
	} else if (winningNum % 2 == 1) {
		oddWin = true;
	}
	if (redNums.includes(winningNum)) {
		redWin = true;
	} else if (blackNums.includes(winningNum)) {
		blackWin = true;
	}

}

function genUniqueNum(max, array) {
	
	let random = (Number(Math.floor(Math.random() * max).toFixed()));
		
	if (!array.includes(random) || !haveIt.includes(random)) {
		haveIt = [];
		return random;
	} else {
		haveIt.push(random);
	return genUniqueNum(max, array);
	}
}

function pushCmdMemObj(cmd, user, target) {

	const arrayLen = cmdMemArray.length();
	const arrayLoc = arrayLen - 1;

	const cmdMem = {
		cmd: `${cmd}`,
		user: `${user}`
	};

	const cmdMem2 = {
		recipient: `${target}`,
		arrayLoc: `${arrayLoc}`,
		memory: `${cmdMem}`
	}

	if (arrayLen > 0) {
		cmdMemArray[arrayLen] = cmdMem2;
		return true;
	} else if (arrayLen == 0) {
		cmdMemArray[0] = cmdMem2;
		return true;
	} else {
		console.log(` FUNC ERROR: pushCmdMemObj FAILED - ${console.error}`)
		return false;
	}
}

function kandiKidRaidAlert() {

	// Prompts chat about upcoming raid to the_kandi_kid_assassin's channel
	// Currently deprecated, Sunday streams with Nick are on pause

	var timeRightNow = new Date();
	var millsTill1145pm = new Date(timeRightNow.getFullYear(), timeRightNow.getMonth(), timeRightNow.getDate(), 23, 45, 0, 0) - timeRightNow;

	if (millsTill1145pm < 0) {
		millsTill1145pm += 396000000; // it's after 11:45pm, try 11:45pm tomorrow.
	}

	setTimeout(function () {  ComfyJS.Say(`It's 11:45pm. In 15 minutes we'll be raiding over to @the_kandi_kid_assassin 's channel. Stick around and hold tight!`) }, millsTill1145pm);

}



/*

case 'blue':
            
      FPPpayload = 'http://192.168.1.123/api/playlist/blue/start';
      needle('get', FPPpayload)
        .then((resp) => {
          ComfyJS.Say(`Changing the lights to ${cmd}!`);
          console.log(` CMD LOG (${time()}): User '${user}' changed the lighting color to '${cmd}'. Response: ${resp.body}`);
        })
        .catch((err) =>  {
          ComfyJS.Say(`Something went wrong, ${user}... Not sure what. Try again?`);
          console.error(` CMD LOG (${time()}): Error occurred when user '${user} issued command '${cmd}'. Error: ${err}`);
        })
      break;
        
    case 'red':

      FPPpayload = 'http://192.168.1.123/api/playlist/red/start';
      needle('get', FPPpayload)
        .then((resp) =>  {
          ComfyJS.Say(`Changing the lights to ${cmd}!`);
          console.log(` CMD LOG (${time()}): User '${user}' changed the lighting color to '${cmd}'. Response: ${resp.body}`);
        })
        .catch((err) =>  {
          ComfyJS.Say(`Something went wrong, ${user}... Not sure what. Try again?`);
          console.error(` CMD LOG (${time()}): Error occurred when user '${user} issued command '${cmd}'. Error: ${err}`);
        })
      break;
        
    case 'green':

      FPPpayload = 'http://192.168.1.123/api/playlist/green/start';
      needle('get', FPPpayload)
        .then((resp) =>  {
        	ComfyJS.Say(`Changing the lights to ${cmd}!`);
        	console.log(` CMD LOG (${time()}): User '${user}' changed the lighting color to '${cmd}'. Response: ${resp.body}`);
      	})
        .catch((err) =>  {
        	ComfyJS.Say(`Something went wrong, ${user}... Not sure what. Try again?`);
          console.error(` CMD LOG (${time()}): Error occurred when user '${user} issued command '${cmd}'. Error: ${err}`);
        })
      break;
        
    case 'yellow':

      FPPpayload = 'http://192.168.1.123/api/playlist/yellow/start';
      needle('get', FPPpayload)
        .then((resp) =>  {
          ComfyJS.Say(`Changing the lights to ${cmd}!`);
          console.log(` CMD LOG (${time()}): User '${user}' changed the lighting color to '${cmd}'. Response: ${resp.body}`);
        })
        .catch((err) =>  {
          ComfyJS.Say(`Something went wrong, ${user}... Not sure what. Try again?`);
          console.error(` CMD LOG (${time()}): Error occurred when user '${user} issued command '${cmd}'. Error: ${err}`);
        })
      break;
        
    case 'white':

      FPPpayload = 'http://192.168.1.123/api/playlist/white/start';
      needle('get', FPPpayload)
        .then((resp) =>  {
          ComfyJS.Say(`Changing the lights to ${cmd}!`);
          console.log(` CMD LOG (${time()}): User '${user}' changed the lighting color to '${cmd}'. Response: ${resp.body}`);
        })
        .catch((err) =>  {
          ComfyJS.Say(`Something went wrong, ${user}... Not sure what. Try again?`);
          console.error(` CMD LOG (${time()}): Error occurred when user '${user} issued command '${cmd}'. Error: ${err}`);
        })
      break;
        
    case 'cyan':

      FPPpayload = 'http://192.168.1.123/api/playlist/cyan/start';
      needle('get', FPPpayload)
        .then((resp) =>  {
          ComfyJS.Say(`Changing the lights to ${cmd}!`);
          console.log(` CMD LOG (${time()}): User '${user}' changed the lighting color to '${cmd}'. Response: ${resp.body}`);
        })
        .catch((err) =>  {
          ComfyJS.Say(`Something went wrong, ${user}... Not sure what. Try again?`);
          console.error(` CMD LOG (${time()}): Error occurred when user '${user} issued command '${cmd}'. Error: ${err}`);
        })
      break;
        
    case 'pink':

      FPPpayload = 'http://192.168.1.123/api/playlist/pink/start';
      needle('get', FPPpayload)
        .then((resp) => {
          ComfyJS.Say(`Changing the lights to ${cmd}!`);
          console.log(` CMD LOG (${time()}): User '${user}' changed the lighting color to '${cmd}'. Response: ${resp.body}`);
        })
        .catch((err) =>  {
          ComfyJS.Say(`Something went wrong, ${user}... Not sure what. Try again?`);
          console.error(` CMD LOG (${time()}): Error occurred when user '${user} issued command '${cmd}'. Error: ${err}`);
        })
      break;
    
		case 'black':
    case 'off':

      FPPpayload = 'http://192.168.1.123/api/playlist/off/start';
    	needle('get', FPPpayload)
        .then((resp) =>  {
          ComfyJS.Say(`Changing the lights to ${cmd}!`);
          console.log(` CMD LOG (${time()}): User '${user}' changed the lighting color to '${cmd}'. Response: ${resp.body}`);
        })
        .catch((err) =>  {
          ComfyJS.Say(`Something went wrong, ${user}... Not sure what. Try again?`);
          console.error(` CMD LOG (${time()}): Error occurred when user '${user} issued command '${cmd}'. Error: ${err}`);
        })
      break;
		
		case 'strobe':
		case 'strobewhite':

			FPPpayload = 'http://192.168.1.123/api/playlist/white_strobe/start';
    	needle('get', FPPpayload)
        .then((resp) =>  {
          ComfyJS.Say(`Changing the lights to white strobes!`);
          console.log(` CMD LOG (${time()}): User '${user}' changed the lighting color to '${cmd}'. Response: ${resp.body}`);
        })
        .catch((err) =>  {
          ComfyJS.Say(`Something went wrong, ${user}... Not sure what. Try again?`);
          console.error(` CMD LOG (${time()}): Error occurred when user '${user} issued command '${cmd}'. Error: ${err}`);
        })
			break;
		
		case 'strobergb':
		case 'rgbstrobe':
			FPPpayload = 'http://192.168.1.123/api/playlist/rgb_strobe/start';
    	needle('get', FPPpayload)
        .then((resp) =>  {
          ComfyJS.Say(`Changing the lights to RGB strobes!`);
          console.log(` CMD LOG (${time()}): User '${user}' changed the lighting color to '${cmd}'. Response: ${resp.body}`);
        })
        .catch((err) =>  {
          ComfyJS.Say(`Something went wrong, ${user}... Not sure what. Try again?`);
          console.error(` CMD LOG (${time()}): Error occurred when user '${user} issued command '${cmd}'. Error: ${err}`);
        })
			break;
		
		case 'colorwash':
		case 'pattern1':

			FPPpayload = 'http://192.168.1.123/api/playlist/color_wash/start';
    	needle('get', FPPpayload)
        .then((resp) =>  {
          ComfyJS.Say(`Changing the lights to RGB color wash!`);
          console.log(` CMD LOG (${time()}): User '${user}' changed the lighting color to '${cmd}'. Response: ${resp.body}`);
        })
        .catch((err) =>  {
          ComfyJS.Say(`Something went wrong, ${user}... Not sure what. Try again?`);
          console.error(` CMD LOG (${time()}): Error occurred when user '${user} issued command '${cmd}'. Error: ${err}`);
        })
			break;
		
		case 'colortrack':
		case 'pattern2':
			
			FPPpayload = 'http://192.168.1.123/api/playlist/color_track/start';
    	needle('get', FPPpayload)
        .then((resp) =>  {
          ComfyJS.Say(`Changing the lights to RGB bars!`);
          console.log(` CMD LOG (${time()}): User '${user}' changed the lighting color to '${cmd}'. Response: ${resp.body}`);
        })
        .catch((err) =>  {
          ComfyJS.Say(`Something went wrong, ${user}... Not sure what. Try again?`);
          console.error(` CMD LOG (${time()}): Error occurred when user '${user} issued command '${cmd}'. Error: ${err}`);
        })
			break;

			*/

			/*

			case 'addjoke':
		case 'newjoke':

			var index = message.indexOf(" ");  // Gets the first index where a space occours
			var jokeCmd = message.substr(0, index); // Gets the first part
			var jokeCmdRemainder = message.substr(index + 1);  // Gets the text part
			index = jokeCmdRemainder.indexOf(" ");
			var jokeType = jokeCmdRemainder.substr(0, index);
			var jokeSyntax = jokeCmdRemainder.substr(index + 1);

			if (jokeType.length() <= 2) {
				jokeType = 'generic';
			}
			if (jokeType != 'generic' || jokeType != 'dad' || jokeType != 'riddle') {
				 ComfyJS.Say(`Acceptable joke types currently are 'generic', 'dad', or 'riddle' - Setting to 'generic' for now.`);
				jokeType = 'generic';
			}
			var newJokeObj = {
				"jokeSyntax": jokeSyntax,
				"jokeCmd": jokeCmd,
				"username": user,
				"jokeType": jokeType
			};
		
			let addJokeSuccess = await userDB.addJoke(newJokeObj);

			if (addJokeSuccess) {
				 ComfyJS.Say(`Joke added successfully, @${user}. Use !joke 'joke_cmd' to have me tell it specifically, or just !joke for a random joke, !dadjoke for a dad joke, or !riddle for a riddle.`);
			} else if (!addJokeSuccess) {
				 ComfyJS.Say(`Error adding joke encountered, @${user}. Sorry about that. Please try again. Correct syntax: !addjoke joke_name joke_type the_joke_itself - Example: !addjoke testjoke generic This joke isn't funny`);
			}
			break;
		
		case 'joke':

			var jokeCmd;
			var jokeID = parseInt(message);
			
			if (jokeID.isNaN()) { jokeCmd = message; }
			else jokeCmd = jokeID;
			
			ComfyJS.Say(await userDB.getJoke(jokeCmd));
			break;

		case 'dadjoke':

			var jokeCmd;
			var jokeType = 'dad';
			var jokeID = parseInt(message);
			
			if (jokeID.isNaN()) { jokeCmd = message; }
			else { jokeCmd = jokeID; }
			
			ComfyJS.Say(await userDB.getJoke(jokeCmd, jokeType));
			break;
		
		case 'riddle':

			var jokeCmd;
			var jokeType = 'riddle';
			var jokeID = parseInt(message);
			
			if (jokeID.isNaN()) { jokeCmd = message; }
			else { jokeCmd = jokeID; }
			
			ComfyJS.Say(await userDB.getJoke(jokeCmd, jokeType));
			break;
		
		case 'basicjoke':

			var jokeCmd;
			var jokeType = 'generic';
			var jokeID = parseInt(message);
			
			if (jokeID.isNaN()) { jokeCmd = message; }
			else { jokeCmd = jokeID; }
			
			ComfyJS.Say(await userDB.getJoke(jokeCmd, jokeType));
			break;
		
			*/