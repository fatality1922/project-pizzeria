import amountWidget from './AmountWidget.js';
import { select, classNames, templates } from '../settings.js';

import utils from '../utils.js';

class Product {
  constructor(id, data) {
    const thisProduct = this;

    thisProduct.id = id;
    thisProduct.data = data;

    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();
  }

  renderInMenu() {
    const thisProduct = this;

    /* generate HTML based on template*/
    const generatedHTML = templates.menuProduct(thisProduct.data);

    /* create element using utils.createElementFromHTML */
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);
    /* find menu container */
    const menuContainer = document.querySelector(select.containerOf.menu);
    /* add element to menu*/
    menuContainer.appendChild(thisProduct.element);
  }

  getElements() {
    const thisProduct = this;

    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable); //jak to sie odnosi do accordiona
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }

  initAccordion() {
    const thisProduct = this;

    /* find the clickable trigger (the element that should react to clicking) */
    //const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);//dlaczego nie dzialalo przy wyszukiwaniu klasy
    /* START: add event listener to clickable trigger on event click */
    thisProduct.accordionTrigger.addEventListener('click', function (event) { //dlaczego ten trugger nie jest dostepny tylko w zakresie swojej metody
      /* prevent default action for event */
      event.preventDefault();
      /* find active product (product that has active class) */
      const allActiveProducts = document.querySelectorAll('.product.active');
      /* if there is active product and it's not thisProduct.element, remove class active from it */
      for (let activeProduct of allActiveProducts) {
        if (activeProduct !== thisProduct.element) {
          activeProduct.classList.remove('active');
        }
      }
      /* toggle active class on thisProduct.element */
      thisProduct.element.classList.toggle('active');
    });
  }

  initOrderForm() {
    const thisProduct = this;
    //console.log('initOrderForm');

    thisProduct.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
    });

    for (let input of thisProduct.formInputs) {
      input.addEventListener('change', function () { //dlaczego nie można bez tej funkcji?
        thisProduct.processOrder();
      });
    }

    thisProduct.cartButton.addEventListener('click', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }

  processOrder() {
    const thisProduct = this;

    // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
    const formData = utils.serializeFormToObject(thisProduct.form);

    // set price to default price
    let price = thisProduct.data.price;

    // for every category (param)...
    for (let paramId in thisProduct.data.params) {
      // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
      const param = thisProduct.data.params[paramId];
      // for every option in this category
      for (let optionId in param.options) {
        // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
        const option = param.options[optionId];
        //console.log(optionId, option);

        //zad2

        // console.log(formData.indexOf(option));
        // if (formData.indexOf(option) !== -1 {
        //   console.log('aagewwgw');
        // }
        if (formData[paramId] && formData[paramId].includes(optionId)) {
          if (option.default == true) {
            //console.log('true');
          } else {
            price = price + option.price;
          }
        } else if (option.default == true) {
          price = price - option.price;
        }

        //zad3
        const image = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId);
        if (image !== null && formData[paramId] && formData[paramId].includes(optionId)) {
          image.classList.add(classNames.menuProduct.imageVisible);
        } else if (image !== null && formData[paramId] && !formData[paramId].includes(optionId)) {
          image.classList.remove(classNames.menuProduct.imageVisible);
        }
      }
    }

    // update calculated price in the HTML
    thisProduct.priceSingle = price;
    thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;


    thisProduct.priceElem.innerHTML = thisProduct.priceSingle;
    return thisProduct.priceSingle;
  }

  initAmountWidget() {
    const thisProduct = this;

    thisProduct.amountWidget = new amountWidget(thisProduct.amountWidgetElem);
    thisProduct.amountWidgetElem.addEventListener('updated', function () {
      thisProduct.processOrder();
    });
  }

  addToCart() {
    const thisProduct = this;
    thisProduct.name = thisProduct.data.name;
    thisProduct.amount = thisProduct.amountWidget.value;


    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });

    thisProduct.element.dispatchEvent(event);
  }


  prepareCartProduct() {
    const thisProduct = this;

    const productSummary = {
      id: thisProduct.id,
      name: thisProduct.data.name,
      amount: thisProduct.amountWidget.value,
      priceSingle: thisProduct.processOrder(),
      price: thisProduct.processOrder() * thisProduct.amountWidget.value,
      params: thisProduct.prepareCartProductParams(),
    };
    return (productSummary);
  }

  prepareCartProductParams() {
    const thisProduct = this;

    // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
    const formData = utils.serializeFormToObject(thisProduct.form);

    const params = {};
    for (let paramId in thisProduct.data.params) {
      // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
      const param = thisProduct.data.params[paramId];

      params[paramId] = {
        name: param.label,
        options: {}
      };

      for (let optionId in param.options) {
        const option = param.options[optionId];
        const optionSelected = formData[paramId] && formData[paramId].includes(optionId);

        if (optionSelected) {
          params[paramId].options = option;
        }
      }
    }
    return params;
  }
}

export default Product;