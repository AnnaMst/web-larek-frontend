export interface IApiProductList {
    total?: number;
    items: IProduct[]
}

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
    items?: string[];
}

export type TOrderInfo = Pick<IOrder, 'payment' | 'address'>;

export type TUserInfo = Pick<IOrder, 'email' | 'phone'>;

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    baseUrl: string;
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method: ApiPostMethods): Promise<T>
}