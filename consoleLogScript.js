<<<<<<< HEAD
<<<<<<< HEAD
//const WebSocket = require('ws')
const url = 'ws://localhost:3000'
const connection = new WebSocket(url)
const logDiv = document.querySelector("div.consolelog")
let logCount = 1

connection.onopen = () => {

}

connection.onerror = (error) => {
    console.log(`Websocket Error: ${error}`)
}

connection.onmessage = (event) => {

    console.log(event.data)

    let object = JSON.parse(event.data)

    let logTime = object.timestamp
    let logType = object.type
    let logUser = object.sender
    let logMsg = object.msg

    appendLog(logTime, logType, logUser, logMsg)

    reloadPageTimer = setTimeout(reloadPage, 10000)
}

reloadPage = function () { location.reload(true) };
reloadInterval = function () { document.getElementById("logTable").innerHTML = document.getElementById("logTable").innerHTML; }

let tableHeaders = ["#", "Timestamp", "Type", "Sender", "Message"]

const createConsoleLogTable = () => {

    while (logDiv.firstChild) {
        logDiv.removeChild(logDiv.firstChild) // Remove all children from logDiv (if any)
    }

    let logTable = document.createElement('table') // Create the table itself
    logTable.className = 'logTable'

    let logTableHead = document.createElement('thead') // Creates the table header group element
    logTableHead.className = 'logTableHead'

    let logTableHeaderRow = document.createElement('tr') // Creates the row that will contain the headers
    logTableHeaderRow.className = 'logTableHeaderRow'

    // Will iterate over all the strings in the tableHeader array and will append the header cells to the table header 
    tableHeaders.forEach(header => {
        let logHeader = document.createElement('th') // Creates the current header cell during a specific iteration
        logHeader.innerText = header
        logTableHeaderRow.append(logHeader) // Appends the current header cell to the header row
    })

    logTableHead.append(logTableHeaderRow) // Appends the header row to the table header group element
    logTable.append(logTableHead)

    let logTableBody = document.createElement('tbody') // Creates the table body group element
    logTableBody.className = "logTable-Body"

    logTable.append(logTableBody) // Appends the table body group element to the table
    logDiv.append(logTable) // Appends the table to the logDiv
}

const appendLog = (time, type, sender, message) => {

    const logTable = document.querySelector('.logTable') // Find the table we created
    let logTableBodyRow = document.createElement('tr') // Create the current table row
    logTableBodyRow.className = 'logTableBodyRow'

    let logNum = document.createElement('td')
    logNum.className = 'logTableNum'
    logNum.innerText = logCount
    logCount = logCount + 1

    let logTimestamp = document.createElement('td')
    logTimestamp.className = 'logTableTimestamp'
    logTimestamp.innerText = time

    let logType = document.createElement('td')
    logType.className = 'logTableType'
    logType.innerText = type


    let logSender = document.createElement('td')
    logSender.className = 'logTableSender'
    logSender.innerText = sender

    switch (sender) {
        case 'CONSOLE':
            logSender.className = 'logTableSenderConsole'
            break;
        case 'The_Random_Encounter':
            logSender.className = 'logTableSenderHost'
            break;
        case 'randomencounterbot':
            logSender.className = 'logTableSenderBot'
            break;
        default:
            logSender.className = 'logTableSender'
            break;
    }
    /*if (logSender.innerText == 'CONSOLE') {
        logSender.className = 'logTableSenderConsole'
    } else {
        logSender.className = 'logTableSender'
    }*/

    let logMessage = document.createElement('td')
    logMessage.className = 'logTableMessage'
    logMessage.innerText = message

    logTableBodyRow.append(logNum, logTimestamp, logType, logSender, logMessage)

    //logTable.prependTo(logTableBodyRow)
    logTable.prepend(logTableBodyRow)

}

function createTimeStamp() {

    const d = new Date();
    let AMPM = 'AM';
    //const date = new Date();
    let dayOfMonth = d.getDate();

    let monthOfYear = d.getMonth() + 1;

    //const hours = new Date();
    let dayHours = d.getHours();
    if (dayHours > 12) {
        dayHours = dayHours - 12;
        AMPM = 'PM';
    }
    if (dayHours < 10) {
        dayHours = '0' + dayHours;
    }

    //const minutes = new Date();
    let dayMinutes = d.getMinutes();
    if (dayMinutes < 10) {
        dayMinutes = '0' + dayMinutes;
    }

    //const seconds = new Date();
    let daySeconds = d.getSeconds();
    if (daySeconds < 10) {
        daySeconds = '0' + daySeconds;
    }

    let fullYear = d.getFullYear();

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    //const day = new Date();
    let dayOfWeek = days[d.getDay()];

    let timestamp = monthOfYear + '/' + dayOfMonth + '/' + fullYear + " - " + dayHours + ':' + dayMinutes + ':' + daySeconds + ` ${AMPM}`;

    return timestamp;
}

createConsoleLogTable()

