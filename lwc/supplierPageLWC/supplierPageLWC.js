import { LightningElement, track } from 'lwc';
import getDetails from '@salesforce/apex/SupplierDataTransfer.getDetails';
import CreateBidModal from 'c/createBidModal';
import CreateShipmentModalLWC from 'c/createShipmentModalLWC';
import ShowSupplierDetailsModal from 'c/showSupplierDetailsModal';
import {
    subscribe,
    unsubscribe,
    onError,
    setDebugFlag,
    isEmpEnabled
} from "lightning/empApi";
  

// actions = [
//     { label: 'Show details', name: 'show_details' },
//     { label: 'Delete', name: 'delete' }
// ]
const tenderColumns = [
    {label: 'Tender Id', fieldName: 'Name'},
    {label: 'Book Title', fieldName: 'BookName'},
    {label: 'Quantity', fieldName: 'Quantity__c'},
    {label: 'Status', fieldName: 'Status__c'},
    {label: 'Created Date', fieldName: 'FormatedDate'},

    {type: 'button', label: 'Create Bid', typeAttributes: {
        label: 'Create Bid',
        name: 'Create Bid',
        disabled: {fieldName: 'buttonIsActive'},
        iconPosition: 'left',
        
    }},

]

const orderColumns = [
    {label: 'Order Id', fieldName: 'Name'},
    {label: 'Book Title', fieldName: 'BookName'},
    {label: 'Quantity', fieldName: 'Quantity'},
    {label: 'Status', fieldName: 'Status__c'},

    {type: 'button', label: 'Create Shipment', typeAttributes: {
        label: 'Create Shipment',
        disabled: {fieldName: 'createShipmentButtonIsActive'},
        iconPosition: 'left'
    }},
]

const shipmentColumns = [

    {label: 'Shipment Id', fieldName: 'Name'},
    {label: 'Status', fieldName: 'Status__c'},
    {label: 'Shipped Quantity', fieldName: 'Shipment_Quantity__c'},
    {label: 'Order Id', fieldName: 'OrderId'},
    {label: 'Shipped Date', fieldName: 'FormatedDate'},
]

const bidColumns = [
    {label: 'Bid Id', fieldName: 'Name'},
    {label: 'Status', fieldName: 'Status__c'},
    {label: 'Tender Id', fieldName: 'TenderId'},
    {label: 'Per Copy MRP', fieldName: 'Per_Copy_MRP__c'},
    {label: 'Price Per Book', fieldName: 'PricePerBook__c'},
    {label: 'Created Date', fieldName: 'FormatedDate'},

]

const newBidColumns = [
    {label: 'Bid Id', fieldName: 'Name'},
    {label: 'Status', fieldName: 'Status__c'},
    {label: 'Tender Id', fieldName: 'TenderId'},
    {label: 'Per Copy MRP', fieldName: 'Per_Copy_MRP__c'},
    {label: 'Price Per Book', fieldName: 'PricePerBook__c'},
    {label: 'Created Date', fieldName: 'FormatedDate'},

]

const completedOrderColumns = [
    {label: 'Order Id', fieldName: 'Name'},
    {label: 'Book Title', fieldName: 'BookName'},
    {label: 'Quantity', fieldName: 'Quantity'},
    {label: 'Status', fieldName: 'Status__c'}
]

export default class SupplierPageLWC extends LightningElement {
    supplierRecordId;
    supplierId;
    tenderColumnList = tenderColumns;
    orderColumnList = orderColumns;
    shipmentColumnList = shipmentColumns;
    bidColumnList = bidColumns;
    completedOrderColumnList = completedOrderColumns;
    newBidColumnList = newBidColumns;
    completedOrderDataList;
    tenderDataList;
    orderDataList;
    shipmentDataList;
    bidDataList;
    supplierName;
    newBidDataList;
    supplierPhone;
    supplierEmail;


    loadData() {
        getDetails({supplierId: this.supplierId}).then((result) => {
            console.log('Inside supplier then method');
            console.log('Supplier getDetails returned value: ', JSON.stringify(result));

            this.bidDataList = result.supplierBids.map(record => Object.assign({"TenderId":record.Tender__r.Name, "FormatedDate": this.formatDate(record.CreatedDate)}, record));

            this.newBidDataList = result.supplierNewBids.map(record => Object.assign({"TenderId":record.Tender__r.Name, "FormatedDate": this.formatDate(record.CreatedDate)}, record));

            this.tenderDataList = result.openTender.map(record => { 
                let flag;
                if(this.newBidDataList.find(bid => bid.TenderId === record.Name) === undefined) {
                    flag = false;
                    // console.log(flag);
                }
                else {
                    flag = true;
                    // console.log(flag);
                }
                return Object.assign({"buttonIsActive": flag, "BookName":record.Book__r.Name, "FormatedDate": this.formatDate(record.CreatedDate)}, record);

            });



            this.shipmentDataList = result.supplierShipments.map(record => Object.assign({"OrderId": record.Book_Order__r.Name, "FormatedDate": this.formatDate(record.CreatedDate)}, record));

            this.orderDataList = result.supplierOrders.map(record => {
                let flag, sum=0;
                let curOrderShipments = this.shipmentDataList.filter(ship => ship.OrderId === record.Name);
                console.log("curOrdershipments: ", JSON.stringify(curOrderShipments));
                for(let i=0;i<curOrderShipments.length;i++){
                    sum += curOrderShipments[i].Shipment_Quantity__c;
                }
                console.log("sum: ", sum);
                if( sum === record.Tender__r.Quantity__c)
                    flag = true;
                else    
                    flag = false;
                console.log('flag: ', flag);
                return Object.assign( {"createShipmentButtonIsActive": flag, 'BookName': record.Tender__r.Book__r.Name, "Quantity": record.Tender__r.Quantity__c}, record );

            });

            this.completedOrderDataList = result.supplierCompletedOrders.map(record => Object.assign({'BookName': record.Tender__r.Book__r.Name, "Quantity": record.Tender__r.Quantity__c}, record));
            

            // console.log(result.supplierDetails.Name);
            this.supplierName = result.supplierDetails.Name;
            this.supplierRecordId = result.supplierDetails.Id;
            this.supplierPhone = result.supplierDetails.Phone__c;
            this.supplierEmail = result.supplierDetails.Email__c;
            
        }).catch((error) => {
            console.log('Inside supplier catch method');
            console.log(JSON.stringify(error));
        })
    }

