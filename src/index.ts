import './scss/styles.scss';
import {ProductData} from "./components/productData"
import { EventEmitter } from './components/base/events';
import { AppApi } from './components/AppApi';
import { API_URL, CDN_URL, settings } from './utils/constants';
import { Card } from './components/visual/Card';
import { cloneTemplate } from './utils/utils';
import { OrderData } from './components/orderData';
import { Modal } from './components/visual/Modal';
import { Page } from './components/visual/Page';
import { CardsContainer } from './components/visual/CardsContainer';
import { Basket } from './components/visual/Basket';
import { CardsModal } from './components/visual/CardModal';
import { OrderForm } from './components/visual/OrderForm';
import { ContactsForm } from './components/visual/ContactsForm';
import { Form } from './components/visual/Form';
import { Success } from './components/visual/Success';

const events = new EventEmitter();

//API
const api = new AppApi(API_URL, settings, CDN_URL)

//СЛОЙ ДАННЫХ
const productData = new ProductData(events)
const orderData = new OrderData(events)

//СЛОЙ ПРЕДСТАВЛЕНИЯ
//Главная страница
const page = new Page(document.body, events);
const cardsContainer = new CardsContainer(document.querySelector('.gallery'))

//Модальное окно
const modal = new Modal(document.querySelector('.modal'), events)

//Корзина
const basket = new Basket(document.querySelector('.basket'), events);

//ТЕМПЛЕЙТЫ
const cardTemplate: HTMLTemplateElement = document.querySelector('#card-catalog');
const cardPreviewTemplate: HTMLTemplateElement = document.querySelector('#card-preview');
const cardBasketTemplate: HTMLTemplateElement = document.querySelector('#card-basket')
const basketTemplate: HTMLTemplateElement = document.querySelector('#basket');
const orderTemplate: HTMLTemplateElement = document.querySelector('#order');
const contactsTemplate: HTMLTemplateElement = document.querySelector('#contacts')
const successTemplate: HTMLTemplateElement = document.querySelector('#success')

//смотрю события
events.onAll((event) => {
    console.log(event.eventName, event.data)
})

//получение данных карточек с сервера
api.getProducts()
.then((productInfo) => {
    productData.products = productInfo
    events.emit('initialData:loaded')
})
.catch((err) => {
    console.error(err);
});

//вывод карточек на экран
events.on('initialData:loaded', () => {
    const cardArray = productData.products.map((card) => {
        const cardInstant = new Card(cloneTemplate(cardTemplate), events);
        cardInstant.handleCardOpen()

        return cardInstant.render(card)
    })
    cardsContainer.render({catalog: cardArray})    
});

//открытие модального окна с карточкой
events.on('card:select', (data: {card: CardsModal}) => {
    
    const cardInstant = new CardsModal(cloneTemplate(cardPreviewTemplate), events)
    const {card} = data
    const newCardItem = productData.getProductItem(card.id)
    const readyCard = cardInstant.render(newCardItem)

    //проверяем на то, есть ли эта карточка уже в корзине
    if (basket.showItems().includes(card.id)) {cardInstant.toggleButton()}

    modal.open();
    modal.setContent(readyCard);
    modal.render(readyCard);
});

//добавление карточки товара в корзину
events.on('cardButton:click', (data: {card: CardsModal}) => {
    const {card} = data
    basket.addToCart(card.id)
    card.toggleButton()
    events.emit('basketItem:changed');
})

//событие "товар добавлен"
events.on('basketItem:changed', () => {
    const productQuantaty = basket.countItems()
    page.setCounter(productQuantaty)
});

//событие "открыть корзину"
events.on('basket:open', ()=>{
    modal.open()
    events.emit('basket:changed')
});

//событие "изменение данных в корзине"
events.on('basket:changed', () => {
    //создаю массив карточек из данных id, которые лежат в корзине
    const cardList = basket.showItems().map((item) => {
        const productItem = productData.getProductItem(item)
        const cardInstant = new Card(cloneTemplate(cardBasketTemplate), events)
        return cardInstant.render(productItem)
    })
    
    const basketInstant = new Basket(cloneTemplate(basketTemplate), events)

    //создаю темплейт карточек внутри темплейта корзины
    basketInstant.render(cardList)

    modal.setContent(basketInstant.render(cardList))
    modal.render(basketInstant.render(cardList))

    //создаю массив товаров, чтобы посчитать сумму товаров
    const cardsMassive = basket.showItems().map((item) => {
        return productData.getProductItem(item)
    })
    const countTotal = orderData.countTotal(cardsMassive)    
    //передаю данные в соответствующее поле корзины
    basketInstant.handleSum(countTotal)
    //сохраняю данные в класс OrderData
    orderData.setOrderItemsData(basket.showItems(), countTotal)
});

//событие "удалить карточку из корзины"
events.on('basketItem:delete', (data: { card: Card }) => {
    const {card} = data
    basket.removeFromCart(card.id)
    events.emit('basket:changed')
    events.emit('basketItem:changed')
});

//событие "оформить"
events.on('placeOrder:click', () => {
    //создание темплейта
    const orderInfo = new OrderForm(cloneTemplate(orderTemplate), events)
    modal.setContent(orderInfo.form)
    modal.render(orderInfo.form)
});

//событие, обрабатывающее выбор метода оплаты
events.on('paymentButton:click', (data: {button: HTMLButtonElement}) => {
    const{button} = data
    orderData.setPaymentData(button.name)
});

//сохранение данных оплаты
events.on('payment:saved', (data: {payment: string}) => {
    const {payment} = data;
    const orderInfo = new OrderForm(cloneTemplate(orderTemplate), events)
    modal.setContent(orderInfo.form)
    modal.render(orderInfo.form)
    orderInfo.togglePaymentButton(payment)
});

//сохранение значений данных адреса
events.on('order:input', (data: { field: string, value: string }) => {
    const {value} = data
    orderData.setAddressData(value)
})

//открытие формы контактов
events.on('order:click', () => {
    //создание темплейта
    const contactsInfo = new ContactsForm(cloneTemplate(contactsTemplate), events)
    modal.setContent(contactsInfo.form)
    modal.render(contactsInfo.render)
})

//введение значений формы контактов
events.on('contacts:input', (data: { field: string, value: string }) => {
    const {value} = data
    const{ field } = data
    orderData.setUserData(field, value);
    console.log(orderData.getOrderData())
})

//открытие формы успеха
events.on('order:success', () => {
    const success = new Success(cloneTemplate(successTemplate), events)
    modal.setContent(success.container)
    modal.render(success.container)
    success.putSuccessText(orderData.total)
})

//отправка заказа
events.on('order:send', () => {
    api
        .postOrderData(orderData.getOrderData())
        .then( ()  => {
            events.emit('order:sent');
            console.log('done')
        })
        .catch(err => {
            console.error(err);
        });
})

//обработка события отправки формы
events.on('order:sent', () => {
    basket.emptyCart()
    events.emit('basketItem:changed');
    modal.close()
})

//блокируем окно
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});