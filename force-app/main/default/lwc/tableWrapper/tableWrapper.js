import { LightningElement, api } from 'lwc';

/* Expected shape of event payload to apply filters
 *[{
     fieldName:'', //required
     fieldValues:[], //required
     fieldType:'' //optional. defaults to 'text'
  }]
 */
export default class TableWrapper extends LightningElement {
  selectedFilters = {};

  soqlQuery = '';

  @api
  objApiName;

  @api
  filterFieldsMap;

  @api
  parentFieldName;

  @api
  recordId;

  @api
  fieldNames;

  @api
  title = '';

  @api
  iconName = 'standard:account';

  _filterFieldsMap;

  connectedCallback() {
    this._filterFieldsMap = JSON.parse(this.filterFieldsMap || '{}');
    this.soqlQuery = this._createQueryString();
  }

  _createQueryString() {
    let query = `Select ${this.fieldNames} from ${this.objApiName} where ${this.parentFieldName}='${this.recordId}'`;
    if (this.selectedFilters && Object.keys(this.selectedFilters).length > 0) {
      const predicates = [];
      for (let filterName in this.selectedFilters) {
        if (filterName && this.selectedFilters.hasOwnProperty(filterName))
          predicates.push(this._createPredicateString(this.selectedFilters[filterName])); // predicate string would never be null/undefined
      }
      if (predicates.length > 0) {
        query += ` and ${predicates.join(' and ')}`;
      }
    }
    //query = query.replace(/\band$/, '');
    return query + ' limit 50';
  }

  _createPredicateString(filterObj) {
    let fieldValueStr = '';
    let predicate = '';
    const fieldProps = this._filterFieldsMap[filterObj.name]; // we would always have a match here since we delete any unmatched ones in `handleFilterChange` method itself
    let shouldAddQuotes = fieldProps.addQuotes;
    if (shouldAddQuotes === null || shouldAddQuotes === undefined) {
      shouldAddQuotes = true; //by default, we add quotes around the field value in the where clause
    }
    const fieldName = fieldProps.fieldName;
    const fieldValues = filterObj.fieldValues;
    if (fieldValues.length > 1) {
      fieldValueStr = shouldAddQuotes ? `('${fieldValues.join("','")}')` : `(${fieldValues.join(',')})`;
      predicate = `${fieldName} in ${fieldValueStr}`;
    } else if (fieldValues.length === 1) {
      fieldValueStr = shouldAddQuotes ? `'${fieldValues[0]}'` : fieldValues[0];
      predicate = `${fieldName}=${fieldValueStr}`;
    }
    return predicate;
  }

  _shouldAddFilter(filter) {
    return filter.fieldValues && filter.fieldValues.length > 0 && this._filterFieldsMap[filter.name];
  }

  handleFilterChange(event) {
    const filter = event.detail.value.filter;
    if (this._shouldAddFilter(filter)) this.selectedFilters[filter.name] = filter;
    else if (this.selectedFilters[filter.name]) delete this.selectedFilters[filter.name];
    this.soqlQuery = this._createQueryString(this.selectedFilters);
    this.title = 'Refreshed Contacts';
    this.template.querySelector('c-soql-datatable').refreshTableWithQueryString(this.soqlQuery);
  }
}
