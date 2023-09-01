const Toolbar = require('../lib/Toolbar');
const Draw = require('../lib/Draw');
const Color = require("../lib/Color");

Tester.openFile("new2.docx");
Draw.penOne({type: Color.Type.CustomClick, x: 50, y: 100, hue: 45}, 0, 0, 0, 30, 30);
Draw.penOne({index: 5}, 0, 0, 0, 100, 230);
Draw.penTwo({type: Color.Type.CustomClick, x: 28, y: 14, hue: 28}, 0, 0, 0, 203, 78);
Draw.penTwo({index: 5}, 0, 0, 0, 24, 88);
Draw.highlighter({type: Color.Type.CustomClick, x: 45, y: 55, hue: 55}, 0, 15, 15, 145, 73);
Draw.highlighter({index: 5}, 0, 15, 15, 145, 73);

Tester.close();


