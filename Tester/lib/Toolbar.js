module.exports = {
    tester : globalThis.Tester,

    clickHome : async function() {
        await this.tester.click('li a[data-title="Home"]');
    },

    clickBold : async function() {
        await this.clickHome();
        await this.tester.click("#id-toolbar-btn-bold");
    },

    clickItalic : async function() {
        await this.clickHome();
        await this.tester.click("#id-toolbar-btn-italic");
    },

    clickUnderline : async function() {
        await this.clickHome();
        await this.tester.click("#id-toolbar-btn-underline");
    },

    clickStrikeout : async function() {
        await this.clickHome();
        await this.tester.click("#id-toolbar-btn-strikeout");
    },

    clickSuperscript : async function() {
        await this.clickHome();
        await this.tester.click("#id-toolbar-btn-superscript");
    },

    clickSubscript : async function() {
        await clickHome();
        await this.tester.click("#id-toolbar-btn-subscript");
    },

    clickIncFont : async function() {
        await this.clickHome();
        await this.tester.click("#id-toolbar-btn-incfont");
    },

    clickDecFont : async function() {
        await this.clickHome();
        await this.tester.click("#id-toolbar-btn-decfont");
    },

    clickFormControl : async function() {
        await this.clickHome();
        await this.tester.click("#asc-gen439");
    },

    setFontSize : async function(size) {
        await this.clickHome();
        await this.tester.click("#asc-gen437");
        await this.tester.input(size);
    },

    selectFontSize : async function(size) {
        await this.clickHome();
        await this.tester.click("#asc-gen437 > button");
        await this.tester.selectByText(size, "#asc-gen437");
    },

    clickHightlight : async function(color) {
        await this.clickHome();
        await this.tester.click("#id-toolbar-btn-highlight > .btn.btn-toolbar");
        await this.tester.selectDrowdown("#id-toolbar-btn-highlight");
        await this.tester.selectColor("#id-toolbar-btn-highlight", color);
    },

    clickChangeCase : async function(textCase) {
        await this.clickHome();
        await this.tester.click("#id-toolbar-btn-case");
        await this.tester.selectByText(textCase, "#id-toolbar-btn-case");
    },

    clickFontColor : async function(color) {
        await this.clickHome();
        await this.tester.click("#id-toolbar-btn-fontcolor > .btn.btn-toolbar");
        await this.tester.selectDrowdown("#id-toolbar-btn-fontcolor");
        await this.tester.selectColor("#id-toolbar-btn-fontcolor", color);
    },

    clickBullets : async function(bullet) {
        await this.clickHome();
        const bulletLibrary = {
            none: "#id-markers-asc-gen3785",
            filledroundbullets: "#id-markers-asc-gen3786",
            hollowroundbullets: "#id-markers-asc-gen3787",
            filledsquarebullets: "#id-markers-asc-gen3788",
            starbullets: "#id-markers-asc-gen3789",
            arrowbullets: "#id-markers-asc-gen3790",
            checkmarkbullets: "#id-markers-asc-gen3791",
            filledrhombusbullets: "#id-markers-asc-gen3792",
            dashbullets: "#id-markers-asc-gen3793",
        };
        await this.tester.selectDrowdown("#id-toolbar-btn-markers");
        const selectedBulletSelector = bulletLibrary[bullet];
        if (selectedBulletSelector) {
            //search selector?? todo
            await this.tester.click(selectedBulletSelector);
        } else {
            console.error(`Unknown bullet type: ${bullet}`);
        }
    }
};
