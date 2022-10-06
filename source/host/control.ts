/* ------------
     Control.ts

     Routines for the hardware simulation, NOT for our client OS itself.
     These are static because we are never going to instantiate them, because they represent the hardware.
     In this manner, it's A LITTLE BIT like a hypervisor, in that the Document environment inside a browser
     is the "bare metal" (so to speak) for which we write code that hosts our client OS.
     But that analogy only goes so far, and the lines are blurred, because we are using TypeScript/JavaScript
     in both the host and client environments.

     This (and other host/simulation scripts) is the only place that we should see "web" code, such as
     DOM manipulation and event handling, and so on.  (Index.html is -- obviously -- the only place for markup.)

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

//
// Control Services
//
module TSOS {

    export class Control {

        public static hostInit(): void {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.

            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = <HTMLCanvasElement>document.getElementById('display');

            //Memory table initiallize 
            _MemTable = <HTMLTableElement>document.getElementById('memory');
            // Total memory is 256
            // Outer for loop adds an additional row
            for (var i = 0x0000; i < (256/8); i++)
            {
                var addRow = _MemTable.insertRow(i);
                // Inner for loop adds an additional cell within the current row
                for (var j = 0; j <= 8; j++)
                {
                    var addCell = addRow.insertCell(j);
                    if (j == 0)
                    {
                        // Get the hexidecimal string on each interval of 8
                        var strHex: string = (i * 8).toString(16).toUpperCase();
                        while (strHex.length < 4)
                        {
                            // Add padding zeroes to look more neat 
                            strHex = "0" + strHex;
                        }
                        addCell.innerHTML = "0x" + strHex;
                    }
                    else
                    {
                        //Every remaining cell in a row is initialized to 00
                        addCell.innerHTML = "00";
                    }
                }

            }

            // Cpu table initiallize 
            _CpuTable = <HTMLTableElement>document.getElementById('cpu');
            for (var i = 0; i < 2; i++)
            {
                var addRow =  _CpuTable.insertRow(i);
                for (var j = 0; j < 6; j++)
                {
                    var addCell = addRow.insertCell(j)
                    if (i == 0)
                    {
                        if (j == 0)
                        {
                            addCell.innerHTML = "PC";
                        }
                        else if (j == 1)
                        {
                            addCell.innerHTML = "IR";
                        }
                        else if (j == 2)
                        {
                            addCell.innerHTML = "ACC";
                        }
                        else if (j == 3)
                        {
                            addCell.innerHTML = "X-Reg";
                        }
                        else if (j == 4)
                        {
                            addCell.innerHTML = "Y-Reg";
                        }
                        else if (j == 5)
                        {
                            addCell.innerHTML = "Z-Flag";
                        }
                    }
                    else 
                    {
                        addCell.innerHTML = "-";
                    }
                }
            }

            // PCB table initialize
            _PcbTable = <HTMLTableElement>document.getElementById('pcb');
            for (var i = 0; i < 2; i++)
            {
                var addRow =  _PcbTable.insertRow(i);
                for (var j = 0; j < 8; j++)
                {
                    var addCell = addRow.insertCell(j)
                    if (i == 0)
                    {
                        if (j == 0)
                        {
                            addCell.innerHTML = "PID";
                        }
                        else if (j == 1)
                        {
                            addCell.innerHTML = "State";
                        }
                        else if (j == 2)
                        {
                            addCell.innerHTML = "Location";
                        }
                        else if (j == 3)
                        {
                            addCell.innerHTML = "Priority";
                        }
                        else if (j == 4)
                        {
                            addCell.innerHTML = "PC";
                        }
                        else if (j == 5)
                        {
                            addCell.innerHTML = "ACC";
                        }
                        else if (j == 6)
                        {
                            addCell.innerHTML = "X-Reg";
                        }
                        else if (j == 7)
                        {
                            addCell.innerHTML = "Y-Reg";
                        }
                        else if (j == 8)
                        {
                            addCell.innerHTML = "Z-Flag";
                        }
                    }
                    else 
                    {
                        addCell.innerHTML = "-";
                    }
                }
            }

            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");

            // Today's Date
            // I found on stackoverflow, a cool way to display dates that involves more than using the date class.
            // NOTE: It needed to be modified slightly due to differences between JS and TS.
            // https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript
            // create a new date object
            var today = new Date();
            // days and months that are not 10 and over, we can add a 0 before to make it more pleasing to look at
            var dd = String(today.getDate()).padStart(2, '0');
            //since January is 0 and December is 11 for months, we need to add 1 
            var mm = String(today.getMonth() + 1).padStart(2, '0'); 
            var yyyy = today.getFullYear();

            // create a string using the variables for each part of the date and separating by '/'
            var dateStr = (mm + '/' + dd + '/' + yyyy);
            // place the date string
            document.getElementById('date').innerHTML = dateStr;

            // Initial Status Message that can be updated via shell
            document.getElementById('status').innerHTML = "OFFLINE";

            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            CanvasTextFunctions.enable(_DrawingContext);   // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.

            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("taHostLog")).value="";

            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("btnStartOS")).focus();

            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
        }

        public static hostLog(msg: string, source: string = "?"): void {
            // Note the OS CLOCK.
            var clock: number = _OSclock;

            // Note the REAL clock in milliseconds since January 1, 1970.
            var now: number = new Date().getTime();

            // Build the log string.
            var str: string = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now  + " })"  + "\n";

            // Update the log console.
            var taLog = <HTMLInputElement> document.getElementById("taHostLog");
            taLog.value = str + taLog.value;

            // TODO in the future: Optionally update a log database or some streaming service.
        }


        //
        // Host Events
        //
        public static hostBtnStartOS_click(btn): void {
            // Disable the (passed-in) start button...
            btn.disabled = true;

            // New Status
            document.getElementById('status').innerHTML = "ONLINE";

            // .. enable the Halt and Reset buttons ...
            (<HTMLButtonElement>document.getElementById("btnHaltOS")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnReset")).disabled = false;

            // .. set focus on the OS console display ...
            document.getElementById("display").focus();

            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new Cpu();  // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            _CPU.init();       //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.

            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new Kernel();
            _Kernel.krnBootstrap();  // _GLaDOS.afterStartup() will get called in there, if configured.
        }

        public static hostBtnHaltOS_click(btn): void {
            // New Status
            document.getElementById('status').innerHTML = "HALTED";

            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        }

        public static hostBtnReset_click(btn): void {
            // New Status
            document.getElementById('status').innerHTML = "RESETTING";

            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload();
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        }
    }
}
