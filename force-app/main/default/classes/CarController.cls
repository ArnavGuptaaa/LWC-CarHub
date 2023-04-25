public with sharing class CarController {
    public class Filters {
        @AuraEnabled
        public String searchKey {get; set;}

        @AuraEnabled
        public Decimal maxPrice {get; set;}

        @AuraEnabled
        public String[] categories {get; set;}

        @AuraEnabled
        public String[] makeType {get; set;}
    }

    @AuraEnabled(cacheable=true)
    public static List<Car__c> getCars(Filters filters) {
        String whereClause = '';
        String query, searchkey, key;
        String[] criteria = new List<String>();
        String[] categories, makeType = new List<String>();
        
        if(filters != null) {
            // Create a new variable??
            // Gives null pointer exception otherwise
            searchkey = filters.searchKey;
            if(!String.isEmpty(searchKey)){
                key = '%' + searchKey + '%';
                criteria.add('Name LIKE :key');
            }

            if(filters.maxPrice >= 0) {
                criteria.add('MSRP__c <= ' + filters.maxPrice);
            }

            if(filters.categories != null) {
                categories = filters.categories;
                criteria.add('Category__c IN :categories');
            }

            if(filters.makeType != null) {
                makeType = filters.makeType;
                criteria.add('Make__c IN :makeType');
            }
        }

        // creating where clause
        if(!criteria.isEmpty()) {
            whereClause = ' WHERE ' + String.join(criteria, ' AND ');
        }

        query = 'SELECT Id, Name, Picture_URL__c, MSRP__c FROM Car__c' + whereClause + ' WITH SECURITY_ENFORCED ' + ' ORDER BY Name';
        
        System.debug(query);
        return Database.query(query);
    }

    @AuraEnabled(cacheable=true)
    public static List<Car__c> getSimilarCars(Id recordId, List<String> makeType) {
        System.debug(recordId);
        System.debug(makeType);

        return [
            SELECT Id, Name, Picture_URL__c, MSRP__c, Make__c
            FROM Car__c 
            WHERE Make__c IN :makeType 
            AND Id != :recordId
        ];
    }
}