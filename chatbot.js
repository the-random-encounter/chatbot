// RANDOM ENCOUNTER TWITCH CHAT BOT
// MAIN FUNCTIONS FILE
// v0.1.5 - 04/26/2022
// by The Random Encounter
// https://github.com/the-random-encounter/randomencounterbot.git
// https://www.twitch.tv/the_random_encounter
// https://www.facebook.com/random.encounter.dj
// E-Mail: talent@random-encounter.net
// Secondary: contact@random-encounter.net



// Import Environment variables & configure event emitter listeners
require('dotenv').config();
require('events').EventEmitter.prototype._maxListeners = 100;

// Declare CONST library requirements
const ComfyJS = require('comfy.js');
const nodemailer = require('nodemailer');
const userDB = require('./sqlFuncs.js');
const express = require('express');
const WebSocket = require('ws');
const http = require('http');

// Declare CONST global objects
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const botMailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Declare global variables
// Script timing variable
var scriptStart = new Date().getTime();

// User tracking list arrays
let currentUsersList = [];
let updatedUsersList = [];

// Stream-tracking flags
let streamActive = false;
let secondDailyStream = false;

// Generic message global var
let msg;

// Init WebSocket Events
wss.on('connection', wsc => {
    wsc.on('message', message => {
        console.log(`Received message => ${message}`);
    });
    wsc.send('something');
});

// Start Websocket Server
server.listen(3000, () => {
    console.log(`Websocket server started on port 3000`);
});

// Init Twitch IRC Server Connection
ComfyJS.Init(process.env.TWITCH_USERNAME, process.env.TWITCH_OAUTH, process.env.TWITCH_CHANNEL, true);

// Init local MySQL Server Connection
userDB.connect();

// Announcement Function Declarations
const subathonAnnounce = () => { ComfyJS.Say(`Hey ravers and lovers and good-time-facilitators! Random Encounter is running a subathon today, hoping to get some funds to replace a bunch of stolen studio equipment. MIDI controllers, speakers, and more... all gone... It'd be awesome if you can help out. We'd both appreciate your generousity greatly!`); }
const raidTrainAnnounce = () => { ComfyJS.Say(`Weekly streams, Tuesdays and Wednesdays! Catch Random Encounter closing out Thrust Tuesdays at 1am CST/6am GMT (yes, it's technically a Wednesday), and again Wednesday evening at 7pm CST/12am GMT! We'd love to see ya there!`); }
const tipAnnounce = () => { ComfyJS.Say(`Consider supporting the stream! Subscriptions, bits, or even direct tips are immensely helpful, and go towards new music, new gear, or other stream/studio-related items. Tip directly at https://streamelements.com/the_random_encounter/tip`); }
const marathonAnnounce = () => { ComfyJS.Say(``); }

//
// START OF TWITCH EVENT HANDLERS 
// - comfy.js

ComfyJS.onChat = (user, message, flags, self, extra) => {
    const logType = 'CHAT';
    // Logs all messages being sent to Twitch chat
    console.log('CHAT LOG: ' + user + ': ' + message);
    logXmit(message, logType, user);

    let userPOS = currentUsersList.indexOf(user);

    if (userPOS == -1) {
        currentUsersList.push(user);
        console.log(`CHAT LOG: New user ${user} is chatting, but not on user list. Appending to users list.`);
        logXmit(`New user ${user} is chatting, but not on user list. Appending to users list.`);

        //if (userDB.doesExist(user) == false) {
        //    userDB.addUser(user);
        //} else if (userDB.doesExist(user) == true) {
        //    userDB.lastSeen(user);
        //}
    }

    userDB.incChats(user);
}

