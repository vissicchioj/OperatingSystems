var TSOS;
(function (TSOS) {
    class CpuScheduler {
        // Cpu Scheduler is in charge of checking whether or not a context switch should be occurring
        // IP3 only handles Round Robin Scheduling
        constructor(
        // default quantum is 6
        quantum = 6, 
        // after (quantum num) cycles the context switch occurs
        cycleCounter = 0) {
            this.quantum = quantum;
            this.cycleCounter = cycleCounter;
        }
        roundRobin() {
            // Needs to call the kernel interrupt for cpu dispatcher context switch
            if (_Kernel.readyQueue.getSize() > 0) {
                // The amount of clock cycles reached the quantum so call context switch via interrupt
                if (this.cycleCounter >= this.quantum) {
                    this.cycleCounter = 0;
                    _Kernel.krnInterruptHandler(CONTEXTSWITCH_IRQ, null);
                }
            }
        }
    }
    TSOS.CpuScheduler = CpuScheduler;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpuScheduler.js.map