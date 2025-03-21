import { Component } from "../base/component";
import { EventEmitter } from "../base/events";

interface ISuccess {
    container: HTMLTemplateElement
    button: HTMLButtonElement;
    orderSum: HTMLElement;
}

export class Success extends Component<ISuccess> {
    container: HTMLTemplateElement
    protected button: HTMLButtonElement;
    orderSum: HTMLElement;

    constructor(container: HTMLTemplateElement, events: EventEmitter) {
            super(container);

            this.button = this.container.querySelector('.order-success__close');
            this.orderSum = this.container.querySelector('.order-success__description')

            this.button.addEventListener('click', () => {
                events.emit('modal:close');
            });
    }

    putSuccessText (sum:number): void {
        this.setText(this.orderSum, `Списано ${sum} синапсов`)
    }
}