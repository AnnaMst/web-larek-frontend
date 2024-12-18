import { IEvents } from "../components/base/events";

export interface IApiProductList {
    total: number;
    items: IProduct[]
}

export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

export interface IOrder {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

/описываем объект, который создаётся на основе класса/
export interface IProductsData extends IApiProductList {
    _events: IEvents;
    getProductItem(products: IProduct[], productId: string): IProduct
}

export interface IOrderData {
    getItems(productId: string): IProduct;
    deleteProduct(productId: string, payload: Function | null): void;
    countTotal(productMassive: []): number | null;
    choosePayment(paymentElement: HTMLButtonElement, payload: Function | null): void;
    checkValidationOrder(data: Record<keyof TOrderInfo, string>): boolean;
    checkValidationUser(data: Record<keyof TUserInfo, string>): boolean;
}

export type TBasketInfo = Pick<IOrder, 'items' | 'total'>;

export type TOrderInfo = Pick<IOrder, 'payment' | 'address'>;

export type TUserInfo = Pick<IOrder, 'email' | 'phone'>;

export type TSuccessInfo = Pick<IOrder, 'total'>;

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    baseUrl: string;
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method: ApiPostMethods): Promise<T>
}