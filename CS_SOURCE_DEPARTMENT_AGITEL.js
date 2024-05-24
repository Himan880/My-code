define(['N/record', 'N/search', 'N/log'], function(record, search, log) {
    /**
     *@NApiVersion 2.x
     *@NScriptType ClientScript
     */

    function fieldChanged(context) {
        try {
            var currentRecord = context.currentRecord;
            var sublistName = context.sublistId;
            var sublistFieldName = context.fieldId;
            var recordType = currentRecord.type;
            var subsidiaryId = currentRecord.getValue({
                fieldId: 'subsidiary'
            });

            if (sublistName == 'line' && recordType == 'journalentry' && subsidiaryId == 2 && context.fieldId == 'entity') {
                var clientID = currentRecord.getCurrentSublistValue({
                    sublistId: 'line',
                    fieldId: 'entity'
                });

                var deptSearch = search.create({
                    type: 'customer',
                    filters: [
                        ['internalid', 'is', clientID]
                    ],
                    columns: ['custentityagital_customer_department']
                });

                var searchResult = deptSearch.run().getRange({
                    start: 0,
                    end: 1
                });

                if (searchResult.length > 0) {
                    var clientDept = searchResult[0].getValue('custentityagital_customer_department');

                    if (clientDept) {
                        currentRecord.setCurrentSublistValue({
                            sublistId: 'line',
                            fieldId: 'department',
                            value: clientDept,
                            ignoreFieldChange: true,
                            forceSyncSourcing: true
                        });
                    }
                }
                return true;
            }
			
            if ((recordType == 'salesorder' || recordType == 'invoice' || recordType == 'creditmemo') && subsidiaryId == 2 && context.fieldId == 'entity') {
                var clientID = currentRecord.getValue({
                    fieldId: 'entity'
                });

                var deptSearch = search.create({
                    type: 'customer',
                    filters: [
                        ['internalid', 'is', clientID]
                    ],
                    columns: ['custentityagital_customer_department']
                });

                var searchResult = deptSearch.run().getRange({
                    start: 0,
                    end: 1
                });

                if (searchResult.length > 0) {
                    var clientDept = searchResult[0].getValue('custentityagital_customer_department');
                    currentRecord.setValue({
                        fieldId: 'department',
                        value: clientDept,
                        ignoreFieldChange: true,
                        forceSyncSourcing: true
                    });

                }
                return true;
            }

        } catch (e) {
            log.error('Error in fieldChanged function', e.message);
        }
        return true;
    }

    function postSourcing(context) {
        try {
            var currentRecord = context.currentRecord;
            var sublistName = context.sublistId;
            var sublistFieldName = context.fieldId;
            var subsidiaryId = currentRecord.getValue({
                fieldId: 'subsidiary'
            });
            var recordType = currentRecord.type;

            if (context.fieldId === 'subsidiary') {
                var custId = currentRecord.getValue({
                    fieldId: 'customer'
                });

                if (!custId) {
                    log.error('Error', 'Customer ID is not available');
                    return;
                }

                var custDep;
                var customerSearchObj = search.create({
                    type: "customer",
                    filters: [
                        ["internalid", "anyof", custId]
                    ],
                    columns: [
                        search.createColumn({
                            name: "custentityagital_customer_department",
                            label: "Client Department"
                        })
                    ]
                });

                var searchResultCount = customerSearchObj.runPaged().count;
                log.debug("customerSearchObj result count", searchResultCount);

                if (searchResultCount > 0) {
                    customerSearchObj.run().each(function(result) {
                        custDep = result.getValue({
                            name: "custentityagital_customer_department"
                        });
                        return true;
                    });

                    if (custDep) {
                        currentRecord.setValue({
                            fieldId: 'department',
                            value: custDep,
                            ignoreFieldChange: true
                        });

                    }
                }
            }
            if ((recordType == 'salesorder' || recordType == 'invoice' || recordType == 'creditmemo') && context.sublistId === 'item') {
                var clientID = currentRecord.getValue({
                    fieldId: 'entity'
                });

                var deptSearch = search.create({
                    type: 'customer',
                    filters: [
                        ['internalid', 'is', clientID]
                    ],
                    columns: ['custentityagital_customer_department']
                });

                var searchResult = deptSearch.run().getRange({
                    start: 0,
                    end: 1
                });

                if (searchResult.length > 0) {
                    var clientDept = searchResult[0].getValue('custentityagital_customer_department');


                    var objField = currentRecord.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'department'
                    });

                    objField.defaultValue = clientDept
                    currentRecord.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'department',
                        value: clientDept,
                        ignoreFieldChange: true,
                        forceSyncSourcing: true
                    });

                    return true;
                }
            }

        } catch (e) {
            log.error('Error in postSourcing function', e.message);
        }
    }


    return {
        fieldChanged: fieldChanged,
        postSourcing: postSourcing
    };
});