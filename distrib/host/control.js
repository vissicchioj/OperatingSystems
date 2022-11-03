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
var TSOS;
(function (TSOS) {
    class Control {
        static _SetMemTable() {
            // Set our memory to an array of strings
            var memArr = _Memory.toString().split(' ');
            // Increments through memory
            var memIndex = 0;
            // Empty table
            _MemTable.innerHTML = "";
            // Outer for loop adds an additional row
            for (var i = 0x000; i < (768 / 8); i++) {
                var addRow = _MemTable.insertRow(i);
                // Inner for loop adds an additional cell within the current row
                for (var j = 0; j <= 8; j++) {
                    var addCell = addRow.insertCell(j);
                    if (j == 0) {
                        // Get the hexidecimal string on each interval of 8
                        var strHex = (i * 8).toString(16).toUpperCase();
                        while (strHex.length < 4) {
                            // Add padding zeroes to look more neat 
                            strHex = "0" + strHex;
                        }
                        addCell.innerHTML = "0x" + strHex;
                    }
                    else {
                        // Set the current cell to the current location in memory
                        addCell.innerHTML = memArr[memIndex];
                        // Get the next location in memory to be set in the next loop
                        memIndex++;
                    }
                }
            }
        }
        static _SetCpuTable() {
            // Empty table
            _CpuTable.innerHTML = '';
            for (var i = 0; i < 2; i++) {
                var addRow = _CpuTable.insertRow(i);
                for (var j = 0; j < 6; j++) {
                    var addCell = addRow.insertCell(j);
                    if (i == 0) {
                        if (j == 0) {
                            addCell.innerHTML = "PC";
                        }
                        else if (j == 1) {
                            addCell.innerHTML = "IR";
                        }
                        else if (j == 2) {
                            addCell.innerHTML = "ACC";
                        }
                        else if (j == 3) {
                            addCell.innerHTML = "X-Reg";
                        }
                        else if (j == 4) {
                            addCell.innerHTML = "Y-Reg";
                        }
                        else if (j == 5) {
                            addCell.innerHTML = "Z-Flag";
                        }
                    }
                    else {
                        // Update each value in the display
                        if (j == 0) {
                            addCell.innerHTML = _CPU.PC.toString(16).toUpperCase();
                        }
                        else if (j == 1) {
                            addCell.innerHTML = _CPU.IR.toString(16).toUpperCase();
                        }
                        else if (j == 2) {
                            addCell.innerHTML = _CPU.Acc.toString(16).toUpperCase();
                        }
                        else if (j == 3) {
                            addCell.innerHTML = _CPU.Xreg.toString(16).toUpperCase();
                        }
                        else if (j == 4) {
                            addCell.innerHTML = _CPU.Yreg.toString(16).toUpperCase();
                        }
                        else if (j == 5) {
                            addCell.innerHTML = _CPU.Zflag.toString(16).toUpperCase();
                        }
                    }
                }
            }
        }
        static _SetPcbTable() {
            _PcbTable.innerHTML = '';
            for (var i = 0; i < 2; i++) {
                var addRow = _PcbTable.insertRow(i);
                for (var j = 0; j < 8; j++) {
                    var addCell = addRow.insertCell(j);
                    if (i === 0) {
                        if (j == 0) {
                            addCell.innerHTML = "PID";
                        }
                        else if (j == 1) {
                            addCell.innerHTML = "State";
                        }
                        else if (j == 2) {
                            addCell.innerHTML = "Location";
                        }
                        else if (j == 3) {
                            addCell.innerHTML = "Priority";
                        }
                        else if (j == 4) {
                            addCell.innerHTML = "PC";
                        }
                        else if (j == 5) {
                            addCell.innerHTML = "ACC";
                        }
                        else if (j == 6) {
                            addCell.innerHTML = "X-Reg";
                        }
                        else if (j == 7) {
                            addCell.innerHTML = "Y-Reg";
                        }
                        else if (j == 8) {
                            addCell.innerHTML = "Z-Flag";
                        }
                    }
                    else {
                        // Update each value in the display
                        if (j == 0) {
                            addCell.innerHTML = _PCB.pid.toString();
                        }
                        else if (j == 1) {
                            addCell.innerHTML = _PCB.state.toString();
                        }
                        else if (j == 2) {
                            addCell.innerHTML = _PCB.location.toString();
                        }
                        else if (j == 3) {
                            addCell.innerHTML = _PCB.priority.toString();
                        }
                        else if (j == 4) {
                            addCell.innerHTML = _PCB.pc.toString();
                        }
                        else if (j == 5) {
                            addCell.innerHTML = _PCB.acc.toString();
                        }
                        else if (j == 6) {
                            addCell.innerHTML = _PCB.xreg.toString();
                        }
                        else if (j == 7) {
                            addCell.innerHTML = _PCB.yreg.toString();
                        }
                        else if (j == 8) {
                            addCell.innerHTML = _PCB.zflag.toString();
                        }
                    }
                }
            }
        }
        static hostInit() {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.
            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = document.getElementById('display');
            //Memory table initiallize 
            _MemTable = document.getElementById('memory');
            // Total memory is 256 // 768
            // Outer for loop adds an additional row
            for (var i = 0x000; i < (768 / 8); i++) {
                var addRow = _MemTable.insertRow(i);
                // Inner for loop adds an additional cell within the current row
                for (var j = 0; j <= 8; j++) {
                    var addCell = addRow.insertCell(j);
                    if (j == 0) {
                        // Get the hexidecimal string on each interval of 8
                        var strHex = (i * 8).toString(16).toUpperCase();
                        while (strHex.length < 3) {
                            // Add padding zeroes to look more neat 
                            strHex = "0" + strHex;
                        }
                        addCell.innerHTML = "0x" + strHex;
                    }
                    else {
                        //Every remaining cell in a row is initialized to 00
                        addCell.innerHTML = "00";
                    }
                }
            }
            // Cpu table initiallize 
            _CpuTable = document.getElementById('cpu');
            for (var i = 0; i < 2; i++) {
                var addRow = _CpuTable.insertRow(i);
                for (var j = 0; j < 6; j++) {
                    var addCell = addRow.insertCell(j);
                    if (i == 0) {
                        if (j == 0) {
                            addCell.innerHTML = "PC";
                        }
                        else if (j == 1) {
                            addCell.innerHTML = "IR";
                        }
                        else if (j == 2) {
                            addCell.innerHTML = "ACC";
                        }
                        else if (j == 3) {
                            addCell.innerHTML = "X-Reg";
                        }
                        else if (j == 4) {
                            addCell.innerHTML = "Y-Reg";
                        }
                        else if (j == 5) {
                            addCell.innerHTML = "Z-Flag";
                        }
                    }
                    else {
                        addCell.innerHTML = "-";
                    }
                }
            }
            // PCB table initialize
            _PcbTable = document.getElementById('pcb');
            for (var i = 0; i < 2; i++) {
                var addRow = _PcbTable.insertRow(i);
                for (var j = 0; j < 8; j++) {
                    var addCell = addRow.insertCell(j);
                    if (i == 0) {
                        if (j == 0) {
                            addCell.innerHTML = "PID";
                        }
                        else if (j == 1) {
                            addCell.innerHTML = "State";
                        }
                        else if (j == 2) {
                            addCell.innerHTML = "Location";
                        }
                        else if (j == 3) {
                            addCell.innerHTML = "Priority";
                        }
                        else if (j == 4) {
                            addCell.innerHTML = "PC";
                        }
                        else if (j == 5) {
                            addCell.innerHTML = "ACC";
                        }
                        else if (j == 6) {
                            addCell.innerHTML = "X-Reg";
                        }
                        else if (j == 7) {
                            addCell.innerHTML = "Y-Reg";
                        }
                        else if (j == 8) {
                            addCell.innerHTML = "Z-Flag";
                        }
                    }
                    else {
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
            TSOS.CanvasTextFunctions.enable(_DrawingContext); // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.
            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            document.getElementById("taHostLog").value = "";
            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            document.getElementById("btnStartOS").focus();
            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
        }
        static hostLog(msg, source = "?") {
            // Note the OS CLOCK.
            var clock = _OSclock;
            // Note the REAL clock in milliseconds since January 1, 1970.
            var now = new Date().getTime();
            // Build the log string.
            var str = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now + " })" + "\n";
            // Update the log console.
            var taLog = document.getElementById("taHostLog");
            taLog.value = str + taLog.value;
            // TODO in the future: Optionally update a log database or some streaming service.
        }
        //
        // Host Events
        //
        static hostBtnStartOS_click(btn) {
            // Disable the (passed-in) start button...
            btn.disabled = true;
            // New Status
            document.getElementById('status').innerHTML = "ONLINE";
            document.getElementById("stepMode").innerHTML = "Off";
            // .. enable the Halt and Reset buttons ...
            document.getElementById("btnHaltOS").disabled = false;
            document.getElementById("btnReset").disabled = false;
            // .. set focus on the OS console display ...
            document.getElementById("display").focus();
            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new TSOS.Cpu(); // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            _CPU.init(); //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.
            // Create and initialize the Memory. (Size of 256 as of IP2). Part of hardware
            //_Memory = new Memory(256);
            _Memory = new TSOS.Memory(768);
            _Memory.init();
            // Create Memory Accessor. Part of hardware
            _MA = new TSOS.MemoryAccessor();
            _PCB = new TSOS.ProcessControlBlock();
            _PCB.init();
            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(TSOS.Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new TSOS.Kernel();
            _Kernel.krnBootstrap(); // _GLaDOS.afterStartup() will get called in there, if configured.
        }
        static hostBtnHaltOS_click(btn) {
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
        static hostBtnReset_click(btn) {
            // New Status
            document.getElementById('status').innerHTML = "RESETTING";
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload();
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        }
        static hostBtnSingleStep_click(btn) {
            if (this._SingleStep === false) {
                document.getElementById("stepMode").innerHTML = "On";
                document.getElementById("btnStep").disabled = false;
                this._SingleStep = true;
            }
            else {
                document.getElementById("stepMode").innerHTML = "Off";
                document.getElementById("btnStep").disabled = true;
                this._SingleStep = false;
                if (_PCB.state === "Running") {
                    _CPU.isExecuting = true;
                }
            }
        }
        static hostBtnStep_click(btn) {
            // Made sure you can't step while the program isn't running, otherwise step would work the same way as run 0
            if (_PCB.state === "Running") {
                if (this._SingleStep === true) {
                    if (this._Step === false) {
                        this._Step = true;
                        _CPU.isExecuting = true;
                        this._Step = false;
                    }
                }
            }
        }
    }
    Control._SingleStep = false;
    Control._Step = false;
    TSOS.Control = Control;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=control.js.map