import { api } from 'lwc';
import LightningModal from 'lightning/modal';


export default class ShowSupplierDetailsModal extends LightningModal {
    @api supplierId;
    @api email;
    @api name;
    @api phone;
}