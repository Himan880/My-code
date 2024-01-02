/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 */
define(['N/currentRecord', 'N/log', 'N/format'], 
    function(currentRecord, log, format) {

    function validateLine(context) {
        const currentRecord = context.currentRecord;
        let quantity = currentRecord.getCurrentSublistValue({
			sublistId : 'item',
            fieldId: 'quantity'
        });
		//alert('quantity'+quantity);
			let qtyRound = quantity % 1;
		if(qtyRound > 0){
			//alert('qtyRound'+qtyRound);
			let getRound = quantity.toString().split('.')[0];
			//alert('getRound'+getRound)
			let additionQty = Number(getRound) + Number(1);
      currentRecord.setCurrentSublistValue({
				sublistId : 'item',
                fieldId: 'quantity',
                value: additionQty
            });
		}
		
 

        return true;
    }


    return {
        validateLine: validateLine
    };

});