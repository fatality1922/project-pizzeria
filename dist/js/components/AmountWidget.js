import { settings, select } from '../settings.js';
import BaseWidget from './BaseWidget.js';

class amountWidget extends BaseWidget {
  constructor(element) {
    super(element, settings.amountWidget.defaultValue);
    const thisWidget = this;

    thisWidget.getElements(element);
    thisWidget.initActions();

    console.log('element', element);
  }
  getElements(){
    const thisWidget = this;
    
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
  }
  isValid(value) {
    return !isNaN(value)
      && value <= settings.amountWidget.defaultMax
      && value >= settings.amountWidget.defaultMin;
  }
  renderValue(){
    const thisWidget = this;

    thisWidget.dom.input.value = thisWidget.value;
  }
  announce() {
    const thisWidget = this;

    const event = new CustomEvent('updated', {
      bubbles: true
    });
    thisWidget.dom.input.dispatchEvent(event);
  }

  initActions() {
    const thisWidget = this;

    thisWidget.dom.input.addEventListener('change', function () {
      thisWidget.value = thisWidget.dom.input.value;
    });

    thisWidget.dom.linkDecrease.addEventListener('click', function (event) {
      event.preventDefault();
      thisWidget.setValue(parseInt(thisWidget.dom.input.value) - 1);
    });

    thisWidget.dom.linkIncrease.addEventListener('click', function (event) {
      event.preventDefault();
      thisWidget.setValue(parseInt(thisWidget.dom.input.value) + 1);
    });

  }
}

export default amountWidget;