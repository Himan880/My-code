/** 
 * @NApiVersion 2.1 
 * @NScriptType MapReduceScript 
 */
define(['N/search', 'N/record', 'N/https'], function(search, record, https) {
    function getInputData() {
      var purchaseorderSearchObj = search.create({
   type: "purchaseorder",
   filters:
   [
      ["type","anyof","PurchOrd"], 
      "AND", 
      ["mainline","is","T"], 
      "AND", 
      ["status","anyof","PurchOrd:A"], 
      "AND", 
      ["custbody_next_approver_role","noneof","1022","1020"]
   ],
   columns:
   [
      search.createColumn({
         name: "trandate",
         sort: search.Sort.ASC,
         label: "Date"
      }),
      search.createColumn({name: "type", label: "Type"}),
      search.createColumn({name: "tranid", label: "Document Number"}),
      search.createColumn({name: "entity", label: "Name"}),
      search.createColumn({name: "memo", label: "Memo"}),
      search.createColumn({name: "amount", label: "Amount"}),
      search.createColumn({name: "custbody_cinn_mvm_tallyvoucherno", label: "Tally Voucher No."}),
      search.createColumn({name: "custbody_next_approver_role", label: "Next Approver Role"})
   ]
});
var searchResultCount = purchaseorderSearchObj.runPaged().count;
log.debug("purchaseorderSearchObj result count",searchResultCount);

return purchaseorderSearchObj;
    }
    function map(context) {
       // log.debug('in map', context.value);
		var dataParse = JSON.parse(context.value);
		var recType = dataParse.recordType;
		//log.debug('recType',recType);
		var recId = dataParse.id;
		//log.debug('recId',recId);
		var salesOrderRecord = record.load({
       type: recType,
       id: recId
    });
	salesOrderRecord.setValue({
		fieldId : 'approvalstatus',
		value : 2
	})
	salesOrderRecord.save();
	log.debug('salesOrderRecord',salesOrderRecord);


    }
    function reduce(context) {
    }
    // The summarize stage is a serial stage, so this function is invoked only one time. 
    function summarize(context) {
        // Log details about the script’s execution. 
    }
    // Link each entry point to the appropriate function. 
    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    };

});