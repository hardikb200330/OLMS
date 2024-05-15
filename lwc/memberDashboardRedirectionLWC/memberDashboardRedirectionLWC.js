import { LightningElement, api} from 'lwc';

export default class MemberDashboardRedirectionLWC extends LightningElement {
    _memberId;
    get memberId(){
        return this._memberId;
    }
    @api
    set memberId(value){
        this._memberId = value;
        if(value){
            window.sessionStorage.setItem('memberId',value);
        }
        // console.log(value);
    }

    constructor () {
        super();
        document.location.href = 'https://wise-wolf-5titbv-dev-ed.trailblaze.my.site.com/lms/s/member-page';
    }
}