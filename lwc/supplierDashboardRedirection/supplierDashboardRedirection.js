import { LightningElement, api } from 'lwc';

export default class SupplierDashboardRedirection extends LightningElement {
    _supplierId;
    get supplierId () {
        return this._supplierId;
    }
    @api
    set supplierId(value) {
        this._supplierId = value;
        if(value) {
            window.sessionStorage.setItem('supplierId', value);
        }
    }
    constructor () {
        super();
        document.location.href = 'https://wise-wolf-5titbv-dev-ed.trailblaze.my.site.com/lms/s/supplier-page';
    }

}