import Toolbar
import Download 
import InsertImage
import Draw
//Tester.uploadTestFile('/', 'docx');
Tester.createFile('docx');
//Tester.selectFileEncoding("Vietnamese (Windows)");
Toolbar.selectFontSize('14')
// Toolbar.clickBold();
// Toolbar.clickFormControl();
// // Toolbar.clickFontColor('Light blue, Accent 1, Lighter 60%');
// // Toolbar.clickHightlight('Black');
Toolbar.clickChangeCase('UPPERCASE');
// // Toolbar.selectFontSize('28');
// Toolbar.selectShading('Black, Text 1')
// Toolbar.clickBullets('filledroundbullets');
// Toolbar.clickNumbering('iBrace');
// Toolbar.clickMultilevels('variosheadings')
// Toolbar.clickJustified()
// Toolbar.clickAlignRight()
// Toolbar.clickAlignCenter()
// Toolbar.clickAlignLeft()
Draw.clickSelect()
//Toolbar.selectFontMoreBySquare(0, 100);
Draw.penOne('Black', 0, 0, 0, 30, 30);
Draw.penTwo('Red', 0, 0, 0, 30, 30);
Draw.highlighter('Blue', 0, 0, 0, 30, 30);
//ownload.downloadTxt();
