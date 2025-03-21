import { IProduct, IOrder, IApiProductList } from "../types";
import { Api } from "./base/api";

interface IAppApi {
    getProducts(): Promise<IProduct[]>
    postOrderData(data: IOrder): Promise<IOrder>
}

export class AppApi extends Api implements IAppApi{
    readonly cdn: string;

    constructor(baseUrl: string, options: RequestInit = {}, cdn: string){
        super(baseUrl, options);

        this.cdn = cdn;
    }

    //получаем с сервера информацию о списке товаров и картинках
    getProducts(): Promise<IProduct[]> {
        return this.get('/product').then((data: IApiProductList) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    //отправляем на сервер информацию о заказе
    postOrderData(data: IOrder): Promise<IOrder> {
        return this
          .post<IOrder>('/order', data, 'POST')
          .then((res: IOrder) => res)
          .catch((error: string) => {
            console.error('Failed to set order info:', error);
            throw new Error('Could not complete the order. Please try again.');
        });
      }
}