const Toolbar = require('../lib/Toolbar')
const Draw = require('../lib/Draw')
const Color = require("../lib/Color");
//Tester.uploadTestFile('/', 'docx');
Tester.openFile('new (2).docx')
Draw.penOne({type: Color.Type.CustomClick, square: [50, 100], hight: 45}, 0, 0, 0, 30, 30);
Draw.penOne({index: 5}, 0, 0, 0, 100, 230)
Draw.penTwo({type: Color.Type.CustomClick, square: [28, 14], hight: 28}, 0, 0, 0, 203, 78);
Draw.penTwo({index: 5}, 0, 0, 0, 24, 88)
Draw.highlighter({type: Color.Type.CustomClick, square: [45, 55], hight: 55}, 0, 15, 15, 145, 73);
Draw.highlighter({index: 5}, 0, 15, 15, 145, 73)


