import { api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class CreateBidModal extends LightningModal {
    @api tenderId;
    @api supplierId;
    handleOkay() {
        this.close('okay');
    }
    get inputVariables() {
        return [
            {
                name: 'varSupplierId',
                type: 'String',
                value: this.supplierId,
            },
            {
                name: 'varTenderId',
                type: 'String',
                value: this.tenderId,
            }
        ]
    }
    handleStatusChange(event) {
        if (event.detail.status === 'FINISHED') {
            this.close('Create Bid Modal Closed!');
        }
    }
}