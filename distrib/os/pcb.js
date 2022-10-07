var TSOS;
(function (TSOS) {
    class ProcessControlBlock {
        constructor(pid = 0, state = '', location = '', priority = 0, pc = 0, acc = 0, xreg = 0, yreg = 0, zflag = 0) {
            this.pid = pid;
            this.state = state;
            this.location = location;
            this.priority = priority;
            this.pc = pc;
            this.acc = acc;
            this.xreg = xreg;
            this.yreg = yreg;
            this.zflag = zflag;
        }
        init() {
            this.pid = 0;
            this.state = '';
            this.location = '';
            this.priority = 0;
            this.pc = 0;
            this.acc = 0;
            this.xreg = 0;
            this.yreg = 0;
            this.zflag = 0;
        }
    }
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=pcb.js.map