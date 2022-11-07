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
            if (_Kernel.readyQueue.getSize() > 0)
            {
                
            }
        }
    }
}