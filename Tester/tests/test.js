const Toolbar = require('../lib/Toolbar')
const Color = require('../lib/Color')
Tester.setConsoleLogFilter("[speed]: ");
function writeToLogFile(message) {
    const logFileName = "log.txt"; 
    fs.appendFile(logFileName, message + "\n", (err) => {
        if (err) {
            console.error("Error:", err);
        } else {
            console.log("Input message:", message);
        }
    });
}

Tester.attachConsoleLog(writeToLogFile);

//Tester.uploadTestFile('/', 'docx');
Tester.createFile('Document')
//Tester.selectFileEncoding("Vietnamese (Windows)");
Toolbar.selectFontSize('14')
// Toolbar.clickBold();
// Toolbar.clickFormControl();
Toolbar.clickFontColor({type:Color.Type.Auto});
Toolbar.clickFontColor({type:Color.Type.Standard, index: 5, subIndex:3});
Toolbar.clickFontColor({type:Color.Type.EyeDropper, x: 100, y: 100})
Toolbar.clickFontColor({type:Color.Type.Custom, r: 100, g: 100, b:100, grid: 0});
Toolbar.clickFontColor({type: Color.Type.CustomClick, square: [50, 100], hight: 45});
Toolbar.clickHightlight({index: 3});
Toolbar.clickShading({type:Color.Type.Standard, index: 5, subIndex:3});
Toolbar.clickShading({type:Color.Type.EyeDropper, x: 100, y: 100})
Toolbar.clickShading({type:Color.Type.Custom, r: 100, g: 100, b:100, grid: 0});
Toolbar.clickShading({type: Color.Type.CustomClick, square: [50, 100], hight: 45});
// Toolbar.clickChangeCase('UPPERCASE');
// // // Toolbar.selectFontSize('28');
// // Toolbar.selectShading('Black, Text 1')
// // Toolbar.clickBullets('filledroundbullets');
// // Toolbar.clickNumbering('iBrace');
// // Toolbar.clickMultilevels('variosheadings')
// // Toolbar.clickJustified()
// // Toolbar.clickAlignRight()
// // Toolbar.clickAlignCenter()
// // Toolbar.clickAlignLeft()
// // Draw.clickSelect()
// //Toolbar.selectFontMoreBySquare(0, 100);
// // Draw.penOne('Black', 0, 0, 0, 30, 30);
// // Draw.penTwo('Red', 0, 0, 0, 30, 30);
// // Draw.highlighter('Blue', 0, 0, 0, 30, 30);
// Toolbar.selectFontCombo([50,50], 30);
// Toolbar.selectFontColorByText(50, 50, 50, 50);
// Toolbar.selectShadingColorByText(50, 25, 88, 200)
// Toolbar.clickFontEyedrop(100, 200);
//ownload.downloadTxt();
