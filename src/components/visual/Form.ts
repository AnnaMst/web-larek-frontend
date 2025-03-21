import { Component } from "../base/component";
import { IEvents } from "../base/events";

interface IForm {
    _events: IEvents;
    submitButton: HTMLButtonElement;
    formName: string;
    inputs: NodeListOf<HTMLInputElement>;
    errorField: HTMLElement;
}

export abstract class Form extends Component<IForm>{
    protected _events: IEvents;
    protected submitButton: HTMLButtonElement;
    protected formName: string;
    protected inputs: NodeListOf<HTMLInputElement>;
     errorField: HTMLElement;


    constructor (protected container: HTMLTemplateElement, events: IEvents) {
        super(container)

        this._events = events;

        this.inputs = this.container.querySelectorAll<HTMLInputElement>('.form__input');
        
        this.formName = this.container.getAttribute('name');

        this.errorField = this.container.querySelector('.form__errors');

        this.container.addEventListener('input', (event: InputEvent) => {
            const target = event.target as HTMLInputElement;
            const field = target.name;
            const value = target.value;
            this._events.emit(`${field}:input`, { field, value })
        })

    }

    //Валидация кнопки
    initButtonValidation(isValid: boolean) {
        if (isValid === true) {
            this.setDisabled(this.submitButton, false)
            this.setText(this.errorField, '')
        } else {
            this.setDisabled(this.submitButton, true)
        }
    }

    get form(): HTMLTemplateElement {
        return this.container
    }

    close(): void {
        this.container.remove;
        this.setText(this.errorField, '')
    }

    set inputValues(data: Record<string, string>) {
		this.inputs.forEach((element) => {
			element.value = data[element.name];
		});
	}

    setErrors(errorText: string, isValid: boolean): void {
        isValid === false ? this.setText(this.errorField, errorText) : this.setText(this.errorField, '')
    }

    protected getInputValues(): Record<string, string> {
		const valuesObject: Record<string, string> = {};
		this.inputs.forEach((element) => {
			valuesObject[element.name] = element.value;
		});
		return valuesObject;
	}
}