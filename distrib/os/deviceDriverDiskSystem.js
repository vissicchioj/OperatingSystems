/* ----------------------------------
   DeviceDriverDiskSystem.ts

   The Kernel Device Driver Disk System
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    class DeviceDriverDiskSystem extends TSOS.DeviceDriver {
        constructor() {
            super();
            this.driverEntry = this.krnDsddDriverEntry;
        }
        krnDsddDriverEntry() {
            // Initialization routine for this, the kernel-mode Disk System Device Driver.
            this.status = "loaded";
        }
        format() {
            //tracks
            for (var t = 0; t < 4; t++) {
                //sectors
                for (var s = 0; s < 8; s++) {
                    //blocks
                    for (var b = 0; b < 8; b++) {
                        var val = "";
                        // Check for MBR
                        if (t == 0 && s == 0 && b == 0) {
                            val += "1000"; // key (0,0,0) (aka mbr) will have 1 for inUse and 000 for next
                            for (var i = 0; i < 60; i++) {
                                // Data will be filled with -
                                val += "- ";
                            }
                        }
                        else {
                            val += "0000";
                            for (var i = 0; i < 60; i++) {
                                val += "- ";
                            }
                        }
                        sessionStorage.setItem(t + "," + s + "," + b, val);
                    }
                }
            }
            _StdOut.putText("Disk Format Successful!");
            TSOS.Control._setDiskTable();
        }
        create(fileName) {
            // TODO: Check if fileName exists.
            var availableDir = this.findNextDir();
            var availableData = this.findNextData();
            // Remove all commas from the tsb string that returns from availableData as it will mess up my display.
            var availableDataNext = availableData.replace(/,/g, '');
            var strToHex = this.strToHex(fileName);
            // Create a value string 
            var newVal = "1" + availableDataNext + strToHex; // inUse = 1, Next = tsb string from avaialableData, valData = strToHex
            // Calculate remainingValData by subtracting space used from 64
            var remainingValData = 64 - (4 + strToHex.length / 2);
            for (var i = 0; i < remainingValData; i++) {
                newVal += "- ";
            }
            sessionStorage.setItem(availableDir, newVal);
            // Set the new data location that is next to inUse
            var availableDataVal = "1000";
            for (var j = 0; j < 60; j++) {
                availableDataVal += "- ";
            }
            sessionStorage.setItem(availableData, availableDataVal);
            TSOS.Control._setDiskTable();
        }
        findNextDir() {
            var dirKey = "";
            var found = false;
            for (var s = 0; s < 8; s++) {
                for (var b = 0; b < 8; b++) {
                    var inUse = sessionStorage.getItem("0," + s + "," + b).charAt(0);
                    if (inUse === "0" && found === false) {
                        dirKey = "0," + s + "," + b;
                        found = true;
                    }
                }
            }
            return dirKey;
        }
        findNextData() {
            var dataKey = "";
            var found = false;
            for (var t = 1; t < 4; t++) {
                for (var s = 0; s < 8; s++) {
                    for (var b = 0; b < 8; b++) {
                        var inUse = sessionStorage.getItem(t + "," + s + "," + b).charAt(0);
                        if (inUse === "0" && found === false) {
                            dataKey = t + "," + s + "," + b;
                            found = true;
                        }
                    }
                }
            }
            return dataKey;
        }
        strToHex(str) {
            var hexNums = "";
            for (var i = 0; i < str.length; i++) {
                hexNums += str.charCodeAt(i).toString(16);
            }
            return hexNums;
        }
        hexToStr(hex) {
            var str = "";
            // every two hex digits is an ascii char
            for (var i = 0; i < hex.length; i += 2) {
                str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
            }
            return str;
        }
    }
    TSOS.DeviceDriverDiskSystem = DeviceDriverDiskSystem;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=deviceDriverDiskSystem.js.map