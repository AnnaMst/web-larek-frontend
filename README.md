# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Список карточек товаров с сервера

```
interface IApiProductList {
    total: number;
    items: IProduct[]
}
```
Товар

```
interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}
```
Заказ

```
interface IOrder {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}
```
Данные о заказе в форме об оплате и адресе
```
type TOrderInfo = Pick<IOrder, 'payment' | 'address'>
```
Данные о заказе в форме с контактами покупателя
```
type TUserInfo = Pick<IOrder, 'email' | 'phone'>
```
Методы работы с сервером
```
type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
```
## Архитектура приложения

Код приложения разделён на слои согласно парадигме MVP
1) слой представления: отвечает за отображение данных на странице
2) слой данных, отвечает за хранение и изменение данных
3) презентер, отвечает за связь представления и данных

### Базовый код

#### Класс Api

Содержит в себе базовую логику отправки запросов. В конструктор передаётся базовый адрес сервера и опциональный объект с заголовками запросов.
Методы:
- 'get' - выполяет GET запрос на переданный в параметрах эндпоинт и возвращает промис с объектом, которым ответит сервер
- 'post' - пинимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные из эндпоинт, переданный как параметр при вызове метода. По умолчанию выполняется 'POST' запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове
- 'handleResponse' -

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс испротщуеися в презентере для обработки событий и в слоях приложения для генерации событий.
Основные методы, реализуемые классом описаны интерфейсом 'IEvents':
- 'on' - подписка на событие
- 'emit' - инициализация события
- 'trigger' - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

### Слой данных

#### Класс ProductData
Класс отвечает за хранение и логику работы с товарами в магазине.\
Конструктор класса принимает инстант брокера событий\
В полях класса хранятся следующие данные:
- items: IProduct[] - список товаров
- _preview: string | null - айди определённого товара

Также класс предоставляет метод для работы с этими данными:
- get products(): IProduct[]; - метод, который возвращает основные данные карточки для отображения на сайте
- set products(products: IProduct[]): void - сохранение массива товаров в классе
- getProductItem(products: IProduct[], productId: string): TProductInfo - метод возвращает 1 товар из массива по ID
- set preview(cardId: string | null): void - сохранение айди определённого товара
- get preview (): string|null - вызов сохранённого айди товара

#### Класс OrderData
Класс отвечает за хранение и логику работы с заказом в магазине.\
Конструктор класса принимает инстант брокера событий\
В полях класса хранятся следующие данные:
- payment: string; - метод оплаты товара
- email: string; - имейл пользователя
- phone: string; - номер телефона пользователя
- address: string; - адрес, введённый пользователем
- total: number; - стоимость корзины
- items: []; - массив id выбранных товаров

Также класс предоставляет метод для работы с этими данными:
- getProductsInfo(): string[] - Метод получения списка товаров в корзине
- addProductToCart(itemID: string): void - добавляет товары в корзину
- getItem(productId: string): TProductInfo; - возвращает данные о том товаре, который пользователь добавил в корзину
- isProductInCart(id: string): boolean - проверяет наличие товара в корзине
- deleteProduct(order: IOrder, itemId: string): IOrder; - удаляет товары из корзины
- countTotal(productMassive: IProduct[]): number; - считает сумму корзины
- getTotal(): number - получает данные о сумме корзины
- itemsCount(): number - Метод подсчёта количества товара в корзине
- setOrderItemsData(items: string[], total: number): void - сохраняет данные о списке товара и их сумме
- setAddressData(address: string): void - сохраняет данные об адресе пользователя
- setPaymentData(payment: string): void - сохраняет информацию способе оплаты
- setUserData(field: string, value: string): void - сохраняет данные пользователя
- getUserData(): { email: string; phone: string; address: string, payment: string } - получает данные пользователя из корзины
- deleteItems (): метод очищения данных о заказе

### Слой представления
Отвечает за отображения в контейнере (DOM элементе)

#### Абстрактный класс Component
Базовый компонент

- constructor(container: HTMLElement) - конструктор принимает DOM элемент

Методы класса:
- toggleClass(element: HTMLElement, className: string, force?: boolean) - переключатель классов
- setText(element: HTMLElement, value: unknown) - установка текстового содержимого
- render(data?: Partial`<T>`): HTMLElement - вернуть корневой элемент

#### Класс Page
Наследует класс Component\
Реализует главную страницу.\

- constructor(container: HTMLElement, events: IEvents) - конструктор принимает DOM элемент и экземпляр класса 'EventEmitter' для возможности инициации событий

