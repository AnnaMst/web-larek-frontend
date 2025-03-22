import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";


interface IPage {
    counter: number;
    locked: boolean;
}

export class Page extends Component<IPage> {
    protected counter: HTMLElement;
    protected wrapper: HTMLElement;
    protected basket: HTMLElement;
    protected catalog: HTMLElement;



    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.counter = ensureElement<HTMLElement>('.header__basket-counter');
        this.wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this.basket = ensureElement<HTMLElement>('.header__basket');
        this.catalog = ensureElement<HTMLElement>('.gallery')

        this.basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    setCounter(value: number): void {
        this.setText(this.counter, String(value));
    }

    setCatalog (items: HTMLElement[]) {
        this.catalog.replaceChildren(...items);
    }

    set locked(value: boolean) {
        if (value) {
            this.toggleClass(this.wrapper, 'page__wrapper_locked')
        } else {
            this.toggleClass(this.wrapper, 'page__wrapper_locked')
        }
    }
}