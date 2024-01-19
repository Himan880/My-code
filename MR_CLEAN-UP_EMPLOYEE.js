/** 
* @NApiVersion 2.x 
* @NScriptType MapReduceScript 
*/ 

define(['N/search','N/record'], function (search,record) { 
function getInputData() { 

var employeeSearchObj = search.create({
   type: "employee",
   filters:
   [
      ["isinactive","is","T"]
   ],
   columns:
   [
      search.createColumn({name: "internalid", label: "Internal ID"})
   ]
});
var searchResultCount = employeeSearchObj.runPaged().count;
log.debug("employeeSearchObj result count",searchResultCount);

return employeeSearchObj;
    } 


    function map(context) { 
	var data = JSON.parse(context.value);
	log.debug('data',data);
	var invoiceRecord = data.recordType;
	log.debug('invoiceRecord',invoiceRecord);
	var invoiceID = data.id;
	log.debug('invoiceID',invoiceID);
	var loadInvoiceRec =  record.delete({
		type :'employee',
		id : invoiceID
	});
	} 

    function reduce(context) { 

    } 
    function summarize(context) {   
	
} 
return { 

        getInputData: getInputData, 
		map: map, 
        reduce: reduce, 
        summarize: summarize 

    }; 

}); 