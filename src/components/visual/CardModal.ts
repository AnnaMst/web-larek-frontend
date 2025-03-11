import { IEvents } from "../base/events";
import { Card } from "./Card";

export class CardsModal extends Card {
    protected cardButton: HTMLButtonElement
    protected events: IEvents;
    protected cardContainer: HTMLElement

    constructor(protected container: HTMLTemplateElement, events: IEvents) { 
        super(container, events)
        this.cardButton = this.container.querySelector('.card__button')
        this.events = events;

        this.cardButton.addEventListener('click', () => {
            this.events.emit('cardButton:click', { card: this })
        })

    }

    toggleButton(): void {
        if (!this.cardButton.hasAttribute('disabled')) {
            this.cardButton.setAttribute('disabled', '')
            this.cardButton.textContent = 'Товар уже в корзине'
        } else {
            this.cardButton.removeAttribute('disabled');
            this.cardButton.textContent = 'Купить'
        }
    }
    
}