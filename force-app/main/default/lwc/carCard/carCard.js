import { LightningElement, wire } from 'lwc';

import CAR_OBJECT from '@salesforce/schema/Car__c';
import CATEGORY_FIELD from '@salesforce/schema/Car__c.Category__c';
import MAKE_FIELD from '@salesforce/schema/Car__c.Make__c';
import MSRP_FIELD from '@salesforce/schema/Car__c.MSRP__c';
import FUEL_TYPE_FIELD from '@salesforce/schema/Car__c.Fuel_Type__c';
import SEATS_FIELD from '@salesforce/schema/Car__c.seats__c';
import CONTROL_FIELD from '@salesforce/schema/Car__c.Control__c';

import CAR_CARD_MESSAGE_CHANNEL from '@salesforce/messageChannel/carCard__c';
import { subscribe, MessageContext } from 'lightning/messageService';

import {NavigationMixin} from 'lightning/navigation';

export default class CarCard extends NavigationMixin(LightningElement) {
    objectApiName = CAR_OBJECT;

    categoryField = CATEGORY_FIELD;
    makeField = MAKE_FIELD;
    msrpField = MSRP_FIELD;
    fuelTypeField = FUEL_TYPE_FIELD;
    controlField = CONTROL_FIELD;
    seatsField = SEATS_FIELD;
    controlField = CONTROL_FIELD;
    
    recordId;
    pictureURL;
    carName;

    handleLoad = (e) => {
        const carRecord = e.detail.records[this.recordId];
        this.pictureURL = carRecord.fields.Picture_URL__c.value;
        this.carName = carRecord.fields.Name.value;
    }

    @wire(MessageContext)
    context;

    handleNavigation = () => {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.recordId,
                objectApiName: CAR_OBJECT.objectApiName,
                actionName: 'view'
            }
        });
    }

    subscribeHandler = () => {
        subscribe(this.context, CAR_CARD_MESSAGE_CHANNEL, message => this.recordId = message.recordId);
    }

    connectedCallback() {
        this.subscribeHandler();
    }
}