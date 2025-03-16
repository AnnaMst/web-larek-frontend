import { createElement, ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { EventEmitter } from "../base/events";

export interface IBasket {
    items: string[];
    total: number;
    cardList: HTMLElement[];
    _list: HTMLElement;
}

export class Basket  extends Component <IBasket> {
    protected _list: HTMLElement;
    protected _button: HTMLButtonElement;
    protected total: number;    
    protected cardList: HTMLElement[]
    protected container: HTMLTemplateElement
    protected basketPrice: HTMLElement;


    constructor(container: HTMLTemplateElement, events: EventEmitter) {
        super(container)

        this.container = container
        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._button = this.container.querySelector('.basket__button');
        this.basketPrice = this.container.querySelector('.basket__price')

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('placeOrder:click');
            });
        }

    }

    setItems(items: HTMLElement[]) {
        if (items.length) {
            this.cardList = items
            this._list.append(...this.cardList)
            this.cardList.forEach((card, index) => {
                const indexElement = this.container.querySelector('.basket__item-index')
                indexElement.textContent = (index + 1).toString()
                this._list.appendChild(card)
            })
        } else {
            this._list.replaceChildren(
                createElement<HTMLParagraphElement>('p', {
                    textContent: 'Добавьте товары'
                })
            );
        }

    }

    handleSum (orderData: number | null): void {
        if (orderData === 0) {
            this.basketPrice.textContent = orderData.toString() + ' синапсов'
            this._button.setAttribute('disabled', '')
        } else if (orderData === null){
            this.basketPrice.textContent = "0 синапсов"
            this._button.setAttribute('disabled', '')
        } else {
            this.basketPrice.textContent = orderData.toString() + ' синапсов'
            this._button.removeAttribute('disabled')
        }
    }

}