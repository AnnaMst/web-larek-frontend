import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Form } from "./Form"

export class OrderForm extends Form {
    protected submitButton: HTMLButtonElement;
    paymentButtons: NodeListOf<HTMLButtonElement>;
    cashPaymentButton: HTMLButtonElement;
    cardPaymentButton: HTMLButtonElement;
    inputValue: string;

    constructor (protected container: HTMLTemplateElement, events: IEvents) {
        super(container, events);

        this.submitButton = ensureElement<HTMLButtonElement>('.order__button', container);

        this.submitButton.addEventListener('click', (evt) => {
            evt.preventDefault()
            this._events.emit(`${this.formName}:click`)
        })

        this.paymentButtons = this.container.querySelectorAll('button[name="card"], button[name="cash"]')
        this.cardPaymentButton = this.container.querySelector('button[name="card"]')
        this.cashPaymentButton = this.container.querySelector('button[name="cash"]')

        this.cashPaymentButton.addEventListener('click', (evt) => {
            evt.preventDefault;
            this._events.emit('paymentButton:click', {button: this.cashPaymentButton})
        })
        this.cardPaymentButton.addEventListener('click', (evt) => {
            evt.preventDefault;
            this._events.emit('paymentButton:click', {button: this.cardPaymentButton})
        })
        
    }

    togglePaymentButton (buttonName: string): void {
        this.paymentButtons.forEach((button) => {
            if (buttonName === button.name) {
                button.classList.add('button_alt-active')
            } else {
                button.classList.remove('button_alt-active')
            }
        })
    }
}