// RANDOM ENCOUNTER GAMING TWITCH CHAT BOT
// SQL FUNCTIONS MODULE
// Database: userinfodb-gaming
// Tables: userinfo, commands
// v0.3.6 - 03/06/2023
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
const { query } = require('express');

// Create async SQL database object
const execDB = new asyncSQL({
	host: process.env.SQL_HOSTNAME,
	user: process.env.SQL_USERNAME,
	password: process.env.SQL_PASSWORD,
	database: process.env.GAMING_SQL_DB,
	skiptzfix: true
});


class ServerRecord {

	constructor(name, value, holder, date, description) {
		this.name = name;
		this.value = value;
		this.holder = holder;
		this.date = date;
		this.description = description;
	}

	set name(name) {
		this.name = name;
	}

	get name() {
		return this._name;
	}

	set value(value) {
		this.value = value;
	}

	get value() {
		return this._value;
	}

	set holder(holder) {
		this.holder = holder;
	}

	get holder() {
		return this._holder;
	}

	set date(date) {
		if (typeof date != null) {
			this.date = date;
		} else {
			this.date = getCurrentDate();
		}
	}

	get date() {
		return this._date;
	}

	set description(description) {
		this.description = description;
	}

	get description() {
		return this._description;
	}
	
	}





//
// --- BASIC DATA FUNCTIONS ---
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

const time = () => {

	const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

	return time;
}

//
// --- PRIMARY SQL FUNCTION ---
//

