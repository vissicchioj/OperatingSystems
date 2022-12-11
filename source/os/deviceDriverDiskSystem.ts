/* ----------------------------------
   DeviceDriverDiskSystem.ts

   The Kernel Device Driver Disk System
   ---------------------------------- */

module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverDiskSystem extends DeviceDriver {

        constructor(

        ) {
            super();
            this.driverEntry = this.krnDsddDriverEntry;
        }

        public krnDsddDriverEntry() {
            // Initialization routine for this, the kernel-mode Disk System Device Driver.
            this.status = "loaded";
            
        }

        public format()
        {
            //tracks
            for (var t = 0; t < 4; t++)
            {
                //sectors
                for (var s = 0; s < 8; s++)
                {
                    //blocks
                    for (var b = 0; b < 8; b++)
                    {
                        var val = "";
                        // Check for MBR
                        if (t == 0 && s == 0 && b == 0)
                        {
                            val += "1000"; // key (0,0,0) (aka mbr) will have 1 for inUse and 000 for next
                            for (var i = 0; i < 60; i++)
                            {
                                // Data will be filled with -
                                val += "- ";
                            }
                        }
                        else
                        {
                            val += "0000";
                            for (var i = 0; i < 60; i++)
                            {
                                val += "- ";
                            }
                        }

                        sessionStorage.setItem(t + "," + s + "," + b, val)
                    }
                }
            }
            _StdOut.putText("Disk Format Successful!");
            TSOS.Control._setDiskTable();
        }

        public create(fileName: string)
        {
            
        }

        public findNextDir(): string
        {
            var dirKey = ""
            var found = false;
            for (var s = 0; s < 8; s++)
            {
                for (var b = 0; b < 8; b++)
                {
                    var inUse = sessionStorage.getItem("0," + s + "," + b).charAt(0);
                    if (inUse === "0" && found === false)
                    {
                        dirKey = "0," + s + "," + b;
                        found = true;
                    }
                }
            }
            return dirKey;
        }

        public findNextData(): string
        {
            var dataKey = ""
            var found = false;
            for (var t = 1; t < 4; t++)
            {
                for (var s = 0; s < 8; s++)
                {
                    for (var b = 0; b < 8; b++)
                    {
                        var inUse = sessionStorage.getItem(t + "," + s + "," + b).charAt(0);
                        if (inUse === "0" && found === false)
                        {
                            dataKey = t + "," + s + "," + b;
                            found = true;
                        }
                    }
                }
            }
            return dataKey;
        }

    }
}