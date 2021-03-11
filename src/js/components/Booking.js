import { templates } from '../settings.js';
import { select } from '../settings.js';
import { utils } from '../utils.js';
import AmountWidget from './AmountWidget.js';


class Booking {
  constructor(element) {
    const thisBooking = this;
    thisBooking.render(element);
    thisBooking.initWidgets();
  }

  render(element) {
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();
    thisBooking.dom = {};
    thisBooking.dom.wrapper = element;
    // generate dom from tempate
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    //insert generated dom into wrapper
    thisBooking.dom.wrapper.appendChild(generatedDOM);

    thisBooking.dom.peopleAmount = select.booking.peopleAmount;
    thisBooking.dom.hoursAmount = select.booking.hoursAmount;
  }

  initWidgets() {
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);

  }
}


export default Booking;