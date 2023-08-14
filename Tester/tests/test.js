
Tester.launch();
Tester.uploadTestFile('/', 'docx');
Tester.goToFile('new.docx');
//Tester.selectFileEncoding("Vietnamese (Windows)");
Tester.waitEditor();
import ClickHomeMethods 
clickHomeMethods.clickBold();
clickHomeMethods.clickFontColor('Light blue, Accent 1, Lighter 60%');
clickHomeMethods.clickHightlight('Black');
clickHomeMethods.clickChangeCase('UPPERCASE');
clickHomeMethods.selectFontSize('28');
