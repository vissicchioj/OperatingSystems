module TSOS
{
    export class CpuScheduler
    {
        // Cpu Scheduler is in charge of checking whether or not a context switch should be occurring
        // IP3 only handles Round Robin Scheduling
        constructor
        (
            // default quantum is 6
            public quantum = 6,
            // after (quantum num) cycles the context switch occurs
            public cycleCounter = 0
        )
        {

        }

        public roundRobin()
        {
            // Needs to call the kernel interrupt for cpu dispatcher context switch
        }
    }
}