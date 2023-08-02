Tester.launch();
Tester.load("https://doc-linux.teamlab.info/example/editor?fileName=new.docx");
Tester.waitEditor();
Tester.keyPress("Enter");
// type text
Tester.input("Hello World!");
//Tester.relativeClick('#id-toolbar-btn-bold', 10, 20)
Tester.keyPress("ArrowLeft");
Tester.keyDown("Shift");
for (let i = 0; i < 5; i++)
  Tester.keyPress("ArrowLeft");
Tester.keyUp("Shift");
// bold ???
Tester.mouseClickInsideElement('#toolbar',81, 65);
//italic -> file
Tester.click(['#id-toolbar-btn-italic', 'li[data-layout-name="toolbar-file"]']);
// if needed
Tester.waitAutosave();
// Tester.downloadFile("docx")
// Tester.downloadFile("odt")
// Tester.close(true);


