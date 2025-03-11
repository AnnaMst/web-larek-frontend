import { IOrder, IProduct } from "../types"
import { IEvents } from "./base/events";

export class OrderData implements IOrder {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
    _events: IEvents;

    constructor(events: IEvents){
        this._events = events;
        this.items = []
    }

    getOrderData() {
        return {
            payment: this.payment,
            email:this.email,
            phone: this.phone,
            address: this.address,
            total: this.total,
            items: this.items
        }
    }

    // Метод получения списка товаров в корзине
    getProductsInfo(): string[] {
        return this.items
    }

    // Метод добавления товара в корзину
    public addProductToCart(itemID: string): void {
        this.items.push(itemID);
        this.itemsCount();
    }

    // Метод проверки наличия товара в корзине
    isProductInCart(id: string): boolean {
        return this.items.includes(id) ? false : true
    }

    // Метод удаления товара из корзины
    public deleteProduct(order: IOrder, itemId: string): IOrder {
        const index = order.items.indexOf(itemId);
        if (index !== -1) {
            // Удаляем элемент по найденному индексу
            order.items.splice(index, 1);
        }
        return order
    }

    // Метод подсчета общей суммы корзины
    public countTotal(productMassive: IProduct[]): number {
        let total = productMassive.reduce((accumulator, currentProduct) => {
            return accumulator + currentProduct.price;
        }, 0) || null

        return total
    }

    // Метод получения общей суммы корзины
    public getTotal(): number {
        return this.total;
    }

    // Метод подсчёта количества товара в корзине
    public itemsCount(): number {
        return this.items.length
    }

    setOrderItemsData(items: string[], total: number): void {
        this.items = items;
        this.total = total
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
        this.total = 0;
        this.items = undefined;
    }
}
