/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/search', 'N/ui/dialog'], 
    function(currentRecord, search, dialog) {
	function fieldChanged(context) {
		try{
        const currentRec = context.currentRecord;

        // Check if the sublist being validated is the one you want to target
        if (context.fieldId === 'custbodycinn_travel_expense' || context.fieldId === 'custbodycinn_thirdparty_expense' || context.fieldId === 'custbodycinn_resource_cost' || context.fieldId === 'custbodycinn_discount_amount') { 
            let travelExpense = 0;
			let thirdPartyExpense = 0;
			let resourceCost = 0;
			let discountAmt = 0;
			travelExpense = currentRec.getValue({
				fieldId : 'custbodycinn_travel_expense'
			});
			
			 thirdPartyExpense = currentRec.getValue({
				fieldId : 'custbodycinn_thirdparty_expense'
			});
			
			resourceCost = currentRec.getValue({
				fieldId : 'custbodycinn_resource_cost'
			});
			discountAmt = currentRec.getValue({
				fieldId : 'custbodycinn_discount_amount'
			});
			let tcv = Number(travelExpense) + Number(thirdPartyExpense) + Number(resourceCost) - Number(discountAmt)
			
						if(tcv){
						currentRec.setValue({
						fieldId: 'custbody_tcv',
						value: tcv,
						ignoreFieldChange: true,
						forceSyncSourcing: true
					});
	}
      }
		}
		catch(ex){
			log.error('Error in fieldChanged')
		}
        
    }	
    function saveRecord(context) {
		console.log('context',context);
             log.debug('context',context);
	
        var rec = context.currentRecord;
        var dealName = rec.getValue({
            fieldId: 'title' 
        });
			   var opportunitySearchObj = search.create({
		   type: "opportunity",
		   filters:
		   [
			  ["title","is",dealName]
		   ],
		   columns:
		   [
			  search.createColumn({name: "title", label: "Title"})
		   ]
		});
		var searchResultCount = opportunitySearchObj.runPaged().count;
		log.debug("opportunitySearchObj result count",searchResultCount);

        if (searchResultCount) {
            dialog.alert({
                title: 'Duplicate Deal Name',
                message: 'A record with the same Deal Name already exists. Please choose a different Deal Name.'
            });
			return false;
        }
			return true;
    
	}

    return {
        saveRecord: saveRecord,
		fieldChanged:fieldChanged
    };
});