=======
//const WebSocket = require('ws')
const url = 'ws://localhost:3000'
const connection = new WebSocket(url)
const logDiv = document.querySelector("div.consolelog")
let logCount = 1

connection.onopen = () => {

}

connection.onerror = (error) => {
    console.log(`Websocket Error: ${error}`)
}

connection.onmessage = (event) => {

    console.log(event.data)

    let object = JSON.parse(event.data)

    let logTime = object.timestamp
    let logType = object.type
    let logUser = object.sender
    let logMsg = object.msg

    appendLog(logTime, logType, logUser, logMsg)

    reloadPageTimer = setTimeout(reloadPage, 10000)
}

reloadPage = function () { location.reload(true) };
reloadInterval = function () { document.getElementById("logTable").innerHTML = document.getElementById("logTable").innerHTML; }

let tableHeaders = ["#", "Timestamp", "Type", "Sender", "Message"]

const createConsoleLogTable = () => {

    while (logDiv.firstChild) {
        logDiv.removeChild(logDiv.firstChild) // Remove all children from logDiv (if any)
    }

    let logTable = document.createElement('table') // Create the table itself
    logTable.className = 'logTable'

    let logTableHead = document.createElement('thead') // Creates the table header group element
    logTableHead.className = 'logTableHead'

    let logTableHeaderRow = document.createElement('tr') // Creates the row that will contain the headers
    logTableHeaderRow.className = 'logTableHeaderRow'

    // Will iterate over all the strings in the tableHeader array and will append the header cells to the table header 
    tableHeaders.forEach(header => {
        let logHeader = document.createElement('th') // Creates the current header cell during a specific iteration
        logHeader.innerText = header
        logTableHeaderRow.append(logHeader) // Appends the current header cell to the header row
    })

    logTableHead.append(logTableHeaderRow) // Appends the header row to the table header group element
    logTable.append(logTableHead)

    let logTableBody = document.createElement('tbody') // Creates the table body group element
    logTableBody.className = "logTable-Body"

    logTable.append(logTableBody) // Appends the table body group element to the table
    logDiv.append(logTable) // Appends the table to the logDiv
}

const appendLog = (time, type, sender, message) => {

    const logTable = document.querySelector('.logTable') // Find the table we created
    let logTableBodyRow = document.createElement('tr') // Create the current table row
    logTableBodyRow.className = 'logTableBodyRow'

    let logNum = document.createElement('td')
    logNum.className = 'logTableNum'
    logNum.innerText = logCount
    logCount = logCount + 1

    let logTimestamp = document.createElement('td')
    logTimestamp.className = 'logTableTimestamp'
    logTimestamp.innerText = time

    let logType = document.createElement('td')
    logType.className = 'logTableType'
    logType.innerText = type


    let logSender = document.createElement('td')
    logSender.className = 'logTableSender'
    logSender.innerText = sender

    switch (sender) {
        case 'CONSOLE':
            logSender.className = 'logTableSenderConsole'
            break;
        case 'The_Random_Encounter':
            logSender.className = 'logTableSenderHost'
            break;
        case 'randomencounterbot':
            logSender.className = 'logTableSenderBot'
            break;
        default:
            logSender.className = 'logTableSender'
            break;
    }
    /*if (logSender.innerText == 'CONSOLE') {
        logSender.className = 'logTableSenderConsole'
    } else {
        logSender.className = 'logTableSender'
    }*/

    let logMessage = document.createElement('td')
    logMessage.className = 'logTableMessage'
    logMessage.innerText = message

    logTableBodyRow.append(logNum, logTimestamp, logType, logSender, logMessage)

    //logTable.prependTo(logTableBodyRow)
    logTable.prepend(logTableBodyRow)

}

function createTimeStamp() {

    const d = new Date();
    let AMPM = 'AM';
    //const date = new Date();
    let dayOfMonth = d.getDate();

    let monthOfYear = d.getMonth() + 1;

    //const hours = new Date();
    let dayHours = d.getHours();
    if (dayHours > 12) {
        dayHours = dayHours - 12;
        AMPM = 'PM';
    }
    if (dayHours < 10) {
        dayHours = '0' + dayHours;
    }

    //const minutes = new Date();
    let dayMinutes = d.getMinutes();
    if (dayMinutes < 10) {
        dayMinutes = '0' + dayMinutes;
    }

    //const seconds = new Date();
    let daySeconds = d.getSeconds();
    if (daySeconds < 10) {
        daySeconds = '0' + daySeconds;
    }

    let fullYear = d.getFullYear();

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    //const day = new Date();
    let dayOfWeek = days[d.getDay()];

    let timestamp = monthOfYear + '/' + dayOfMonth + '/' + fullYear + " - " + dayHours + ':' + dayMinutes + ':' + daySeconds + ` ${AMPM}`;

    return timestamp;
}

createConsoleLogTable()

