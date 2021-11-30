import { LightningElement, api } from 'lwc';

export default class SoqlFilter extends LightningElement {
  filters = 'Assistant Manager;Teacher;Doctor;Accountant;Engineer;Nurse;Recruiter;Sales Representative;Technical Writer;SVP, Administration and Finance'.split(
    ';'
  );
  selectedFilters = [];

  @api
  filterName;

  publishEvent() {
    const messageservice = this.template.querySelector('c-message-service');
    const payload = { filters: [{ fieldName: this.filterName, fieldValues: this.selectedFilters }] };
    messageservice.publish({ key: 'filterchange', value: payload });
  }

  handleFilterChange() {
    this.selectedFilters = [...this.template.querySelectorAll('lightning-input')]
      .filter(e => e.checked)
      .map(e => e.label);
    this.publishEvent();
  }
}