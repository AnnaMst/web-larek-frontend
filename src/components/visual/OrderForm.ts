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
    protected cardPaymentButton: HTMLButtonElement;
    protected cashPaymentButton: HTMLButtonElement;
    protected submitButton: HTMLButtonElement;

    constructor (protected container: HTMLTemplateElement, events: IEvents) {
        super(container, events);
        
        this.cardPaymentButton = ensureElement<HTMLButtonElement>('[name="card"]');
        this.cashPaymentButton = ensureElement<HTMLButtonElement>('[name="cash"]');

        this.cardPaymentButton.addEventListener('click', () => this.toggleCardPaymentButton());
        this.cashPaymentButton.addEventListener('click', () => this.toggleCashPaymentButton());

        this.submitButton = ensureElement<HTMLButtonElement>('.button', container);

        this.submitButton.addEventListener('submit', (evt) => {
            evt.preventDefault()
            this._events.emit(`${this.formName}:submit`, this.getInputValues())
            }
        )
    }

    protected toggleCardPaymentButton () {
        this.cashPaymentButton.toggleAttribute('disabled')
    }

    protected toggleCashPaymentButton () {
        this.cardPaymentButton.toggleAttribute('disabled')
    }
}