import { IApi, IProduct, IOrder, ApiListResponse } from "../types";
import { Api } from "./base/api";

interface IAppApi {
    getProducts(): Promise<IProduct[]>
    postOrderData(orderID: string, data: IOrder): Promise<IOrder>
}

export class AppApi extends Api implements IAppApi{
    readonly cdn: string;

    constructor(baseUrl: string, options: RequestInit = {}, cdn: string){
        super(baseUrl, options);

        this.cdn = cdn;
    }

    //получаем с сервера информацию о списке товаров и картинках
    getProducts(): Promise<IProduct[]> {
        return this.get('/product').then((data: ApiListResponse<IProduct>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    //отправляем на сервер информацию о заказе
    postOrderData(orderID: string, data: IOrder): Promise<IOrder> {
        return this.post<IOrder>(`/order/${orderID}`, data, 'PUT').then((res: IOrder) => res)
    }
}