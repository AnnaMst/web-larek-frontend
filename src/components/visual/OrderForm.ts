/*Расширение класса Form, класс для формы заказа (выбор оплаты и ввод адреса).

- constructor(container: HTMLElement, events: IEvents) - конструктор принимает DOM элемент и экземпляр класса 'EventEmitter' для возможности инициации событий

Поля класса:
- onlinePaymentButton: HTMLElement - кнопка оплаты онлайн
- offlinePaymentButton: HTMLElement - кнопка оплаты наличными

Методы класса:
- managePayment(onlinePaymentButton: HTMLElement, offlinePaymentButton: HTMLElement): void - метод реализует выбор способа оплаты в форме
- handleFormChange(): void - метод расширяет родительский метод, отвечающий за вызов события изменения формы
- submitForm(): void - метод, отвечающий за сабмит формы: её сохранение и переключение на следующую форму*/

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

        this.updateValidity()

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

        this.updateValidity()
    }
    

    updateValidity(): void {
        let isButtonValid = true;
        let isInputValid = true

        Array.from(this.inputs).forEach((input) => {
            if (this.validateInput(input.value) === false && input.name === 'address') {
                this.showInputError('Введите адрес');
                isInputValid = false
            } else {
                this.hideInputError()
                isInputValid = true
                this.inputValue = input.value
            }
        })
        
        const activeButton = Array.from(this.paymentButtons).some((button) =>
            button.classList.contains('button_alt-active')
        )
        
        if(!activeButton) {
            this.showInputError('Сначала выберите способ оплаты');
            isButtonValid = false;
        }

        this.initValidation(isButtonValid && isInputValid)
    }
}