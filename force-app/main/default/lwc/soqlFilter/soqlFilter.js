import { LightningElement } from 'lwc';

export default class SoqlFilter extends LightningElement {
  filters = 'Assistant Manager,Teacher,Doctor,Accountant,Engineer,Nurse,Recruiter,Sales Representative,Technical Writer'.split(
    ','
  );
  selectedFilters = [];

  publishEvent() {
    const messageservice = this.template.querySelector('c-message-service');
    const payload = { filters: this.selectedFilters };
    messageservice.publish({ key: 'filterchange', value: payload });
  }

  handleFilterChange() {
    this.selectedFilters = [...this.template.querySelectorAll('lightning-input')]
      .filter(e => e.checked)
      .map(e => e.label);
    console.log('selectedfilters ', this.selectedFilters);
    this.publishEvent();
  }
}
