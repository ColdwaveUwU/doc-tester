const Toolbar = require("../lib/Toolbar");
const Color = require("../lib/Color");

Tester.openFile("new.docx");
Toolbar.selectFontSize("14");
Toolbar.clickFontColor({ type: Color.Type.Auto });
Toolbar.clickFontColor({ type: Color.Type.Standard, index: 5, subIndex: 3 });
Toolbar.clickFontColor({ type: Color.Type.EyeDropper, x: 100, y: 100 });
Toolbar.clickFontColor({
    type: Color.Type.Custom,
    r: 100,
    g: 100,
    b: 100
});
Toolbar.clickFontColor({
    type: Color.Type.CustomClick,
    x: 50, y: 100,
    hue: 45
});
Toolbar.clickHightlight({ index: 3 });
Toolbar.clickShading({ type: Color.Type.Standard, index: 5, subIndex: 3 });
Toolbar.clickShading({ type: Color.Type.EyeDropper, x: 100, y: 100 });
Toolbar.clickShading({
    type: Color.Type.Custom,
    r: 100,
    g: 100,
    b: 100
});
Toolbar.clickShading({
    type: Color.Type.CustomClick,
    x: 50, y: 100,
    hue: 45
});

Tester.close();
