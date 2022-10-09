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
        setPcb() {
            // Keep up PCB values with the PC
            _PCB.pc = this.PC;
            _PCB.acc = this.Acc;
            _PCB.xreg = this.Xreg;
            _PCB.yreg = this.Yreg;
            _PCB.zflag = this.Zflag;
        }
        // Cycles when isExecuting = true
        cycle() {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            this.IR = _MA.read(this.PC);
            this.opCodes(this.IR);
            this.setPcb();
            TSOS.Control._SetCpuTable();
            TSOS.Control._SetMemTable();
            TSOS.Control._SetPcbTable();
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
                    this.ADC();
                    break;
                case 0xA2:
                    this.LDXConstant();
                    break;
                case 0xAE:
                    this.LDXMemory();
                    break;
                case 0xA0:
                    this.LDYConstant();
                    break;
                case 0xAC:
                    this.LDYMemory();
                    break;
                case 0xEA:
                    this.NOP();
                    break;
                case 0x00:
                    this.BRK();
                    break;
                case 0xEC:
                    this.CPX();
                    break;
                case 0xD0:
                    this.BNE();
                    break;
                case 0xEE:
                    this.INC();
                    break;
                case 0xFF:
                    this.SYS();
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
            this.setPcb();
            this.PC++;
        }
        LDAMemory() {
            this.PC++;
            // Set the lob
            _MM.lob = _MA.read(this.PC);
            this.setPcb();
            this.PC++;
            // Set the hob
            _MM.hob = _MA.read(this.PC);
            //Set accumulator to loaction in memory using little endian conversion
            this.Acc = _MA.read(_MM.combineBytes(_MM.lob, _MM.hob));
            this.setPcb();
            this.PC++;
        }
        STAMemory() {
            this.PC++;
            // Set the lob
            _MM.lob = _MA.read(this.PC);
            this.setPcb();
            this.PC++;
            // Set the hob
            _MM.hob = _MA.read(this.PC);
            //combine the bytes for little endian conversion
            _MA.write(_MM.combineBytes(_MM.lob, _MM.hob), this.Acc);
            this.setPcb();
            this.PC++;
        }
        ADC() {
            this.PC++;
            // Set the lob
            _MM.lob = _MA.read(this.PC);
            this.setPcb();
            this.PC++;
            // Set the hob
            _MM.hob = _MA.read(this.PC);
            this.setPcb();
            //Set accumulator to loaction in memory using little endian conversion
            this.Acc = this.Acc + _MA.read(_MM.combineBytes(_MM.lob, _MM.hob));
            this.PC++;
        }
        LDXConstant() {
            this.PC++;
            this.Xreg = _MA.read(this.PC);
            this.setPcb();
            this.PC++;
        }
        LDXMemory() {
            this.PC++;
            // Set the lob
            _MM.lob = _MA.read(this.PC);
            this.setPcb();
            this.PC++;
            // Set the hob
            _MM.hob = _MA.read(this.PC);
            this.setPcb();
            //Set Xreg to loaction in memory using little endian conversion
            this.Xreg = _MA.read(_MM.combineBytes(_MM.lob, _MM.hob));
            this.PC++;
        }
        LDYConstant() {
            this.PC++;
            this.Yreg = _MA.read(this.PC);
            this.setPcb();
            this.PC++;
        }
        LDYMemory() {
            this.PC++;
            // Set the lob
            _MM.lob = _MA.read(this.PC);
            this.setPcb();
            this.PC++;
            // Set the hob
            _MM.hob = _MA.read(this.PC);
            this.setPcb();
            //Set Yreg to loaction in memory using little endian conversion
            this.Yreg = _MA.read(_MM.combineBytes(_MM.lob, _MM.hob));
            this.PC++;
        }
        NOP() {
            this.PC++;
        }
        CPX() {
            this.PC++;
            // Set the lob
            _MM.lob = _MA.read(this.PC);
            this.setPcb();
            this.PC++;
            // Set the hob
            _MM.hob = _MA.read(this.PC);
            this.setPcb();
            //sets zFlag to 0 if the combination of the lob and hob does not equal the xReg
            if (_MA.read(_MM.combineBytes(_MM.lob, _MM.hob)) !== this.Xreg) {
                this.Zflag = 0x00;
            }
            //sets zFlag to 1 if the combination of the lob and hob does equal the xReg
            else {
                this.Zflag = 0x01;
            }
            this.PC++;
        }
        BNE() {
            this.PC++;
            this.setPcb();
            //if zFlag is not set
            if (this.Zflag == 0x00) {
                // //if the number represents a positive number
                // if (_MA.read(this.PC) < 0x80)
                // {
                //     this.PC = this.PC + _MM.combineBytes(_MA.read(this.PC),0x00);
                //     this.setPcb();
                // }
                // //if the number represents a negative number
                // else
                // {
                this.PC = this.PC + _MM.combineBytes(_MA.read(this.PC), 0x00);
                this.setPcb();
                //then remove the 1 in the front so that we are moving backwards
                //and not moving extremely far forwards
                if (this.PC > 0xFF) {
                    this.PC = this.PC - 0x100;
                    this.setPcb();
                }
                //}
                this.PC++;
            }
            //branch fails because the zFlag is 1
            else {
                this.PC++;
            }
        }
        INC() {
            this.PC++;
            // Set the lob
            _MM.lob = _MA.read(this.PC);
            this.setPcb();
            this.PC++;
            // Set the hob
            _MM.hob = _MA.read(this.PC);
            this.setPcb();
            //Set accumulator to loaction in memory using little endian conversion
            this.Acc = _MA.read(_MM.combineBytes(_MM.lob, _MM.hob));
            this.setPcb();
            this.Acc++;
            // Set address in memory using little endian conversion to the accumulator
            _MA.write(_MM.combineBytes(_MM.lob, _MM.hob), this.Acc);
            this.PC++;
        }
        SYS() {
            //this.PC++;
            //System Call 1
            if (this.Xreg == 0x01) {
                //print out the value in the yReg
                _StdOut.putText(this.Yreg + " ");
            }
            //System Call 2
            if (this.Xreg == 0x02) {
                var asciiStr = '';
                // tempPC will remember where the PC was before the Sys call
                tempPC = this.PC;
                this.PC = this.Yreg;
                this.setPcb();
                while (_MA.read(this.PC) !== 0x00) {
                    // Get all of the ascii characters in the current location in memory until it reaches 0x00
                    asciiStr = asciiStr + String.fromCharCode(_MA.read(this.PC));
                    ;
                    this.PC++;
                    this.setPcb();
                }
                // Print out the string
                _StdOut.putText(asciiStr);
                // Go back to where we were before the Sys call
                this.PC = tempPC;
            }
            this.PC++;
        }
        BRK() {
            // PROGRAM COMPLETE
            this.isExecuting = false;
            _PCB.state = "Finished";
            this.init();
            _StdOut.advanceLine();
        }
    }
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpu.js.map