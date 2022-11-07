module TSOS
{
    export class CpuScheduler
    {
        // Cpu Scheduler is in charge of checking whether or not a context switch should be occurring
        // IP3 only handles Round Robin Scheduling
        constructor
        (
            // default quantum is 6
            public quantum: number = 6,
            // after (quantum num) cycles the context switch occurs
            public cycleCounter: number = 0,
        )
        {

        }

        public roundRobin()
        {
            // Needs to call the kernel interrupt for cpu dispatcher context switch
            if (_Kernel.readyQueue.getSize() > 0)
            {
                // Need to check if CPU's pcb exists or not first or else the context switch will never get called
                // Also context switch if the CPU's pcb is complete
                if (_CPU.pcb === null || _CPU.pcb.state === "Finished")
                {
                    _Kernel.krnInterruptHandler(CONTEXTSWITCH_IRQ, null);
                }
                else
                {
                    // The amount of clock cycles reached the quantum so call context switch via interrupt
                    if (this.cycleCounter >= this.quantum)
                    {
                        this.cycleCounter = 0;
                        _Kernel.krnInterruptHandler(CONTEXTSWITCH_IRQ, null);
                    }
                }
            }
        }
    }
}