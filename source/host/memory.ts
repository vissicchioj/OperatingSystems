
module TSOS
{
    //variables
    var i: number = 0x00;
    var length: number = 0x100;
    var address: string;
    var contains: string;

    export class Memory
    {

        // create the private array of memory
        private memArray = [];

        constructor()
        {
            //fills up the private array with 0x00
            for(i = 0x00; i < length; i++)
            {
                this.memArray[i] = 0x00;
            }
        }


        //reset all members in the array to be 0x00
        reset()
        {
            for(i = 0x00; i < length; i++) 
            {
                this.memArray[i] = 0x00;
            }
        }

    }
}