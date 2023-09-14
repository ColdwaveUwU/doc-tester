const Toolbar = require("../lib/Toolbar");
const Color = require("../lib/Color");
Tester.setUrlParams("action={%22debug%22:true}");
const handlersLog = [
    {
        filter: "[speed]: ",
        handler: function (message) {
            const logFileName = "log.txt";
            const logFilePath = path.join(logDirectory, logFileName);
            fs.appendFile(logFilePath, message + "\n", (err) => {
                if (err) {
                    console.error("Error:", err);
                } else {
                    console.log("Input message:", message);
                }
            });
        },
    },
    {
        filter: "[speed]: ",
        handler: function (message) {
            console.log("test", message);
        },
    },
];
for (const { filter, handler } of handlersLog) {
    Tester.attachConsoleLog(filter, handler);
}

Tester.createFile("Document");
Tester.close();
