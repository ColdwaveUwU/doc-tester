const Insert = require("../lib/InsertImage");

Tester.createFile("Document");
Insert.fromFile("testFile.png");
Insert.fromStorage();
Insert.fromUrl("https://i.postimg.cc/s2fyPfHj/E0d-R7-QWVc-AQJN2-Z.jpg");

Tester.close();
