import { IOrder, IProduct } from "../types"
import { IEvents } from "./base/events";

export class OrderData implements IOrder {
    payment: string;
    email: string;
    phone: string;
    address: string;
    _items: IProduct[];
    _events: IEvents;

    constructor(events: IEvents){
        this._events = events;
        this._items = []
        this.payment = '';
        this.email = '';
        this.phone = '';
        this.address = '';
    }

    getIds (): string[] {
        const products = this._items.map(products => products.id)
        return products
    }

    getOrderData() {
        return {
            payment: this.payment,
            email:this.email,
            phone: this.phone,
            address: this.address,
            total: this.countTotal(),
            items: this.getIds()
        }
    }

    // Метод получения списка товаров в корзине
    getProductsInfo(): IProduct[] {
        return this._items
    }

    // Метод добавления товара в корзину
    public addProductToCart(item: IProduct): void {
        this._items.push(item);
        this.itemsCount();
    }

    // Метод проверки наличия товара в корзине
    isProductInCart(itemId: string): boolean {
        return this._items.map((item) => {item.id.includes(itemId)}) ? false : true
    }

    // Метод подсчета общей суммы корзины
    public countTotal(): number {
        let total = this._items.reduce((accumulator, currentProduct) => {
            return accumulator + currentProduct.price;
        }, 0) || null

        return total
    }

    // Метод подсчёта количества товара в корзине
    public itemsCount(): number {
        return this._items.length
    }

    setOrderItemsData(items: IProduct[]): void {
        this._items = items;
    }

    addToCart(item: IProduct): void {
        this._items.push(item)
        this._events.emit('basket:changed');
    }

    removeFromCart(basketItem: IProduct): void {
        this._items = this._items.filter(item => item !== basketItem)
        this._events.emit('basket:changed')
    }

    emptyCart (): void {
        this._items.length = 0;
        this._events.emit('basket:changed')
    }

    showItems (): IProduct[] {
        return this._items
    }

    countItems(): number {
        return this._items.length
    }

    setPaymentData(payment: string): void {
        this.payment = payment
        this._events.emit('payment:saved', {payment: this.payment})
    }
    
    setAddressData(address: string): void {
        this.address = address
        this._events.emit('address:saved')
        console.log(this.address)
    }

    // Метод сохранения данных пользователя
    setUserData(field: string, value: string): void {
        if (field === 'phone') {
            this.phone = value;
        }
        if (field === 'email'){
            this.email = value;
        }
    }

    // Метод получения данных пользователя
    public getUserData(): { email: string; phone: string; address: string, payment: string } {
        return {
        email: this.email,
        phone: this.phone,
        address: this.address,
        payment: this.payment
        };
    }

    public deleteItems () {
        this.payment = '';
        this.email = '';
        this.phone = '';
        this.address = '';
        this._items = undefined;
    }

    checkContactsValidation (): boolean {
        if (this.phone.trim().length > 0 && this.email.trim().length > 0 ) {
            return true
        } else {
            return false
        }
    }
    
    checkOrderValidation (): boolean {
        if (this.payment.trim().length > 0 && this.address.trim().length > 0 ) {
            return true
        } else {
            return false
        }
    }
}