const execQuery = async (functionName, queryData) => {
	const functions = {
		//
		// -- USERINFO TABLE QUERIES --
		//
		getAdjective: {
			query: 'SELECT random_adjective AS item FROM userinfo WHERE user_name = (?)',
			response: (value) => { return value; },
			type: 'get'
		},
		addUser: {
			query: 'INSERT INTO userinfo (user_name,first_seen,last_seen,random_adjective) VALUES (?,?,?,?)',
			response: () => true,
			type: 'set'
		},
		updateUserFlags: {
			query: 'UPDATE userinfo SET is_broadcaster = ?,is_moderator = ?,is_founder = ?,is_vip = ?,is_subscriber = ? WHERE user_name = ?',
			response: () => true,
			type: 'set'
		},
		checkForUser: {
			query: 'SELECT EXISTS(SELECT * FROM userinfo WHERE user_name = ?)',
			response: (value) => { return (value == 1) ? true : false; },
			type: 'get'
		},
		updateLastSeen: {
			query: 'UPDATE userinfo SET last_seen = ? WHERE user_name = ?',
			response: () => true,
			type: 'set'
		},
		getLastSeen: {
			query: 'SELECT last_seen FROM userinfo WHERE user_name = ?',
			response: (value) => { return (value == false) ? false : value; },
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
		getCmdsCreated: {
			query: 'SELECT cmds_created FROM userinfo WHERE user_name = ?',
			response: (value) => { return value; },
			type: 'get'
		},
		setCmdsCreated: {
			query: 'UPDATE userinfo SET cmds_created = ? where user_name = ?',
			response: () => true,
			type: 'set'
		},
		getJokesCreated: {
			query: 'SELECT jokes_created FROM userinfo WHERE user_name = ?',
			response: (value) => { return value; },
			type: 'get'
		},
		setJokesCreated: {
			query: 'UPDATE userinfo SET jokes_created = ? where user_name = ?',
			response: () => true,
			type: 'set'
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
		getBitsCheered: {
			query: 'SELECT bits_cheered FROM userinfo WHERE user_name = ?',
			response: (value) => { return value; },
			type: 'get'
		},
		updateBitsCheered: {
			query: 'UPDATE userinfo SET bits_cheered = ? WHERE user_name = ?',
			response: () => true,
			type: 'set'
		},
		addJoke: {
			query: 'INSERT into jokes (joke_text,joke_cmd,joke_creator,added_on,joke_type) VALUES (?,?,?,?,?)',
			response: () => true,
			type: 'set'
		},
		isSub: {
			query: 'SELECT is_subscriber FROM userinfo WHERE user_name = ?',
			response: (value) => { return value == 1 ? true : false; },
			type: 'get'
		},
		isMod: {
			query: 'SELECT is_moderator FROM userinfo WHERE user_name = ?',
			response: (value) => { return value == 1 ? true : false; },
			type: 'get'
		},
		isVIP: {
			query: 'SELECT is_vip FROM userinfo WHERE user_name = ?',
			response: (value) => { return value == 1 ? true : false; },
			type: 'get'
		},
		isFounder: {
			query: 'SELECT is_founder FROM userinfo WHERE user_name = ?',
			response: (value) => { return value == 1 ? true : false; },
			type: 'get'
		},
		isBroadcaster: {
			query: 'SELECT is_broadcaster FROM userinfo WHERE user_name = ?',
			response: (value) => { return value == 1 ? true : false; },
			type: 'get'
		},
		setSub: {
			query: 'UPDATE userinfo SET is_subscriber = ? WHERE user_name = ?',
			response: () => true,
			type: 'set'
		},
		setSubTier: {
			query: 'UPDATE userinfo SET sub_tier = ? WHERE user_name = ?',
			response: () => true,
			type: 'set'
		},
		setSubStreak: {
			query: 'UPDATE userinfo SET sub_streak = ? WHERE user_name = ?',
			response: () => true,
			type: 'set'
		},
		setSubMonths: {
			query: 'UPDATE userinfo SET months_subbed = ? WHERE user_name = ?',
			response: () => true,
			type: 'set'
		},
		setLastMonthSubbed: {
			query: 'UPDATE userinfo SET last_month_subbed = ? WHERE user_name = ?',
			response: () => true,
			type: 'set'
		},
		setLastMonthSubbedName: {
			query: 'UPDATE userinfo SET last_month_subbed_name = ? WHERE user_name = ?',
			response: () => true,
			type: 'set'
		},
		setTier1GiftCount: {
			query: 'UPDATE userinfo SET tier1_subs_gifted = ? WHERE user_name = ?',
			response: () => true,
			type: 'set'
		},
		setTier2GiftCount: {
			query: 'UPDATE userinfo SET tier2_subs_gifted = ? WHERE user_name = ?',
			response: () => true,
			type: 'set'
		},
		setTier3GiftCount: {
			query: 'UPDATE userinfo SET tier3_subs_gifted = ? WHERE user_name = ?',
			response: () => true,
			type: 'set'
		},
		setTotalGiftCount: {
			query: 'UPDATE userinfo SET total_subs_gifted = ? WHERE user_name = ?',
			response: () => true,
			type: 'set'
		},
		setLastSubGifter: {
			query: 'UPDATE userinfo SET last_sub_gifter = ? WHERE user_name = ?',
			response: () => true,
			type: 'set'
		},
		setLastGiftSubRecipient: {
			query: 'UPDATE userinfo SET last_gift_sub_recipient = ? WHERE user_name = ?',
			response: () => true,
			type: 'set'
		},
		getSubbed: {
			query: 'SELECT is_subscriber FROM userinfo WHERE user_name = ?',
			response: (value) => { return value; },
			type: 'get'
		},
		getSubTier: {
			query: 'SELECT sub_tier FROM userinfo WHERE user_name = ?',
			response: (value) => { return value; },
			type: 'get'
		},
		getSubStreak: {
			query: 'SELECT sub_streak FROM userinfo WHERE user_name = ?',
			response: (value) => { return value; },
			type: 'get'
		},
		getSubMonths: {
			query: 'SELECT sub_months FROM userinfo WHERE user_name = ?',
			response: (value) => { return value; },
			type: 'get'
		},
		getLastMonthSubbed: {
			query: 'SELECT last_month_subbed FROM userinfo WHERE user_name = ?',
			response: (value) => { return value; },
			type: 'get'
		},
		getTier1GiftCount: {
			query: 'SELECT tier1_subs_gifted FROM userinfo WHERE user_name = ?',
			response: (value) => { return value; },
			type: 'get'
		},
		getTier2GiftCount: {
			query: 'SELECT tier2_subs_gifted FROM userinfo WHERE user_name = ?',
			response: (value) => { return value; },
			type: 'get'
		},
		getTier3GiftCount: {
			query: 'SELECT tier3_subs_gifted FROM userinfo WHERE user_name = ?',
			response: (value) => { return value; },
			type: 'get'
		},
		getTotalGiftCount: {
			query: 'SELECT total_subs_gifted FROM userinfo WHERE user_name = ?',
			response: (value) => { return value; },
			type: 'get'
		},
		getLastSubGifter: {
			query: 'SELECT last_sub_gifter FROM userinfo WHERE user_name = ?',
			response: (value) => { return value; },
			type: 'get'
		},
		getLastSubGiftRecipient: {
			query: 'SELECT  last_gift_sub_recipient FROM userinfo WHERE user_name = ?',
			response: (value) => { return value; },
			type: 'get',
		},
		setMod: {
			query: 'UPDATE userinfo SET is_moderator = ? WHERE user_name = ?',
			response: () => true,
			type: 'set'
		},
		setVIP: {
			query: 'UPDATE userinfo SET is_vip = ? WHERE user_name = ?',
			response: () => true,
			type: 'set'
		},
		setFounder: {
			query: 'UPDATE userinfo SET is_founder = ? WHERE user_name = ?',
			response: () => true,
			type: 'set'
		},
		getRaids: {
			query: 'SELECT times_raided FROM userinfo WHERE user_name = ?',
			response: (value) => { return value; },
			type: 'get'
		},
		addRaid: {
			query: 'UPDATE userinfo SET times_raided = ? WHERE user_name = ?',
			response: () => true,
			type: 'set'
		},
		getRaidSize: {
			query: 'SELECT largest_raid FROM userinfo WHERE user_name = ?',
			response: (value) => { return value; },
			type: 'get'
		},
		updateRaidSize: {
			query: 'UPDATE userinfo SET largest_raid = ? WHERE user_name = ?',
			response: () => true,
			type: 'set'
		},
		getHosts: {
			query: 'SELECT times_hosted FROM userinfo WHERE user_name = ?',
			reponse: (value) => { return value; },
			type: 'get'
		},
		addHost: {
			query: 'UPDATE userinfo SET times_hosted = ? WHERE user_name = ?',
			response: () => true,
			type: 'set'
		},
		getHostSize: {
			query: 'SELECT largest_host FROM userinfo WHERE user_name = ?',
			response: (value) => { return value; },
			type: 'get'
		},
		updateHostSize: {
			query: 'UPDATE userinfo SET largest_host = ? WHERE user_name = ?',
			response: () => true,
			type: 'set'
		},
		getTimesCheered: {
			query: 'SELECT times_cheered FROM userinfo WHERE user_name = ?',
			response: (value) => { return value; },
			type: 'get'
		},
		updateTimesCheered: {
			query: 'UPDATE userinfo SET times_cheered = ? WHERE user_name = ?',
			response: () => true,
			type: 'set'
		},
		getCmdsSent: {
			query: 'SELECT cmds_sent FROM userinfo WHERE user_name = ?',
			response: (value) => { return value; },
			type: 'get'
		},
		updateCmdsSent: {
			query: 'UPDATE userinfo SET cmds_sent = ? WHERE user_name = ?',
			response: () => true,
			type: 'set'
		},
		//
		// -- COMMANDS TABLE QUERIES --
		//
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
			query: 'DELETE FROM commands WHERE command = ?',
			response: () => true,
			type: 'set'
		},
		getCmdModLvl: {
			query: 'SELECT modlvl FROM commands WHERE command = ?',
			response: (value) => { return value; },
			type: 'get'
		},
		//
		// -- JOKES TABLE QUERIES --
		//
		getJokeByCmd: {
			query: 'SELECT joke_text FROM jokes WHERE joke_cmd = ?',
			response: (value) => { return value; },
			type: 'get'
		},
		getJokeByID: {
			query: 'SELECT joke_text FROM jokes WHERE joke_id = ?',
			response: (value) => { return value; },
			type: 'get'
		},
		getRandomJokeByType: {
			query: 'SELECT joke_syntax FROM jokes WHERE joke_type = ? ORDER BY RAND() LIMIT 1',
			response: (value) => { return value; },
			type: 'get'
		},
		getRandomJoke: {
			query: 'SELECT joke_syntax FROM jokes ORDER BY RAND() LIMIT 1',
			response: (value) => { return value; },
			type: 'get'
		},
		removeJokeByCmd: {
			query: 'DELETE FROM jokes WHERE joke_cmd = ?',
			response: () => true,
			type: 'set'
		},
		removeJokeByID: {
			query: 'DELETE FROM jokes WHERE joke_id = ?',
			response: () => true,
			type: 'set'
		},
		//
		// -- SERVER_DATA TABLE QUERIES --
		//
		/*getStreamCount: {
			query: 'SELECT stream_count FROM server_data',
			response: (value) => { return value; },
			type: 'get'
		},
		setStreamCount: {
			query: 'UPDATE server_data SET stream_count = ?',
			response: () => true,
		},
		getTopCheerer: {
			query: 'SELECT top_cheerer FROM server_data',
			response: (value) => { return value; },
			type: 'get'
		},
		setTopCheerer: {
				query: 'UPDATE server_data SET top_cheerer = ?',
				response: () => true,
				type: 'set'
		},
		getTopRaider: {
				query: 'SELECT top_raider FROM server_data',
				response: (value) => { return value; },
				type: 'get'
		},
		setTopRaider: {
				query: 'UPDATE server_data SET top_raider = ?',
				response: () => true,
				type: 'set'
		},
		getTopHost: {
				query: 'SELECT top_host FROM server_data',
				response: (value) => { return value; },
				type: 'get'
		},
		setTopHost: {
				query: 'UPDATE server_data SET top_host = ?',
				response: () => true,
				type: 'set'
		},
		getTopTipper: {
				query: 'SELECT top_tipper FROM server_data',
				response: (value) => { return value; },
				type: 'get'
		},
		setTopTipper: {
				query: 'UPDATE server_data SET top_tipper = ?',
				response: () => true,
				type: 'set'
		},
		getBiggestCheer: {
				query: 'SELECT biggest_cheer FROM server_data',
				response: (value) => { return value; },
				type: 'get'
		},
		setBiggestCheer: {
				query: 'UPDATE server_data SET biggest_cheer = ?',
				response: () => true,
				type: 'set'
		},
		getBiggestRaid: {
				query: 'SELECT biggest_raid FROM server_data',
				response: (value) => { return value; },
				type: 'get'
		},
		setBiggestRaid: {
				query: 'UPDATE server_data SET biggest_raid = ?',
				response: () => true,
				type: 'set'
		},
		getBiggestHost: {
				query: 'SELECT biggest_host FROM server_data',
				response: (value) => { return value; },
				type: 'get'
		},
		setBiggestHost: {
				query: 'UPDATE server_data SET biggest_host = ?',
				response: () => true,
				type: 'set'
		},
		getBiggestTip: {
				query: 'SELECT biggest_tip FROM server_data',
				response: (value) => { return value; },
				type: 'get'
		},
		setBiggestTip: {
				query: 'UPDATE server_data SET biggest_tip = ?',
				response: () => true,
				type: 'set'
		},
		getCheerRecordDate: {
				query: 'SELECT cheer_record_date FROM server_data',
				response: (value) => { return value; },
				type: 'get'
		},
		setCheerRecordDate: {
				query: 'UPDATE server_data SET cheer_record_date = ?',
				response: () => true,
				type: 'set'
		},
		getRaidRecordDate: {
				query: 'SELECT raid_record_date FROM server_data',
				response: (value) => { return value; },
				type: 'get'
		},
		setRaidRecordDate: {
				query: 'UPDATE server_data SET raid_record_date = ?',
				response: () => true,
				type: 'set'
		},
		getHostRecordDate: {
				query: 'SELECT host_record_date FROM server_data',
				response: (value) => { return value; },
				type: 'get'
		},
		setHostRecordDate: {
				query: 'UPDATE server_data SET host_record_date = ?',
				response: () => true,
				type: 'set'
		},
		getTipRecordDate: {
				query: 'SELECT tip_record_date FROM server_data',
				response: (value) => { return value; },
				type: 'get'
		},
		setTipRecordDate: {
				query: 'UPDATE server_data SET tip_record_date = ?',
				response: () => true,
				type: 'set'
		},
		getTopChatter: {
				query: 'SELECT top_chatter FROM server_data',
				response: (value) => { return value; },
				type: 'get'
		},
		setTopChatter: {
				query: 'UPDATE server_data SET top_chatter = ?',
				response: () => true,
				type: 'set'
		},
		getChatRecord: {
				query: 'SELECT chat_record FROM server_data',
				response: (value) => { return value; },
				type: 'get'
		},
		setChatRecord: {
				query: 'UPDATE server_data SET chat_record = ?',
				response: () => true,
				type: 'set'
		},
		getTopViewer: {
				query: 'SELECT top_vieweer FROM server_data',
				response: (value) => { return value; },
				type: 'get'
		},
		setTopViewer: {
				query: 'UPDATE server_data SET top_viewer = ?',
				response: () => true,
				type: 'set'
		},
		getViewerRecord: {
				query: 'SELECT viewer_record FROM server_data',
				response: (value) => { return value; },
				type: 'get'
		},
		setViewerRecord: {
				query: 'UPDATE server_data SET viewer_record = ?',
				response: () => true,
				type: 'set'
		},
		getHardcodedCommandCount: {
				query: 'SELECT hardcoded_command_count FROM server_data',
				response: (value) => { return value; },
				type: 'get'
		},
		setHardcodedCommandCount: {
				query: 'UPDATE server_data SET hardcoded_command_count = ?',
				response: () => true,
				type: 'set'
		},
		getCustomCommandCount: {
				query: 'SELECT custom_command_count FROM server_data',
				response: (value) => { return value; },
				type: 'get'
		},
		setCustomCommandCount: {
				query: 'UPDATE server_data SET custom_command_count = ?',
				response: () => true,
				type: 'set'
		},
		getTotalCommandCount: {
				query: 'SELECT total_command_count FROM server_data',
				response: (value) => { return value; },
				type: 'get'
		},
		setTotalCommandCount: {
				query: 'UPDATE server_data SET total_command_count = ?',
				response: () => true,
				type: 'set'
		},
		getTotalUserCount: {
				query: 'SELECT total_user_count FROM server_data',
				response: (value) => { return value; },
				type: 'get'
		},
		setTotalUserCount: {
				query: 'UPDATE server_data SET total_user_count = ?',
				response: () => true,
				type: 'set'
		},
		getViewershipRecord: {
				query: 'SELECT viewership_record FROM server_data',
				response: (value) => { return value; },
				type: 'get'
		},
		setViewershipRecord: {
				query: 'UPDATE server_data SET viewership_record = ?',
				response: () => true,
				type: 'set'
		},
		getViewershipRecordDate: {
				query: 'SELECT viewership_record_date FROM server_data',
				response: (value) => { return value; },
				type: 'get'
		},
		setViewershipRecordDate: {
				query: 'UPDATE server_data SET viewership_record_date = ?',
				response: () => true,
				type: 'set'
		},
		getJokeCount: {
				query: 'SELECT joke_count FROM server_data',
				response: (value) => { return value; },
				type: 'get'
		},
		setJokeCount: {
				query: 'UPDATE server_data SET joke_count = ?',
				response: () => true,
				type: 'set'
		},
		getTopJokeCreator: {
				query: 'SELECT top_joke_creator FROM server_data',
				response: (value) => { return value; },
				type: 'get'
		},
		setTopJokeCreator: {
				query: 'UPDATE server_data SET top_joke_creator = ?',
				response: () => true,
				type: 'set'
		},
		getTopCommandCreator: {
				query: 'SELECT top_command_creator FROM server_data',
				response: (value) => { return value; },
				type: 'get'
		},
		setTopCommandCreator: {
				query: 'UPDATE server_data SET top_command_creator = ?',
				response: () => true,
				type: 'set'
		},
		getLongestSubscriber: {
			query: 'SELECT longest_subscriber FROM server_data',
			response: (value) => { return value; },
			type: 'get'
		},
		setLongestSubscriber: {
			query: 'UPDATE server_data SET longest_subscriber = ?',
			response: () => true,
			type: 'set'
		},
		getLongestSubscriberRecord: {
			query: 'SELECT longest_subscriber_record FROM server_data',
			response: (value) => { return value; },
			type: 'get'
		},
		setLongestSubscriberRecord: {
			query: 'UPDATE server_data SET longest_subscriber_record = ?',
			response: () => true,
			type: 'set'
		},*/
		//
		// -- STATS TABLE QUERIES --
		//

		// - GET QUERIES -
		getStreamCountRecord: {
			query: 'SELECT * FROM stats WHERE stat_id = "1"',
			response: (value) => { return value; },
			type: 'get'
		},
		getCheeringRecord: {
			query: 'SELECT * FROM stats WHERE stat_id = "2"',
			type: 'get'
		},
		getSingleCheerRecord: {
				query: 'SELECT * FROM stats WHERE stat_id = "3"',
				response: (value) => { return value; },
				type: 'get'
		},
		getStreamCheersRecord: {
				query: 'SELECT * FROM stats WHERE stat_id = "4"',
				response: (value) => { return value; },
				type: 'get'
		},
		getBiggestRaidRecord: {
				query: 'SELECT * FROM stats WHERE stat_id = "5"',
				response: (value) => { return value; },
				type: 'get'
		},
		getMostRaidsRecord: {
				query: 'SELECT * FROM stats WHERE stat_id = "6"',
				response: (value) => { return value; },
				type: 'get'
		},
		getBiggestHostRecord: {
				query: 'SELECT * FROM stats WHERE stat_id = "7"',
				response: (value) => { return value; },
				type: 'get'
		},
		getMostHostsRecord: {
				query: 'SELECT * FROM stats WHERE stat_id = "8"',
				response: (value) => { return value; },
				type: 'get'
		},
		getBiggestTipRecord: {
				query: 'SELECT * FROM stats WHERE stat_id = "9"',
				response: (value) => { return value; },
				type: 'get'
		},
		getMostTipsRecord: {
				query: 'SELECT * FROM stats WHERE stat_id = "10"',
				response: (value) => { return value; },
				type: 'get'
		},
		getBiggestTipPoolRecord: {
				query: 'SELECT * FROM stats WHERE stat_id = "11"',
				response: (value) => { return value; },
				type: 'get'
		},
		getTopChatterRecord: {
				query: 'SELECT * FROM stats WHERE stat_id = "12"',
				response: (value) => { return value; },
				type: 'get'
		},
		getTopViewerRecord: {
				query: 'SELECT * FROM stats WHERE stat_id = "13"',
				response: (value) => { return value; },
				type: 'get'
		},
		getHardcodedCommandCountRecord: {
				query: 'SELECT * FROM stats WHERE stat_id = "14"',
				response: (value) => { return value; },
				type: 'get'
		},
		getCustomCommandCountRecord: {
				query: 'SELECT * FROM stats WHERE stat_id = "15"',
				response: (value) => { return value; },
				type: 'get'
		},
		getTotalCommandCountRecord: {
				query: 'SELECT * FROM stats WHERE stat_id = "16"',
				response: (value) => { return value; },
				type: 'get'
		},
		getViewershipRecord: {
				query: 'SELECT * FROM stats WHERE stat_id = "17"',
				response: (value) => { return value; },
				type: 'get'
		},
		getJokeCountRecord: {
				query: 'SELECT * FROM stats WHERE stat_id = "18"',
				response: (value) => { return value; },
				type: 'get'
		},
		getTopCommandCreatorRecord: {
				query: 'SELECT * FROM stats WHERE stat_id = "19"',
				response: (value) => { return value; },
				type: 'get'
		},
		getTopJokeCreatorRecord: {
				query: 'SELECT * FROM stats WHERE stat_id = "20"',
				response: (value) => { return value; },
				type: 'get'
		},
		getLongestSubscriberRecord: {
				query: 'SELECT * FROM stats WHERE stat_id = "21"',
				response: (value) => { return value; },
				type: 'get'
		},
		// - SET QUERIES -
		setStreamCountRecord: {
			query: 'SELECT * FROM stats WHERE stat_id = "1"',
			response: () => true,
			type: 'set'
		},
		setCheeringRecord: {
			query: 'UPDATE stats SET stat_record_value = ?, stat_record_holder = ?, stat_record_date = ? WHERE stat_id = "2"',
			response: () => true,
			type: 'set'
		},
		setSingleCheerRecord: {
			query: 'UPDATE stats SET stat_record_value = ?, stat_record_holder = ?, stat_record_date = ? WHERE stat_id = "3"',
			response: () => true,
			type: 'set'
		},
		setStreamCheersRecord: {
			query: 'UPDATE stats SET stat_record_value = ?, stat_record_holder = ?, stat_record_date = ? WHERE stat_id = "4"',
			response: () => true,
			type: 'set'
		},
		setBiggestRaidRecord: {
				query: 'UPDATE stats SET stat_record_value = ?, stat_record_holder = ?, stat_record_date = ? WHERE stat_id = "5"',
				response: () => true,
				type: 'set'
		},
		setMostRaidsRecord: {
				query: 'UPDATE stats SET stat_record_value = ?, stat_record_holder = ?, stat_record_date = ? WHERE stat_id = "6"',
				response: () => true,
				type: 'set'
		},
		setBiggestHostRecord: {
				query: 'UPDATE stats SET stat_record_value = ?, stat_record_holder = ?, stat_record_date = ? WHERE stat_id = "7"',
				response: () => true,
				type: 'set'
		},
		setMostHostsRecord: {
				query: 'UPDATE stats SET stat_record_value = ?, stat_record_holder = ?, stat_record_date = ? WHERE stat_id = "8"',
				response: () => true,
				type: 'set'
		},
		setBiggestTipRecord: {
				query: 'UPDATE stats SET stat_record_value = ?, stat_record_holder = ?, stat_record_date = ? WHERE stat_id = "9"',
				response: () => true,
				type: 'set'
		},
		setMostTipsRecord: {
				query: 'UPDATE stats SET stat_record_value = ?, stat_record_holder = ?, stat_record_date = ? WHERE stat_id = "10"',
				response: () => true,
				type: 'set'
		},
		setBiggestTipPoolRecord: {
				query: 'UPDATE stats SET stat_record_value = ?, stat_record_holder = ?, stat_record_date = ? WHERE stat_id = "11"',
				response: () => true,
				type: 'set'
		},
		setTopChatterRecord: {
				query: 'UPDATE stats SET stat_record_value = ?, stat_record_holder = ?, stat_record_date = ? WHERE stat_id = "12"',
				response: () => true,
				type: 'set'
		},
		setTopViewerRecord: {
				query: 'UPDATE stats SET stat_record_value = ?, stat_record_holder = ?, stat_record_date = ? WHERE stat_id = "13"',
				response: () => true,
				type: 'set'
		},
		setHardcodedCommandCountRecord: {
				query: 'UPDATE stats SET stat_record_value = ?, stat_record_holder = ?, stat_record_date = ? WHERE stat_id = "14"',
				response: () => true,
				type: 'set'
		},
		setCustomCommandCountRecord: {
				query: 'UPDATE stats SET stat_record_value = ?, stat_record_holder = ?, stat_record_date = ? WHERE stat_id = "15"',
				response: () => true,
				type: 'set'
		},
		setTotalCommandCountRecord: {
				query: 'UPDATE stats SET stat_record_value = ?, stat_record_holder = ?, stat_record_date = ? WHERE stat_id = "16"',
				response: () => true,
				type: 'set'
		},
		setViewershipRecord: {
				query: 'UPDATE stats SET stat_record_value = ?, stat_record_holder = ?, stat_record_date = ? WHERE stat_id = "17"',
				response: () => true,
				type: 'set'
		},
		setJokeCountRecord: {
				query: 'UPDATE stats SET stat_record_value = ?, stat_record_holder = ?, stat_record_date = ? WHERE stat_id = "18"',
				response: () => true,
				type: 'set'
		},
		setTopCommandCreatorRecord: {
				query: 'UPDATE stats SET stat_record_value = ?, stat_record_holder = ?, stat_record_date = ? WHERE stat_id = "19"',
				response: () => true,
				type: 'set'
		},
		setTopJokeCreatorRecord: {
				query: 'UPDATE stats SET stat_record_value = ?, stat_record_holder = ?, stat_record_date = ? WHERE stat_id = "20"',
				response: () => true,
				type: 'set'
		},
		setLongestSubscriberRecord: {
				query: 'UPDATE stats SET stat_record_value = ?, stat_record_holder = ?, stat_record_date = ? WHERE stat_id = "21"',
				response: () => true,
				type: 'set'
		}

	}
						
	const querySQL = functions?.[functionName]?.query;

	try {

		const result = await execDB.query(querySQL, queryData);

		/*if (functions?.[functionName] == 'checkForUser') {
			if (!result || !result.length || typeof result == 'undefined') {
				return false;
			} else {
				//return functions?.[functionName]?.response;
				return true;
			}
		}*/
		
		if (functions?.[functionName]?.type == 'get') {
			
			const resObj = result[0];
			const key = Object.keys(resObj)[0];
			const value = resObj[key];
			
			if (!result || !result.length) {
				console.log(` SQL LOG (${time()}): execQuery returned FALSE for ${querySQL}`);
				return false;
			}

			return functions?.[functionName]?.response(value);

		} else if (functions?.[functionName]?.type == 'set') {
			if (result.affectedRows > 0) {
				return functions?.[functionName]?.response;
			}
			else {
				console.log(` SQL LOG (${time()}): Result Header Info: ${result.info}`);
				return false;
			}
		} else {
			console.error(` SQL LOG (${time()}): Returned unknown functionName type property error`);
			return false;
		}
	} catch (e) {
		if (functions?.[functionName] == 'checkForUser') {
			return functions?.[functionName]?.response;
		}
		console.error(` SQL LOG (${time()}): Error catch for query '${querySQL}' - Error: ${e.message}`);
		console.dir(queryData);
		return false;
	}
};



//
// --- START OF QUERY FUNCTIONS ---
//


//
// ---- USERINFO TABLE FUNCTIONS ----
//



const dbCheckForUser = async (username) => {
	
	const user = username.toString();
	const queryResponse = await execQuery('checkForUser', user);
	
	return (queryResponse) ? true : false;
	
};

const dbAddUser = async (username) => {
	
	if (await dbCheckForUser(username) == true) { return false; }

		const todaysDate = getCurrentDate();
		const randomAdjective = generateRandomAdjective();
		const insertData = [
			username,
			todaysDate,
			todaysDate,
			randomAdjective,
		];
	
		const queryResponse = await execQuery('addUser', insertData);
		
		console.log(` SQL LOG (${time()}): Successfully added user ${username}!`);
		
	return (queryResponse) ? true : false;
};

const dbUpdateUserFlags = async (userDataObj) => {

	const insertData = [
		userDataObj.broadcaster,
		userDataObj.moderator,
		userDataObj.founder,
		userDataObj.vip,
		userDataObj.subscriber,
		userDataObj.username
	];

	const queryResponse = await execQuery('updateUserFlags', insertData);

	return queryResponse ? true : false;
}

const dbGetAdjective = async (username) => {
	
	const queryResponse = await execQuery('getAdjective', [username]);
		
	return (queryResponse) ? queryResponse : false;
};

const dbUpdateLastSeen = async (username) => {

	const todaysDate = getCurrentDate();
	const insertData = [
		todaysDate,
		username
	];

	const oldLastSeen = await dbGetLastSeen(username);
	JSON.stringify(oldLastSeen);
	if (oldLastSeen == false || typeof oldLastSeen == 'undefined') {
		return false;
	} else if (oldLastSeen == todaysDate) {
		return true;
	}

	const queryResponse = await execQuery('updateLastSeen', insertData);

	return (queryResponse) ? true : false;

};

const dbGetLastSeen = async (username) => {

	const queryResponse = await execQuery('getLastSeen', username);

	const responseString = JSON.stringify(queryResponse);

	const year = responseString.substring(1, 5);
	const month = responseString.substring(6, 8);
	const day = responseString.substring(9, 11);
	
	const lastSeenDate = year + '-' + month + '-' + day;

	return (queryResponse) ? lastSeenDate : false;

};

const dbGetTokens = async (username) => {

	const queryResponse = await execQuery('getTokens', [username]);

	return (queryResponse) ? queryResponse : false;

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

		return (updateResponse) ? newAmt : false;
	}
};

