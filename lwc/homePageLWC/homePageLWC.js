import { LightningElement } from 'lwc';
import supplierImg from "@salesforce/resourceUrl/SupplierImage";
import memberImg from "@salesforce/resourceUrl/MemberImage";
export default class HomePageLWC extends LightningElement {
    sImg = supplierImg;
    mImg = memberImg;
}