    formatDate(date) {
        let newDate = new Date(date);
        let result = newDate.getDate() + "/" + newDate.getMonth() + "/" + newDate.getFullYear() + " - " + newDate.getHours() + ":" + newDate.getMinutes();
        return result;
    }

    // constructor() {
    //     super();
        
    //     const messageCallback = function (response) {
    //         thisReference.messageBody = response.data.payload.message__c;
    //         console.log("###New message received ", response.data.payload.message__c);
    //     };
    //     subscribe("/event/lmsEvent__e", -1, messageCallback).then((response) => {
    //         console.log(
    //             "Subscription request sent to: ",
    //             JSON.stringify(response.channel)
    //         );
    //     }).catch(error=> {
    //         console.log(JSON.parse.JSON.stringify(error));
    //     });
    //     console.log('Constructor called');
    // }
    connectedCallback() {
        debugger
        this.supplierId = window.sessionStorage.getItem('supplierId');
        if(this.supplierId === null) {  
            console.log("Supplier Session is ended please login again");
            window.location = "https://wise-wolf-5titbv-dev-ed.trailblaze.my.site.com/lms/s/errorpage";
        }
        else {
            this.loadData();
        }
        this.registerErrorListener();
    }

    async callRowTenderAction(event) {
        const tenderId = event.detail.row.Id;
        const result = await CreateBidModal.open({
            size: 'large',
            tenderId: tenderId,
            supplierId: this.supplierRecordId,
        });
        console.log(result);
        this.loadData();
    }

    async callRowOrderAction(event) {
        const orderId = event.detail.row.Id;
        const result = await CreateShipmentModalLWC.open({
            orderId: orderId,
        });
        this.loadData();
    }

    handleLogOut() {
        window.sessionStorage.clear();
        window.location = "https://wise-wolf-5titbv-dev-ed.trailblaze.my.site.com/lms/s";
    }

    async handleShowDetails() {
        await ShowSupplierDetailsModal.open({
            supplierId: this.supplierId,
            name: this.supplierName,
            email: this.supplierEmail,
            phone: this.supplierPhone,
        });
    }

    // ===========================================================================================================c/createBidModal
    @track messageBody = "";
    channelName = "/event/lmsEvent__e";
    isSubscribeDisabled = false;
    isUnsubscribeDisabled = !this.isSubscribeDisabled;

    subscription = {};

    // Tracks changes to channelName text field
    handleChannelName(event) {
        this.channelName = event.target.value;
    }

    // Handles subscribe button click
    handleSubscribe() {
        console.log('subscribe pressed - 1');
        const thisReference = this;
        // Callback invoked whenever a new event message is received
        const messageCallback = function (response) {
        thisReference.messageBody = response.data.payload.message__c;
        console.log("###New message received ", response.data.payload.message__c);
        // Response contains the payload of the new message received
        };
        console.log('subscribe pressed - 2');
        // Invoke subscribe method of empApi. Pass reference to messageCallback
        subscribe(this.channelName, -1, messageCallback).then((response) => {
        // Response contains the subscription information on subscribe call
        console.log(
            "Subscription request sent to: ",
            JSON.stringify(response.channel)
        );
        this.subscription = response;
        this.toggleSubscribeButton(true);
        });
        console.log('subscribe pressed - 3');
    }

    // Handles unsubscribe button click
    handleUnsubscribe() {

        this.toggleSubscribeButton(false);

        // Invoke unsubscribe method of empApi
        unsubscribe(this.subscription, (response) => {
        console.log("unsubscribe() response: ", JSON.stringify(response));
        // Response is true for successful unsubscribe
        });
    }

    toggleSubscribeButton(enableSubscribe) {
        this.isSubscribeDisabled = enableSubscribe;
        this.isUnsubscribeDisabled = !enableSubscribe;
    }

    registerErrorListener() {
        // Invoke onError empApi method
        onError((error) => {
        console.log("Received error from server: ", JSON.stringify(error));
        // Error contains the server-side error
        });
    }
}