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
            // TODO: Check if fileName exists before adding a new one.
            var availableDir = this.findNextAvailableDir();
            var availableData = this.findNextAvailableData();
            // Remove all commas from the tsb string that returns from availableData as it will mess up my display.
            var availableDataNext = availableData.replace(/,/g, '');
            var strToHex = this.strToHex(fileName);
            // Create a value string 
            var newVal = "1" + availableDataNext + strToHex; // inUse = 1, Next = tsb string from avaialableData, valData = strToHex
            newVal = this.appendDashes(newVal);
            sessionStorage.setItem(availableDir, newVal);
            // Set the new data location that is next to inUse
            var availableDataVal = "1000";
            for (var j = 0; j < 60; j++) {
                availableDataVal += "- ";
            }
            sessionStorage.setItem(availableData, availableDataVal);
            _StdOut.putText("New file created: " + fileName);
            TSOS.Control._setDiskTable();
        }
        write(fileName, dataStr) {
            // get the TSB key for the filename mentioned
            var fileNameKey = this.findFileNameKey(fileName);
            if (fileNameKey === "") {
                _StdOut.putText(fileName + " not found.");
            }
            else {
                // get the next key by looking at the value within the current key
                var nextKey = sessionStorage.getItem(fileNameKey).substr(1, 3);
                nextKey = this.appendCommas(nextKey);
                var hexDataStr = this.strToHex(dataStr);
                var newVal = "1***" + hexDataStr;
                newVal = this.appendDashes(newVal);
                // With the nextKey and the dataStr turned into hex, our key and value is set in session storage.
                sessionStorage.setItem(nextKey, newVal);
                _StdOut.putText("Data written to " + fileName);
                TSOS.Control._setDiskTable();
            }
        }
        read(fileName) {
            var fileNameKey = this.findFileNameKey(fileName);
            if (fileNameKey === "") {
                _StdOut.putText(fileName + " not found.");
            }
            else {
                var nextKey = sessionStorage.getItem(fileNameKey).substr(1, 3);
                nextKey = this.appendCommas(nextKey);
                // Get the hexString from file by removing all -
                var hexStr = sessionStorage.getItem(nextKey).replace(/- /g, '').trim();
                var dataStr = this.hexToStr(hexStr);
                _StdOut.putText("Contents of " + fileName + ": ");
                // read out the dataStr to user
                _StdOut.putText(dataStr);
            }
        }
        delete(fileName) {
            var fileNameKey = this.findFileNameKey(fileName);
            if (fileNameKey === "") {
                _StdOut.putText(fileName + " not found.");
            }
            else {
                var fileNameData = sessionStorage.getItem(fileNameKey);
                // Set inUse to 0 so it is available to be replaced but dont remove the data
                var removeInUse = fileNameData.replace("1", "0");
                sessionStorage.setItem(fileNameKey, removeInUse);
                _StdOut.putText("File: " + fileName + " has been deleted.");
                TSOS.Control._setDiskTable();
            }
        }
        rename(oldFileName, newFileName) {
            var oldFileNameKey = this.findFileNameKey(oldFileName);
            if (oldFileNameKey === "") {
                _StdOut.putText(oldFileName + " not found.");
            }
            else {
                //var count = 0;
                var fileNameData = sessionStorage.getItem(oldFileNameKey).replace(/- /g, '').trim();
                var removeFileName = fileNameData.substr(0, 4);
                var hexNewFileName = this.strToHex(newFileName);
                var renamedFile = removeFileName + hexNewFileName;
                renamedFile = this.appendDashes(renamedFile);
                sessionStorage.setItem(oldFileNameKey, renamedFile);
                //_StdOut.putText(count + "");
                _StdOut.putText(oldFileName + " has been renamed to " + newFileName + ".");
                TSOS.Control._setDiskTable();
            }
        }
        ls() {
            var fileNames = [];
            // go through DIR and add eveery fileName inUse to fileNames
            for (var s = 0; s < 8; s++) {
                for (var b = 0; b < 8; b++) {
                    var valData = sessionStorage.getItem("0," + s + "," + b);
                    var hexFileName = valData.substr(4, valData.length).replace(/- /g, '');
                    if (hexFileName === '') {
                    }
                    else {
                        // Check that the data is inUse
                        if (valData.charAt(0) === "1") {
                            var strFileName = this.hexToStr(hexFileName);
                            fileNames.push(strFileName);
                        }
                    }
                }
            }
            for (var i = 0; i < fileNames.length; i++) {
                _StdOut.putText(fileNames[i]);
                _StdOut.advanceLine();
            }
        }
        appendDashes(dataStr) {
            var newStr = dataStr;
            // Calculate remainingValData by subtracting space used from 64
            var remainingValData = 64 - (4 + newStr.substr(4, newStr.length).length / 2);
            //var count = 0;
            for (var i = 0; i < remainingValData; i++) {
                newStr += "- ";
                // Count to check if the amount of dashes are correct
                //count++;
            }
            //_StdOut.putText(count + "");
            return newStr;
        }
        // Will need to add commas when taking the next key and using it as a current key
        appendCommas(key) {
            var newStr = key;
            var charArr = [...newStr];
            charArr[0] = charArr[0] + ",";
            charArr[1] = charArr[1] + ",";
            newStr = charArr.join("");
            return newStr;
        }
        findFileNameKey(fileName) {
            var key = "";
            var found = false;
            for (var s = 0; s < 8; s++) {
                for (var b = 0; b < 8; b++) {
                    var itemLength = sessionStorage.getItem("0," + s + "," + b).length;
                    // use this find the fileName with -
                    var dataVal = sessionStorage.getItem("0," + s + "," + b).substr(4, itemLength);
                    // remove all - from the dataVal
                    var hexFileName = dataVal.replace(/- /g, '').trim();
                    var getFileName = this.hexToStr(hexFileName);
                    if (getFileName === fileName && found === false) {
                        key = "0," + s + "," + b;
                        found = true;
                    }
                }
            }
            return key;
        }
        findNextAvailableDir() {
            // Search through Dir until inUse = 0, meaning its available 
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
        findNextAvailableData() {
            // Search through Data until inUse = 0, meaning its available 
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