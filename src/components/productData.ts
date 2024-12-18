//Класс отвечает за хранение и логику работы с товарами в магазине.\
//Конструктор класса принимает инстант брокера событий\

import { IApiProductList, IProduct } from "../types"
import { IEvents } from "./base/events"

export class ProductData implements IApiProductList {
    total: number;
    items: IProduct[];
    protected _events: IEvents;
    protected _preview: string | null;

    constructor(events: IEvents){
        this._events = events;
    }

    set products(products: IProduct[]) {
        this.items = products;
    }
    
    get products(): IProduct[] {
        return this.items
    }


    getProductItem(productId: string): IProduct {
        return this.items.find((item) => item.id === productId)
    }

    set preview(cardId: string | null) {
        if (!cardId) {
            this._preview = null;
            return;
        }
        const selectedCard = this.getProductItem(cardId);
        if (selectedCard) {
            this._preview = cardId;
            this._events.emit('card:selected')
        }
    }

    get preview () {
        return this._preview;
    }
}