module TSOS
{
    export class CpuDispatcher
    {
        //Cpu Dispatcher is in charge of performing the context switch
        constructor
        (

        )
        {

        }

        public contextSwitch()
        {
            // Check that the ready queue still has processes left
            if (_Kernel.readyQueue.getSize() > 0)
            {
                // there was no last pcb (Meaning this is the first pcb to be ran in the CPU)
                if (_CPU.pcb !== null)
                {
                    // If the pcb is already finished don't add it back to the queue
                    if (_CPU.pcb.state !== "Finished")
                    {
                        //put it back on the ready queue for the next context switch
                        var lastPCB:TSOS.ProcessControlBlock = _CPU.pcb;
                        lastPCB.state = "Ready"
                        _Kernel.readyQueue.enqueue(lastPCB);
                    }
                }

                // Get the next pcb that will be context switched in and run it in the CPU
                var nextPCB: TSOS.ProcessControlBlock = _Kernel.readyQueue.dequeue();
            
                nextPCB.state = "Running";
                _CPU.currPcb(nextPCB);

                // The PCB saves variables that the CPU needs in order to continue where it was last switched off from
                _CPU.loadCpuWithPcb();

                // Tell the CPU to begin executing
                if (TSOS.Control._SingleStep === true)
                {
                    // Waiting on Step button clicks
                }
                else
                {
                    _CPU.isExecuting = true;
                }
            }
        }
    }
}