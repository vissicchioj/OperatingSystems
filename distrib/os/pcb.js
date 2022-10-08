var TSOS;
(function (TSOS) {
    class ProcessControlBlock {
        constructor(pid = -1, state = '', location = '-', priority = 0, pc = 0, acc = 0, xreg = 0, yreg = 0, zflag = 0) {
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
            this.pid = -1;
            this.state = '';
            this.location = 'Memory';
            this.priority = 0;
            this.pc = 0;
            this.acc = 0;
            this.xreg = 0;
            this.yreg = 0;
            this.zflag = 0;
        }
        // Loading a program into memory
        load(userProgram) {
            // Loading again overwrites memory, so reset it first
            _MM.deallocateMem();
            // Memory Manager allocates the User Program into memory
            _MM.allocateMem(userProgram);
            // change state
            this.state = "Resident";
            // Update the PCB table with values
            TSOS.Control._SetPcbTable();
        }
        // Running a program in memory
        run() {
            // change state
            this.state = "Running";
            // Update the PCB table with values
            TSOS.Control._SetPcbTable();
            // Tell the CPU to begin executing
            _CPU.isExecuting = true;
        }
    }
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=pcb.js.map