ComfyJS.onCommand = (user, command, message, flags, extra) => {

    let cmd = command;
    let target = '';
    const logType = 'CMD';

    logXmit(`!${cmd} ${message}`, logType, user);

    // Parse command by case, execute
    if (cmd[1] == '!') { }
    else {
        switch (cmd.toLowerCase()) {

            case 'command':
            case 'commands':
                //ComfyJS.Say('For a complete command list and their functions, please goto https://www.random-encounter.net/botcmds/');
                ComfyJS.Say(`Completed commands: !hello, !commands, !cheers/!toast, !so/!shoutout, !lurk, !hype/!rage, !kr, !botiq, !madlove, !hug, !kiss, !spank, !doctor, !dice/!rolldice/!diceroll, !tuna/!tune, !whattune/!trackid/!tunename, !banger, !discord, !throwdown, !thrust, !tuesday, !wednesday`);
                ComfyJS.Say(`Commands under development/not fully implemented: !adjective, !tokens/!checktokens, !bet`);
                break;

            case 'hello':
                ComfyJS.Say(`@${user}, it is good to see you! Hello!`);
                break;

            case 'byebyebot':
                if (flags.broadcaster) {
                    ComfyJS.Say(`Alright, I'm out! Bye Felicia!`);
                    userDB.disconnect();
                    ComfyJS.Disconnect();
                }
                break;

            case 'beginstream':
                if (flags.broadcaster) {

                    raidTrainInit = setTimeout(raidTrainAnnounce, 480000) // Initial Raid Train Streams announcement, 8m delay
                    raidTrainInterval = setInterval(raidTrainAnnounce, 2400000); // Announce Raid Train Streams in 30m intervals

                    moneyTipInit = setTimeout(tipAnnounce, 300000); // Initial tip link announcement, 5m delay
                    moneyTipInterval = setInterval(tipAnnounce, 900000); // Announce tip link in 15m intervals

                    helpTipInterval = setInterval(generateTip, 300000); // Random tips every five minutes

                    // subathonInit = setTimeout(subathonAnnounce, 180000); // Initial Subathon announcement, 3m delay
                    // subathonInterval = setInterval(subathonAnnounce, 1200000); // Announce Subathon, 20m intervals

                    streamActive = true;
                    updatedUsersList = [];

                    console.log(` CMD LOG: Broadcaster began stream timer. Time-delayed events and triggers active.`);
                    ComfyJS.Say(`Done. Stream timer has begun.`);
                }
                break;

            case 'begin2ndstream':
                if (flags.broadcaster) {

                    raidTrainInit = setTimeout(raidTrainAnnounce, 480000) // Initial Raid Train Streams announcement, 8m delay
                    raidTrainInterval = setInterval(raidTrainAnnounce, 2400000); // Announce Raid Train Streams in 30m intervals

                    moneyTipInit = setTimeout(tipAnnounce, 300000); // Initial tip link announcement, 5m delay
                    moneyTipInterval = setInterval(tipAnnounce, 900000); // Announce tip link in 15m intervals

                    helpTipInterval = setInterval(generateTip, 300000); // Random tips every five minutes

                    // subathonInit = setTimeout(subathonAnnounce, 180000); // Initial Subathon announcement, 3m delay
                    // subathonInterval = setInterval(subathonAnnounce, 1200000); // Announce Subathon, 20m intervals

                    streamActive = true;
                    secondDailyStream = true;
                    updatedUsersList = [];

                    console.log(` CMD LOG: Broadcaster began stream timer. Second stream flagged, time-delayed events and triggers active.`);
                    ComfyJS.Say(`Done. Stream timer has begun. Second daily stream registered.`);
                }

            case 'endstream':
                if (flags.broadcaster) {


                    clearTimeout(raidTrainInit);
                    clearInterval(raidTrainInterval);

                    clearTimeout(moneyTipInit);
                    clearInterval(moneyTipInterval);

                    clearInterval(helpTipInterval);

                    // clearTimeout(subathonInit);
                    // clearInterval(subathonInterval);

                    streamActive = false;
                    secondDailyStream = false;

                    console.log(` CMD LOG: Broadcaster ended stream timer. Time-delayed events and triggers disabled.`);
                    ComfyJS.Say(`Done. Stream timer ended.`);
                }
                break;

            case 'cheers':
            case 'toast':
                target = '';
                if (message == '') {
                    ComfyJS.Say(`@${user} wants to celebrate the good times with a toast! Cheers, ${user}`);
                    break;
                } else {
                    if (message[0] === '@') { target = message.substring(1); } else { target = message; };
                    ComfyJS.Say(`@${user} wants to celebrate the good times with you, @${target}! Cheers!`);
                    break;
                }

            case 'so':
            case 'shoutout':
                target = '';
                if (message[0] === '@') {
                    target = message.substring(1);
                } else {
                    target = message;
                }
                ComfyJS.Say(`@${user} wants to give a mad shoutout to the amazing @${target}! It takes less than ten seconds to click the link and follow their profile, and they deserve the recognition! https://www.twitch.tv/${target}/`);
                break;

            case 'lurk':
                ComfyJS.Say(`@${user} has decided they have something better to do, receding into the shadows. Catch you later, wallflower!`);
                break;

            case 'hype':
            case 'rage':
                ComfyJS.Say(`djbriskParty djbriskBass djbriskParty djbriskBass djbriskParty djbriskBass djbriskParty djbriskBass djbriskParty djbriskBass djbriskParty djbriskBass djbriskParty djbriskBass djbriskParty djbriskBass djbriskParty djbriskBass djbriskParty djbriskBass djbriskParty djbriskBass djbriskParty djbriskBass djbriskParty djbriskBass djbriskParty djbriskBass djbriskParty djbriskBass djbriskParty djbriskBass djbriskParty djbriskBass djbriskParty djbriskBass djbriskParty djbriskBass djbriskParty`);
                break;

            case 'kr':
            case 'knightsradiant':
            case 'stormlight':
                ComfyJS.Say(`The hallowed oaths must again be spoken. Life before death. Strength before weakness. Journey before destination. The Knights Radiant must stand again! @${user} must be a huge Cosmere nerd!`);
                break;

            case 'botiq':
                ComfyJS.Say(`I know you don't think I'm very smart, @${user}. It's okay, I know I ride the short bus everyday. I've come to terms with it.`);
                break;

            case 'madlove':
                ComfyJS.Say(`AsexualPride boredrAversMadLove BisexualPride boredrAversMadLove GayPride boredrAversMadLove GenderFluidPride boredrAversMadLove IntersexPride boredrAversMadLove LesbianPride boredrAversMadLove NonbinaryPride boredrAversMadLove PansexualPride boredrAversMadLove TransgenderPride boredrAversMadLove`);
                break;

            case 'userdebug':
                if (flags.broadcaster) {
                    ComfyJS.Say(`Performing user debug action. Check console logs for further information.`);
                    console.log(currentUsersList);
                } else if (!flags.broadcaster) {
                    ComfyJS.Say(`Access denied. You are not the broadcaster of this channel. Sorry, mate.`);
                    console.log(` CMD LOG: User '${user}' attempted to access user debug list. Access denied.`);
                }
                break;

            case 'updatelistdebug':
                if (flags.broadcaster) {
                    ComfyJS.Say(`Performing updated user list debug action. Check console logs for further information.`);
                    console.log(updatedUsersList);
                } else if (!flags.broadcaster) {
                    ComfyJS.Say(`Access denied. You are not the broadcaster of this channel. Sorry, mate.`);
                    console.log(` CMD LOG: User '${user}' attempted to access user debug list. Access denied.`);
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

            case 'ttd':
            case 'wednesday':
                ComfyJS.Say(`Every Wednesday, @the_random_encounter is waging war against hardcore! Catch him for an hour at 5:00PM-6:00PM PST/8:00PM-9:00PM EST/12:00-1:00AM GMT. For the rest, check out the linktree link for all the information on line-ups and other cool stuff you could want! https://linktr.ee/ThrowdownThursday`);
                break;

            case 'throwdown':
                ComfyJS.Say(`The Throwdown's Linktree https://linktr.ee/ThrowdownThursday`);
                break;

            case 'adjective':
                userDB.getAdj(user);
                //ComfyJS.Say(`@${user}, your RANDOM ADJECTIVE is ${adjective}! And you're stuck with it for good!`);
                break;

            case 'checktokens':
            case 'tokens':
                let amt = userDB.displayTokens(user);
                //ComfyJS.Say(`@${user}, you currently have ${amtTokens} casino tokens remaining.`);
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

                if (failState && failState2) {
                    failMessage = failMessage + ` AND ALSO, `;
                }

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
                break;

            case 'kiss':
                target = '';
                if (message[0] === '@') {
                    target = message.substring(1);
                } else {
                    target = message;
                }

                ComfyJS.Say(`@${user} plants a big fat kiss right on @${target} 's lips! So much love in the air!`);
                break;

            case 'spank':
                target = '';
                if (message[0] === '@') {
                    target = message.substring(1);
                } else {
                    target = message;
                }

                ComfyJS.Say(`@${user} bends @${target} over their knee and gives them a good spanking! How risque!`);
                break;

            case 'bet':

                let [gameType, betAmt] = message.split(" ");
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
                            userDB.updateTokens(user, payout);
                        } else {

                        }
                        break;

                    case 'roulette':

                        break;

                    default:

                        break;
                }

                break;

            case 'tip':
                ComfyJS.Say(`Consider supporting the stream! Subscriptions, bits, or even direct tips are immensely helpful, and go towards new music, new gear, or other stream/studio-related items. Tip directly at https://streamelements.com/the_random_encounter/tip`);
                break;

            case 'addcmd':
            case 'addcommand':

                let [newCmd, cmdSyntax] = message.split(" ");

                userDB.addCmd(newCmd, cmdSyntax, user);

                break;

            default:

                userDB.getCmd(cmd);

                break;
        }
    }
}

