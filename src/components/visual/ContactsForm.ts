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
            this._events.emit('order:success')
        })
    }

    updateValidity() {
        let isEmailValid = true;
        let isPhoneValid = true;
        let errorMassage ='';
        console.log(this.inputs)

        Array.from(this.inputs).forEach((input) => {
            if (this.validateInput(input.value) === false && input.name === 'email') {
                errorMassage = 'Введите адрес электронной почты';
                this.showInputError(errorMassage);
                isEmailValid = false;
            } else {
                this.hideInputError()            
            }
            
            if (this.validateInput(input.value) === false && input.name === 'phone') {
                errorMassage = 'Введите контактный номер телефона';
                this.showInputError(errorMassage);
                isPhoneValid = false
            } else {
                this.hideInputError()            
            }
        })

        this.initValidation(isEmailValid && isPhoneValid)
        this._error = errorMassage
    }
}