const dbGetUserFlags = async (username) => {

	const queryResponse = await execQuery('getUserFlags', [username]);

	if (!queryResponse) {
		console.log(` SQL LOG (${time()}): SELECT Query 'getUserFlags' returned FALSE for data payload '${username}'.`);
		return false;
	} else if (queryResponse) {
		console.log(` SQL LOG (${time()}): SELECT Query 'getUserFlags' returned TRUE for data payload '${username}'.`);
		return true;
	}
};

const dbGetMsgCount = async (username) => {
	
	const queryResponse = await execQuery('getMsgCount', username);
	
	return (queryResponse) ? queryResponse : false;
	
};

const dbUpdateMsgCount = async (username) => {

	const newCount = (await dbGetMsgCount(username)) + 1;
	const insertData = [
		newCount,
		username
	];
	
	const queryResponse = await execQuery('updateMsgCount', insertData);

	return (queryResponse) ? newCount : false;	
};

const dbGetBitsCheered = async (username) => {

	const queryResponse = await execQuery('getBitsCheered', [username]);

	return (queryResponse) ? queryResponse : false;

};

const dbUpdateBitsCheered = async (username, newBits) => {

	const origBitCount = await dbGetBitsCheered(username);
	const newBitCount = origBitCount + newBits;
	const insertData = [
		newBitCount,
		username
	];

	const queryResponse = await execQuery('updateBitsCheered', insertData);

	return (queryResponse) ? newBitCount : false;
	
};