Поля класса:
- _counter: HTMLElement; - отвечает за отрисовку счётчика товаров в корзине
- basket: HTMLElement - отвечает за отрисовку элемента корзины, на него будем вешать слушатель события
- _wrapper: HTMLElement - отвечает за поведение обёртки всей страницы

Методы класса:
- setCounter(value: number): void - устанавливает счётчик товаров в корзине
- set locked(value: boolean) - блокирует страницу

#### Класс CardsContainer
Наследует класс Component\
Реализует выгрузку карточек на страницу.\

- constructor(protected container: HTMLElement) - конструктор принимает DOM элемент

Поля класса:
- _catalog: HTMLElement - каталог карточек товаров

Методы класса:
- set catalog(items: HTMLElement[]): [] - выводит каталог на страницу

#### Класс Card
Наследует класс Component\
Отвечает за отображение карточки товара, задавая ей данные названия, категории, изображения, описания и цены. В конструктор класса передаётся DOM элемент темплейта, что позволяет при необходимости формировать карточки разных вариантов верстки. В классе устанавливаются слушатели на все интерактивные элементы, в результате взаимодействия с которыми пользователем генерируются соответствующие события\
Поля класса содержат элементы разметки элементов карточки. Конструктор, кроме темплейта, принимает экземпляр 'EventEmitter' для инициации событий.\

Методы класса:
- handleCardOpen (): void - вешает слушатель клика на карточку
- render(cardData?: Partial<IProduct> | undefined) - рендерит карточку
- set _id(id: string) - записывает id карточки
- set price(cardPrice: number) - записывает цену
- set description (description: string) - записывает описание
- set category (category: string) - записывает категорию
- set title(title: string) - записывает заголовок
- set image(image: string) - записывает картинку
- _id():string - возвращаяет уникальный id карточки

#### Класс Modal
Наследует класс Component\
Реализует модальное окно, родительский для всех модальных форм страницы\

- constructor(container: HTMLElement, events: IEvents) - конструктор принимает DOM элемент и экземпляр класса 'EventEmitter' для возможности инициации событий

Поля класса:
- modal: HTMLElement - элемент модального окна
- closeButton: HTMLButtonElement - кнопка закрытия модального окна
- content: HTMLElement - содержимое модального окна
- events: IEvents - брокер событий

Методы класса:
- setContent(_content: HTMLElement): void - записывает контент модального окна
- open(): void - реализует открытие модального окна
- close(): void - реализует закрытие модального окна нажатием на кнопку закрытия и по клику вне модального окна

##### Класс CardModal
Наследует класс Modal\
Реализует модальное окно карточки товара с кнопкой "купить"\

- constructor(protected container: HTMLTemplateElement, events: IEvents) - конструктор принимает DOM элемент и экземпляр класса 'EventEmitter' для возможности инициации событий, вешает слушатель события на кнопку

Поля класса:
- cardButton: HTMLButtonElement - кнопка заказа товара
- events: IEvents; - брокер событий
- cardContainer: HTMLElement - контейнер для карточки

Методы класса:
- toggleButton(): void - переключение кнопки модального окна

#### Класс Form
Наследует класс Component\
Родительский класс для всех форм для страницы\

- constructor(container: HTMLElement, events: IEvents) - конструктор принимает DOM элемент и экземпляр класса 'EventEmitter' для возможности инициации событий, вешает слушатель событий на все импуты

Поля класса:
- submitButton: HTMLElement; - кнопка подтверждения
- _events: IEvents; - брокер событий
- formName: string; - имя формы
- inputs: NodeListOf<HTMLInputElement>; - поля импутов
- errorField: HTMLElement; - поле ошибки
- _error: string; - текст ошибки

Методы класса:
- abstract updateValidity (): void - абстрактный класс, валидирует импуты
- validateInput(inputValue: string): boolean - проверка валидности поля input
- showInputError(errorText: string): void - Показывает ошибку поля input
- hideInputError(): void - Скрывает ошибки поля input
- initValidation(isValid: boolean) - Валидация кнопки
- get form(): HTMLTemplateElement - метод получения формы
- close(): void - метод закрытия формы
- set inputValues(data: Record<string, string>) - сохранение значения инпутов
- set error (data: { field: string; value: string; validInformation: string }) - сохранение ошибки
- getInputValues(): Record<string, string> - получение значение полей импутов

##### Класс OrderForm
Расширение класса Form, класс для формы заказа (выбор оплаты и ввод адреса).\