ComfyJS.onJoin = (user, flags, self, extra) => {
    var scriptRuntime = new Date().getTime();
    var timeSinceBegin = scriptRuntime - scriptStart;
    let runTimeMinutes = timeSinceBegin / 60000;
    let upTime = msToTime(timeSinceBegin);
    let runTime = `Script Runtime: ${upTime} (${timeSinceBegin}ms)`;
    const logType = 'JOIN';
    let logMsg;

    if (user == 'stressedgrad' || user == 'academyimpossible' || user == 'randomencounterbot' || user == 'streamelements' || user == 'moobot' || user == 'streamlabs' || user == 'anothertvviewer' || user == 'dudutopaz1') {
        console.log(`JOIN LOG: ${user} has joined channel, is on blacklist. Ignoring.`);
    } else if (user === 'the_random_encounter' && timeSinceBegin > 100000) {
        //ComfyJS.Say('Welcome to your castle, master.')
        console.log(`JOIN LOG: Channel owner the_random_encounter has joined the channel. ${upTime}`);
    } else if (timeSinceBegin > 100000) {
        console.log(`JOIN LOG: ${user} has joined channel. ${upTime}`);
    }

    let userPOS = currentUsersList.indexOf(user);
    let userUpdatedPOS = updatedUsersList.indexOf(user);

    if (userPOS == -1) {
        currentUsersList.push(user);
        console.log(`JOIN LOG: New user in channel named ${user}. Added to users list.`);
        logXmit(`New user in channel named ${user}. Added to users list.`, logType);
    } else if (userPOS != -1) {
        console.log(`JOIN LOG: User '${user}' joined channel, hasn't been pruned from user list. Leaving alone.`);
        logXmit(`User '${user}' joined channel, hasn't been pruned from user list. Leaving alone.`, logType);
    } else {
        console.log(`JOIN LOG: Unknown error regarding new user '${user}' in channel. No action taken.`);
        logXmit(`Unknown error regarding new user '${user}' in channel. No action taken.`, logType);
    }

    let userAdded = userDB.addUser(user);

    if (userAdded) {
        updatedUsersList.push(user);
        console.log(`JOIN LOG: New user '${user}' has been successfully added.`);
        logXmit(`New user '${user}' has been successfully added.`, logType);
    } else {
        if (userUpdatedPOS == -1) {
            updatedUsersList.push(user);
            userDB.lastSeen(user);
            console.log(`JOIN LOG: User '${user}' has been updated and added to updated users list.`);
            logXmit(`User '${user}' has been updated and added to updated users list.`, logType);
        } else {
            console.log(`JOIN LOG: User '${user} present on updated users list (Index: ${userUpdatedPOS}). No action taken.`);
            logXmit(`User '${user} present on updated users list (Index: ${userUpdatedPOS}). No action taken.`, logType);
        }
    }

    userPOS = 0;
}

