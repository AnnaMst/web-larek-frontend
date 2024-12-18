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

    // Метод сохранения информации о способе оплаты
    public setPaymentMethod(paymentInfo: string): void {
        this.payment = paymentInfo;
    }

    // Метод сохранения данных пользователя
    setUserData(email: string, phone: string, address: string): void {
        this.email = email;
        this.phone = phone;
        this.address = address;
    }

    // Метод получения данных пользователя
    public getUserData(): { email: string; phone: string; address: string } {
        return {
        email: this.email,
        phone: this.phone,
        address: this.address,
        };
    }

    // Метод проверки правильности заполнения формы заказа
    public checkValidationOrder(address: string): boolean {
        if (address !== null || undefined) {
            return true
        } else {
            return false
        }
    }

    // Метод проверки правильности заполнения формы данных пользователя
    public checkValidationUser(data: Record<'email' | 'phone', string>): boolean {
        const { email, phone } = data;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

        return emailRegex.test(email) && phoneRegex.test(phone);
    }
}


/*- payment: string; - метод оплаты товара
- email: string; - имейл пользователя
- phone: string; - номер телефона пользователя
- address: string; - адрес, введённый пользователем
- items: []; - массив id выбранных товаров

Также класс предоставляет метод для работы с этими данными:
- addProductToCart(productId: string): void - добавляет товары в корзину
- getProductsInfo(): { TProductInfo } - выводит список товаров в корзине
- getItem(productId: string): TProductInfo; - возвращает данные о том товаре, который пользователь добавил в корзину
- isProductInCart(productId: string): boolean - проверяет наличие товара в корзине
- deleteProduct(productId: string, payload: Function | null): void; - удаляет товары из корзины
- countTotal(productMassive: []): number | null; - считает сумму корзины
- getTotal(): number - получает данные о сумме корзины
- choosePayment(paymentElement: HTMLButtonElement, payload: Function | null): void; - выбирает способ оплаты
- setPayment(paymentInfo: string): void - сохраняет информацию способе оплаты
- setUserData(email: string, phone: string, address: string): void - сохраняет данные пользователя в корзине
- getUserData(): { email: string; phone: string; address: string } - получает данные пользователя из корзины
- checkValidationOrder(data: Record<keyof TOrderInfo, string>): boolean; - проверяет правильность заполнения поля в форме заказа
- checkValidationUser(data: Record<keyof TUserInfo, string>): boolean; - проверяет правильность заполнения полей в форме данных пользователя
*/