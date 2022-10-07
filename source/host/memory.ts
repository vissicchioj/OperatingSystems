
module TSOS
{
    //variables
    var i: number = 0x00;
    var address: string;
    var contains: string;

    export class Memory
    {

        // create the private array of memory
        private memArray = [];

        constructor(size: number)
        {
            // Set the size of the array based on Control.ts (256 as of IP2)
            this.memArray = new Array(size);
        }

        // initialize array as 0x00
        public init(): void {
            for(i = 0x00; i < this.memArray.length; i++) 
            {
                this.memArray[i] = 0x00;
            }
        }



        //reset all members in the array to be 0x00
        reset()
        {
            for(i = 0x00; i < this.memArray.length; i++) 
            {
                this.memArray[i] = 0x00;
            }
        }

    }
}