ComfyJS.onSub = (user, message, subTierInfo, extra) => {
    console.log(`LOG>> ${user} subbed at tier ${subTierInfo}.`);
    //ComfyJS.Say(`Wow! Thank you so much subscribing at tier ${subTierInfo}, @${user}! Much appreciated, and much love!`);
}

ComfyJS.onResub = (user, message, streakMonths, cumulativeMonths, subTierInfo, extra) => {
    console.log(`LOG>> ${user} resubbed at tier ${subTierInfo}. Streak: ${streakMonths}, Cumulative: ${cumulativeMonths}`);
    // ComfyJS.Say(`Thank you for resubbing at tier ${subTierInfo}, @${user}! They now have a sub streak of ${streakMonths}, with ${cumulativeMonths} months total! Much appreciated, much love!`);
}

ComfyJS.onSubGift = (gifterUser, streakMonths, recipientUser, senderCount, subTierInfo, extra) => {
    console.log(`LOG>> ${gifterUser} purchased ${senderCount} tier ${subTierInfo} gift subs for ${recipientUser}, giving them a streak of ${streakMonths}.`);
    //ComfyJS.Say(`@${gifterUser} purchased ${senderCount} tier ${subTierInfo} gift subs for @${recipientUser}, giving them a streak of ${streakMonths}. Wow, thank you so much! Much love.`);
}

