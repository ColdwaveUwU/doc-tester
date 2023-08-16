import Toolbar
import Download 
import InsertImage
//Tester.uploadTestFile('/', 'docx');
Tester.createFile('docx');
//Tester.selectFileEncoding("Vietnamese (Windows)");
Toolbar.clickBold();
Toolbar.clickFontColor('Light blue, Accent 1, Lighter 60%');
Toolbar.clickHightlight('Black');
Toolbar.clickChangeCase('UPPERCASE');
Toolbar.selectFontSize('28');
InsertImage.fromFile('testFile.png')
InsertImage.fromUrl('https://phonoteka.org/uploads/posts/2023-02/1675403004_phonoteka-org-p-ayaka-oboi-pinterest-37.png')
InsertImage.fromStorage();
Toolbar.clickBullets();
//ownload.downloadTxt();
