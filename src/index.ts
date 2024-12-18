import './scss/styles.scss';
import {ProductData} from "./components/productData"
import { EventEmitter } from './components/base/events';
import { AppApi } from './components/AppApi';
import { API_URL, CDN_URL, settings } from './utils/constants';
import { Card } from './components/visual/Card';
import { cloneTemplate } from './utils/utils';
//import { Form } from './components/visual/Form';
import { OrderData } from './components/orderData';
import { Modal } from './components/visual/Modal';
import { Page } from './components/visual/Page';
import { CardsContainer } from './components/visual/CardsContainer';
import { Basket } from './components/visual/Basket';
import { CardsModal } from './components/visual/CardModal';

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

//Кнопки
const addToCartButton = document.querySelector('.card__button')

//Формы
//const success = new Form(document.querySelector('#success'), events);
//const cardPreview = new Form(document.querySelector('.card-preview'), events);
//const order = new OrderForm(document.querySelector('[name="order"]'), events);
//const contacts = new Form(document.querySelector('[name="contacts"]'), events)

//ТЕМПЛЕЙТЫ
const cardTemplate: HTMLTemplateElement = document.querySelector('#card-catalog');
const cardPreviewTemplate: HTMLTemplateElement = document.querySelector('#card-preview');
const cardBasketTemplate: HTMLTemplateElement = document.querySelector('#card-basket')
const basketTemplate: HTMLTemplateElement = document.querySelector('#basket');
/*const orderTemplate: HTMLTemplateElement = document.querySelector('.order');
const contactsTemplate: HTMLTemplateElement = document.querySelector('.contacts')
*/

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
})

//открытие модального окна с карточкой
events.on('card:select', (data: {card: CardsModal}) => {
    
    const cardInstant = new CardsModal(cloneTemplate(cardPreviewTemplate), events)
    const {card} = data
    const newCardItem = productData.getProductItem(card.id)
    const readyCard = cardInstant.render(newCardItem)
    //проверяем на то, есть ли эта карточка уже в корзине
    if (basket.showItems().includes(card.id)) {cardInstant.toggleButton()}
    modal.open()
    modal.setContent(readyCard);
    modal.render(readyCard)
})


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
})

//событие "открыть корзину"
events.on('basket:open', ()=>{
    modal.open()
    events.emit('basket:changed')
})

events.on('basket:changed', () => {
    //создаю массив карточек из данных id, которые лежат в корзине
    const cardList = basket.showItems().map((item) => {
        const productItem = productData.getProductItem(item)
        const cardInstant = new Card(cloneTemplate(cardBasketTemplate), events)
        return cardInstant.render(productItem)
    })
    
    const basketInstant = new Basket(cloneTemplate(basketTemplate), events)

    //создаю тмплейт карточек внутри темплейта корзины
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
})

//событие "удалить карточку из корзины"
events.on('basketItem:delete', (data: { card: Card }) => {
    const {card} = data
    basket.removeFromCart(card.id)
    events.emit('basket:changed')
    events.emit('basketItem:changed')
})


/*//создала новый темплейт с полями карточки
    const cardInstant = new Card(cloneTemplate(cardBasketTemplate), events)

    
    const {card} = data
    const newCardItem = productData.getProductItem(card.id)
    console.log(cardInstant)
    
    //создали новый контент из данных карточки
    const orderInfo = cardInstant.render(newCardItem);

    //создаём форму корзины
    console.log(basket)
    
    //Рендерим корзину
    modal.setContent(cardInstant.render(newCardItem))
    modal.render({basket})
*/



events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});