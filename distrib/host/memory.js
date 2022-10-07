var TSOS;
(function (TSOS) {
    //variables
    var i = 0x00;
    var length = 0x100;
    var address;
    var contains;
    class Memory {
        constructor() {
            // create the private array of memory
            this.memArray = [];
            //fills up the private array with 0x00
            for (i = 0x00; i < length; i++) {
                this.memArray[i] = 0x00;
            }
        }
        //reset all members in the array to be 0x00
        reset() {
            for (i = 0x00; i < length; i++) {
                this.memArray[i] = 0x00;
            }
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map