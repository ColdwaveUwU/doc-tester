module.exports = {

    clickHome : async function() {
        await Tester.click('li a[data-title="Home"]');
    },

    clickBold : async function() {
        await this.clickHome();
        await Tester.click("#id-toolbar-btn-bold");
    },

    clickItalic : async function() {
        await this.clickHome();
        await Tester.click("#id-toolbar-btn-italic");
    },

    clickUnderline : async function() {
        await this.clickHome();
        await Tester.click("#id-toolbar-btn-underline");
    },

    clickStrikeout : async function() {
        await this.clickHome();
        await Tester.click("#id-toolbar-btn-strikeout");
    },

    clickSuperscript : async function() {
        await this.clickHome();
        await Tester.click("#id-toolbar-btn-superscript");
    },

    clickSubscript : async function() {
        await clickHome();
        await Tester.click("#id-toolbar-btn-subscript");
    },

    clickIncFont : async function() {
        await this.clickHome();
        await Tester.click("#id-toolbar-btn-incfont");
    },

    clickDecFont : async function() {
        await this.clickHome();
        await Tester.click("#id-toolbar-btn-decfont");
    },

    clickFormControl : async function() {
        await this.clickHome();
        await Tester.click("#asc-gen439");
    },

    setFontSize : async function(size) {
        await this.clickHome();
        await Tester.click("#asc-gen437");
        await Tester.input(size);
    },

    selectFontSize : async function(size) {
        await this.clickHome();
        await Tester.click("#asc-gen437 > button");
        await Tester.selectByText(size, "#asc-gen437");
    },

    clickHightlight : async function(color) {
        await this.clickHome();
        await Tester.click("#id-toolbar-btn-highlight > .btn.btn-toolbar");
        await Tester.selectDrowdown("#id-toolbar-btn-highlight");
        await Tester.selectColor("#id-toolbar-btn-highlight", color);
    },

    clickChangeCase : async function(textCase) {
        await this.clickHome();
        await Tester.click("#id-toolbar-btn-case");
        await Tester.selectByText(textCase, "#id-toolbar-btn-case");
    },

    clickFontColor : async function(color) {
        await this.clickHome();
        await Tester.click("#id-toolbar-btn-fontcolor > .btn.btn-toolbar");
        await Tester.selectDrowdown("#id-toolbar-btn-fontcolor");
        await Tester.selectColor("#id-toolbar-btn-fontcolor", color);
    },

    clickBullets : async function(bullet) {
        await this.clickHome();
        const bulletLibrary = {
            none: "#id-markers-asc-gen3777",
            filledroundbullets: "#id-markers-asc-gen3778",
            hollowroundbullets: "#id-markers-asc-gen3787",
            filledsquarebullets: "#id-markers-asc-gen3788",
            starbullets: "#id-markers-asc-gen3789",
            arrowbullets: "#id-markers-asc-gen3790",
            checkmarkbullets: "#id-markers-asc-gen3791",
            filledrhombusbullets: "#id-markers-asc-gen3792",
            dashbullets: "#id-markers-asc-gen3793",
        };
        await Tester.selectDrowdown("#id-toolbar-btn-markers");
        const selectedBulletSelector = bulletLibrary[bullet];
        if (selectedBulletSelector) {
            //search selector?? todo
            await Tester.click("#id-markers-asc-gen3778");
        } else {
            console.error(`Unknown bullet type: ${bullet}`);
        }
    }
};
