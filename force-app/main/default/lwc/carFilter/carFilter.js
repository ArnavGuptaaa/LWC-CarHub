import { LightningElement, wire, track } from 'lwc';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import MAKE_FIELD from '@salesforce/schema/Car__c.Make__c';
import CATEGORY_FIELD from '@salesforce/schema/Car__c.Category__c';

import CAR_OBJECT from '@salesforce/schema/Car__c';
import CARS_FILTERED_MESSAGE_CHANNEL from '@salesforce/messageChannel/carsFiltered__c';

import { publish, MessageContext } from 'lightning/messageService';

export default class CarFilter extends LightningElement {
    @track filters = {
        searchKey: '',
        maxPrice: 999999
    }
    

    @wire(getObjectInfo, { objectApiName: CAR_OBJECT })
    carObjectInfo; 

    @wire(getPicklistValues, { recordTypeId: '$carObjectInfo.data.defaultRecordTypeId', fieldApiName: MAKE_FIELD })
    makePicklistValues;

    @wire(getPicklistValues, { recordTypeId: '$carObjectInfo.data.defaultRecordTypeId', fieldApiName: CATEGORY_FIELD })
    categoryPicklistValues;

    @wire(MessageContext)
    context;

    handleSearchKeyChange = (e) => {
        this.filters = {...this.filters, searchKey:e.target.value};
        this.sendDataToCarList();
    }

    handleMaxPriceChange = (e) => {
        this.filters = {...this.filters, maxPrice:e.target.value};
        this.sendDataToCarList();
    }

    handleCategoryCheckboxChange = (e) => {
        const {value} = e.target;

        if(!this.filters.hasOwnProperty('categories')){
            this.filters['categories'] = [value];
            this.sendDataToCarList();
            return;
        }

        if(e.target.checked) {
            if(!this.filters['categories'].includes(value)){
                this.filters['categories'] = [...this.filters['categories'], value];
            }
        } else {
            this.filters['categories'] = this.filters['categories'].filter(item => item !== value);
        }

        if(this.filters.categories.length === 0) delete this.filters.categories;

        this.sendDataToCarList();
    }

    handleMakeCheckboxChange = (e) => {
        const {value} = e.target;

        if(!this.filters.hasOwnProperty('makeType')){
            this.filters['makeType'] = [value];
            this.sendDataToCarList();
            return;
        }

        if(e.target.checked) {
            if(!this.filters['makeType'].includes(value)){
                this.filters['makeType'] = [...this.filters['makeType'], value];
            }
        } else {
            this.filters['makeType'] = this.filters['makeType'].filter(item => item !== value);
        }

        if(this.filters.makeType.length === 0) delete this.filters.makeType;

        this.sendDataToCarList();
    }

    sendDataToCarList = () => {
        publish(this.context, CARS_FILTERED_MESSAGE_CHANNEL, {
            filters: this.filters
        })
    }
}