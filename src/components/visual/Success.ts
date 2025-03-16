import { EventEmitter } from "../base/events";

export class Success {
    container: HTMLTemplateElement
    protected button: HTMLButtonElement;
    orderSum: HTMLElement;

    constructor(container: HTMLTemplateElement, events: EventEmitter) {
            this.container = container;
            this.button = this.container.querySelector('.order-success__close');
            this.orderSum = this.container.querySelector('.order-success__description')

            this.button.addEventListener('click', () => {
                events.emit('success:close');
            });
    }

    putSuccessText (sum:number): void {
        this.orderSum.textContent = `Списано ${sum} синапсов`
    }
}