const dbGetTimesCheered = async (username) => {

	const queryResponse = await execQuery('getTimesCheered', [username]);

	return (queryResponse) ? queryResponse : false;
}

const dbUpdateTimesCheered = async (username) => {

	const newTimesCheered = (await dbGetTimesCheered(username)) + 1;
	const insertData = [
		newTimesCheered,
		username
	];

	if (newTimesCheered) {
	
		const queryResponse = await execQuery('updateTimesCheered', insertData);

		return (queryResponse) ? newTimesCheered : false;
	} else {
		return false;
	}
}

const dbIsMod = async (username) => {	return (await execQuery('isMod', [username])) ? true : false; }

const dbIsSub = async (username) => {	return (await execQuery('isSub', [username])) ? true : false; }

const dbIsVIP = async (username) => {	return (await execQuery('isVIP', [username])) ? true : false; }

const dbIsFounder = async (username) => {	return (await execQuery('isFounder', [username])) ? true : false; }

const dbIsBroadcaster = async (username) => { return (await execQuery('isBroadcaster', [username])) ? true : false; }

const dbGetSubInfo = async (username) => {
    
	const subTierInfo = {
        "isSubbed": (await execQuery('getSubbed', [username])) ?? false,
        "monthsSubbed": (await execQuery('getSubMonths', [username])) ?? false,
        "subStreak": (await execQuery('getSubStreak', [username])) ?? false,
		"subTier": (await execQuery('getSubTier', [username])) ?? false,
		"lastMonthSubbed": (await execQuery('getLastMonthSubbed', [username])) ?? false
	};
	
    return (!subTierInfo.find(item => item === false)) ? subTierInfo : false;
};

