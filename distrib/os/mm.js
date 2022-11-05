var TSOS;
(function (TSOS) {
    // Allocates and deallocates memory
    class MemoryManager {
        constructor() {
            this.lob = 0x00;
            this.hob = 0x00;
            this.combinedByte = 0x000;
            this.byteFlipArray = [];
            this.memorySize = 256;
        }
        // Allocate User Input Program to memory
        allocateMem(baseReg, userProgram) {
            for (var i = 0; i < this.memorySize; i++) {
                var hex = parseInt(userProgram[i], 16);
                // A lot of programs will not fill the entire memory array so fill the rest with 00
                // if the value is not a number we make it 00
                if (isNaN(hex)) {
                    _Memory.setMem(i + baseReg, 0x00);
                }
                // The memory that the user inputted
                else {
                    _Memory.setMem(i + baseReg, hex);
                }
            }
        }
        // Resets memory
        deallocateMem() {
            _Memory.reset();
        }
        //used to combine two bytes together in order to create a two byte number
        //this is used to implement little endian or to add to the ProgramCounter as seen in branch
        combineBytes(loByte, hoByte) {
            this.byteFlipArray[0] = hoByte;
            this.byteFlipArray[1] = loByte;
            this.combinedByte = ((this.byteFlipArray[0] << 8) | (this.byteFlipArray[1]));
            return this.combinedByte;
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=mm.js.map