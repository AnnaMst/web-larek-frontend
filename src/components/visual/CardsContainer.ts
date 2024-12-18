/*Page 
Реализует главную страницу. 
 
- constructor(container: HTMLElement, events: IEvents) - конструктор принимает DOM элемент и экземпляр класса 'EventEmitter' для возможности инициации событий 
 
Поля класса: 
- basketCounter: HTMLElement - отвечает за отрисовку счётчика товаров в корзине 
- basket: HTMLElement - отвечает за отрисовку элемента корзины, на него будем вешать слушатель события 
- catalogue: HTMLElement - отрисовывает товары 
 
Методы класса: 
- setBasketCounter(value: number): string - устанавливает счётчик товаров в корзине 
- set catalog(items: HTMLElement[]): [] - выводит каталог на страницу */

import { Component } from "../base/component";

interface ICardsContainer{
    catalog: HTMLElement[]
}

export class CardsContainer extends Component<ICardsContainer> {
    protected _catalog: HTMLElement;

    constructor(protected container: HTMLElement) { 
        super(container)    
    }

    set catalog(items: HTMLElement[]) {
        this.container.replaceChildren(...items);
    }
}