- constructor(container: HTMLElement, events: IEvents) - конструктор принимает DOM элемент и экземпляр класса 'EventEmitter' для возможности инициации , инициация событий клика по кнопкам, вызов метода updateValidity(): void

Поля класса:
- protected submitButton: HTMLButtonElement; - кнопка отправки формы
- paymentButtons: NodeListOf<HTMLButtonElement>; - кнопка оплаты
- cashPaymentButton: HTMLButtonElement; - кнопка оплаты наличными
- cardPaymentButton: HTMLButtonElement; - кнопка оплаты по карте
- inputValue: string; - значение поля инпута

Методы класса:
- togglePaymentButton (buttonName: string): void - метод переключениякнопок оплаты
- updateValidity(): void - метод валидации инпутов

##### Класс ContactsForm
Расширение класса Form, класс для записи контактной информации (телефон и имейл)\

- constructor(container: HTMLElement, events: IEvents) - конструктор принимает DOM элемент и экземпляр класса 'EventEmitter' для возможности инициации , инициация событий клика по кнопке

Поля класса:
- submitButton: HTMLButtonElement - кнопка отправки формы

Методы класса:
- updateValidity(): void - метод валидации инпутов

#### Класс Basket
Наследует класс Container\
Реализует отрисовку формы корзины и её работу\

- constructor(container: HTMLElement, events: IEvents) - конструктор принимает DOM элемент и экземпляр класса 'EventEmitter' для возможности инициации событий

Поля класса:
- _list: HTMLElement; - элемент списка товаров в корзине
- _button: HTMLButtonElement; - кнопка корзины
- _items: string[]; - массив айди товаров в корзине
- total: number; - сумма товаров в корзине 
- cardList: HTMLElement[] - список элементов товара в корзине
- container: HTMLTemplateElement - контейнер корзины
- span: HTMLElement; - элемент текста суммы всех товаров в корзине

Методы класса:
- setItems(items: HTMLElement[]) - устанавливает данные товаров, содержащихся в корзине
- addToCart(item: string): void - добавляет айди товаров в список товаров корзины
- removeFromCart(basketItem: string): void - метод для удаления товара из корзины
- emptyCart (): void - очищает товары в корзине
- showItems (): string[] - выводит список товаров в корзине
- countItems(): number - выводит количество товаров в корзине
- render(cardData: HTMLElement[]): HTMLTemplateElement - рендерит корзину
- handleSum (orderData: number | null): void - выводит значение суммы корзины

#### Класс Success
Реализует отрисовку формы успеха и её работу\

- constructor(container: HTMLElement, events: IEvents) - конструктор принимает DOM элемент и экземпляр класса 'EventEmitter' для возможности инициации событий

Поля класса:
- container: HTMLTemplateElement - контейнер
- protected button: HTMLButtonElement; - кнопка успеха
- orderSum: HTMLElement; - элемент, отображающий сумму корзины

Методы класса:
- putSuccessText (sum:number): void - меняет текст на странице успеха

### Слой коммуникаций

#### Класс AppApi
Принимает в конструктор экземпляр класса Api и предоставляет методы, реализующие взаимодействие с бэкендом сервиса.

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле 'index.ts', выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий, генерируемых с помощью брокера событий и обработчиков этих событий, описанных в 'index.ts'\
В 'index.ts' сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий

Список всех событий, которые могут генерироваться в системе\
Событие изменения данных (генерируется классами модели данных)
- 'payment:saved' - сохранение данных оплаты
- 'address:saved' - сохранение данных адреса
- 'card:selected' - открытие модального окна с карточкой



События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)
- 'initialData:loaded' - вывод карточек на экран
- 'cardButton:click' - добавление карточки товара в корзину
- 'basketItem:changed' - событие "товар добавлен"
- 'basket:open' - событие "открыть корзину"
- 'basket:changed' - событие "изменение данных в корзине"
- 'basketItem:delete' - событие "удалить карточку из корзины"
- 'placeOrder:click' - событие "оформить"
- 'paymentButton:click' - событие, обрабатывающее выбор метода оплаты
- 'order:input' - сохранение значений данных адреса
- 'order:click' - открытие формы контактов
- 'contacts:input' - введение значений формы контактов
- 'order:success' - открытие формы успеха
- 'order:send' - отправка заказа
- 'order:sent' - обработка события отправки формы
- 'modal:open' - блокировка окна
- 'modal:close' - разблокировка окна