const dbUpdateSub = async (username, subInfo) => {

	if (subInfo.isSub) { const updateSub = await execQuery('setSub', [subInfo.isSub, username]); }
	if (subInfo.monthsSubbed) { const monthsSubbed = await execQuery('setSubMonths', [subInfo.monthsSubbed, username]); }
	if (subInfo.lastMonthSubbed) { const lastMonthSubbed = await execQuery('setLastMonthSubbed', [subInfo.lastMonthSubbed, username]); }
	if (subInfo.subStreak) { const subStreak = await execQuery('setSubStreak', [subInfo.subStreak, username]); }
	if (subInfo.subTier) { const subTier = await execQuery('setSubTier', [subInfo.subTier, username]); }

	switch (subInfo.lastMonthSubbed) {
		case 0:
			break;
		case 1:
			await execQuery('setLastMonthSubbedName', ["January", username]);
			break;
		case 2:
			await execQuery('setLastMonthSubbedName', ["February", username]);
			break;
		case 3:
			await execQuery('setLastMonthSubbedName', ["March", username]);
			break;
		case 4:
			await execQuery('setLastMonthSubbedName', ["April", username]);
			break;
		case 5:
			await execQuery('setLastMonthSubbedName', ["May", username]);
			break;
		case 6:
			await execQuery('setLastMonthSubbedName', ["June", username]);
			break;
		case 7:
			await execQuery('setLastMonthSubbedName', ["July", username]);
			break;
		case 8:
			await execQuery('setLastMonthSubbedName', ["August", username]);
			break;
		case 9:
			await execQuery('setLastMonthSubbedName', ["September", username]);
			break;
		case 10:
			await execQuery('setLastMonthSubbedName', ["October", username]);
			break;
		case 11:
			await execQuery('setLastMonthSubbedName', ["November", username]);
			break;
		case 12:
			await execQuery('setLastMonthSubbedName', ["December", username]);
			break;
		default:
			break;
	}
	
	console.log(` SQL LOG: ${username}'s sub info updated. isSub: ${updateSub} | monthsSubbed: ${monthsSubbed} | lastMonthSubbed: ${lastMonthSubbed} | subStreak: ${subStreak} | subTier: ${subTier}`);
	
	const queryResponse = (!updateSub || !monthsSubbed || !subTier) ? false : true;
	return queryResponse;

}

const dbUpdateGiftSubs = async (subInfo) => {	

	const senderCount = subInfo.senderCount;
	const subTier = subInfo.subTier;
	const giftedTo = subInfo.giftedTo;
	const giftedBy = subInfo.giftedBy;

	let tierGiftCount;
	let newGiftCount;
	let queryResponse;

	switch (subTier) {
		case 1:
			tierGiftCount = await execQuery('getTier1GiftCount', [giftedBy]);
			newGiftCount = tierGiftCount + senderCount;
			queryResponse = await execQuery('setTier1GiftSubs', [newGiftCount, giftedBy]);
			break;
		case 2:
			tierGiftCount = await execQuery('getTier2GiftCount', [giftedBy]);
			newGiftCount = tierGiftCount + senderCount;
			queryResponse = await execQuery('setTier1GiftSubs', [newGiftCount, giftedBy]);
			break;
		case 3:
			tierGiftCount = await execQuery('getTier3GiftCount', [giftedBy]);
			newGiftCount = tierGiftCount + senderCount;
			queryResponse = await execQuery('setTier1GiftSubs', [newGiftCount, giftedBy]);	
			break;
		default:
			console.log(` SQL LOG (${time()}): Error parsing gift sub tier, did not return an integer 1/2/3.`);
			return false;
	};

	const currentStreak = await execQuery('getCurrentStreak');
	const newTotalCount = (await execQuery('getTotalGiftCount', [giftedBy])) + senderCount;
	const updateTotalCount = await execQuery('setTotalGiftCount', [newTotalCount, giftedBy]);
	const updateGifterRecip = await execQuery('setGifterRecip', [giftedBy, giftedTo]);
	const updateRecipientGifter = await execQuery('setLastGiftSubRecipient', [giftedTo, giftedBy]);

	const successFlag = (queryResponse == true && newTotalCount == true && updateTotalCount == true && updateGifterRecip == true && updateRecipientGifter == true) ? true : false;
	
	return (successFlag == true) ? true : false;	
}

const dbGetRaids = async (username) => {

	const queryResponse = await execQuery('getRaids', [username]);

	return (queryResponse) ? queryResponse : false;
}

const dbIncRaidCount = async (username) => {

	const newRaidCount = (await dbGetRaids(username)) + 1;

	if (!newRaidCount) { return false; }

	const insertData = [
		newRaidCount,
		username];
	const queryResponse = await execQuery('addRaid', insertData);

	return (queryResponse) ? newRaidCount : false;
}

const dbGetRaidSize = async (username) => {

	const queryResponse = await execQuery('getRaidSize', [username]);

	return (queryResponse) ? queryResponse : false;
}

const dbUpdateRaidSize = async (username, latestRaidSize) => {

	const lastBiggestRaid = await dbGetRaidSize(username);

	if (lastBiggestRaid < latestRaidSize) {
		const insertData = [
			latestRaidSize,
			username];
		const queryResponse = await execQuery('updateRaidSize', insertData);

		return (queryResponse) ? queryResponse : false;
	} else {
		return false;
	}
}

const dbGetHosts = async (username) => {

	const queryResponse = await execQuery('getHosts', [username]);

	return (queryResponse) ? queryResponse : false;
}

const dbIncHostCount = async (username) => {

	const newHostCount = (await dbGetHosts(username)) + 1;

	if (!newHostCount) { return false; }

	const insertData = [
		newHostCount,
		username];
	const queryResponse = await execQuery('addHost', insertData);

	return (queryResponse) ? newHostCount : false;
}

const dbGetHostSize = async (username) => {

	const queryResponse = await execQuery('getHostSize', [username]);

	return (queryResponse) ? queryResponse : false;
}

const dbUpdateHostSize = async (username, latestHostSize) => {

	const lastBiggestHost = await dbGetHostSize(username);

	if (lastBiggestHost < latestHostSize) {
		const insertData = [
			latestHostSize,
			username];
		const queryResponse = await execQuery('updateHostSize', insertData);

		return (queryResponse) ? queryResponse : false;
	} else {
		return false;
	}
}

const dbGetCmdsSent = async (username) => {

	const queryResponse = await execQuery('getCmdsSent', [username]);

	return (queryResponse) ? queryResponse : false;
}

const dbUpdateCmdsSent = async (username) => {

	const newCmdsSent = (await dbGetCmdsSent(username)) + 1;
	
	if (newCmdsSent) {

		const insertData = [
			newCmdsSent,
			username];
	
		const queryResponse = await execQuery('updateCmdsSent', insertData);
		
		return (queryResponse) ? newCmdsSent : false;
	} else {
		return false;
	}
}

const dbGetCmdsCreated = async (username) => {

	const queryResponse = await execQuery('getCmdsCreated', [username]);

	return (queryResponse) ? queryResponse : false;
}

const dbUpdateCmdsCreated = async (username) => {

	const newCmdCount = (await dbGetCmdsCreated(username)) + 1;

	const queryResponse = await execQuery('setCmdsCreated', [newCmdCount, username]);

	return (queryResponse) ? true : false;
}

const dbGetJokesCreated = async (username) => {

	const queryResponse = await execQuery('getJokesCreated', [username]);

	return (queryResponse) ? queryResponse : false;
}

