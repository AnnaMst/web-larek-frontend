/*- constructor(container: HTMLElement, events: IEvents) - конструктор принимает DOM элемент и экземпляр класса 'EventEmitter' для возможности инициации событий

Поля класса:
- submitButton - кнопка подтверждения
- _form: HTMLFormElement - элемент формы
- formName: string - значение атрибута name формы
- handleSubmit: Function - функция, на выполнение который запрашивается подтверждение
- inputs: NodeListOf`<HTMLInputElement>` - коллекция всех полей ввода
- error: HTMLElement - элемент для вывода ошибок в форме

Методы класса:
- toggleSubmitButton(submitButton: HTMLButtonElement): void - изменияет активность кнопки подтверждения
- getInputValues(): Record`<string, string>`- возвращает объект с данными из полей формы, где ключ - name инпута, значение - данные, введенные пользователем
- setInputValues(data: Record`<string, string>`): void - принимает объект с данными для заполнения полей формы
- setError(data: {field: string, value: string, validInformation: string}): void - принимает объект с данными для отображения или сокрытия текстов ошибок в поле ошибки
- showInputError(field: string, showMessage: string): void - отображает полученный текст ошибки в поле ошибки
- hideInputError(field: string): void - очищает текст ошибки в поле ошибки*/

import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";

interface IForm {
    valid: boolean;
    inputValues: Record<string, string>;
}

export class Form extends Component<IForm>{
    protected _events: IEvents;
    protected submitButton: HTMLElement;
    protected _form: HTMLFormElement;
    protected formName: string;
    protected inputs: NodeListOf<HTMLInputElement>;
    protected inputValue: string;
    protected errorField: HTMLElement;

    constructor (protected container: HTMLTemplateElement, events: IEvents) {
        super(container)

        this._events = events;

        this.inputs = this.container.querySelectorAll<HTMLInputElement>('.form__input');
        

        this._form = ensureElement<HTMLFormElement>('.form', container);
        this.formName = this._form.getAttribute('name');

        this.errorField = ensureElement<HTMLElement>('.form__errors', container);

        this._form.addEventListener('input', (event: InputEvent) => {
            const target = event.target as HTMLInputElement;
            const field = target.name;
            const value = target.value;
            this._events.emit(`${this.formName}:input`, { field, value })
        })
    }

    protected getInputValues() {
        const valuesObject: Record<string, string> = {}
        this.inputs.forEach((element) => {
            valuesObject[element.name] = element.value;
        })

        return valuesObject
    }

    //Сохраняем значения полей ввода
    set inputValues(data: Record<string, string>) {
        this.inputs.forEach((element) => {
            element.value = data[element.name]
        })
    }

    set error(data: { field: string; value: string, validInformation: string }) {
        if (data.validInformation) {
            this.showInputError(data.validInformation);
        } else {
            this.hideInputError()
        }
    }

    //проверка валидности поля input
    validateInput(inputValue: string): boolean {
        return inputValue.trim().length > 0;
    }

    //Показывает ошибку поля input
    showInputError(errorText: string): void {
        this.errorField.textContent = errorText
    }

    //Скрывает ошибки поля input
    hideInputError(): void {
        this.errorField.textContent = ''
    }

    set valid(isValid: boolean) {
        console.log({isValid})
        isValid === true 
            ? this.submitButton.removeAttribute('disabled') 
            : this.submitButton.getAttribute('disabled')
    }

    get form() {
        return this._form
    }

    close() {
        this._form.reset();
        this.hideInputError()
    }
}