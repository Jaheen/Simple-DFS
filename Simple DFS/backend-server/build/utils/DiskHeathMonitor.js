"use strict";
exports.__esModule = true;
var fs = require("fs");
var os = require("os");
var crypto = require("crypto");
var DiskHealthMonitor = (function () {
    function DiskHealthMonitor() {
    }
    DiskHealthMonitor.getWriteSpeed = function () {
        var previousTime = Date.now();
        var writeStream = fs.createWriteStream(this.TEST_FILE);
        for (var i = 1; i <= 1000; i++) {
            var testChunk = crypto.randomBytes(1000000);
            writeStream.write(testChunk);
        }
        this.SPEED_IN_MB_PER_SECOND.WRITE_SPEED = (1000) / ((Date.now() - previousTime) / 1000);
        writeStream.close();
    };
    DiskHealthMonitor.getReadSpeed = function () {
        var previousTime = Date.now();
        fs.readFileSync(this.TEST_FILE);
        console.log(Date.now() - previousTime);
        this.SPEED_IN_MB_PER_SECOND.READ_SPEED = (1000) / ((Date.now() - previousTime) / 1000);
        fs.unlinkSync(this.TEST_FILE);
    };
    DiskHealthMonitor.checkDiskHealth = function () {
        this.getWriteSpeed();
        this.getReadSpeed();
        console.log(this.SPEED_IN_MB_PER_SECOND);
    };
    DiskHealthMonitor.TEST_FILE = os.tmpdir() + "/simple-dfs-test-block";
    DiskHealthMonitor.SPEED_IN_MB_PER_SECOND = {
        WRITE_SPEED: null,
        READ_SPEED: null
    };
    return DiskHealthMonitor;
}());
exports["default"] = DiskHealthMonitor;
