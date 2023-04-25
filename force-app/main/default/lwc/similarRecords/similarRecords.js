import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import MAKE_FIELD from '@salesforce/schema/Car__c.Make__c';
import getSimilarCars from '@salesforce/apex/CarController.getSimilarCars';

import {NavigationMixin} from 'lightning/navigation';
import CAR_OBJECT from '@salesforce/schema/Car__c';

export default class SimilarRecords extends NavigationMixin(LightningElement) {
    @api recordId;
    makeType;
    similarRecords;

    @wire(getRecord, {recordId: '$recordId', fields: [MAKE_FIELD]})
    wiredRecord({data, error}) {
        if(data) {
            this.makeType = data.fields.Make__c.value;
        } else if(error) {
            console.log(error);
        }
    }

    handleButtonClick = () => {
        getSimilarCars({recordId: this.recordId, makeType: [this.makeType]})
        .then(data => this.similarRecords = data)
        .catch(err => console.log(err));
    }

    handleNavigation = (e) => {
        const {recordid} = e.target.dataset;

        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordid,
                objectApiName: CAR_OBJECT.objectApiName,
                actionName: 'view'
            }
        });
    }
}