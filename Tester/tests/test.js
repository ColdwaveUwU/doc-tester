import Toolbar

Tester.launch();
//Tester.uploadTestFile('/', 'docx');
Tester.goToFile('new.docx');
//Tester.selectFileEncoding("Vietnamese (Windows)");
Tester.waitEditor();

Toolbar.clickBold();
Toolbar.clickFontColor('Light blue, Accent 1, Lighter 60%');
Toolbar.clickHightlight('Black');
Toolbar.clickChangeCase('UPPERCASE');
Toolbar.selectFontSize('28');
Toolbar.clickBullets('dashbullets');