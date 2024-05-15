public without sharing class MemberDataTransfer {
    public without sharing class MemberWithTransaction{
        @AuraEnabled
        public Member__c member;
        @AuraEnabled
        public List<Book_Transaction__c> transactions;
    }


    @AuraEnabled
    public static MemberWithTransaction  getDetails(String memberId){
        try {
            MemberWithTransaction res = new MemberWithTransaction();
            res.member = [SELECT Id, Email__c, Name, CurrentlyIssuedBooks__c, DueFine__c, NotReturnedBooks__c FROM Member__c WHERE MemberId__c = :memberId LIMIT 1];
            res.transactions = [SELECT Name, Book__r.Name, Member__r.Name, Issued_Date__c, Fine__c, Status__c FROM Book_Transaction__c  WHERE Member__r.MemberId__c  =: memberId AND Status__c != 'Returned'];
            System.debug('Sending this name from class: ' + res.member);
            System.debug('Sending Transactions from class: ' + res.transactions);
            return res;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}