module TSOS
{
    export class ProcessControlBlock
    {
        constructor
            (
            public pid: number = 0,
            public state: String = '',
            public location: String = '',
            public priority: number = 0,
            public pc: number = 0,
            public acc: number = 0,
            public xreg: number = 0,
            public yreg: number = 0,
            public zflag: number = 0,
            ) 
        {

        }

        public init(): void {
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
}