import { createElement, ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";

export interface IBasket {
    events: IEvents;
    _list: HTMLElement;
    _button: HTMLButtonElement;
    container: HTMLTemplateElement;
    basketPrice: HTMLElement;
}

export class Basket  extends Component <IBasket> {
    protected events: IEvents;
    protected _list: HTMLElement;
    protected _button: HTMLButtonElement;
    protected container: HTMLTemplateElement;
    protected basketPrice: HTMLElement;


    constructor(container: HTMLTemplateElement, events: IEvents) {
        super(container)

        this.events = events;
        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._button = this.container.querySelector('.basket__button');
        this.basketPrice = this.container.querySelector('.basket__price')

        this.setItems([])

        this._button.setAttribute('disabled', '')

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('placeOrder:click');
            });
        }

    }

    setItems(items?: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items)
        } else {
            this._list.replaceChildren(
                createElement<HTMLParagraphElement>('p', {
                    textContent: 'Добавьте товары'
                })
            );
        }
    }

    handleSum (orderData?: number | null): void {
        if (orderData === 0) {
            this.setText(this.basketPrice, orderData.toString() + ' синапсов')
            this._button.setAttribute('disabled', '')
        } else if (orderData === null){
            this.setText(this.basketPrice, "0 синапсов")
            this._button.setAttribute('disabled', '')
        } else {
            this.setText(this.basketPrice, orderData.toString() + ' синапсов')
            this._button.removeAttribute('disabled')
        }
    }
}