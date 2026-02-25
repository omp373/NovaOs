class Process {
    constructor(id, resources) {
        this.id = id;
        this.resources = resources;
        this.state = 'ready';
    }
    run() {
        this.state = 'running';
    }
    terminate() {
        this.state = 'terminated';
    }
}

class MemoryManager {
    constructor(size) {
        this.memory = new Array(size).fill(null);
        this.freeList = Array.from({length: size}, (_, i) => i);
    }
    allocate(size) {
        if (size > this.freeList.length) {
            throw new Error('Insufficient memory.');
        }
        const allocation = this.freeList.splice(0, size);
        return allocation;
    }
    deallocate(allocation) {
        this.freeList.push(...allocation);
    }
}

class ServiceRegistry {
    constructor() {
        this.services = {};
    }
    register(name, service) {
        this.services[name] = service;
    }
    getService(name) {
        return this.services[name];
    }
}

class Kernel {
    constructor() {
        this.processes = [];
        this.memoryManager = new MemoryManager(1024);
        this.serviceRegistry = new ServiceRegistry();
    }

    createProcess(resources) {
        const processID = this.processes.length + 1;
        const process = new Process(processID, resources);
        this.processes.push(process);
        return process;
    }

    schedule() {
        const process = this.processes.find(p => p.state === 'ready');
        if (process) {
            process.run();
        }
    }

    terminateProcess(processID) {
        const process = this.processes.find(p => p.id === processID);
        if (process) {
            process.terminate();
        }
    }
}

export default new Kernel();
