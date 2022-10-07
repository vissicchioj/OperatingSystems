var TSOS;
(function (TSOS) {
    //variables
    var i = 0x00;
    var address;
    var contains;
    class Memory {
        constructor(size) {
            // create the private array of memory
            this.memArray = [];
            // Set the size of the array based on Control.ts (256 as of IP2)
            this.memArray = new Array(size);
        }
        // initialize array as 0x00
        init() {
            for (i = 0x00; i < this.memArray.length; i++) {
                this.memArray[i] = 0x00;
            }
        }
        //reset all members in the array to be 0x00
        reset() {
            for (i = 0x00; i < this.memArray.length; i++) {
                this.memArray[i] = 0x00;
            }
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map