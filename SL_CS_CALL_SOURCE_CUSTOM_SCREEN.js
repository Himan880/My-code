/**
 *@NApiVersion 2.1
 *@NScriptType Suitelet
 */
 define(['N/record', 'N/render', 'N/search', 'N/ui/serverWidget', 'N/format'], function(record, render, search, serverWidget, format) {
    function onRequest(context) {
        try {
            var form = serverWidget.createForm({
                title: 'Item Inspection',
                hideNavBar: true
            });
            form.clientScriptModulePath = 'SuiteScripts/CS_ITEM_INSPECTION_SCREEN.js';
            var getToDateParam = context.request.parameters.custparam_toDate;
            log.debug('getToDateParam', getToDateParam);
            var getFromDate = context.request.parameters.custparam_fromDate;
            log.debug('getFromDate', getFromDate);
            var getDocType = context.request.parameters.custparam_doctype;
            log.debug('getDocType', getDocType);
            var getSubsidiary = context.request.parameters.custparam_subsidiary;
            log.debug('getSubsidiary', getSubsidiary);
            var getlocation = context.request.parameters.custparam_location;
            log.debug('getlocation', getlocation);
            var getitemCode = context.request.parameters.custparam_itemcode;
            log.debug('getitemCode', getitemCode);
            var getStatus = context.request.parameters.custparam_qc_status;
            log.debug('getStatus', getStatus);
            var fromDAte = form.addField({
                id: 'custpage_fromdate',
                type: serverWidget.FieldType.DATE,
                label: 'From Date'
            });
            fromDAte.isMandatory = true;
            if (getFromDate) {
                var formattedDateString = format.format({
                    value: getFromDate,
                    type: format.Type.DATE
                });
                fromDAte.defaultValue = formattedDateString;
            } else {
                const fromdate = new Date();
				log.debug('fromdate',fromdate);
			
                // let fromday = fromdate.getDate();
                // let frommonth = fromdate.getMonth() + 1;
                // let fromyear = fromdate.getFullYear();
                // var fromFullDay = fromday + '/' + frommonth + '/' + fromyear;
                var formattedDateString = format.parse({
                    value: fromdate,
                    type: format.Type.DATE,
					timezone: format.Timezone.ASIA_CALCUTTA
                });
				log.debug('formattedDateString',formattedDateString);
                fromDAte.defaultValue = formattedDateString;
            }
            var toDate = form.addField({
                id: 'custpage_todate',
                type: serverWidget.FieldType.DATE,
                label: 'To Date '
            });
            toDate.isMandatory = true;
            if (getToDateParam) {
                var formattedDateString1 = format.format({
                    value: getToDateParam,
                    type: format.Type.DATE
                });
                toDate.defaultValue = formattedDateString1;
            } else {
                const todate = new Date();
				// let indianTimeto = todate.toLocaleString("en-US", "Asia/Delhi");
				// log.debug('indianTimeto',indianTimeto);
                // let totoday = todate.getDate();
                // let tomonth = todate.getMonth() + 1;
                // let toyear = todate.getFullYear();
                // var toFullDay = totoday + '/' + tomonth + '/' + toyear;
                // log.debug('toFullDay', toFullDay);
                var formattedDateString1 = format.parse({
                    value: todate,
                    type: format.Type.DATE,
					timezone: format.Timezone.ASIA_CALCUTTA
                });
                toDate.defaultValue = formattedDateString1;

            }
            //toDate.defaultValue = getToDateParam;
            var qcDocType = form.addField({
                id: 'custpage_doctype',
                type: serverWidget.FieldType.SELECT,
                label: 'Document Type'
            });
            qcDocType.isMandatory = true;
		
            qcDocType.addSelectOption({
                value: 'itemreceipt',
                text: 'Item Receipt'
            });
            // qcDocType.addSelectOption({
                // value: 'itemfulfillment',
                // text: 'Item Fulfilment'
            // });
            qcDocType.addSelectOption({
                value: 'assemblybuild',
                text: 'Build Assembly'
            });
			qcDocType.defaultValue = getDocType;
			
			
            var qcSubsidiary = form.addField({
                id: 'custpage_subsidiary',
                type: serverWidget.FieldType.SELECT,
                label: 'SUBSIDIARY',
                source: 'subsidiary'
            });
            qcSubsidiary.defaultValue = getSubsidiary
            var qcLocation = form.addField({
                id: 'custpage_location',
                type: serverWidget.FieldType.SELECT,
                label: 'LOCATION',
                source: 'location'
            });
            qcLocation.defaultValue = getlocation
            var qcItemCode = form.addField({
                id: 'custpage_itemcode',
                type: serverWidget.FieldType.SELECT,
                label: 'ITEM Code',
                source: 'item'
            });
            qcItemCode.defaultValue = getitemCode
            var qcParamterstatus = form.addField({
                id: 'custpage_status',
                type: serverWidget.FieldType.SELECT,
                label: 'STATUS'
            });
            qcParamterstatus.addSelectOption({
                value: '1',
                text: 'Pending'
            });
            qcParamterstatus.addSelectOption({
                value: '2 ',
                text: 'Process'
            });
            form.addButton({
                id: 'custpage_load',
                label: 'Load',
                functionName: 'load'
            })
            

            if (getToDateParam && getDocType != 'assemblybuild') {

                var sublist = form.addSublist({
                    id: 'custpage_item_sublist',
                    type: serverWidget.SublistType.STATICLIST,
                    label: ' '
                });
                var checkboxFld = sublist.addField({
                    id: 'custpage_checkbox',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: 'QC RESULT'
                });
                //checkboxFld.defaultValue = qcLink;
                var documentType = sublist.addField({
                    id: 'custpage_document',
                    type: serverWidget.FieldType.TEXT,
                    label: 'DOCUMENT TYPE'
                });
                var documentNumber = sublist.addField({
                    id: 'custpage_number',
                    type: serverWidget.FieldType.TEXT,
                    label: 'DOCUMENT NUMBER'
                });
                var documentdate = sublist.addField({
                    id: 'custpage_date',
                    type: serverWidget.FieldType.TEXT,
                    label: 'DOCUMENT DATE'
                });
                var itemCode = sublist.addField({
                    id: 'custpage_itemcodelist',
                    type: serverWidget.FieldType.TEXT,
                    label: 'ITEM CODE'
                });
                var itemName = sublist.addField({
                    id: 'custpage_itemname',
                    type: serverWidget.FieldType.TEXT,
                    label: 'ITEM NAME'
                });
                var itemQty = sublist.addField({
                    id: 'custpage_qty',
                    type: serverWidget.FieldType.TEXT,
                    label: 'QUANTITY'
                });
                var vendorCode = sublist.addField({
                    id: 'custpage_vendorcode',
                    type: serverWidget.FieldType.TEXT,
                    label: 'VENDOR CODE'
                });
                var vendorName = sublist.addField({
                    id: 'custpage_vendorname',
                    type: serverWidget.FieldType.TEXT,
                    label: 'VENDOR NAME'
                });
                var locationdoc = sublist.addField({
                    id: 'custpage_location',
                    type: serverWidget.FieldType.TEXT,
                    label: 'LOCATION'
                });
                var statusDoc = sublist.addField({
                    id: 'custpage_status',
                    type: serverWidget.FieldType.TEXT,
                    label: 'STATUS'
                });
                var serialLot = sublist.addField({
                    id: 'custpage_seriallot',
                    type: serverWidget.FieldType.TEXT,
                    label: 'SERIAL/LOT'
                });
				var recType;
				if(getDocType == 'itemreceipt'){
					recType = 'ItemRcpt'
				}
				if(getDocType == 'itemfulfillment'){
					recType = 'ItemShip'
				}
				
				
                var serialLotNumber;
                var serialLotNumberArr = [];
                var serialLotNumberArrtoString;
                var itemreceiptSearchObj = search.create({
                    type: getDocType,
                    filters: [
                        ["type", "anyof", recType],
                        "AND",
                        ["trandate", "within", getFromDate, getToDateParam],
                        "AND",
                        ["mainline", "is", "F"],
                        "AND",
                        ["custcol_used_serial_lot_number", "isnotempty", ""]
                    ],
                    columns: [
                        search.createColumn({
                            name: "custcol_used_serial_lot_number",
                            label: "Used Serial Lot Number"
                        })
                    ]
                });
                var searchResultCount = itemreceiptSearchObj.runPaged().count;
                log.debug("itemreceiptSearchObj result count", searchResultCount);
                itemreceiptSearchObj.run().each(function(result) {
                    serialLotNumber = result.getValue({
                        name: "custcol_used_serial_lot_number"
                    })
                    serialLotNumberArr.push(serialLotNumber);
                    // .run().each has a limit of 4,000 results
                    return true;
                });
                serialLotNumberArr = "" + serialLotNumberArr;
                if (serialLotNumberArr) {
                    var serialLotNumberArrtoString = serialLotNumberArr.split(",");
                }
                log.debug('serialLotNumberArrtoString', serialLotNumberArrtoString);
                var filter = [];
                if (getFromDate && getToDateParam && getSubsidiary && getlocation && getitemCode) {
                    filter.push(["type", "anyof", recType]);
                    filter.push("AND");
                    filter.push(["mainline", "is", "F"]);
                    if (serialLotNumberArrtoString) {
                        filter.push("AND");

                        filter.push(["inventorydetail.inventorynumber", "noneof", serialLotNumberArrtoString]);
                    }
                    filter.push("AND");
                    filter.push(["item.custitem_is_qualitycheck_required", "is", "T"]);
                    filter.push("AND")
                    filter.push(["trandate", "within", getFromDate, getToDateParam]);
                    filter.push("AND");
                    filter.push(["subsidiary", "anyof", getSubsidiary]);
                    filter.push("AND");
                    filter.push(["location", "anyof", getlocation]);
                    filter.push("AND");
                    filter.push(["item", "anyof", getitemCode]);
                } else if (getFromDate && getToDateParam && getSubsidiary && getlocation) {
                    filter.push(["type", "anyof", recType]);
                    filter.push("AND");
                    filter.push(["mainline", "is", "F"]);
                    if (serialLotNumberArrtoString) {
                        filter.push("AND");
                        filter.push(["inventorydetail.inventorynumber", "noneof", serialLotNumberArrtoString]);
                    }
                    filter.push("AND");
                    filter.push(["item.custitem_is_qualitycheck_required", "is", "T"]);
                    filter.push("AND")
                    filter.push(["trandate", "within", getFromDate, getToDateParam]);
                    filter.push("AND");
                    filter.push(["subsidiary", "anyof", getSubsidiary]);
                    filter.push("AND");
                    filter.push(["location", "anyof", getlocation]);
                } else if (getFromDate && getToDateParam && getitemCode) {
                    filter.push(["type", "anyof", recType]);
                    filter.push("AND");
                    filter.push(["mainline", "is", "F"]);
                    if (serialLotNumberArrtoString) {
                        filter.push("AND");

                        filter.push(["inventorydetail.inventorynumber", "noneof", serialLotNumberArrtoString]);
                    }
                    filter.push("AND");
                    filter.push(["item.custitem_is_qualitycheck_required", "is", "T"]);
                    filter.push("AND")
                    filter.push(["trandate", "within", getFromDate, getToDateParam]);
                    filter.push("AND");
                    filter.push(["item", "anyof", getitemCode]);
                } else if (getFromDate && getToDateParam && getSubsidiary) {
                    filter.push(["type", "anyof", recType]);
                    filter.push("AND");
                    filter.push(["mainline", "is", "F"]);
                    if (serialLotNumberArrtoString) {
                        filter.push("AND");

                        filter.push(["inventorydetail.inventorynumber", "noneof", serialLotNumberArrtoString]);
                    }
                    filter.push("AND");
                    filter.push(["item.custitem_is_qualitycheck_required", "is", "T"]);
                    filter.push("AND")
                    filter.push(["trandate", "within", getFromDate, getToDateParam]);
                    filter.push("AND");
                    filter.push(["subsidiary", "anyof", getSubsidiary]);
                } else if (getFromDate && getToDateParam && getlocation) {
                    filter.push(["type", "anyof", recType]);
                    filter.push("AND");
                    filter.push(["mainline", "is", "F"]);
                    if (serialLotNumberArrtoString) {
                        filter.push("AND");

                        filter.push(["inventorydetail.inventorynumber", "noneof", serialLotNumberArrtoString]);
                    }
                    filter.push("AND");
                    filter.push(["item.custitem_is_qualitycheck_required", "is", "T"]);
                    filter.push("AND")
                    filter.push(["trandate", "within", getFromDate, getToDateParam]);
                    filter.push("AND");
                    filter.push(["location", "anyof", getlocation]);
                } else {
                    filter.push(["type", "anyof", recType]);
                    filter.push("AND");
                    filter.push(["mainline", "is", "F"]);
                    if (serialLotNumberArrtoString) {
                        filter.push("AND");

                        filter.push(["inventorydetail.inventorynumber", "noneof", serialLotNumberArrtoString]);
                    }
                    filter.push("AND");
                    filter.push(["item.custitem_is_qualitycheck_required", "is", "T"]);
                    filter.push("AND")
                    filter.push(["trandate", "within", getFromDate, getToDateParam]);
                }

                log.debug('filter', filter);
                var itemreceiptSearchObj = search.create({
                    type: getDocType,
                    filters: filter,
                    columns: [
                        search.createColumn({
                            name: "type",
                            label: "Type"
                        }),
                        search.createColumn({
                            name: "tranid",
                            label: "Document Number"
                        }),
                        search.createColumn({
                            name: "trandate",
                            label: "Date"
                        }),
                        search.createColumn({
                            name: "displayname",
                            join: "item",
                            label: "Description"
                        }),
                        search.createColumn({
                            name: "item",
                            label: "Item"
                        }),
                        search.createColumn({
                            name: "quantity",
                            label: "Quantity"
                        }),
                        search.createColumn({
                            name: "altname",
                            join: "vendor",
                            label: "Name"
                        }),
                        search.createColumn({
                            name: "entityid",
                            join: "vendor",
                            label: "ID"
                        }),
                        search.createColumn({
                            name: "location",
                            label: "Location"
                        }),
                        search.createColumn({
                            name: "type",
                            join: "item",
                            label: "Type"
                        }),
                        search.createColumn({
                            name: "subsidiary",
                            label: "Subsidiary"
                        }),
                        search.createColumn({
                            name: "custcol_qc_quantity",
                            label: "QC Quantity"
                        }),
                        search.createColumn({
                            name: "custitem_is_qc_searlized",
                            join: "item",
                            label: "Is QC Serailized"
                        }),
                        search.createColumn({
                            name: "inventorynumber",
                            join: "inventoryDetail",
                            label: " Number"
                        }),
						 search.createColumn({
						 name: "quantity",
						 join: "inventoryDetail",
						 label: "QUANTITY"
					  }),
						]
                });
                var searchResultCount = itemreceiptSearchObj.runPaged().count;
                log.debug("itemreceiptSearchObj result count", searchResultCount);
                var xSerialLopp = 0;
                itemreceiptSearchObj.run().each(function(result) {

                    var qcQty = 0;
                    var qcQty = result.getValue({
                        name: "custcol_qc_quantity"
                    })
                    var itemQty = result.getValue({
                        name: "quantity"
                    });
                    log.debug('itemQty', itemQty);
                    if (itemQty != qcQty) {
                        var finalQty = Number(itemQty) - Number(qcQty);
                        log.debug('finalQty', finalQty);
                        var docTypeSearch = result.getText({
                            name: "type"
                        });
                        log.debug('docTypeSearch', docTypeSearch);
                        var docNumberSearch = result.getValue({
                            name: "tranid"
                        });
                        log.debug('docNumberSearch', docNumberSearch);
                        var docDateSearch = result.getValue({
                            name: "trandate"
                        });
                        log.debug('docDateSearch', docDateSearch);
                        var itemName = result.getText({
                            name: "item"
                        });
                        log.debug('itemName', itemName);

                        var vendorCode = result.getValue({
                            name: "entityid",
                            join: "vendor"
                        });
                        log.debug('vendorCode', vendorCode);
                        var vendorName = result.getValue({
                            name: "altname",
                            join: "vendor"
                        });
                        log.debug('vendorName', vendorName);
                        var searchLocation = result.getText({
                            name: "location"
                        });
                        var searchLocationId = result.getValue({
                            name: "location"
                        });
                        log.debug('searchLocation', searchLocation);
                        var itemDesc = result.getValue({
                            name: "displayname",
                            join: "item"
                        });
                        log.debug('itemDesc', itemDesc);
                        var docSubsidiary = result.getValue({
                            name: "subsidiary"
                        })
                        var qcType = result.getValue({
                            name: "custitem_is_qc_searlized",
                            join: "item"
                        });
                        log.debug('qcType', qcType);
                        if (qcType == true) {
                            var inventoryDetailName = result.getValue({
                                name: "inventorynumber",
                                join: "inventoryDetail"
                            })
                            var inventoryDetailText = result.getText({
                                name: "inventorynumber",
                                join: "inventoryDetail"
                            });
                            log.debug('inventoryDetailText', inventoryDetailText);
							var inventoryDetailQty = result.getValue({
                                name: "quantity",
                                join: "inventoryDetail"
                            });
							
                            var qcLink = '<!DOCTYPE html>' +
                                '<html>' +
                                '<body>' +
                                '<a href="https://6810795.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=287&vendorId='+vendorCode+'&itemName='+itemName+'&itemQty='+inventoryDetailQty+'&vendorName='+vendorName+'&docLoaction='+searchLocationId+'&docsub='+docSubsidiary+'&docId='+docNumberSearch+'&inventroyNumber='+inventoryDetailName+'&docTypeSearch='+docTypeSearch+'&invText='+inventoryDetailText+'&itemDesc='+itemDesc+'">QC Result</a>' +
                                '</body>' +
                                '</html>';

                            sublist.setSublistValue({
                                id: 'custpage_checkbox',
                                line: xSerialLopp,
                                value: qcLink
                            });
                            sublist.setSublistValue({
                                id: 'custpage_qty',
                                line: xSerialLopp,
                                value: inventoryDetailQty
                            });
							if(inventoryDetailText){
                            sublist.setSublistValue({
                                id: 'custpage_seriallot',
                                line: xSerialLopp,
                                value: inventoryDetailText
                            });
							}
                        }
                        if (finalQty != 0) {
                            if (qcType == false) {

                                var qcLink = '<!DOCTYPE html>' +
                                    '<html>' +
                                    '<body>' +
                                    '<a href="https://6810795.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=287&vendorId=' + vendorCode + '&itemName=' + itemName + '&itemQty=' + finalQty + '&vendorName=' + vendorName + '&docLoaction=' + searchLocationId + '&docsub=' + docSubsidiary + '&docId=' + docNumberSearch + '&docTypeSearch='+docTypeSearch+'&itemDesc='+itemDesc+'">QC Result</a>' +
                                    '</body>' +
                                    '</html>';

                                sublist.setSublistValue({
                                    id: 'custpage_checkbox',
                                    line: xSerialLopp,
                                    value: qcLink
                                });
                                sublist.setSublistValue({
                                    id: 'custpage_qty',
                                    line: xSerialLopp,
                                    value: finalQty
                                });
                            }
                            if (docTypeSearch) {
                                sublist.setSublistValue({
                                    id: 'custpage_document',
                                    line: xSerialLopp,
                                    value: docTypeSearch
                                });
                            }
                            if (docNumberSearch) {
                                sublist.setSublistValue({
                                    id: 'custpage_number',
                                    line: xSerialLopp,
                                    value: docNumberSearch
                                });
                            }
                            if (docDateSearch) {
                                sublist.setSublistValue({
                                    id: 'custpage_date',
                                    line: xSerialLopp,
                                    value: docDateSearch
                                });
                            }
                            if (itemName) {
                                sublist.setSublistValue({
                                    id: 'custpage_itemcodelist',
                                    line: xSerialLopp,
                                    value: itemName
                                });
                            }
                            if (vendorCode) {
                                sublist.setSublistValue({
                                    id: 'custpage_vendorcode',
                                    line: xSerialLopp,
                                    value: vendorCode
                                });
                            }
                            if (vendorName) {
                                sublist.setSublistValue({
                                    id: 'custpage_vendorname',
                                    line: xSerialLopp,
                                    value: vendorName
                                });
                            }
                            sublist.setSublistValue({
                                id: 'custpage_location',
                                line: xSerialLopp,
                                value: searchLocation
                            });
                            if (itemDesc) {
                                sublist.setSublistValue({
                                    id: 'custpage_itemname',
                                    line: xSerialLopp,
                                    value: itemDesc
                                });
                            }
                            if (getStatus == 1) {
                                sublist.setSublistValue({
                                    id: 'custpage_status',
                                    line: xSerialLopp,
                                    value: "Pending"
                                });
                            } else if (getStatus == 2) {
                                sublist.setSublistValue({
                                    id: 'custpage_status',
                                    line: xSerialLopp,
                                    value: "Process"
                                });
                            }
                            xSerialLopp++;
                        }
                    }
                    return true;
                });

            }
			
			if(getToDateParam && getDocType == 'assemblybuild'){
				
				 var sublist = form.addSublist({
                    id: 'custpage_item_sublist',
                    type: serverWidget.SublistType.STATICLIST,
                    label: ' '
                });
                var checkboxFld = sublist.addField({
                    id: 'custpage_checkbox',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: 'QC RESULT'
                });
                //checkboxFld.defaultValue = qcLink;
                var documentType = sublist.addField({
                    id: 'custpage_document',
                    type: serverWidget.FieldType.TEXT,
                    label: 'DOCUMENT TYPE'
                });
                var documentNumber = sublist.addField({
                    id: 'custpage_number',
                    type: serverWidget.FieldType.TEXT,
                    label: 'DOCUMENT NUMBER'
                });
                var documentdate = sublist.addField({
                    id: 'custpage_date',
                    type: serverWidget.FieldType.TEXT,
                    label: 'DOCUMENT DATE'
                });
                var itemCode = sublist.addField({
                    id: 'custpage_itemcodelist',
                    type: serverWidget.FieldType.TEXT,
                    label: 'ITEM CODE'
                });
                var itemName = sublist.addField({
                    id: 'custpage_itemname',
                    type: serverWidget.FieldType.TEXT,
                    label: 'ITEM NAME'
                });
                var itemQty = sublist.addField({
                    id: 'custpage_qty',
                    type: serverWidget.FieldType.TEXT,
                    label: 'QUANTITY'
                });
                var locationdoc = sublist.addField({
                    id: 'custpage_location',
                    type: serverWidget.FieldType.TEXT,
                    label: 'LOCATION'
                });
                var statusDoc = sublist.addField({
                    id: 'custpage_status',
                    type: serverWidget.FieldType.TEXT,
                    label: 'STATUS'
                });
                var serialLot = sublist.addField({
                    id: 'custpage_seriallot',
                    type: serverWidget.FieldType.TEXT,
                    label: 'SERIAL/LOT'
                });
				 var serialLotNumber;
                var serialLotNumberArr = [];
                var serialLotNumberArrtoString;
				var assemblybuildSearchObj = search.create({
						   type: "assemblybuild",
						   filters:
						   [
							  ["type","anyof","Build"], 
							  "AND", 
							  ["trandate","within",getFromDate,getToDateParam], 
							  "AND", 
							  ["custbody_used_serial_lot_number","isnotempty",""], 
							  "AND", 
							  ["mainline","is","T"]
						   ],
						   columns:
						   [
							  search.createColumn({name: "custbody_used_serial_lot_number", label: "Used Serial Lot Number"})
						   ]
						});
						var searchResultCount = assemblybuildSearchObj.runPaged().count;
						log.debug("assemblybuildSearchObj result count",searchResultCount);
						assemblybuildSearchObj.run().each(function(result){
							 serialLotNumber = result.getValue({
                        name: "custbody_used_serial_lot_number"
                    })
                    serialLotNumberArr.push(serialLotNumber);
						   // .run().each has a limit of 4,000 results
						   return true;
						});
				
                
                serialLotNumberArr = "" + serialLotNumberArr;
                if (serialLotNumberArr) {
                    var serialLotNumberArrtoString = serialLotNumberArr.split(",");
                }
                log.debug('serialLotNumberArrtoString', serialLotNumberArrtoString);
				 var filter = [];
                if (getFromDate && getToDateParam && getSubsidiary && getlocation && getitemCode) {
                    filter.push(["type", "anyof", "Build"]);
                    filter.push("AND");
                    filter.push(["mainline", "is", "T"]);
                    if (serialLotNumberArrtoString) {
                        filter.push("AND");

                        filter.push(["inventorydetail.inventorynumber", "noneof", serialLotNumberArrtoString]);
                    }
                    filter.push("AND");
                    filter.push(["item.custitem_is_qualitycheck_required", "is", "T"]);
                    filter.push("AND")
                    filter.push(["trandate", "within", getFromDate, getToDateParam]);
                    filter.push("AND");
                    filter.push(["subsidiary", "anyof", getSubsidiary]);
                    filter.push("AND");
                    filter.push(["location", "anyof", getlocation]);
                    filter.push("AND");
                    filter.push(["item", "anyof", getitemCode]);
                } else if (getFromDate && getToDateParam && getSubsidiary && getlocation) {
                    filter.push(["type", "anyof", "Build"]);
                    filter.push("AND");
                    filter.push(["mainline", "is", "T"]);
                    if (serialLotNumberArrtoString) {
                        filter.push("AND");
                        filter.push(["inventorydetail.inventorynumber", "noneof", serialLotNumberArrtoString]);
                    }
                    filter.push("AND");
                    filter.push(["item.custitem_is_qualitycheck_required", "is", "T"]);
                    filter.push("AND")
                    filter.push(["trandate", "within", getFromDate, getToDateParam]);
                    filter.push("AND");
                    filter.push(["subsidiary", "anyof", getSubsidiary]);
                    filter.push("AND");
                    filter.push(["location", "anyof", getlocation]);
                } else if (getFromDate && getToDateParam && getitemCode) {
                    filter.push(["type", "anyof", "Build"]);
                    filter.push("AND");
                    filter.push(["mainline", "is", "T"]);
                    if (serialLotNumberArrtoString) {
                        filter.push("AND");

                        filter.push(["inventorydetail.inventorynumber", "noneof", serialLotNumberArrtoString]);
                    }
                    filter.push("AND");
                    filter.push(["item.custitem_is_qualitycheck_required", "is", "T"]);
                    filter.push("AND")
                    filter.push(["trandate", "within", getFromDate, getToDateParam]);
                    filter.push("AND");
                    filter.push(["item", "anyof", getitemCode]);
                } else if (getFromDate && getToDateParam && getSubsidiary) {
                    filter.push(["type", "anyof", "Build"]);
                    filter.push("AND");
                    filter.push(["mainline", "is", "T"]);
                    if (serialLotNumberArrtoString) {
                        filter.push("AND");

                        filter.push(["inventorydetail.inventorynumber", "noneof", serialLotNumberArrtoString]);
                    }
                    filter.push("AND");
                    filter.push(["item.custitem_is_qualitycheck_required", "is", "T"]);
                    filter.push("AND")
                    filter.push(["trandate", "within", getFromDate, getToDateParam]);
                    filter.push("AND");
                    filter.push(["subsidiary", "anyof", getSubsidiary]);
                } else if (getFromDate && getToDateParam && getlocation) {
                    filter.push(["type", "anyof", "Build"]);
                    filter.push("AND");
                    filter.push(["mainline", "is", "T"]);
                    if (serialLotNumberArrtoString) {
                        filter.push("AND");

                        filter.push(["inventorydetail.inventorynumber", "noneof", serialLotNumberArrtoString]);
                    }
                    filter.push("AND");
                    filter.push(["item.custitem_is_qualitycheck_required", "is", "T"]);
                    filter.push("AND")
                    filter.push(["trandate", "within", getFromDate, getToDateParam]);
                    filter.push("AND");
                    filter.push(["location", "anyof", getlocation]);
                } else {
                    filter.push(["type", "anyof", "Build"]);
                    filter.push("AND");
                    filter.push(["mainline", "is", "T"]);
                    if (serialLotNumberArrtoString) {
                        filter.push("AND");

                        filter.push(["inventorydetail.inventorynumber", "noneof", serialLotNumberArrtoString]);
                    }
                    filter.push("AND");
                    filter.push(["item.custitem_is_qualitycheck_required", "is", "T"]);
                    filter.push("AND")
                    filter.push(["trandate", "within", getFromDate, getToDateParam]);
                }

                log.debug('filter', filter);
				var transactionSearchObj = search.create({
   type: "transaction",
   filters:filter,
   columns:
   [
      search.createColumn({name: "type", label: "Type"}),
      search.createColumn({name: "tranid", label: "Document Number"}),
      search.createColumn({name: "trandate", label: "Date"}),
      search.createColumn({
         name: "itemid",
         join: "item",
         label: "Name"
      }),
      search.createColumn({
         name: "displayname",
         join: "item",
         label: "Display Name"
      }),
	  
	   search.createColumn({name: "subsidiary", label: "Subsidiary"}),
      search.createColumn({name: "quantity", label: "Quantity"}),
      search.createColumn({name: "location", label: "Location"}),
      search.createColumn({
         name: "inventorynumber",
         join: "inventoryDetail",
         label: " Number"
      }),
	    search.createColumn({
         name: "quantity",
         join: "inventoryDetail",
         label: "QUANTITY"
      }),
	     search.createColumn({name: "custbody_qc_quantity", label: "QC Quantity"}),
		 search.createColumn({
         name: "custitem_is_qc_searlized",
         join: "item",
         label: "Is QC Serailized"
      })
   ]
});
var searchResultCount = transactionSearchObj.runPaged().count;
log.debug("transactionSearchObj result count",searchResultCount);
var xSerialLopp = 0;
transactionSearchObj.run().each(function(result){
   var qcQty = 0;
                    var qcQty = result.getValue({
                        name: "custcol_qc_quantity"
                    })
                    var itemQty = result.getValue({
                        name: "quantity"
                    });
                    log.debug('itemQty', itemQty);
                    if (itemQty != qcQty) {
                        var finalQty = Number(itemQty) - Number(qcQty);
                        log.debug('finalQty', finalQty);
                        var docTypeSearch = result.getText({
                            name: "type"
                        });
                        log.debug('docTypeSearch', docTypeSearch);
                        var docNumberSearch = result.getValue({
                            name: "tranid"
                        });
                        log.debug('docNumberSearch', docNumberSearch);
                        var docDateSearch = result.getValue({
                            name: "trandate"
                        });
                        log.debug('docDateSearch', docDateSearch);
                        var itemName = result.getValue({
                              name: "itemid",
                             join: "item"
                        });
                        log.debug('itemName', itemName);

                      
                        var searchLocation = result.getText({
                            name: "location"
                        });
                        var searchLocationId = result.getValue({
                            name: "location"
                        });
                        log.debug('searchLocation', searchLocation);
                        var itemDesc = result.getValue({
                            name: "displayname",
								join: "item"
                        });
                        log.debug('itemDesc', itemDesc);
                        var docSubsidiary = result.getValue({
                            name: "subsidiary"
                        })
                        var qcType = result.getValue({
                            name: "custitem_is_qc_searlized",
                            join: "item"
                        });
                        log.debug('qcType', qcType);
                        if (qcType == true) {
                            var inventoryDetailName = result.getValue({
                                name: "inventorynumber",
                                join: "inventoryDetail"
                            })
                            var inventoryDetailText = result.getText({
                                name: "inventorynumber",
                                join: "inventoryDetail"
                            });
                            log.debug('inventoryDetailText', inventoryDetailText);
							var inventoryDetailQty = result.getValue({
                                name: "quantity",
                                join: "inventoryDetail"
                            });
                            var qcLink = '<!DOCTYPE html>' +
                                '<html>' +
                                '<body>' +
                                '<a href="https://6810795.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=287&itemName='+itemName + '&itemQty='+inventoryDetailQty+'&docLoaction=' + searchLocationId + '&docsub=' + docSubsidiary + '&docId=' + docNumberSearch + '&inventroyNumber=' + inventoryDetailName + '&docTypeSearch='+docTypeSearch+'&invText='+inventoryDetailText+'&itemDesc'+itemDesc+'">QC Result</a>' +
                                '</body>' +
                                '</html>';
							log.debug('qcLink',qcLink);
                            sublist.setSublistValue({
                                id: 'custpage_checkbox',
                                line: xSerialLopp,
                                value: qcLink
                            });
                            sublist.setSublistValue({
                                id: 'custpage_qty',
                                line: xSerialLopp,
                                value: inventoryDetailQty
                            });
							if(inventoryDetailText){
                            sublist.setSublistValue({
                                id: 'custpage_seriallot',
                                line: xSerialLopp,
                                value: inventoryDetailText
                            });
							}
                        }
                        if (finalQty != 0) {
                            if (qcType == false) {

                                var qcLink = '<!DOCTYPE html>' +
                                    '<html>' +
                                    '<body>' +
                                    '<a href="https://6810795.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=287&itemName='+itemName+'&itemQty='+ finalQty + '&docLoaction=' + searchLocationId + '&docsub=' + docSubsidiary + '&docId=' + docNumberSearch + '&docTypeSearch='+docTypeSearch+'&itemDesc='+itemDesc+'">QC Result</a>' +
                                    '</body>' +
                                    '</html>';

                                sublist.setSublistValue({
                                    id: 'custpage_checkbox',
                                    line: xSerialLopp,
                                    value: qcLink
                                });
                                sublist.setSublistValue({
                                    id: 'custpage_qty',
                                    line: xSerialLopp,
                                    value: finalQty
                                });
                            }
                            if (docTypeSearch) {
                                sublist.setSublistValue({
                                    id: 'custpage_document',
                                    line: xSerialLopp,
                                    value: docTypeSearch
                                });
                            }
                            if (docNumberSearch) {
                                sublist.setSublistValue({
                                    id: 'custpage_number',
                                    line: xSerialLopp,
                                    value: docNumberSearch
                                });
                            }
                            if (docDateSearch) {
                                sublist.setSublistValue({
                                    id: 'custpage_date',
                                    line: xSerialLopp,
                                    value: docDateSearch
                                });
                            }
                            if (itemName) {
                                sublist.setSublistValue({
                                    id: 'custpage_itemcodelist',
                                    line: xSerialLopp,
                                    value: itemName
                                });
                            }
                           
                            sublist.setSublistValue({
                                id: 'custpage_location',
                                line: xSerialLopp,
                                value: searchLocation
                            });
                            if (itemDesc) {
                                sublist.setSublistValue({
                                    id: 'custrecord_item_name_qr',
                                    line: xSerialLopp,
                                    value: itemDesc
                                });
                            }
                           
                            xSerialLopp++;
                        }
                    }
   return true;
});
				
			}
            context.response.writePage(form);
        } catch (ex) {
            log.error('error in QC paramter', ex)
        }

    }
    return {
        onRequest: onRequest
    }

});










