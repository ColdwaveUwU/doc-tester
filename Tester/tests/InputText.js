const Toolbar = require("../lib/Toolbar");

Tester.createFile("Document");
Toolbar.clickBold();
Tester.keyPress("Enter");

Tester.input("Hello World!");

Tester.keyPress("ArrowLeft");
Tester.keyDown("Shift");
for (let i = 0; i < 5; i++) Tester.keyPress("ArrowLeft");
Tester.keyUp("Shift");

Tester.keyPress("Enter");
Tester.input("Hello World!");
Tester.keyDown("Shift");
for (let i = 0; i < 5; i++) Tester.keyPress("ArrowLeft");
Tester.keyUp("Shift");
Toolbar.clickUnderline();

Tester.close();
