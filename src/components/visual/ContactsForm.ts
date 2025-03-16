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
            this._events.emit('order:sent')
        })

        this.inputs.forEach((input) => {
            input.addEventListener('input', () => {
              this.inputValues = this.getInputValues();
              this.updateValidity();
            });
        });
    }

    updateValidity() {
        //let isEmailValid = true;
        //let isPhoneValid = true;
        let allInputsValid = true;
        let errorMassage = '';

        this.inputs.forEach((input) => {
            if (this.validateInput(input.value) === false && input.name === 'email') {
                errorMassage = 'Введите адрес электронной почты';
                this.showInputError(errorMassage);
                allInputsValid = false;
            } else if (this.validateInput(input.value) === false && input.name === 'phone') {
                errorMassage = 'Введите контактный номер телефона';
                this.showInputError(errorMassage);
                allInputsValid = false
            }
        })

        this.initValidation(allInputsValid)
        this._error = errorMassage
    }
}