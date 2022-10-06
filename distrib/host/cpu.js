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
        constructor(PC = 0, IR = 0, Acc = 0, Xreg = 0, Yreg = 0, Zflag = 0, isExecuting = false) {
            this.PC = PC;
            this.IR = IR;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        init() {
            this.PC = 0;
            this.IR = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }
        cycle() {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            //will only perform one step per clock cycle
            this.step(stepNum);
        }
        step(step) {
            //step represents what instruction cycle step we are currently on for this clock cycle
            switch (step) {
                case 0:
                    this.fetch(this.PC);
                    break;
                case 1:
                    this.decode(this.PC);
                    break;
                case 2:
                    this.decode2(this.PC);
                    break;
                case 3:
                    this.execute();
                    break;
                case 4:
                    this.execute2();
                    break;
                case 5:
                    this.writeBack();
                    break;
            }
        }
        fetch(hexNum) {
            this.isExecuting = true;
            //set the IR to the current MDR
            this.IR = this.mmu.readImmediate(hexNum);
            //increment program counter because we went to memory
            this.PC++;
            //console.log("fetch");
            //always go to decode next
            stepNum = 1;
        }
        decode(hexNum) {
            //load accumulator with a constant
            if (this.IR == 0xA9) {
                //set accumulator to the MDR
                this.Acc = this.mmu.readImmediate(hexNum);
                this.PC++;
                stepNum = 0;
            }
            //These instructions all use decode2 because it makes use of lob and hob
            // loading accumulator from memory || store accumulator in memory ||
            // store the x register from memory || store the y register from memory || add contents from memory to accumulator ||
            // Compare a byte in memory to the x reg, sets z flag if equal || increment a byte from memory
            if (this.IR == 0xAD || this.IR == 0x8D || this.IR == 0xAE || this.IR == 0xAC || this.IR == 0x6D || this.IR == 0xEC || this.IR == 0xEE) {
                //we need to set the lob the MDR
                this.mmu.lob = this.mmu.readImmediate(hexNum);
                this.PC++;
                //we will need decode2 to make use of the hob
                stepNum = 2;
            }
            //load x register with a constant
            if (this.IR == 0xA2) {
                //set x register to the MDR
                this.Xreg = this.mmu.readImmediate(hexNum);
                this.PC++;
                stepNum = 0;
            }
            //no operation
            if (this.IR == 0xEA) {
                //does nothing and brings us back to fetch
                stepNum = 0;
            }
            //break
            if (this.IR == 0x00) {
                //kills the program
                //process.kill(process.pid, 'SIGINT');
                //stepNum = 0;
                this.isExecuting = false;
            }
            //branch
            if (this.IR == 0xD0) {
                //if zFlag is not set
                if (this.Zflag == 0x00) {
                    //if the number represents a positive number
                    if (this.mmu.readImmediate(hexNum) < 0x80) {
                        //add the MDR to the programCounter
                        this.PC = this.PC + this.mmu.combineBytes(this.mmu.readImmediate(hexNum), 0x00);
                    }
                    //if the number represents a negative number
                    else {
                        //we need to make sure that there are two Fs in front since we are adding a one byte number
                        //to a two byte number and the MDR is a negative representation
                        this.PC = this.PC + this.mmu.combineBytes(this.mmu.readImmediate(hexNum), 0xFF);
                        //then find a way to remove the 1 in the front so that we are moving backwards
                        //and not moving extremely far forwards
                        if (this.PC > 0xFF) {
                            this.PC = this.PC - 0x100;
                        }
                    }
                    this.PC++;
                    stepNum = 0;
                }
                //branch fails because the zFlag is 1
                else {
                    this.PC++;
                    stepNum = 0;
                }
            }
            //System Calls
            if (this.IR == 0xFF) {
                //System Call 1
                if (this.Xreg == 0x01) {
                    //print out the value in the yReg
                    _StdOut.putText(this.Yreg + " ");
                    stepNum = 0;
                }
                //System Call 2
                if (this.Xreg == 0x02) {
                }
                //System Call 3
                if (xReg == 0x03) {
                    //we need to set the lob to the MDR and use decode2
                    this.mmu.lob = this.mmu.readImmediate(hexNum);
                    programCounter++;
                    stepNum = 2;
                }
                //stepNum = 6
            }
            //console.log("decode");
            /*
            //if we need decode2
            stepNum = 2;
            //or go to execute
            stepNum = 3;
            */
        }
        decode2(hexNum) {
            if (this.IR == 0xAD || this.IR == 0x8D || this.IR == 0xAE || this.IR == 0xAC ||
                this.IR == 0x6D || this.IR == 0xEC || this.IR == 0xEE || this.IR == 0xFF) {
                //we need to set the hob to the MDR
                this.mmu.hob = this.mmu.readImmediate(hexNum);
                this.PC++;
                stepNum = 3;
            }
            //console.log("decode2");
        }
        execute() {
            if (this.IR == 0xAD) {
                //set the accumulator to the combination of the data in the MAR lob and hob
                this.Acc = this.mmu.readImmediate(this.mmu.combineBytes(this.mmu.lob, this.mmu.hob));
                stepNum = 0;
            }
            if (this.IR == 0x8D) {
                //overwrite data in the MAR to the data in the MAR accumulator
                this.mmu.writeImmediate(this.mmu.combineBytes(this.mmu.lob, this.mmu.hob), accumulator);
                stepNum = 0;
            }
            if (this.IR == 0xAE) {
                //set the xReg to the combination of the data in the MAR lob and hob
                this.Xreg = this.mmu.readImmediate(this.mmu.combineBytes(this.mmu.lob, this.mmu.hob));
                stepNum = 0;
            }
            if (this.IR == 0xAC) {
                //set the yReg to the combination of the data in the MAR lob and hob
                this.Yreg = this.mmu.readImmediate(this.mmu.combineBytes(this.mmu.lob, this.mmu.hob));
                stepNum = 0;
            }
            if (this.IR == 0x6D) {
                //add the data in the MAR combination of the lob and hob to the accumulator
                this.Acc = this.Acc + this.mmu.readImmediate(this.mmu.combineBytes(this.mmu.lob, this.mmu.hob));
                stepNum = 0;
            }
            if (this.IR == 0xEC) {
                //sets zFlag to 0 if the combination of the lob and hob does not equal the xReg
                if (this.mmu.readImmediate(this.mmu.combineBytes(this.mmu.lob, this.mmu.hob)) != this.Xreg) {
                    this.Zflag = 0x00;
                }
                //sets zFlag to 1 if the combination of the lob and hob does equal the xReg
                else {
                    this.Zflag = 0x01;
                }
                stepNum = 0;
            }
            if (this.IR == 0xEE) {
                //set the accumulator to the data in the MAR combination of the lob and hob
                this.Acc = this.mmu.readImmediate(this.mmu.combineBytes(this.mmu.lob, this.mmu.hob));
                //we need execute2
                stepNum = 4;
            }
            if (this.IR == 0xFF) {
                //set the tempPC to the current programCounter to remember where we were
                tempPC = this.PC;
                //set program counter to the combination of the lob and hob
                this.PC = this.mmu.combineBytes(this.mmu.lob, this.mmu.hob);
                //keep printing out ascii chars until we reach 0x00
                while (this.mmu.readImmediate(this.PC) != 0x00) {
                    //make use of our ascii class to print out the byte from our MDR in character form
                    _StdOut.putText(this.ascii.byteToChar(this.mmu.readImmediate(this.PC)));
                    this.PC++;
                }
                //set the programCounter to the tempPC to go back to where we were
                this.PC = tempPC;
                stepNum = 0;
            }
            //console.log("execute");
            /*
            //if we need execute2
            stepNum = 4
            */
        }
        execute2() {
            if (this.IR == 0xEE) {
                //increment the accumulator
                this.Acc++;
                stepNum = 5;
            }
        }
        writeBack() {
            if (this.IR == 0xEE) {
                //overwrite the data in the MAR combination of the lob and hob with the accumulator
                this.mmu.writeImmediate(this.mmu.combineBytes(this.mmu.lob, this.mmu.hob), this.Acc);
                stepNum = 0;
            }
        }
    }
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpu.js.map