

export class Observable {
    subscriberUpdateFunction : Function = ()=> {} 
    subscribeFunction : Function;
    
    observer = {
        next :  (val : any) => {
            this.subscriberUpdateFunction(val)
        }
    }

    constructor(subscribeFunction : Function ) {
        //this.subscriberUpdateFunction = subscribeFunction;
        this.subscribeFunction = subscribeFunction;
    }

    subscribe (subFunction : Function) {
        this.subscriberUpdateFunction = subFunction;
        this.subscribeFunction(this.observer);
    }

    next (val : any) {
        this.subscriberUpdateFunction(val)
    }

}