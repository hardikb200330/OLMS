import { api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class CreateShipmentModalLWC extends LightningModal {
    @api orderId;
    @api content;

    handleOkay() {
        this.close('okay');
    }
    get inputVariables() {
        return [
            {
                name: 'varBookOrderId',
                type: 'String',
                value: this.orderId,
            }
        ]
    }

    handleStatusChange(event) {
        if (event.detail.status === 'FINISHED') {
            this.close('Create Shipment Modal Closed!');
        }
    }

}