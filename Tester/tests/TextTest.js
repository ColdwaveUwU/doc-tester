const Toolbar = require("../lib/Toolbar")
Tester.createFile("Document");
Tester.input("Hello World");
Tester.keyDown("Shift");
for (let i = 0; i < 5; i++) Tester.keyPress("ArrowLeft");
Tester.keyUp("Shift");
Toolbar.clickBold();
Toolbar.selectFont("Cambria");
Toolbar.selectFontSize("36");
Toolbar.clickFontColor({index: 8});