const dbUpdateJokesCreated = async (username) => {

	const newJokeCount = (await dbGetJokesCreated(username)) + 1;

	const queryResponse = await execQuery('setJokesCreated', [newJokeCount, username]);

	return (queryResponse) ? true : false;
}
//
// ---- COMMANDS TABLE FUNCTIONS ----
//



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

	const cmdsCreatedTotal = (await execQuery('getCmdsCreated', [cmdDataObj.creator])) + 1;
	const cmdsCreatedUpdated = await execQuery('setCmdsCreated', [cmdsCreatedTotal, cmdDataObj.creator]);

	if (cmdsCreatedUpdated == false) {
		return false;
	} else {
		if (!queryResponse) {
			console.log(` SQL LOG (${time()}): INSERT Query 'addCmd' returned FALSE for data payload '${insertData[0]}'.`);
			return false;
		} else if (queryResponse) {
			console.log(` SQL LOG (${time()}): INSERT Query 'addCmd' returned TRUE for data payload '${insertData[0]}'.`);
			return true;
		}
	}

	
};

const dbGetCmd = async (cmd, user) => {

	const queryResponse = await execQuery('getCmd', [cmd]);

	if (!queryResponse) {
		console.log(` SQL LOG(${time()}): Custom command '${cmd}' not found. Attmpted by user '${user}'`);
		return false;
	} else if (queryResponse) {

		ComfyJS.Say(`${queryResponse}`);
		

		const newUsage = (await execQuery('getCmdUsage', [cmd])) + 1;
		const insertData = [
			newUsage,
			cmd
		];

		const updateResponse = await execQuery('updateCmdUsage', insertData);

		return (queryResponse) ? queryResponse : false;
			
	}
};

const dbRemoveCmd = async (cmd, username, userModLvl) => {

	const modLvlResponse = await execQuery('getCmdModLvl', [cmd]);
	if (!modLvlResponse) {
		console.log(` SQL LOG (${time()}): SELECT Query 'getCmdModLvl' returned FALSE for data payload '${cmd}'.`);
		return false;
	} else if (modLvlResponse) {
		console.log(` SQL LOG (${time()}): SELECT Query 'getCmdModLvl' returned TRUE for data payload '${cmd}'.`);
		
		if (modLvlResponse > userModLvl) {
			ComfyJS.Say(`Sorry, @${username}, but you are not allowed to delete this command due to having a lower user privilege level than its creator (${userModLvl} versus ${modLvlResponse}).`);
			console.log(` SQL LOG (${time()}): User '${username} attempted to remove custom command '${cmd}' but failed due to a lower privilege level (${userModLvl} versus ${modLvlResponse}).`);
			return false;
		} else {

			const queryResponse = await execQuery('removeCmd', [cmd]);

			if (!queryResponse) {
				ComfyJS.Say(`Sorry, @${username}, but I encountered an unknown error while removing the command. Feel free to try again.`);
				console.log(` SQL LOG (${time()}): DELETE Query 'removeCmd' returned FALSE for data payload '${cmd}'.`);
				return false;
			} else if (queryResponse) {
				ComfyJS.Say(`Custom command '${cmd}' successfully deleted, @${username}. Honor its memory.`);
				console.log(` SQL LOG (${time()}): DELETE Query 'removeCmd' returned TRUE for data payload '${cmd}'.`);
				return true;
			}
		}
	}
};



//
// ---- JOKES TABLE FUNCTIONS ----
//



const dbAddJoke = async (newJokeObj) => {

	const todaysDate = getCurrentDate();
	const insertData = [
		newJokeObj.jokeData,
		newJokeObj.jokeType,
		newJokeObj.username,
		todaysDate		
	];

	const queryResponse = await execQuery('addJoke', insertData);

	if (queryResponse) {
		await execQuery('setJokesCreated', [newJokeObj.username]);
	}

	return (queryResponse) ? true : false;
};

const dbGetJoke = async (jokeIdentifier, jokeType) => {

	let selectType;
	let queryResponse;
	let jokeCmd;
	let jokeID;
	if (typeof jokeIdentifier == 'string') {
		jokeCmd = jokeIdentifier;
		selectType = 'CMD';
	} else if (typeof jokeIdentifier == 'integer') {
		jokeID = jokeIdentifier;
		selectType = 'ID';
	} else {

		return false;
	}

	if (jokeType == 'dad' || jokeType == 'generic' || jokeType == 'riddle') {	
		queryResponse = await execQuery('getRandomJokeByType', [jokeType]);
		if (queryResponse) {
			console.log(` SQL LOG (${time()}): SELECT Query 'getRandomJokeByType' returned TRUE for data payload '${jokeType}'.`);
			return queryResponse;
		} else {
			console.log(` SQL LOG (${time()}): SELECT Query 'getRandomJokeByType' returned FALSE for data payload '${jokeType}'.`);
			return false;
		}
	} else if (typeof jokeType == 'undefined' && typeof jokeIdentifier == 'undefined') {
		queryResponse = await execQuery('getRandomJoke');
		if (queryResponse) {
			console.log(` SQL LOG (${time()}): SELECT Query 'getRandomJoke' returned TRUE.`);
			return queryResponse;
		} else {
			console.log(` SQL LOG (${time()}): SELECT Query 'getRandomJoke' returned FALSE.`);
			return false;
		}
	}

	if (selectType === 'CMD') {
		if (typeof jokeType == 'undefined') {
			queryResponse = await execQuery('getJokeByCmd', [jokeCmd]);
		} else {
			
		}
	}
	if (selectType === 'ID') {
		if (typeof jokeType == 'undefined') {
			queryResponse = await execQuery('getJokeByID', [jokeID]);
		}
	}

	if (!queryResponse && selectType === 'CMD') {
		console.log(` SQL LOG (${time()}): SELECT Query 'getJokeByCmd' returned FALSE for data payload '${jokeIdentifier}'.`);
		return false;
	} else if (!queryResponse && selectType === 'ID') {
		console.log(` SQL LOG (${time()}): SELECT Query 'getJokeByID' returned FALSE for data payload '${jokeIdentifier}'.`);
		return false;
	} else if (queryResponse && selectType === 'CMD') {
		console.log(` SQL LOG (${time()}): SELECT Query 'getJokeByCmd' returned TRUE for data payload '${jokeIdentifier}'.`);
		return queryResponse;
	} else if (queryResponse && selectType === 'ID)') {
		console.log(` SQL LOG (${time()}): SELECT Query 'getJokeByID' returned TRUE for data payload '${jokeIdentifier}'.`);
		return queryResponse;
	}
};

const dbRemoveJoke = async (jokeIdentifier) => {

	if (typeof jokeIdentifier == 'string') {
		const jokeCmd = jokeIdentifier;
		let jokeType = 'CMD';
	} else if (typeof jokeIdentifier == 'integer') {
		const jokeID = jokeIdentifier;
		let jokeType = 'ID';
	} else {

		return false;
	}
	
	if (jokeType === 'CMD') {
		const queryResponse = await execQuery('removeJokeByCmd', [jokeCmd]);
	}
	if (jokeType === 'ID') {
		const queryResponse = await execQuery('removeJokeByID', [jokeID]);
	}

	if (!queryResponse && jokeType === 'CMD') {
		console.log(` SQL LOG (${time()}): DELETE Query 'removeJokeByCmd' returned FALSE for data payload '${jokeIdentifier}'.`);
		return false;
	} else if (!queryResponse && jokeType === 'ID') {
		console.log(` SQL LOG (${time()}): DELETE Query 'removeJokeByID' returned FALSE for data payload '${jokeIdentifier}'.`);
		return false;
	} else if (queryResponse && jokeType === 'CMD') {
		console.log(` SQL LOG (${time()}): DELETE Query 'removeJokeByCmd' returned TRUE for data payload '${jokeIdentifier}'.`);
		return queryResponse;
	} else if (queryResponse && jokeType === 'ID)') {
		console.log(` SQL LOG (${time()}): DELETE Query 'removeJokeByID' returned TRUE for data payload '${jokeIdentifier}'.`);
		return queryResponse;
	}
};



//
// ---- SERVER_DATA TABLE FUNCTIONS ----
//



