import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Form } from "./Form"

export class ContactsForm extends Form {
    
    protected submitButton: HTMLButtonElement;

    constructor (protected container: HTMLTemplateElement, events: IEvents) {
        super(container, events);

        this.submitButton = ensureElement<HTMLButtonElement>('.button', container)

        this.submitButton.addEventListener('click', (evt) =>{
            evt.preventDefault()
            this._events.emit('order:send')
        })
    }
}