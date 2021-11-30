import { LightningElement, api } from 'lwc';

/* Expected shape of event payload to apply filters
 *[{
     fieldName:'', //required
     fieldValues:[], //required
     fieldType:'' //optional. defaults to 'text'
  }]
 */
export default class TableWrapper extends LightningElement {
  selectedFilters = [];

  soqlQuery = '';

  @api
  objectApiName;

  @api
  filterFieldsMap;

  @api
  parentFieldName;

  @api
  recordId;

  _filterFieldsMap;

  connectedCallback() {
    this.soqlQuery = this.createQuery();
    this._filterFieldsMap = JSON.parse(this.filterFieldsMap);
  }

  createQuery(selectedFilters) {
    let query = `Select Name,Email,Title from ${this.objectApiName} where ${this.parentFieldName}='${this.recordId}'`;
    if (selectedFilters && selectedFilters.length > 0) {
      query += ' and ';
      selectedFilters.forEach(filterObj => {
        query += `${this.createPredicate(filterObj)} and`;
      });
    }
    query = query.replace(/\band$/, '');
    return query + ' limit 50';
  }

  createPredicate(filterObj) {
    const fieldValues = filterObj.fieldValues;
    let fieldValueStr = '';
    let predicate = '';
    const shouldAddQuotes = this.shouldAddQuotes(filterObj.fieldType);
    const fieldName = this._filterFieldsMap[filterObj.fieldName];
    if (fieldValues.length > 1) {
      fieldValueStr = shouldAddQuotes ? `('${fieldValues.join("','")}')` : `(${fieldValues.join(',')})`;
      predicate = `${fieldName} in ${fieldValueStr}`;
    } else if (fieldValues.length === 1) {
      fieldValueStr = shouldAddQuotes ? `'${fieldValues[0]}'` : fieldValues[0];
      predicate = `${fieldName}=${fieldValueStr}`;
    }
    return predicate;
  }

  shouldAddQuotes(fieldType) {
    return !fieldType || fieldType === 'text';
  }

  handleFilterChange(event) {
    const selectedFilters = event.detail.value.filters;
    this.soqlQuery = this.createQuery(selectedFilters);
    this.title = 'Refreshed Contacts';
    this.template.querySelector('c-soql-datatable').refreshTableWithQueryString(this.soqlQuery);
  }
}
