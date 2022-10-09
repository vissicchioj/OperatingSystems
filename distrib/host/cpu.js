/* ------------
     CPU.ts
     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.
     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    //stepNum must begin at 0 because fetch is always the first instruction
    var stepNum = 0;
    //temporary program counter to remember our current place 
    var tempPC = 0x000;
    class Cpu {
        constructor(PC = 0x00, IR = 0x00, Acc = 0x00, Xreg = 0x00, Yreg = 0x00, Zflag = 0x00, isExecuting = false) {
            this.PC = PC;
            this.IR = IR;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        init() {
            this.PC = 0x00;
            this.IR = 0x00;
            this.Acc = 0x00;
            this.Xreg = 0x00;
            this.Yreg = 0x00;
            this.Zflag = 0x00;
            this.isExecuting = false;
        }
        // Cycles when isExecuting = true
        cycle() {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            this.IR = _MA.read(this.PC);
            this.opCodes(this.IR);
            TSOS.Control._SetCpuTable();
        }
        opCodes(currInstruction) {
            switch (currInstruction) {
                case 0xA9:
                    this.LDAConstant();
                    break;
                case 0xAD:
                    this.LDAMemory();
                    break;
                case 0x8D:
                    this.STAMemory();
                    break;
                case 0x6D:
                    break;
                case 0xA2:
                    break;
                case 0xAE:
                    break;
                case 0xA0:
                    break;
                case 0xAC:
                    break;
                case 0xEA:
                    break;
                case 0x00:
                    this.BRK();
                    break;
                case 0xEC:
                    break;
                case 0xD0:
                    break;
                case 0xEE:
                    break;
                case 0xFF:
                    break;
                default:
                    _StdOut.putText("Error: Invalid Op Code.");
            }
        }
        // Fetch, Decode, and Execute do not have to be separated which will remove some complexity that I struggled with in Org & Arch
        // Just need to remember to increment PC at the start of each Op Code (minus BRK) and everytime we access memory
        // Also this time the MA handles reading and writing, NOT the MM like in Org & Arch
        LDAConstant() {
            this.PC++;
            // Set Acc to the current location in memory 
            this.Acc = _MA.read(this.PC);
            this.PC++;
        }
        LDAMemory() {
            this.PC++;
            // Set the lob
            _MM.lob = _MA.read(this.PC);
            this.PC++;
            // Set the hob
            _MM.hob = _MA.read(this.PC);
            //combine the bytes for little endian conversion
            this.Acc = _MA.read(_MM.combineBytes(_MM.lob, _MM.hob));
            this.PC++;
        }
        STAMemory() {
            this.PC++;
            // Set the lob
            _MM.lob = _MA.read(this.PC);
            this.PC++;
            // Set the hob
            _MM.hob = _MA.read(this.PC);
            //combine the bytes for little endian conversion
            _MA.write(_MM.combineBytes(_MM.lob, _MM.hob), this.Acc);
            this.PC++;
            TSOS.Control._SetMemTable();
        }
        BRK() {
            this.isExecuting = false;
            _PCB.state = "Finished";
            // Update the PCB table with values
            TSOS.Control._SetPcbTable();
            this.init();
        }
    }
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpu.js.map