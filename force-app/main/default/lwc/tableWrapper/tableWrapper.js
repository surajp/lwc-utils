import { LightningElement, track } from 'lwc';

export default class TableWrapper extends LightningElement {
  selectedFilters = [];

  @track
  soqlQuery = '';

  title = 'Contacts';

  connectedCallback() {
    this.soqlQuery = this.createQuery();
  }

  createQuery() {
    let query = 'Select Name,Email,Title from Contact';
    if (this.selectedFilters && this.selectedFilters.length > 0) {
      query += ` where Title in ('${this.selectedFilters.join("','")}')`;
    }
    return query + ' limit 50';
  }

  handleFilterChange(event) {
    this.selectedFilters = event.detail.value.filters;
    this.soqlQuery = this.createQuery();
    this.title = 'Refreshed Contacts';
  }
}
