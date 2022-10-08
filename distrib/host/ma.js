var TSOS;
(function (TSOS) {
    // Read and Writes Memory
    class MemoryAccessor {
        constructor() {
        }
        read(addr) {
            return _Memory.getMem(addr);
        }
        write(addr, hex) {
            _Memory.setMem(addr, hex);
        }
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=ma.js.map