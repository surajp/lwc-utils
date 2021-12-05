import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { encodeDefaultFieldValues } from 'lightning/pageReferenceUtils';

export default class GenericNewRecord extends NavigationMixin(LightningElement) {
  @api
  objectName;

  @api
  parentFieldName;

  @api
  recordId;

  getDefaultValues() {
    const defaultValues = {
      [this.parentFieldName]: this.recordId
    };
    return encodeDefaultFieldValues(defaultValues);
  }

  createNew() {
    this[NavigationMixin.Navigate]({
      type: 'standard__objectPage',
      attributes: {
        objectApiName: this.objectName,
        actionName: 'new'
      },
      state: {
        defaultFieldValues: this.getDefaultValues(),
        nooverride: 1
      }
    });
  }
}