ComfyJS.onSubMysteryGift = (gifterUser, numbOfSubs, senderCount, subTierInfo, extra) => {
    console.log(`LOG>> ${gifterUser} mystery purchased ${numbOfSubs} tier ${subTierInfo}. senderCount: ${senderCount}.`);
    // ComfyJS.Say('A mystery gifter just gifted ' + numbOfSubs + ' subs! Thank you for your tall, dark, and mysterious gifts!');
}

ComfyJS.onGiftSubContinue = (user, sender, extra) => {
    console.log(`LOG>> ${user} continued their sub via a gift sub from ${sender}.`);
    // ComfyJS.Say(`Thank you for continuing your subscription, @${user}! Be sure to thank @${sender} for the gift! Much love to you both!`);
}

ComfyJS.onRaid = (user, viewers, extra) => {
    console.log(`LOG>> ${user} raided the channel with ${viewers} in tow.`);
    ComfyJS.Say(`Incoming raid from @${user} with ${viewers} viewers in tow! Welcome raiders! Please refresh your browsers once you are loaded in. Glad to have you! https://www.twitch.tv/the_random_encounter`);
}

ComfyJS.onHosted = (user, viewers, autohost, extra) => {
    console.log(`LOG>> ${user} hosted the channel with ${viewers} viewers. Authost: ${autohost}.`);
    ComfyJS.Say(`@${user} is hosting the channel with ${viewers} viewers. Thanks for the support, and glad to have you guys!`);
}

ComfyJS.onWhisper = (user, message, flags, self, extra) => {

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
            console.log(`WHISPER LOG: User '${user}' sent a message. E-mailed successfully. (${info.response})`);
        }
    });
}

ComfyJS.onCheer = (user, message, bits, flags, extra) => {
    console.log(`LOG>> ${user} cheered a total of ${bits} bits. Message: ${message}`);
    ComfyJS.Say(`@${user} just cheered, sending a total of ${bits} of the juiciest bits out! Wow! Thank you very much, and much love!`);
}

