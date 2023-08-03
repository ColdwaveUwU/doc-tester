Tester.launch();
Tester.load("https://doc-linux.teamlab.info/example/editor?fileName=new.docx");
Tester.waitEditor();
Tester.keyPress("Enter");
// type text
Tester.input("Hello World!");
Tester.keyPress("ArrowLeft");
Tester.keyDown("Shift");
for (let i = 0; i < 5; i++)
  Tester.keyPress("ArrowLeft");
Tester.keyUp("Shift");
// bold coord
Tester.mouseClickInsideElement('#toolbar',81, 65);
//italic -> underline
Tester.click(['#id-toolbar-btn-italic', '#id-toolbar-btn-underline']);
// if needed
Tester.waitAutosave();
Tester.downloadFile("rtf")
// Tester.downloadFile("odt")
// Tester.close(true);


