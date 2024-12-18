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

/*

toggleButton2(): void {
        if (this.cardButton.textContent = 'Купить') {
            this.cardButton.textContent = 'Удалить из корзины'
            this.removeCardButtonListener()
        } else if (this.cardButton.textContent = 'Удалить из корзины') {
            this.initializeRemoveCardButtonListener()
            this.cardButton.textContent = 'Купить'
        }
    }


    public initializeCardButtonListener(): void {
        if (this.cardButton) {
            this.cardButtonClickHandler = () => {
                this.events.emit('cardButton:click', { card: this });
            };
            this.cardButton.addEventListener('click', this.cardButtonClickHandler);
        }
    }

    public initializeRemoveCardButtonListener(): void {
        if (this.cardButton) {
            this.cardButtonClickHandler = () => {
                this.events.emit('basketItem:delete', { card: this });
            };
            this.cardButton.addEventListener('click', this.cardButtonClickHandler);
        }
    }

    public removeCardButtonListener(): void {
        if (this.cardButton && this.cardButtonClickHandler) {
            this.cardButton.removeEventListener('click', this.cardButtonClickHandler);
            this.cardButtonClickHandler = null;
        }
    }
*/