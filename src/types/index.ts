export interface IProduct {
    id?: string;
    description?: string;
    image?: string;
    title: string;
    category?: string;
    price: number;
}

export interface IOrder {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: [];
}

/описываем объект, который создаётся на основе класса/
export interface IProductsData {
    products: IProduct[];
    getProductInfo(productId: string): TProductInfo;
}

export interface IOrderData {
    getItems(productId: string): TProductInfo;
    deleteProduct(productId: string, payload: Function | null): void;
    countTotal(productMassive: []): number | null;
    choosePayment(paymentElement: HTMLButtonElement, payload: Function | null): void;
    checkValidationOrder(data: Record<keyof TOrderInfo, string>): boolean;
    checkValidationUser(data: Record<keyof TUserInfo, string>): boolean;
}

export type TProductInfo = Pick<IProduct, 'description' | 'category' | 'image' | 'price' | 'title'>

export type TBasketInfo = Pick<IOrder, 'items' | 'total'>

export type TOrderInfo = Pick<IOrder, 'payment' | 'address'>

export type TUserInfo = Pick<IOrder, 'email' | 'phone'>

export type TSuccessInfo = Pick<IOrder, 'total'>