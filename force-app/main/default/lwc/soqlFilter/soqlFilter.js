import { LightningElement, api } from 'lwc';

export default class SoqlFilter extends LightningElement {
  filters = 'Assistant Manager;Teacher;Doctor;Accountant;Engineer;Nurse;Recruiter;Sales Representative;Technical Writer;SVP, Administration and Finance'.split(
    ';'
  );
  selectedFilters = [];

  @api
  filterName;

  _debounce(fn) {
    let timeOut = '';
    return () => {
      if (timeOut) clearTimeout(timeOut);
      timeOut = setTimeout(fn, 700);
    };
  }

  publishEvent = () => {
    const messageservice = this.template.querySelector('c-message-service');
    const filter = { name: this.filterName, fieldValues: this.selectedFilters };
    const payload = { filter };
    messageservice.publish({ key: 'filterchange', value: payload });
  };

  debouncedPublishEvent = this._debounce(this.publishEvent);

  handleFilterChange() {
    this.selectedFilters = [...this.template.querySelectorAll('lightning-input')]
      .filter(e => e.checked)
      .map(e => e.label);
    this.debouncedPublishEvent();
  }
}
