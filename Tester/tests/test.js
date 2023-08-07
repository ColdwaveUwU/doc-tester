Tester.launch();
Tester.load('/');
Tester.goToFile('new.docx');
 Tester.keyPress("Enter");
  //type text
 Tester.input("Hello World!");
 Tester.keyPress("ArrowLeft");
 Tester.keyDown("Shift");
 for (let i = 0; i < 5; i++) Tester.keyPress("ArrowLeft");
 Tester.keyUp("Shift");
  //bold coord
 Tester.mouseClickInsideElement("#toolbar", 81, 65);
 //italic -> underline
 Tester.click(["#id-toolbar-btn-italic", "#id-toolbar-btn-underline"]);
  //if needed
 Tester.waitAutosave();
 //try "https:w.forfun.com/fetch/4a/4af0bcc2b0c34fd573eca9f1be9ab245.jpeg" or testFile.png
 //0 - fromdir 1 - url 2 - storage
 Tester.click(['li a[data-tab="ins"][data-title="Insert"]', "#slot-btn-insimage"]);
 Tester.uploadFile('testFile.png', 'picture', "#asc-gen237")
 Tester.click(["#slot-btn-insimage","#asc-gen239"]);
 Tester.inputToForm('adssdas', "input.form-control");
 Tester.click(['button[result="ok"]']);
 //Tester.downloadFile("txt");
 //Tester.downloadFile("odt")
  //Tester.close(true);
