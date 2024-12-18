import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";

export class Card extends Component <IProduct> {
    protected events: IEvents;
    protected cardTitle: HTMLElement;
    protected cardCategory: HTMLElement;
    protected cardImage: HTMLImageElement;
    protected cardDescreption: HTMLElement;
    protected cardPrice: HTMLElement;
    protected cardId: string;
    protected _cardDeleteButton: HTMLButtonElement;

    constructor(protected container: HTMLTemplateElement, events: IEvents) {
        super(container)

        this.events = events;

        this.cardTitle = this.container.querySelector('.card__title');
        this.cardPrice = this.container.querySelector('.card__price');

        this.cardCategory = this.container.querySelector('.card__category');
        
        this.cardImage = this.container.querySelector('.card__image');
        this.cardDescreption = this.container.querySelector('.card__text');

        this._cardDeleteButton = this.container.querySelector('.basket__item-delete')

        if(this._cardDeleteButton) {
            this._cardDeleteButton.addEventListener('click', () =>
                this.events.emit('basketItem:delete', { card: this })
            )
        }
    }

    handleCardOpen (): void {
        this.container.addEventListener('click', () => {
            this.events.emit('card:select', { card: this });
        });
    }

    set _id(id: string) {
        this.cardId = id;
    }

    set price(cardPrice: number) {
        cardPrice === null ? 
            this.cardPrice.textContent = 'Бесценно' : 
            this.cardPrice.textContent = 
                `${cardPrice.toString().split('').reverse().map((el, index) => 
                    index % 3 !== 2 ? el : ` ${el}`).reverse().join('')
                } синапсов`
            ;
    }

    set category (category: string) {
        if (this.cardCategory) {
            this.cardCategory.textContent = category
        }
    }

    set title(title: string) {
        this.cardTitle.textContent = title
    }

    set image(image: string) {
        if (this.image) {
            this.cardImage.src = image
        }
    }

    set descreption(descreption: string) {
        if(this.cardDescreption) {
            this.cardDescreption.textContent = descreption
        }
    }

    get _id() {
        return this.cardId
    }

    deleteCard() {
		this.container.remove();
		this.container = null;
	}

    render(cardData: Partial<IProduct>) {
        const {...otherCardData} = cardData;
        return super.render(otherCardData)
    }
}