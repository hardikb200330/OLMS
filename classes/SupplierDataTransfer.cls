public without sharing class SupplierDataTransfer {
    public without sharing class SupplierRelatedDataWrapper{
        @AuraEnabled
        public List<Tender__c> openTender;
        @AuraEnabled
        public List<BookOrders__c> supplierOrders;
        @AuraEnabled
        public List<BookOrders__c> supplierCompletedOrders;
        @AuraEnabled
        public List<Shipments__c> supplierShipments;
        @AuraEnabled
        public List<Bid__c> supplierBids;
        @AuraEnabled
        public Supplier__c supplierDetails;
        @AuraEnabled
        public List<Bid__c> supplierNewBids;

    }


    @AuraEnabled
    public static SupplierRelatedDataWrapper  getDetails(String supplierId){
        try {
            SupplierRelatedDataWrapper res = new SupplierRelatedDataWrapper();
            res.openTender = SupplierDataTransfer.getOpenTenders();
            res.supplierOrders = SupplierDataTransfer.getSupplierOrders(supplierId);
            res.supplierCompletedOrders = SupplierDataTransfer.getSupplierCompletedOrders(supplierId);
            res.supplierShipments = SupplierDataTransfer.getSupplierShipments(supplierId);
            res.supplierBids = SupplierDataTransfer.getSupplierBids(supplierId);
            res.supplierNewBids = SupplierDataTransfer.getSupplierNewBids(supplierId);
            res.supplierDetails = SupplierDataTransfer.getSupplierDetails(supplierId);

            System.debug('Sending openTender from class: ' + res.openTender);
            System.debug('Sending supplierOrders from class: ' + res.supplierOrders);
            System.debug('Sending supplierCompletedOrders from class: ' + res.supplierCompletedOrders);
            System.debug('Sending supplierShipments from class: ' + res.supplierShipments);
            System.debug('Sending supplierBids from class: ' + res.supplierBids);

            return res;
        } catch (Exception e) {
            throw new AuraHandledException('This Exception is from the SupplierDataTransfer Apex class: -- ' + e.getMessage());
        }
    }

    @AuraEnabled
    public static List<Tender__c> getOpenTenders(){
        return  [SELECT Id, Name, Book__r.Name, Quantity__c, Status__c, CreatedDate FROM Tender__c WHERE Status__c != 'Closed'];
    }

    @AuraEnabled
    public static List<BookOrders__c> getSupplierOrders(String supplierId){
       return [SELECT Id,Name, Tender__r.Book__r.Name, Tender__r.Quantity__c, Status__c FROM BookOrders__c  WHERE Tender__r.Supplier__r.SupplierId__c = :supplierId AND Status__c != 'Delivered'];
    }

    @AuraEnabled
    public static List<BookOrders__c> getSupplierCompletedOrders(String supplierId){
        return [SELECT Id, Name, Tender__r.Book__r.Name, Tender__r.Quantity__c, Status__c FROM BookOrders__c  WHERE Tender__r.Supplier__r.SupplierId__c = :supplierId AND Status__c = 'Delivered'];
    }

    @AuraEnabled
    public static List<Shipments__c> getSupplierShipments(String supplierId){
        return [SELECT Id,Name, Book_Order__r.Name, Status__c, Shipment_Quantity__c, CreatedDate FROM Shipments__c   WHERE Book_Order__r.Tender__r.Supplier__r.SupplierId__c = :supplierId];
    }

    @AuraEnabled
    public static List<Bid__c> getSupplierBids(String supplierId){
       return [SELECT Id, Name, Status__c, Tender__r.Name, Per_Copy_MRP__c, PricePerBook__c, CreatedDate FROM Bid__c WHERE Supplier__r.SupplierId__c = :supplierId AND Status__c != 'In Consideration'];
    }

    @AuraEnabled
    public static List<Bid__c> getSupplierNewBids(String supplierId){
        return [SELECT Id, Name, Status__c, Tender__r.Name, Per_Copy_MRP__c, PricePerBook__c, CreatedDate FROM Bid__c WHERE Supplier__r.SupplierId__c = :supplierId AND Status__c = 'In Consideration'];
    }

    @AuraEnabled
    public static Supplier__c getSupplierDetails(String supplierId){
        return [SELECT Id, Name, Email__c, Phone__c FROM Supplier__c WHERE SupplierId__c =: supplierId LIMIT 200];
    }

}