/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
 define(['N/url', 'N/https', 'N/currentRecord','N/url'], function(url, https, currentRecord,url) {
    function pageInit(context) {
       
    }
	function load(context){
		var currentRecord1 = currentRecord.get();
		var fromDate = currentRecord1.getText({
			fieldId : 'custpage_fromdate'
		});
		//alert('fromDate'+fromDate);
		var toDate = currentRecord1.getText({
			fieldId : 'custpage_todate'
		});
		//alert('toDate'+toDate);
		var docType = currentRecord1.getValue({
			fieldId : 'custpage_doctype'
		});
		//alert('docType'+docType);
		var Qc_status = currentRecord1.getValue({
			fieldId : 'custpage_status'
		});
		var subsidiary = currentRecord1.getValue({
			fieldId : 'custpage_subsidiary'
		});
		//alert('subsidiary'+subsidiary);
		var docLoaction = currentRecord1.getValue({
			fieldId : 'custpage_location'
		});
		var itemCode = currentRecord1.getValue({
			fieldId : 'custpage_itemcode'
		});
		document.location = url.resolveScript({
			scriptId : 'customscript_sl_item_inspection_screen',
			deploymentId : 'customdeploy_sl_item_inspection_screen',
			params : {
				custparam_toDate : toDate,
				custparam_fromDate : fromDate,
				custparam_doctype : docType,
				custparam_qc_status : Qc_status,
				custparam_subsidiary : subsidiary,
				custparam_location : docLoaction,
				custparam_itemcode : itemCode
				
			}
		})
	}
    return {
        pageInit: pageInit,
		load : load
    };
});