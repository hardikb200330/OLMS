import { LightningElement } from 'lwc';
import getDetails from '@salesforce/apex/MemberDataTransfer.getDetails';

const columns = [
    {label: 'Transaction Id', fieldName: 'Name'},
    {label: 'Book Name', fieldName: 'BookName'},
    {label: 'Issued Date', fieldName: 'Issued_Date__c'},
    {label: 'Status', fieldName: 'Status__c'},
    
]

export default class MemberPageLWC extends LightningElement {
    memberId;
    memberName;
    dueFine;
    currentlyIssuedBooks;
    notReturnedBooks;
    columnsList = columns;
    dataList;
    validUser = false;

    
    
    connectedCallback() {
        this.memberId = window.sessionStorage.getItem('memberId');
        if(this.memberId === null) {
            console.log("Member session is ended please login again"); 
            window.location = "https://wise-wolf-5titbv-dev-ed.trailblaze.my.site.com/lms/s/errorpage";
        }
        else {
            this.validUser = true;
            console.log('Valid User');
        }
        if(this.validUser) {
            getDetails({memberId:this.memberId}).then((result)=>{
                console.log('Inside then method');
                console.log('Member Transaction Table data',JSON.stringify(result));
                console.log(result.transactions);
                this.dataList =  result.transactions.map(record => Object.assign({ "BookName": record.Book__r.Name}, record));
                this.memberName = result.member.Name;
                this.dueFine = result.member.DueFine__c;
                this.currentlyIssuedBooks = result.member.CurrentlyIssuedBooks__c;
                this.notReturnedBooks = result.member.NotReturnedBooks__c;
            }).catch((error)=>{
                console.log(error);
            });
            console.log('Data Loaded');
        }
        console.log('connectedCallback');
    }
    
    
    handleShowDetails() {
        window.location = "https://google.com";
    }
    handleLogOut() {
        window.sessionStorage.clear();
        window.location = "https://wise-wolf-5titbv-dev-ed.trailblaze.my.site.com/lms/s";

    }
}