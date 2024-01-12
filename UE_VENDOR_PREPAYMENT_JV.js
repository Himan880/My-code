/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record'],
    function(record) {
        function beforeSubmit(scriptContext) {
            if (scriptContext.type === scriptContext.UserEventType.CREATE) {
                var objRecord = scriptContext.newRecord;
              // 	let sectionId = scriptContext.newRecord.id;
                let customerId = objRecord.getValue({
                    fieldId: 'entity'
                });
                let tdsAmt = objRecord.getValue({
                    fieldId: 'custbody_vendor_prepayment'
                });
				let vendorStatus = objRecord.getValue({
                    fieldId: 'approvalstatus'
                });
				log.debug ('vendorStatus',vendorStatus);
				
				let sectionActId = objRecord.getValue({
				fieldId : "custbody_vebdorprepayment_"
				})
                log.debug('sectionActId', sectionActId);
				let subsidiary = objRecord.getValue({
				fieldId : "subsidiary"
				})
			    let sectionLoad = record.load({
				type: "customrecord_in_tds_setup",
				id : sectionActId
				});
				log.debug ('sectionLoad',sectionLoad);
				
			
				
                if (tdsAmt || vendorStatus == 2) {
                    let creditAcc = objRecord.getValue({
                        fieldId: 'account'
                    });
                    log.debug('creditAcc', creditAcc);
					let tdsAccount = sectionLoad.getValue({
						fieldId : 'custrecordcust_account_code'
					})
                    let vendorPrepaymentRecord = record.create({
                        type: 'journalentry',
                        isDynamic: true
                    });
                    log.debug('vendorPrepaymentRecord', vendorPrepaymentRecord);
					vendorPrepaymentRecord.setValue({
                        fieldId : 'subsidiary',
                        value: subsidiary
                    });
					vendorPrepaymentRecord.setValue({
                        fieldId : 'memo',
                        value: 'Vendor Prepayment'
                    });	
                    vendorPrepaymentRecord.selectLine({
                        sublistId: 'line',
                        line: 0
                    });
                    vendorPrepaymentRecord.setCurrentSublistValue({
                        sublistId: 'line',
                        fieldId: 'account',
                        value: tdsAccount
                    });
					log.debug('vendorPrepaymentRecord',vendorPrepaymentRecord);
                    vendorPrepaymentRecord.setCurrentSublistValue({
                        sublistId: 'line',
                        fieldId: 'debit',
                        value: tdsAmt
                    });
                    vendorPrepaymentRecord.setCurrentSublistValue({
                        sublistId: 'line',
                        fieldId: 'entity',
                        value: customerId
                     });
					  vendorPrepaymentRecord.setCurrentSublistValue({
                        sublistId: 'line',
                        fieldId: 'memo',
                        value: 'Vendor Prepayment'
                     });
                    vendorPrepaymentRecord.commitLine({
                        sublistId: 'line'
                    });

                    // Set line 1 (Apply sublist)
                    vendorPrepaymentRecord.selectLine({
                        sublistId: 'line',
						line : 1
                    });
					 vendorPrepaymentRecord.setCurrentSublistValue({
                        sublistId: 'line',
                        fieldId: 'account',
                        value: creditAcc
                    });
                    vendorPrepaymentRecord.setCurrentSublistValue({
                        sublistId: 'line',
                        fieldId: 'credit',
                        value: tdsAmt
                    });
                   vendorPrepaymentRecord.setCurrentSublistValue({
                        sublistId: 'line',
                        fieldId: 'entity',
                        value: customerId
                     });
					 vendorPrepaymentRecord.setCurrentSublistValue({
                        sublistId: 'line',
                        fieldId: 'memo',
                        value: 'Vendor Prepayment'
                     });
                    vendorPrepaymentRecord.commitLine({
                        sublistId: 'line'
                    });
					log.debug('vendorPrepaymentRecord',vendorPrepaymentRecord);

                    let vendorPrepaymentId = vendorPrepaymentRecord.save();
                    log.debug('vendorPrepaymentId', vendorPrepaymentId);
                    objRecord.setValue({
                        fieldId: 'custbody_journal_entry',
                        value: vendorPrepaymentId,
                        ignoreFieldChange: true,
                        forceSyncSourcing: true
                    });
                }
            }
        }
        return {
            beforeSubmit: beforeSubmit
        };
    });
