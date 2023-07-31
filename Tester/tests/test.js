Tester.launch();
Tester.load("https://doc-linux.teamlab.info/example/editor?fileName=new.docx");
Tester.waitEditor();

// down Enter
Tester.keyPress("Enter");

// type text
Tester.input("Hello World!");

Tester.keyPress("ArrowLeft");
Tester.keyDown("Shift");
for (let i = 0; i < 5; i++)
  Tester.keyPress("ArrowLeft");
Tester.keyUp("Shift");

// bold
Tester.click("#id-toolbar-btn-bold");
// italic
Tester.mouseClick(115, 105);

// if needed
Tester.waitAutosave();

Tester.downloadFile("docx")
Tester.downloadFile("odt")

Tester.close(true);