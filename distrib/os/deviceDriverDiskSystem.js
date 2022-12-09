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
        }
    }
    TSOS.DeviceDriverDiskSystem = DeviceDriverDiskSystem;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=deviceDriverDiskSystem.js.map