ComfyJS.onPart = (user, self, extra) => {
    var scriptRuntime = new Date().getTime();
    var timeSinceBegin = scriptRuntime - scriptStart;
    let upTime = msToTime(timeSinceBegin);
    let runTime = `Script Runtime: ${upTime} (${timeSinceBegin}ms)`;
    const logType = 'PART';
    let logMsg;

    let userPOS = currentUsersList.indexOf(user);
    let userUpdatedPOS = updatedUsersList.indexOf(user);

    if (userPOS == -1) {
        logMsg = `User '${user}' left channel, but was not on users list beforehand. Leaving alone. ${runTime}`;
        console.log(`PART LOG: ` + logMsg);
        logXmit(logMsg, logType);
    } else if (userPOS != -1) {
        currentUsersList.splice(userPOS, 1);
        logMsg = `User '${user}' has left channel, pruned username from active users list. ${runTime}`;
        console.log(`PART LOG: ` + logMsg);
        logXmit(logMsg, logType);
    } else {
        logMsg = `Unknown exception regarding user '${user}' leaving channel. UserPOS variable not -1 or above 1. Leaving alone. ${runTime}`;
        console.log(`PART LOG: ` + logMsg);
        logXmit(logMsg, logType);
    }

    let userAdded = userDB.addUser(user);

    if (userAdded) {
        updatedUsersList.push(user);
        logMsg = `New user '${user}' has been successfully added.`;
        console.log(`PART LOG: ` + logMsg);
        logXmit(logMsg, logType);
    } else {
        if (userUpdatedPOS == -1) {
            updatedUsersList.push(user);
            userDB.lastSeen(user);
            logMsg = `User '${user}' has been updated and added to updated users list.`;
            console.log(`PART LOG: ` + logMsg);
            logXmit(logMsg, logType);
        }
    }

    userPOS = 0;
}

//
// START OF CUSTOM FUNCTION DEFINITIONS
//

function kandiKidRaidAlert() {

    // Prompts chat about upcoming raid to the_kandi_kid_assassin's channel
    // Currently deprecated, Sunday streams with Nick are on pause

    var timeRightNow = new Date();
    var millsTill1145pm = new Date(timeRightNow.getFullYear(), timeRightNow.getMonth(), timeRightNow.getDate(), 23, 45, 0, 0) - timeRightNow;

    if (millsTill1145pm < 0) {
        millsTill1145pm += 396000000; // it's after 11:45pm, try 11:45pm tomorrow.
    }

    setTimeout(function () { ComfyJS.Say(`It's 11:45pm. In 15 minutes we'll be raiding over to @the_kandi_kid_assassin 's channel. Stick around and hold tight!`) }, millsTill1145pm);

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
        type: 'LOG',
        sender: 'CONSOLE',
        msg: data
    }

    if (typeof user !== "undefined") { logData.sender = user; }
    if (typeof logType !== "undefined") { logData.type = logType; }

    wss.on('connection', wsc => {
        wsc.on('message', message => {
            console.log(`Received message => ${message}`);
        });
        wsc.send(JSON.stringify(logData));
        //wsc.close();
    });

    return;
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

function padDigits(num) { return num.toString().padStart(2, '0'); } // Just pads a digit with a leading zero

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

    // Picks a random tip from the list and broadcasts it to chat
    // Function is ran on a timer interval, intialized at top of file

    let tipList = [
        'Did you know that the_random_encounter is creating me from scratch? Pretty impressive really, even if he does say mean things about me.',
        'Did you know you can send the_random_encounter an e-mail by sending me a whisper directly? I will forward anything you say to me in private to his e-mail. Nifty, huh?',
        'Did you know that the_random_encounter has lots of cheeky ways to spend your channel points? Make yourself known and punish his hubris today!',
        'Did you know that the_random_encounter is adding new features to me rather frequently? Gambling games coming soon! If you have any ideas for commands or features, whisper them to me and I will pass them on.',
        'Did you know that the_kandi_kid_assassin is one of the_random_encounters best friends, and a glorious DJ as well? If you arent following him, you should! https://www.twitch.tv/the_kandi_kid_assassin',
        'Interested in supporting the stream directly? Tips are greatly appreciated, and go 100% towards new tracks, new gear, and otherwise improving your streaming experience! https://streamelements.com/the_random_encounter/tip',
        'Did you know that subscribers are automatically entered into a monthly raffle to win a $25 Twitch eGift Card on the 1st of every month? All subscribers active on the 1st are entered and the winner is drawn on the first livestream of the month!',
        'Another way you can support the stream directly is by taking a look at the_random_encounters Amazon wish list! All items are for streaming or studio work! https://www.amazon.com/hz/wishlist/ls/2QA8UOEUQVI00?ref_=wl_share',
        'Did you know you can create your own commands now? Try it out with !addcmd'
    ]
    let listSize = tipList.length;
    let arrayLoc = Math.floor(Math.random() * listSize);

    let chosenTip = tipList[arrayLoc];

    ComfyJS.Say(`${chosenTip}`);
    return;
}