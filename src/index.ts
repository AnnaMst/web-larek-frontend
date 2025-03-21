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
import { Basket } from './components/visual/Basket';
import { CardsModal } from './components/visual/CardModal';
import { OrderForm } from './components/visual/OrderForm';
import { ContactsForm } from './components/visual/ContactsForm';
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

//Модальное окно
const modal = new Modal(document.querySelector('.modal'), events)

//ТЕМПЛЕЙТЫ
const cardTemplate: HTMLTemplateElement = document.querySelector('#card-catalog');
const cardPreviewTemplate: HTMLTemplateElement = document.querySelector('#card-preview');
const cardBasketTemplate: HTMLTemplateElement = document.querySelector('#card-basket')
const basketTemplate: HTMLTemplateElement = document.querySelector('#basket');
const orderTemplate: HTMLTemplateElement = document.querySelector('#order');
const contactsTemplate: HTMLTemplateElement = document.querySelector('#contacts')
const successTemplate: HTMLTemplateElement = document.querySelector('#success')

const basketInstant = new Basket(cloneTemplate(basketTemplate), events)
const orderInfo = new OrderForm(cloneTemplate(orderTemplate), events)
const contactsInfo = new ContactsForm(cloneTemplate(contactsTemplate), events)
const success = new Success(cloneTemplate(successTemplate), events)



//смотрю события
events.onAll((event) => {
    console.log(event.eventName, event.data)
})

//получение данных карточек с сервера
api.getProducts()
.then((productInfo) => {
    productData.products = productInfo
    const cardArray = productData.products.map((card) => {
        const cardInstant = new Card(cloneTemplate(cardTemplate), events);
        cardInstant.handleCardOpen()

        return cardInstant.render(card)
    })
    page.setCatalog(cardArray)
})
.catch((err) => {
    console.error(err);
});

//открытие модального окна с карточкой
events.on('card:select', (data: {card: CardsModal}) => {
    
    const cardInstant = new CardsModal(cloneTemplate(cardPreviewTemplate), events)
    const {card} = data
    const newCardItem = productData.getProductItem(card.id)
    const readyCard = cardInstant.render(newCardItem)

    //проверяем на то, есть ли эта карточка уже в корзине
    const productList = orderData.showItems();
    const productIds = productList.map(products => products.id)
    if (productIds.includes(card.id)) {cardInstant.toggleButton()}
    else {console.log('no product')}

    //проверяем цену карточки, переключаем кнопку добавления карточки в корзину
    if (productData.getProductItem(card.id).price === null) {cardInstant.blockButton();}
    else {console.log('success')}

    modal.setContent(readyCard);
    modal.open();

});

//добавление карточки товара в корзину
events.on('cardButton:click', (data: {card: CardsModal}) => {
    const {card} = data
    orderData.addToCart(productData.getProductItem(card.id))
    card.toggleButton()
})

//событие "открыть корзину"
events.on('basket:open', ()=>{
    modal.setContent(basketInstant.render())
    modal.open()
});

//событие "удалить карточку из корзины"
events.on('basketItem:delete', (data: { card: Card }) => {
    const {card} = data
    const cardToDelete = productData.getProductItem(card.id)
    orderData.removeFromCart(cardToDelete)
});

//событие "изменение данных в корзине"
events.on('basket:changed', () => {
   //создаю массив карточек из товаров, которые лежат в корзине
    const cardList = orderData.showItems().map((item, index) => {
        const productItem = productData.getProductItem(item.id)
        const cardInstantBasket = new Card(cloneTemplate(cardBasketTemplate), events)
        cardInstantBasket._index = index + 1
        return cardInstantBasket.render(productItem)
    })

    //создаю темплейт карточек внутри темплейта корзины
    basketInstant.setItems(cardList)

    //считаю сумму корзины
    basketInstant.handleSum(orderData.countTotal())

    //обновлен счётчик товаров в корзине
    const productQuantaty = orderData.countItems()
    page.setCounter(productQuantaty)
})

//событие открытие формы ввода адреса и оплаты
events.on('placeOrder:click', () => {
    modal.setContent(orderInfo.render())
    modal.open()
    orderInfo.setErrors('Выберите способ оплаты и введите адрес', orderData.checkOrderValidation())
});


//событие, обрабатывающее выбор метода оплаты
events.on('paymentButton:click', (data: {button: HTMLButtonElement}) => {
    const{button} = data
    orderData.setPaymentData(button.name)
});

//сохранение данных оплаты
events.on('payment:saved', (data: {payment: string}) => {
    const {payment} = data;
    modal.setContent(orderInfo.form)
    modal.render(orderInfo.form)
    orderInfo.togglePaymentButton(payment)
    orderInfo.initButtonValidation(orderData.checkOrderValidation())
    orderInfo.setErrors('Заполните, пожалуйста, адрес', orderData.checkOrderValidation())    
});

//сохранение значений данных адреса
events.on('address:input', (data: { field: string, value: string }) => {
    const {value} = data
    orderData.setAddressData(value)
    orderInfo.initButtonValidation(orderData.checkOrderValidation())
})

//открытие формы контактов
events.on('order:click', () => {
    //создание темплейта
    modal.setContent(contactsInfo.form)
    modal.render(contactsInfo.render)
    contactsInfo.setErrors('Введите адрес электронной почты и номер телефона', orderData.checkContactsValidation())
})

//заполнение инпута имейла
events.on('email:input', (data: { field: string, value: string }) => {
    const {value} = data
    const{ field } = data
    orderData.setUserData(field, value);
    contactsInfo.initButtonValidation(orderData.checkContactsValidation()) 
    
})

//заполнение инпута телефона
events.on('phone:input', (data: { field: string, value: string }) => {
    const {value} = data
    const{ field } = data
    orderData.setUserData(field, value);
    contactsInfo.initButtonValidation(orderData.checkContactsValidation()) 
    
})

//отправка заказа
events.on('order:send', () => {
    api
        .postOrderData(orderData.getOrderData())
        .then( (data)  => {
            orderData.emptyCart()
            modal.setContent(success.container)
            modal.render(success.container)
            success.putSuccessText(data.total)
        })
        .catch(err => {
            console.error(err);
        });
})

//закрытие модального окна
events.on('modal:close', ()=>{
    modal.close()
})

//блокируем окно
events.on('page:locked', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('page:unlocked', () => {
    page.locked = false;
});