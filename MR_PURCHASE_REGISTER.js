/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/format', 'N/record', 'N/search', 'N/runtime', 'N/file', 'N/log', 'N/email'],
    function (format, record, search, runtime, file, log, email) {

        var successRecords = [];
        var failedRecords = [];

        function getInputData() {
            var fileArr = [];
            var scriptObj = runtime.getCurrentScript();
            var fileId = scriptObj.getParameter({ name: 'custscript_fileid' });
            log.debug('fileId', fileId);
            var csvFile = file.load({
                id: fileId
            });
            log.debug('csvFile', csvFile);
            var csvContent = csvFile.getContents();
            var iterator = csvFile.lines.iterator();

            // Skip the first line (CSV header)
            iterator.each(function () { return false; });
            iterator.each(function (line) {
                var fields = line.value.split(',');
                log.debug('fields', fields);
                var fileObj = {
                    "ItemReceiptId": fields[0],
                    "COSTALLOCATIONMETHOD": fields[1],
                    "SOURCE": fields[2],
                    "COMM1": fields[3],
                    "INWARDFRTHANDLING": fields[4],
                    "MOQCOST": fields[5],
                    "AININWARDFREIGHT": fields[6],
                    "AINCOMMISSION1": fields[7],
                    "AINCUSTOMDUTY": fields[8],
                    "AINCLEARINGCHARGES": fields[9],
                    "AININSURANCE": fields[10],
                    "AINMOQCOST": fields[11],
                    "CUSTOMDUTY": fields[12],
                    "SALESTAX": fields[13],
                    "ATHCUSTOMDUTY": fields[14],
                    "ATHFREIGHTHANDLING": fields[15],
                    "ATHINSURANCE": fields[16],
                    "AVNDOCUMENTFEE": fields[17],
                    "AVNCUSTOMCLEARANCE": fields[18],
                    "AIDDOCUMENTFEE": fields[19],
                    "AIDDUTYHANDLING": fields[20],
                    "AIDMOQFEE": fields[21],
                    "MEMO": fields[22],
                    "IMPORTDUTYOK": fields[23],
                    "COMMOK": fields[24],
                    "FREIGHTOK": fields[25],
                    "INVOICENO": fields[26]
                };

                fileArr.push(fileObj);
                return true;
            });

            log.debug('fileArr', fileArr);
            return fileArr;
        }

        function map(context) {
            var valueS = JSON.parse(context.value);
            log.debug('valueS', valueS);
            log.debug('length of value', valueS.length);
            try {
                var itemReceiptId = valueS.ItemReceiptId;
                log.debug('itemReceiptId', itemReceiptId);
                if (itemReceiptId) {
                    var recordLoad = record.load({
                        type: 'itemreceipt',
                        id: itemReceiptId
                    });
                    var fldCOSTALLOCATIONMETHOD = valueS.COSTALLOCATIONMETHOD;
                    var fldSOURCE = valueS.SOURCE;
                    var fldCOMM1 = valueS.COMM1;
                    var fldINWARDFRTHANDLING = valueS.INWARDFRTHANDLING;
                    var fldMOQCOST = valueS.MOQCOST;
                    var fldAININWARDFREIGHT = valueS.AININWARDFREIGHT;
                    var fldAINCOMMISSION1 = valueS.AINCOMMISSION1;
                    var fldAINCUSTOMDUTY = valueS.AINCUSTOMDUTY;
                    var fldAINCLEARINGCHARGES = valueS.AINCLEARINGCHARGES;
                    var fldAININSURANCE = valueS.AININSURANCE;
                    var fldAINMOQCOST = valueS.AINMOQCOST;
                    var fldCUSTOMDUTY = valueS.CUSTOMDUTY;
                    var fldSALESTAX = valueS.SALESTAX;
                    var fldATHCUSTOMDUTY = valueS.ATHCUSTOMDUTY;
                    var fldATHFREIGHTHANDLING = valueS.ATHFREIGHTHANDLING;
                    var fldATHINSURANCE = valueS.ATHINSURANCE;
                    var fldAVNDOCUMENTFEE = valueS.AVNDOCUMENTFEE;
                    var fldAVNCUSTOMCLEARANCE = valueS.AVNCUSTOMCLEARANCE;
                    var fldAIDDOCUMENTFEE = valueS.AIDDOCUMENTFEE;
                    var fldAIDDUTYHANDLING = valueS.AIDDUTYHANDLING;
                    var fldAIDMOQFEE = valueS.AIDMOQFEE;
                    var memo = valueS.MEMO;
                    var importdutyOk = valueS.IMPORTDUTYOK;
                    var commonOk = valueS.COMMOK;
                    var freightok = valueS.FREIGHTOK;
                    var invoiceNumber = valueS.INVOICENO;

                    if (importdutyOk === 'TRUE' || importdutyOk === 'FALSE') {
                        recordLoad.setValue({
                            fieldId: 'custbody_aap_ir_import_duty',
                            value: importdutyOk === 'TRUE'
                        });
                    }

                    if (commonOk === 'TRUE' || commonOk === 'FALSE') {
                        recordLoad.setValue({
                            fieldId: 'custbody_aap_ir_cd',
                            value: commonOk === 'TRUE'
                        });
                    }

                    if (freightok === 'TRUE' || freightok === 'FALSE') {
                        recordLoad.setValue({
                            fieldId: 'custbody_aap_ir_freight',
                            value: freightok === 'TRUE'
                        });
                    }

                    if (invoiceNumber) {
                        recordLoad.setValue({
                            fieldId: 'custbody_aap_bill_inv',
                            value: invoiceNumber
                        });
                    }

                    if (fldCOSTALLOCATIONMETHOD) {
                        recordLoad.setValue({
                            fieldId: 'landedcostmethod',
                            value: fldCOSTALLOCATIONMETHOD
                        });
                    }
                    if (fldCOMM1) {
                        recordLoad.setValue({
                            fieldId: 'landedcostamount1',
                            value: fldCOMM1
                        });
                    }
                    if (fldINWARDFRTHANDLING) {
                        recordLoad.setValue({
                            fieldId: 'landedcostamount2',
                            value: fldINWARDFRTHANDLING
                        });
                    }

                    if (fldMOQCOST) {
                        recordLoad.setValue({
                            fieldId: 'landedcostamount3',
                            value: fldMOQCOST
                        });
                    }

                    if (fldAININWARDFREIGHT) {
                        recordLoad.setValue({
                            fieldId: 'landedcostamount4',
                            value: fldAININWARDFREIGHT
                        });
                    }

                    if (fldAINCOMMISSION1) {
                        recordLoad.setValue({
                            fieldId: 'landedcostamount5',
                            value: fldAINCOMMISSION1
                        });
                    }

                    if (fldAINCUSTOMDUTY) {
                        recordLoad.setValue({
                            fieldId: 'landedcostamount6',
                            value: fldAINCUSTOMDUTY
                        });
                    }
                    if (fldAINCLEARINGCHARGES) {
                        recordLoad.setValue({
                            fieldId: 'landedcostamount7',
                            value: fldAINCLEARINGCHARGES
                        });
                    }

                    if (fldAININSURANCE) {
                        recordLoad.setValue({
                            fieldId: 'landedcostamount8',
                            value: fldAININSURANCE
                        });
                    }

                    if (fldAINMOQCOST) {
                        recordLoad.setValue({
                            fieldId: 'landedcostamount9',
                            value: fldAINMOQCOST
                        });
                    }

                    if (fldCUSTOMDUTY) {
                        recordLoad.setValue({
                            fieldId: 'landedcostamount10',
                            value: fldCUSTOMDUTY
                        });
                    }

                    if (fldSALESTAX) {
                        recordLoad.setValue({
                            fieldId: 'landedcostamount12',
                            value: fldSALESTAX
                        });
                    }

                    if (fldATHCUSTOMDUTY) {
                        recordLoad.setValue({
                            fieldId: 'landedcostamount13',
                            value: fldATHCUSTOMDUTY
                        });
                    }

                    if (fldATHFREIGHTHANDLING) {
                        recordLoad.setValue({
                            fieldId: 'landedcostamount14',
                            value: fldATHFREIGHTHANDLING
                        });
                    }
                    if (fldATHINSURANCE) {
                        recordLoad.setValue({
                            fieldId: 'landedcostamount15',
                            value: fldATHINSURANCE
                        });
                    }

                    if (fldAVNDOCUMENTFEE) {
                        recordLoad.setValue({
                            fieldId: 'landedcostamount16',
                            value: fldAVNDOCUMENTFEE
                        });
                    }

                    if (fldAVNCUSTOMCLEARANCE) {
                        recordLoad.setValue({
                            fieldId: 'landedcostamount17',
                            value: fldAVNCUSTOMCLEARANCE
                        });
                    }

                    if (fldAIDDOCUMENTFEE) {
                        recordLoad.setValue({
                            fieldId: 'landedcostamount19',
                            value: fldAIDDOCUMENTFEE
                        });
                    }

                    if (fldAIDDUTYHANDLING) {
                        recordLoad.setValue({
                            fieldId: 'landedcostamount20',
                            value: fldAIDDUTYHANDLING
                        });
                    }

                    if (fldAIDMOQFEE) {
                        recordLoad.setValue({
                            fieldId: 'landedcostamount21',
                            value: fldAIDMOQFEE
                        });
                    }
                    if (memo) {
                        recordLoad.setValue({
                            fieldId: 'memo',
                            value: memo
                        });
                    }
                    var recId = recordLoad.save({
                        enableSourcing: true,
                        ignoreMandatoryFields: true
                    });
                    log.debug('recId', recId);

                    // Add to success records
                    successRecords.push(valueS);
                }
            } catch (error) {
                log.error('Error in map function', error.message);
                // Log the failed record and the specific field that caused the error
                failedRecords.push({
                    itemReceiptId: valueS.ItemReceiptId,
                    field: error.fieldId,  // Assuming you capture the fieldId that caused the error
                    error: error.message
                });

                context.write({
                    key: "fdata", value: {
                        'itemReceiptId': valueS.ItemReceiptId,
                        'field': error.fieldId,  // Assuming you capture the fieldId that caused the error
                        'error': error.message
                    }
                });
            }
        }

        function reduce(context) {
            // Implement reduce logic if needed
            log.debug("context.values", context.values)

            var aggregatedData = [];
            var aggregatedfield = [];
            var aggregatederror = [];

            context.values.forEach(function (value) {
                var parsedValue = JSON.parse(value); // Parse JSON string to object

                // Example aggregation logic - accumulate counts or sums
                if (!aggregatedData.itemReceiptId) {
                    aggregatedData.itemReceiptId = [];
                    aggregatedfield.field = [];
                    aggregatederror.error = [];
                }
                aggregatedData.itemReceiptId.push(parsedValue.itemReceiptId);
                aggregatedfield.field.push(parsedValue.field);
                aggregatederror.error.push(parsedValue.error);

            });

            log.debug("aggregatedData.length", aggregatedData.length)

            var itemReceiptIdvalues = aggregatedData.itemReceiptId || [];
            log.debug("itemReceiptIdvalues", itemReceiptIdvalues)

            var errorvalues = aggregatederror.error || [];
            log.debug("errorvalues", errorvalues)

            var fieldvalues = aggregatedfield.field || [];
            log.debug("fieldvalues", fieldvalues)

            var csvcontent = 'ItemReceiptId,FieldId,ErrorMessage\n';  
            csvcontent += itemReceiptIdvalues.join(',') + ',' + fieldvalues.join(',') + ',' + errorvalues.join(',') + '\n';

            var scriptObj = runtime.getCurrentScript();
            var currentUser = runtime.getCurrentUser().id;
            var recipientEmail = runtime.getCurrentUser().email;
            log.debug('recipientEmail', recipientEmail);

            var failureFile = file.create({
                name: 'FailedRecords.csv',
                fileType: file.Type.CSV,
                contents: csvcontent
            });
            log.debug('failureFile', failureFile);
            
            email.send({
                author: currentUser,
                recipients: recipientEmail,
                subject: 'Map/Reduce Script Results',
                body: 'Please find the attached CSV files for the failed records.',
                attachments: [failureFile]

            });
            log.debug('success', 'success');
        }

        return {
            getInputData: getInputData,
            map: map,
            reduce: reduce,
            //  summarize: summarize
        };
    });
