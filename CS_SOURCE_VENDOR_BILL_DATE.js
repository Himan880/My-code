/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 */
define(['N/search', 'N/currentRecord', 'N/format'], function (search, currentRecord, format) {
  function pageInit(context) {
	  
	  var objRecord = context.currentRecord;
	   var url = top.location.href;
        var value = new URLSearchParams(url).get("itemrcpt");
		if(value){
      var itemreceiptSearchObj = search.create({
        type: "itemreceipt",
        filters: [
          ["type", "anyof", "ItemRcpt"],
          "AND",
          ["internalid", "anyof", value],
		  "AND",
		  ["mainline","is","T"],
        ],
        columns: [
          search.createColumn({ name: "custbody_cin_ven_bill_date", label: "Vendor Bill Date" }),
          search.createColumn({ name: "custbodycust_vendor_bill_no", label: "Vendor Bill No" })
        ]
      });
      var searchResultCount = itemreceiptSearchObj.runPaged().count;

      itemreceiptSearchObj.run().each(function (result) {
        var vendorInvDate = result.getValue({
          name: "custbody_cin_ven_bill_date"
        });
	
        var vendorInvoice = result.getValue({
          name: "custbodycust_vendor_bill_no"
        });
	    var parsedDate = format.parse({
          value: vendorInvDate,
          type: format.Type.DATE
        });
        objRecord.setValue({
          fieldId: 'custbody_cin_ven_bill_date', 
          value: parsedDate,
          ignoreFieldChange: true
        });
        objRecord.setValue({
          fieldId: 'tranid',
          value: vendorInvoice,
          ignoreFieldChange: true
        });
        return false;
      });
    }
  }
  return {
    pageInit: pageInit
  };
});
