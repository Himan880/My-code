/**
 *@NApiVersion 2.1
 *@NScriptType UserEventScript
 */

define(['N/record', 'N/query'], function(record, query) {

    function afterSubmit(context) {
        try {
            if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.EDIT) {
                var newRecordObj = context.newRecord;
                log.debug('newRecordObj', newRecordObj);
                log.debug('newRecordtype', newRecordObj.type);
                var objId = newRecordObj.id;

                log.debug('objId', objId);
                if (newRecordObj.type === record.Type.ITEM_RECEIPT) {

                    var PoId = newRecordObj.getValue({
                        fieldId: 'createdfrom'
                    });
                    log.debug('PoId', PoId);

                    var objVBN = newRecordObj.getValue({
                        fieldId: 'custbody_vendor_bill_no'
                    });
                    log.debug('objVBN', objVBN);

                    var objVBD = newRecordObj.getValue({
                        fieldId: 'custbody_vendor_bill_dt'
                    });
                    log.debug('objVBD', objVBD);

                    var vendorObj = newRecordObj.getValue({
                        fieldId: 'entity'
                    });
                    getitemReceiptItem(objId)

                    //Create a Vendor Bill based on the Item Receipt
                    var vendorBillObj = record.transform({
                        fromType: 'purchaseorder',
                        fromId: PoId,
                        toType: 'vendorbill',
                        isDynamic: true
                    });
                    log.debug('vendorBillObj', vendorBillObj);

                    // vendorBillObj.setValue({
                    // fieldId: 'entity',
                    // value: vendorObj 
                    // });

                    vendorBillObj.setValue({
                        fieldId: 'tranid',
                        value: objVBN
                    });
                    vendorBillObj.setValue({
                        fieldId: 'custbody_vendor_bill_no',
                        value: objVBN
                    });

                    vendorBillObj.setValue({
                        fieldId: 'custbody_vendor_bill_dt',
                        value: objVBD
                    });
                    let sublistCount = vendorBillObj.getLineCount({
                        sublistId: 'item'
                    });
                    log.debug('sublistCount', sublistCount);
                    if (sublistCount > 0) {
                        for (let i = sublistCount - 1; i >= 0; i--) {
                            vendorBillObj.removeLine({
                                sublistId: 'item',
                                line: i,
                                ignoreRecalc: true
                            });
                        }
                    }

                    let getFunction = getitemReceiptItem(objId);
                    log.debug('getFunction', getFunction);
                    let lengthofQuery = getFunction.length;
                    //alert('lengthofQuery'+lengthofQuery);

                    if (lengthofQuery > 0) {
                        for (let qCount = 0; qCount < lengthofQuery; qCount++) {

                            let itemId = getFunction[qCount].item;
                            log.debug('itemId', itemId);
                            let itemRate = getFunction[qCount].rate;
                            let itemQuantity = getFunction[qCount].quantity;
                            let itemUnit = getFunction[qCount].units;
                            vendorBillObj.selectLine({
                                sublistId: 'item',
                                line: qCount
                            });
                            vendorBillObj.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'item',
                                value: itemId
                            });
                            vendorBillObj.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'quantity',
                                value: itemQuantity
                            })
                            vendorBillObj.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'rate',
                                value: itemRate
                            })
                            vendorBillObj.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'units',
                                value: itemUnit
                            })
                            vendorBillObj.commitLine({
                                sublistId: 'item'
                            })
                        }
                    }




                    var vendorBillId = vendorBillObj.save();

                    log.debug('Vendor Bill Created', 'Vendor Bill ID: ' + vendorBillId);


                }



                function getitemReceiptItem(objId) {
                    return query.runSuiteQL(

                        `SELECT 
  BUILTIN_RESULT.TYPE_INTEGER(transactionLine.item) AS item, 
  BUILTIN_RESULT.TYPE_FLOAT(transactionLine.quantity) AS quantity, 
  BUILTIN_RESULT.TYPE_INTEGER(transactionLine.units) AS units, 
  BUILTIN_RESULT.TYPE_CURRENCY(transactionLine.rate, BUILTIN.CURRENCY(transactionLine.rate)) AS rate
FROM 
  TRANSACTION, 
  transactionLine
WHERE 
  TRANSACTION.ID = transactionLine.TRANSACTION
   AND ((NVL(transactionLine.taxline, 'F') = 'F' AND TRANSACTION.TYPE IN ('ItemRcpt') AND TRANSACTION.ID IN (${objId}) AND NVL(transactionLine.mainline, 'F') = 'F' AND transactionLine.quantity IS NOT NULL))


`).asMappedResults();


                }
            }
        } catch (ex) {
            log.debug(ex.message);
        }

    }

    return {
        afterSubmit: afterSubmit
    };

});