import { LightningElement, wire } from 'lwc';
import getCars from '@salesforce/apex/CarController.getCars';

import CARS_FILTERED_MESSAGE_CHANNEL from '@salesforce/messageChannel/carsFiltered__c';
import CAR_CARD_MESSAGE_CHANNEL from '@salesforce/messageChannel/carCard__c';
import { publish, subscribe, MessageContext } from 'lightning/messageService';

export default class CarTileList extends LightningElement {
    cars;
    filters = {};
    carId;

    @wire(MessageContext)
    context;

    @wire(getCars, {filters: '$filters'}) 
    wiredCars({data, error}){ 
        if(data) {
            this.cars = data;
        } 

        if(error) {
            console.error(error);
        }
    }

    handleFilterChanges(message) {
        if(message.filters != null) 
            this.filters = message.filters;
    }

    subscribeHandler() {
        subscribe(this.context, CARS_FILTERED_MESSAGE_CHANNEL, message => this.handleFilterChanges(message));
    }

    handleSelected = (e) => {
        this.sendDataToCarCard(e.detail);
    }

    sendDataToCarCard = (recordId) => {
        publish(this.context, CAR_CARD_MESSAGE_CHANNEL, {recordId});
    }

    connectedCallback() {
        this.subscribeHandler();
    }
}
