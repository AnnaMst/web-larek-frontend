import { IProduct } from "../../types";
import { Component } from "../base/component";
import { IEvents } from "../base/events";

export class Card extends Component <IProduct> {
    protected events: IEvents;
    protected cardTitle: HTMLElement;
    protected cardCategory: HTMLElement;
    protected cardImage: HTMLImageElement;
    protected cardDescription: HTMLElement;
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
        this.cardDescription = this.container.querySelector('.card__text');

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
    
    render(cardData?: Partial<IProduct> | undefined) {
        if (!cardData) return this.container;
        const {...otherCardData} = cardData;
        return super.render(otherCardData)
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

    set description (description: string) {
        if (this.cardDescription) {
            this.cardDescription.textContent = description;
        } else {
            console.log('no-description')
        }
    }

    set category (category: string) {
        if (this.cardCategory) {
            this.cardCategory.textContent = category
            if (this.cardCategory.textContent ==='софт-скил') {this.cardCategory.classList.add(`card__category_soft`)}
            if (this.cardCategory.textContent ==='другое') {this.cardCategory.classList.add(`card__category_other`)}
            if (this.cardCategory.textContent ==='хард-скил') {this.cardCategory.classList.add(`card__category_hard`)}
            if (this.cardCategory.textContent ==='дополнительное') {this.cardCategory.classList.add(`card__category_additional`)}
            if (this.cardCategory.textContent ==='кнопка') {this.cardCategory.classList.add(`card__category_button`)}
            
        } else {
            console.log('no-category')
        }
    }

    set title(title: string) {
        this.cardTitle.textContent = title
        
    }

    set image(image: string) {
        if (this.cardImage) {
            this.cardImage.src = image
        } else {
            console.log('no-image')
        }
    }

    get _id():string {
        return this.cardId
    }
    
}