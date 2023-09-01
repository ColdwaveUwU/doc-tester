const Download = require("../lib/Download");

Tester.createFile("Document");
Download.downloadDocx();
Download.downloadDotx();
Download.downloadEpub();
Download.downloadFb2();
Download.downloadHtml();
Download.downloadJpg();
Download.downloadTxt("Unicode (UTF-8)");

Tester.close();