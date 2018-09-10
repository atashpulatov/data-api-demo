
export class OfficeExtension {
    constructor() {
        this.Error = new OfficeError;
    };
}

class OfficeError extends Error { };
