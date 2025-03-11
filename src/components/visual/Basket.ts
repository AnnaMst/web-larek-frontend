/*
        this.cardDeleteButton.addEventListener('click', () =>
            this.events.emit('basketItem:delete', { card: this })
        )

            protected cardDeleteButton: HTMLButtonElement;
                    this.cardDeleteButton = this.container.querySelector('.basket__item-delete')

*/

import { createElement, ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/events";

export interface IBasket {
    items: string[];
    total: number;
    cardList: HTMLElement[]
}

export class Basket {
    protected _list: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _items: string[];
    protected total: number;    
    protected cardList: HTMLElement[]
    protected container: HTMLTemplateElement
    protected span: HTMLElement;


    constructor(container: HTMLTemplateElement, events: EventEmitter) {
        this.container = container
        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._button = this.container.querySelector('.basket__button');
        this.span = this.container.querySelector('.basket__price')

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('placeOrder:click', this._items);
            });
        }

        this._items = [];
    }

    setItems(items: HTMLElement[]) {
        if (items.length) {
            this.cardList = items
            this._list.append(...this.cardList)
        } else {
            this._list.replaceChildren(
                createElement<HTMLParagraphElement>('p', {
                    textContent: 'Добавьте товары'
                })
            );
        }
    }

    addToCart(item: string): void {
        this._items.push(item)
    }

    removeFromCart(basketItem: string): void {
        this._items = this._items.filter(item => item !== basketItem)
    }

    emptyCart (): void {
        this._items.length = 0;
    }

    showItems (): string[] {
        return this._items
    }

    countItems(): number {
        return this._items.length
    }

    render(cardData: HTMLElement[]): HTMLTemplateElement {
        this.setItems(cardData)
        cardData.forEach((card, index) => {
            const indexElement = this.container.querySelector('.basket__item-index')
            indexElement.textContent = (index + 1).toString()
            this._list.appendChild(card)
        })
        return this.container
    }

    handleSum (orderData: number | null): void {
        if (orderData === 0) {
            this.span.textContent = orderData.toString() + ' синапсов'
            this._button.setAttribute('disabled', '')
        } else if (orderData === null){
            this.span.textContent = "0 синапсов"
            this._button.setAttribute('disabled', '')
        } else {
            this.span.textContent = orderData.toString() + ' синапсов'
            this._button.removeAttribute('disabled')
        }
    }
}