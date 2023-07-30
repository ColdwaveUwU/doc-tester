const tester = require("./Tester");
(async function (window, undefined) {
    const config = {
        pressSlow: 50, //'userspeed'
        executablePath: "/Program Files/Google/Chrome/Application/chrome.exe",
    };
    const myTester = new tester.Tester(config);
    try {
        await myTester.launch();

        await myTester.load(
            "https://doc-linux.teamlab.info/example/editor?fileName=new.docx"
        );
        await myTester.waitEditor();
        await myTester.click("#id-toolbar-btn-bold");
        await myTester.keyPress("Enter");
        await myTester.input("Hello World");

        await myTester.mouseClick(115, 105);
        await myTester.keyDown("Shift");
        for (let i = 0; i < 5; i += 1) {
            await myTester.keyPress("ArrowLeft");
        }
        await myTester.keyUp("Shift");
        await myTester.downloadFile("rtf");
        //await myTester.close();
    } catch (error) {
        console.error("Error occurred:", error);
    }
})(globalThis);
