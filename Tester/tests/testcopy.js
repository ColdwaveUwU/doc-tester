const Toolbar = require('../lib/Toolbar')
const Draw = require('../lib/Draw')
//Tester.uploadTestFile('/', 'docx');
Tester.createFile('Document')
Draw.penOne({type: 5, square: [50, 100], hight: 45}, 0, 0, 0, 30, 30);
// // Draw.penTwo('Red', 0, 0, 0, 30, 30);
// // Draw.highlighter('Blue', 0, 0, 0, 30, 30);
// Toolbar.selectFontCombo([50,50], 30);
// Toolbar.selectFontColorByText(50, 50, 50, 50);
// Toolbar.selectShadingColorByText(50, 25, 88, 200)
// Toolbar.clickFontEyedrop(100, 200);
//ownload.downloadTxt();