>>>>>>> 2d96ebe7e504abe81772bf0e830afb501d4e817d
=======
//const WebSocket = require('ws')
const url = 'ws://localhost:3000'
const connection = new WebSocket(url)
const logDiv = document.querySelector("div.consolelog")
let logCount = 1

connection.onopen = () => {

}

connection.onerror = (error) => {
    console.log(`Websocket Error: ${error}`)
}

connection.onmessage = (event) => {

    console.log(event.data)

    let object = JSON.parse(event.data)

    let logTime = object.timestamp
    let logType = object.type
    let logUser = object.sender
    let logMsg = object.msg

    appendLog(logTime, logType, logUser, logMsg)

    reloadPageTimer = setTimeout(reloadPage, 10000)
}

reloadPage = function () { location.reload(true) };
reloadInterval = function () { document.getElementById("logTable").innerHTML = document.getElementById("logTable").innerHTML; }

let tableHeaders = ["#", "Timestamp", "Type", "Sender", "Message"]

const createConsoleLogTable = () => {

    while (logDiv.firstChild) {
        logDiv.removeChild(logDiv.firstChild) // Remove all children from logDiv (if any)
    }

    let logTable = document.createElement('table') // Create the table itself
    logTable.className = 'logTable'

    let logTableHead = document.createElement('thead') // Creates the table header group element
    logTableHead.className = 'logTableHead'

    let logTableHeaderRow = document.createElement('tr') // Creates the row that will contain the headers
    logTableHeaderRow.className = 'logTableHeaderRow'

    // Will iterate over all the strings in the tableHeader array and will append the header cells to the table header 
    tableHeaders.forEach(header => {
        let logHeader = document.createElement('th') // Creates the current header cell during a specific iteration
        logHeader.innerText = header
        logTableHeaderRow.append(logHeader) // Appends the current header cell to the header row
    })

    logTableHead.append(logTableHeaderRow) // Appends the header row to the table header group element
    logTable.append(logTableHead)

    let logTableBody = document.createElement('tbody') // Creates the table body group element
    logTableBody.className = "logTable-Body"

    logTable.append(logTableBody) // Appends the table body group element to the table
    logDiv.append(logTable) // Appends the table to the logDiv
}

const appendLog = (time, type, sender, message) => {

    const logTable = document.querySelector('.logTable') // Find the table we created
    let logTableBodyRow = document.createElement('tr') // Create the current table row
    logTableBodyRow.className = 'logTableBodyRow'

    let logNum = document.createElement('td')
    logNum.className = 'logTableNum'
    logNum.innerText = logCount
    logCount = logCount + 1

    let logTimestamp = document.createElement('td')
    logTimestamp.className = 'logTableTimestamp'
    logTimestamp.innerText = time

    let logType = document.createElement('td')
    logType.className = 'logTableType'
    logType.innerText = type


    let logSender = document.createElement('td')
    logSender.className = 'logTableSender'
    logSender.innerText = sender

    switch (sender) {
        case 'CONSOLE':
            logSender.className = 'logTableSenderConsole'
            break;
        case 'The_Random_Encounter':
            logSender.className = 'logTableSenderHost'
            break;
        case 'randomencounterbot':
            logSender.className = 'logTableSenderBot'
            break;
        default:
            logSender.className = 'logTableSender'
            break;
    }
    /*if (logSender.innerText == 'CONSOLE') {
        logSender.className = 'logTableSenderConsole'
    } else {
        logSender.className = 'logTableSender'
    }*/

    let logMessage = document.createElement('td')
    logMessage.className = 'logTableMessage'
    logMessage.innerText = message

    logTableBodyRow.append(logNum, logTimestamp, logType, logSender, logMessage)

    //logTable.prependTo(logTableBodyRow)
    logTable.prepend(logTableBodyRow)

}

function createTimeStamp() {

    const d = new Date();
    let AMPM = 'AM';
    //const date = new Date();
    let dayOfMonth = d.getDate();

    let monthOfYear = d.getMonth() + 1;

    //const hours = new Date();
    let dayHours = d.getHours();
    if (dayHours > 12) {
        dayHours = dayHours - 12;
        AMPM = 'PM';
    }
    if (dayHours < 10) {
        dayHours = '0' + dayHours;
    }

    //const minutes = new Date();
    let dayMinutes = d.getMinutes();
    if (dayMinutes < 10) {
        dayMinutes = '0' + dayMinutes;
    }

    //const seconds = new Date();
    let daySeconds = d.getSeconds();
    if (daySeconds < 10) {
        daySeconds = '0' + daySeconds;
    }

    let fullYear = d.getFullYear();

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    //const day = new Date();
    let dayOfWeek = days[d.getDay()];

    let timestamp = monthOfYear + '/' + dayOfMonth + '/' + fullYear + " - " + dayHours + ':' + dayMinutes + ':' + daySeconds + ` ${AMPM}`;

    return timestamp;
}

createConsoleLogTable()

>>>>>>> refs/remotes/origin/main
//var timer = setInterval(function() {$('#consolelog').load()}, 5000)