const dbGetRecord = async (record) => {
	
	let queryResponse;

	switch (record) {
		case 'stream_count':
			queryResponse = await execQuery('getStreamCount', []);
			break;
		case 'top_cheerer':
			queryResponse = await execQuery('getTopCheerer', []);
			break;
		case 'top_raider':
			queryResponse = await execQuery('getTopRaider', []);
			break;
		case 'top_host':
			queryResponse = await execQuery('getTopHost', []);
			break;
		case 'top_tipper':
			queryResponse = await execQuery('getTopTipper', []);
			break;
		case 'biggest_cheer':
			queryResponse = await execQuery('getBiggestCheer', []);
			break;
		case 'biggest_raid':
			queryResponse = await execQuery('getBiggestRaid', []);
			break;
		case 'biggest_host':
			queryResponse = await execQuery('getBiggestHost', []);
			break;
		case 'biggest_tip':
			queryResponse = await execQuery('getBiggestTip', []);
			break;
		case 'cheer_record_date':
			queryResponse = await execQuery('getCheerRecordDate', []);
			break;
		case 'raid_record_date':
			queryResponse = await execQuery('getRaidRecordDate', []);
			break;
		case 'host_record_date':
			queryResponse = await execQuery('getHostRecordDate', []);
			break;
		case 'tip_record_date':
			queryResponse = await execQuery('getTipRecordDate', []);
			break;
		case 'top_chatter':
			queryResponse = await execQuery('getTopChatter', []);
			break;
		case 'chat_record':
			queryResponse = await execQuery('getChatRecord', []);
			break;
		case 'top_viewer':
			queryResponse = await execQuery('getTopViewer', []);
			break;
		case 'viewer_record':
			queryResponse = await execQuery('getViewerRecord', []);
			break;
		case 'hardcoded_command_count':
			queryResponse = await execQuery('getHardcodedCommandCount', []);
			break;
		case 'custom_command_count':
			queryResponse = await execQuery('getCustomCommandCount', []);
			break;
		case 'total_command_count':
			queryResponse = await execQuery('getTotalCommandCount', []);
			break;
		case 'total_user_count':
			queryResponse = await execQuery('getTotalUserCount', []);
			break;
		case 'viewership_record':
			queryResponse = await execQuery('getViewershipRecord', []);
			break;
		case 'viewership_record_date':
			queryResponse = await execQuery('getViewerRecordDate', []);
			break;
		case 'joke_count':
			queryResponse = await execQuery('getJokeCount', []);
			break;
		case 'top_joke_creator':
			queryResponse = await execQuery('getTopJokeCreator', []);
			break;[]
		case 'top_command_creator':
			queryResponse = await execQuery('getTopCommandCreator', []);
			break;
		case 'longest_subscriber':
			queryResponse = await execQuery('getLongsetSubscriber', []);
			break;
		case 'longest_subscriber_record':
			queryResponse = await execQuery('getLongsetSubscriberRecord', []);
			break;
		default:
			return false;
	}

	return (queryResponse) ? queryResponse : false;
}

const dbSetRecord = async (recordName, newRecord, username) => {
	
	let queryResponse;

	switch (recordName) {
		case 'stream_count':
			queryResponse = await execQuery('setStreamCount', [username]);
			break;
		case 'top_cheerer':
			queryResponse = await execQuery('setTopCheerer', [username]);
			break;
		case 'top_raider':
			queryResponse = await execQuery('setTopRaider', [username]);
			break;
		case 'top_host':
			queryResponse = await execQuery('setTopHost', [username]);
			break;
		case 'top_tipper':
			queryResponse = await execQuery('setTopTipper', [username]);
			break;
		case 'biggest_cheer':
			queryResponse = await execQuery('setBiggestCheer', [newRecord]);
			break;
		case 'biggest_raid':
			queryResponse = await execQuery('setBiggestRaid', [newRecord]);
			break;
		case 'biggest_host':
			queryResponse = await execQuery('setBiggestHost', [newRecord]);
			break;
		case 'biggest_tip':
			queryResponse = await execQuery('setBiggestTip', [newRecord]);
			break;
		case 'cheer_record_date':
			queryResponse = await execQuery('setCheerRecordDate', [newRecord]);
			break;
		case 'raid_record_date':
			queryResponse = await execQuery('setRaidRecordDate', [newRecord]);
			break;
		case 'host_record_date':
			queryResponse = await execQuery('setHostRecordDate', [newRecord]);
			break;
		case 'tip_record_date':
			queryResponse = await execQuery('setTipRecordDate', [newRecord]);
			break;
		case 'top_chatter':
			queryResponse = await execQuery('setTopChatter', [username]);
			break;
		case 'chat_record':
			queryResponse = await execQuery('setChatRecord', [newRecord]);
			break;
		case 'top_viewer':
			queryResponse = await execQuery('setTopViewer', [username]);
			break;
		case 'viewer_record':
			queryResponse = await execQuery('setViewerRecord', [newRecord]);
			break;
		case 'hardcoded_command_count':
			queryResponse = await execQuery('setHardcodedCommandCount', [newRecord]);
			break;
		case 'custom_command_count':
			queryResponse = await execQuery('setCustomCommandCount', [newRecord]);
			break;
		case 'total_command_count':
			queryResponse = await execQuery('setTotalCommandCount', [newRecord]);
			break;
		case 'total_user_count':
			queryResponse = await execQuery('setTotalUserCount', [newRecord]);
			break;
		case 'viewership_record':
			queryResponse = await execQuery('setViewershipRecord', [newRecord]);
			break;
		case 'viewership_record_date':
			queryResponse = await execQuery('setViewerRecordDate', [newRecord]);
			break;
		case 'joke_count':
			queryResponse = await execQuery('setJokeCount', [newRecord]);
			break;
		case 'top_joke_creator':
			queryResponse = await execQuery('setTopJokeCreator', [username]);
			break;
		case 'top_command_creator':
			queryResponse = await execQuery('setTopCommandCreator', [username]);
			break;
		case 'longest_subscriber':
			queryResponse = await execQuery('setLongsetSubscriber', [username]);
			break;
		case 'longest_subscriber_record':
			queryResponse = await execQuery('setLongsetSubscriberRecord', [newRecord]);
			break;
		default:
			return false;
	}

	return (queryResponse) ? true : false;
}

const dbCheckAgainstRecord = async (record, value, username) => {

	const todaysDate = getCurrentDate();
	const currentRecord = await dbGetRecord(record);
	toInteger(currentRecord);
	toInteger(value);

	let recordGroup = {
		'number': null,
		'person': null,
		'date': null
	}

	switch (record) {
		case 'biggest_cheer':
			recordGroup.number = 'setBiggestCheer';
			recordGroup.person = 'setTopCheerer';
			recordGroup.date = 'setCheerRecordDate';
			break;
		case 'biggest_raid':
			recordGroup.number = 'setBiggestRaid';
			recordGroup.person = 'setTopRaider';
			recordGroup.date = 'setRaidRecordDate';
			break;
		case 'biggest_host':
			recordGroup.number = 'setBiggestHost';
			recordGroup.person = 'setTopHost';
			recordGroup.date = 'setHostRecordDate';
			break;
		case 'biggest_tip':
			recordGroup.number = 'setBiggestTip';
			recordGroup.person = 'setTopTipper';
			recordGroup.date = 'setTipRecordDate';
			break;
		case 'chat_record':
			recordGroup.number = 'setChatRecord';
			recordGroup.person = 'setTopChatter';
			recordGroup.date = null;
			break;
		case 'viewer_record':
			recordGroup.number = 'setViewerRecord';
			recordGroup.person = 'setTopViewer';
			recordGroup.date = null;
			break;
		case 'viewership_record':
			recordGroup.number = 'setViewershipRecord';
			recordGroup.person = null;
			recordGroup.date = 'setViewershipRecordDate';
			break;
		case 'longest_subscriber_record':
			recordGroup.number = 'setLongsetSubscriberRecord';
			recordGroup.person = 'setLongsetSubscriber';
			recordGroup.date = null;
		default:
			break;
	}

	if (currentRecord < value) {
		if (recordGroup.number != null) {
			const updateRecordNumber = await execQuery(recordGroup.number, [record, value, username]);
		}
		if (recordGroup.person != null) {
			const updateRecordPerson = await execQuery(recordGroup.person, [record, value, username]);
		}
		if (recordGroup.date != null) {
			const updateRecordDate = await execQuery(recordGroup.date, [record, todaysDate, username]);
		}


		return (updateRecordNumber || updateRecordPerson || updateRecordDate) ? true : false;
	}
}



//
// ---- STATS TABLE FUNCTIONS ----
//



