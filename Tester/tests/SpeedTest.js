const Toolbar = require("../lib/Toolbar");
const Color = require("../lib/Color");

Tester.setConsoleLogFilter("[speed]: ");
function writeToLogFile(message) {
    const logFileName = "log.txt";
    fs.appendFile(logFileName, message + "\n", (err) => {
        if (err) {
            console.error("Error:", err);
        } else {
            console.log("Input message:", message);
        }
    });
}

Tester.attachConsoleLog(writeToLogFile);
Tester.openFile("new.docx");

Tester.close();
