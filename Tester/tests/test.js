import Toolbar
import Download 
import InsertImage
import Draw
//Tester.uploadTestFile('/', 'docx');
Tester.uploadTestFile('/');
//Tester.selectFileEncoding("Vietnamese (Windows)");
Toolbar.clickBold();
// Toolbar.clickFontColor('Light blue, Accent 1, Lighter 60%');
// Toolbar.clickHightlight('Black');
// Toolbar.clickChangeCase('UPPERCASE');
// Toolbar.selectFontSize('28');
// InsertImage.fromFile('testFile.png')
// InsertImage.fromUrl('https://phonoteka.org/uploads/posts/2023-02/1675403004_phonoteka-org-p-ayaka-oboi-pinterest-37.png')
// InsertImage.fromStorage();
Toolbar.clickBullets('filledroundbullets');
Toolbar.clickNumbering('iBrace');
Toolbar.clickMultilevels('variosheadings')
Toolbar.clickJustified()
Toolbar.clickAlignRight()
Toolbar.clickAlignCenter()
Toolbar.clickAlignLeft()
Toolbar.selectFont('agency')
Toolbar.clickIncIndent()
Toolbar.clickDecIndent()
Toolbar.selectNonPrintChar('all')
Toolbar.selectShading('Black, Text 1')
Toolbar.selectFontSize('96')
//Toolbar.selectFontMoreBySquare(0, 100);
Draw.penOne('Black', 0, 0, 0, 30, 30);
//ownload.downloadTxt();
