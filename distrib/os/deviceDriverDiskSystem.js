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
    }
    TSOS.DeviceDriverDiskSystem = DeviceDriverDiskSystem;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=deviceDriverDiskSystem.js.map