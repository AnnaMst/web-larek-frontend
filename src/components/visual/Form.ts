import { Component } from "../base/component";
import { IEvents } from "../base/events";

interface IForm {
    valid: boolean;
    error: string
    inputValues: Record<string, string>;
}

export abstract class Form extends Component<IForm>{
    protected _events: IEvents;
    protected submitButton: HTMLElement;
    protected formName: string;
    protected inputs: NodeListOf<HTMLInputElement>;
    protected errorField: HTMLElement;
    protected _error: string;


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
            this._events.emit(`${this.formName}:input`, { field, value })
            this.updateValidity()
        })
    }

    protected abstract updateValidity (): void

    //проверка валидности поля input
    validateInput(inputValue: string): boolean {
        if (inputValue.trim().length === 0) {
            return false
        } else {
            return true
        }
    }

    //Показывает ошибку поля input
    showInputError(errorText: string): void {
        this.errorField.textContent = errorText
    }

    //Скрывает ошибки поля input
    hideInputError(): void {
        this.errorField.textContent = ''
    }

    //Валидация кнопки
    initValidation(isValid: boolean) {
        isValid === true 
            ? this.submitButton.removeAttribute('disabled') 
            : this.submitButton.getAttribute('disabled')
    }

    get form(): HTMLTemplateElement {
        this.updateValidity()
        return this.container
    }

    close(): void {
        this.container.remove;
        this.hideInputError()
    }

    set inputValues(data: Record<string, string>) {
		this.inputs.forEach((element) => {
			element.value = data[element.name];
		});
	}

    set error (data: { field: string; value: string; validInformation: string }) {
		if (data.validInformation) {
			this.showInputError(data.field);
		} else {
			this.hideInputError();
		}
	}

    protected getInputValues(): Record<string, string> {
		const valuesObject: Record<string, string> = {};
		this.inputs.forEach((element) => {
			valuesObject[element.name] = element.value;
		});
		return valuesObject;
	}
}