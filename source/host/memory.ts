
module TSOS
{
    //variables
    var i: number = 0x00;


    export class Memory
    {

        // create the private array of memory
        private memArray = [];

        constructor(size: number)
        {
            for(i = 0x00; i < size; i++)
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