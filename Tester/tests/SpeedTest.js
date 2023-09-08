const Toolbar = require("../lib/Toolbar");
const Color = require("../lib/Color");
Tester.setUrlParams("action={%22debug%22:true}");
Tester.setConsoleLogFilter("[speed]: ");
Tester.attachConsoleLog(function (message) {
    console.log(message)
    const logFileName = "log.txt";
    fs.appendFile(logFileName, message + "\n", (err) => {
        if (err) {
            console.error("Error:", err);
        } else {
            console.log("Input message:", message);
        }
    });
});
Tester.createFile("Document");
Tester.close()