var TSOS;
(function (TSOS) {
    class CpuDispatcher {
        //Cpu Dispatcher is in charge of performing the context switch
        constructor() {
        }
        contextSwitch() {
            if (_Kernel.readyQueue.getSize() > 0) {
            }
        }
    }
    TSOS.CpuDispatcher = CpuDispatcher;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpuDispatcher.js.map