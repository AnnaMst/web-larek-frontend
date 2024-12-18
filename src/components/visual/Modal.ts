import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";

export class Modal <T> extends Component<T> {
    protected modal: HTMLElement;
    protected content: HTMLElement;
    protected events: IEvents;
    protected closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this.events = events;
        this.closeButton = container.querySelector('.modal__close');
        this.modal = ensureElement<HTMLElement>('.modal__content', container);

        this.closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('mousedown', (evt) => {
            if (evt.target === evt.currentTarget) {
                this.close()
            }
        })
    }

    setContent(_content: HTMLElement): void {
        if (!this.modal) {
            throw new Error('Modal element not found');
        }
        
        // Очистка предыдущего содержимого
        while (this.modal.firstChild) {
            this.modal.removeChild(this.modal.firstChild);
        }

        // Установка нового контента
        this.content = _content;
        this.modal.appendChild(_content);
    }

    open() {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open')
    }

    close() {
        this.container.classList.remove('modal_active');
        this.events.emit('modal:close');
    }
}