const dbGetStatRecord = async (statName) => {

	console.log(`DEBUGGER (${time()}): Entering function 'dbGetStatRecord'`);

	let recordValueArray;

	switch (statName) {
		case 'Stream Count':
			recordValueArray = await execQuery('getStreamCountRecord');
			break;
		case 'Cheering':
			recordValueArray = await execQuery('getCheeringRecord');
			break;
		case 'Single Cheer':
			recordValueArray = await execQuery('getSingleCheerRecord');
			break;
		case 'Stream Cheers':
			recordValueArray = await execQuery('getStreamCheersRecord');
			break;
		case 'Biggest Raid':
			recordValueArray = await execQuery('getBiggestRaidRecord');
			break;
		case 'Most Raids':
			recordValueArray = await execQuery('getMostRaidsRecord');
			break;
		case 'Biggest Host':
			recordValueArray = await execQuery('getBiggestHostRecord');
			break;
		case 'Most Hosts':
			recordValueArray = await execQuery('getMostHostsRecord');
			break;
		case 'Biggest Tip':
			recordValueArray = await execQuery('getBiggestTipRecord');
			break;
		case 'Most Tips':
			recordValueArray = await execQuery('getMostTipsRecord');
			break;
		case 'Biggest Tip Pool':
			recordValueArray = await execQuery('getBiggestTipPoolRecord');
			break;
		case 'Top Chatter':
			recordValueArray = await execQuery('getTopChatterRecord');
			break;
		case 'Top Viewer':
			recordValueArray = await execQuery('getTopViewerRecord');
			break;
		case 'Hardcoded Command Count':
			recordValueArray = await execQuery('getHardcodedCommandCountRecord');
			break;
		case 'Custom Command Count':
			recordValueArray = await execQuery('getCustomCommandCountRecord');
			break;
		case 'Total Command Count':
			recordValueArray = await execQuery('getTotalCommandCountRecord');
			break;
		case 'Viewership Record':
			recordValueArray = await execQuery('getViewershipRecord');
			break;
		case 'Joke Count':
			recordValueArray = await execQuery('getJokeCountRecord');
			break;
		case 'Top Command Creator':
			recordValueArray = await execQuery('getTopCommandCreatorRecord');
			break;
		case 'Top Joke Creator':
			recordValueArray = await execQuery('getTopJokeCreatorRecord');
			break;
		case 'Longest Subscriber':
			recordValueArray = await execQuery('getLongestSubscriberRecord');
			break;
		default:
			return false;
	}

	console.log(`Record Value Array Entries:`);
	console.dir(recordValueArray);

	console.log(`DEBUGGER (${time()}): Exiting function 'dbGetStatRecord'`);
	return (recordValueArray) ? recordValueArray : false;

}	

const dbSetStatRecord = async (statName, newRecord, username) => {

	console.log(`DEBUGGER (${time()}): Entered function 'dbSetStatRecord'`);
	const todaysDate = getCurrentDate();
	const valueArray = [newRecord, username, todaysDate];
	const valueArrayNoDate = [newRecord, username, 'NULL'];

	let updateQuery;

	switch (statName) {
		case 'Stream Count':
			updateQuery = await execQuery('setStreamCountRecord', [valueArrayNoDate]);
			break;
		case 'Cheering':
			updateQuery = await execQuery('setCheeringRecord', [valueArray]);
			break;
		case 'Single Cheer':
			updateQuery = await execQuery('setSingleCheerRecord', [valueArray]);
			break;
		case 'Stream Cheers':
			updateQuery = await execQuery('setStreamCheersRecord', [valueArray]);
			break;
		case 'Biggest Raid':
			updateQuery = await execQuery('setBiggestRaidRecord', [valueArray]);
			break;
		case 'Most Raids':
			updateQuery = await execQuery('setMostRaidsRecord', [valueArray]);
			break;
		case 'Biggest Host':
			updateQuery = await execQuery('setBiggestHostRecord', [valueArray]);
			break;
		case 'Most Hosts':
			updateQuery = await execQuery('setMostHostsRecord', [valueArray]);
			break;
		case 'Biggest Tip':
			updateQuery = await execQuery('setBiggestTipRecord', [valueArray]);
			break;
		case 'Most Tips':
			updateQuery = await execQuery('setMostTipsRecord', [valueArray]);
			break;
		case 'Biggest Tip Pool':
			updateQuery = await execQuery('setBiggestTipPoolRecord', [valueArray]);
			break;
		case 'Top Chatter':
			updateQuery = await execQuery('setTopChatterRecord', [valueArray]);
			break;
		case 'Top Viewer':
			updateQuery = await execQuery('setTopViewerRecord', [valueArray]);
			break;
		case 'Hardcoded Command Count':
			updateQuery = await execQuery('setHardcodedCommandCountRecord', [valueArrayNoDate]);
			break;
		case 'Custom Command Count':
			updateQuery = await execQuery('setCustomCommandCountRecord', [valueArrayNoDate]);
			break;
		case 'Total Command Count':
			updateQuery = await execQuery('setTotalCommandCountRecord', [valueArrayNoDate]);
			break;
		case 'Viewership Record':
			updateQuery = await execQuery('setViewershipRecord', [valueArray]);
			break;
		case 'Joke Count':
			updateQuery = await execQuery('setJokeCountRecord', [valueArrayNoDate]);
			break;
		case 'Top Command Creator':
			updateQuery = await execQuery('setTopCommandCreatorRecord', [valueArray]);
			break;
		case 'Top Joke Creator':
			updateQuery = await execQuery('setTopJokeCreatorRecord', [valueArray]);
			break;
		case 'Longest Subscriber':
			updateQuery = await execQuery('setLongestSubscriberRecord', [valueArray]);
			break;
		default:
			return false;
	}

	console.log(`DEBUGGER (${time()}): Exiting function 'dbSetStatRecord'`);
	return (updateQuery) ? true : false;

}

const dbCheckAgainstRecord2 = async (statName, checkValue) => {

	console.log(`DEBUGGER (${time()}): Entering function 'dbCheckAgainstRecord2'`);
	
	const currentRecordValue = await dbGetStatRecord(statName);

	const recordValue = currentRecordValue[0];

	if (checkValue > recordValue) {
		const updateQuery = await dbSetStatRecord(statName, checkValue, username);
		if (updateQuery) {
			console.log(`STATS LOG (${time()}): New Record Set: '${statName}' new value set to '${checkValue} by user '${username} on date '${getCurrentDate()}'`);
			console.log(`STATS LOG (${time()}): Old Record:     '${statName}' Old Record Value '${currentRecordValue[0]}', Old Record Holder: '${currentRecordValue[1]}', Old Record Date: '${currentRecordValue[2]}'`);
		}
		console.log(`DEBUGGER (${time()}): Exiting function 'dbCheckAgainstRecord2' - return true`);
		return true;
	} else {
		console.log(`DEBUGGER (${time()}): Exiting function 'dbCheckAgainstRecord2' - return false`);
		return false;
	}
}

const dbTestGetRecord = async (statName) => {

	const recordData = await dbGetStatRecord(statName);

	return (recordData) ? recordData : false;

}

const dbTestSetRecord = async (statName, value, holder) => {

	const todaysDate = getCurrentDate();
	const valueArray = [value, holder, todaysDate];

	const updateQuery = await dbSetStatRecord(statName, value, holder);

	return (updateQuery) ? true : false;

}
//
// --- MODULE EXPORTS ---
//

module.exports.testGetRecord = dbTestGetRecord;
module.exports.testSetRecord = dbTestSetRecord;

module.exports.getStatRecord = dbGetStatRecord;
module.exports.setStatRecord = dbSetStatRecord;
module.exports.checkAgainstRecord2 = dbCheckAgainstRecord2;

module.exports.getRecord = dbGetRecord;
module.exports.setRecord = dbSetRecord;
module.exports.checkAgainstRecord = dbCheckAgainstRecord;
module.exports.updateGiftSubs = dbUpdateGiftSubs;
module.exports.getCmdsSent = dbGetCmdsSent;
module.exports.updateCmdsSent = dbUpdateCmdsSent;
module.exports.getTimesCheered = dbGetTimesCheered;
module.exports.updateTimesCheered = dbUpdateTimesCheered;
module.exports.updateHostSize = dbUpdateHostSize;
module.exports.getHostSize = dbGetHostSize;
module.exports.incHostCount = dbIncHostCount;
module.exports.getHosts = dbGetHosts;
module.exports.updateRaidSize = dbUpdateRaidSize;
module.exports.getRaidSize = dbGetRaidSize;
module.exports.getRaids = dbGetRaids;
module.exports.incRaidCount = dbIncRaidCount;
module.exports.updateSub = dbUpdateSub;
module.exports.isMod = dbIsMod;
module.exports.isSub = dbIsSub;
module.exports.isVIP = dbIsVIP;
module.exports.isBroadcaster = dbIsBroadcaster;
module.exports.isHost = dbIsBroadcaster;
module.exports.isFounder = dbIsFounder;
module.exports.checkForUser = dbCheckForUser;
module.exports.addUser = dbAddUser;
module.exports.updateUserFlags = dbUpdateUserFlags;
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
module.exports.getBits = dbGetBitsCheered;
module.exports.updateBits = dbUpdateBitsCheered;
module.exports.addJoke = dbAddJoke;
module.exports.getJoke = dbGetJoke;
module.exports.removeJoke = dbRemoveJoke;
module.exports.getCmdsCreated = dbGetCmdsCreated;
module.exports.updateCmdsCreated = dbUpdateCmdsCreated;
module.exports.getJokesCreated = dbGetJokesCreated;
module.exports.UpdateJokesCreated = dbUpdateJokesCreated;
module.exports.GetSubInfo = dbGetSubInfo;