import { LightningElement } from 'lwc';
import img from "@salesforce/resourceUrl/LoginPageImage"; 
export default class ImageLWC extends LightningElement {
    image = '/ip/s/sfsites/c/resource/1715326943000/LoginPageImage'
    connectedCallback() {
        console.log(this.image);
    }
}