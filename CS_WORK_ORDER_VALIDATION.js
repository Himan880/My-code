/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 */

define(['N/record', 'N/ui/message', 'N/search' ,'N/error'], function (record, message,search, error) {
  
  function validateQuantity(context) {
    const currentRecord = context.currentRecord;

    // Get the quantity field value from the current Work Order record
    let quantity = currentRecord.getValue({
      fieldId: 'quantity' // Replace 'quantity' with the actual field ID of the quantity field on the Work Order record
    });
	let itemId = currentRecord.getValue({
      fieldId: 'assemblyitem' // Replace 'quantity' with the actual field ID of the quantity field on the Work Order record
    });
	var serialCheck;
	var itemSearchObj = search.create({
   type: "item",
   filters:
   [
      ["internalid","anyof",itemId]
   ],
   columns:
   [
      search.createColumn({name: "isserialitem", label: "Is Serialized Item"})
   ]
});
var searchResultCount = itemSearchObj.runPaged().count;
log.debug("itemSearchObj result count",searchResultCount);
itemSearchObj.run().each(function(result){
	serialCheck = result.getValue({
		name: "isserialitem"
	});
	alert('serialCheck'+serialCheck);
   return true;
});

	
	let getVinNumber = currentRecord.getValue({
      fieldId: 'custbody_work_order_vin_selected' // Replace 'quantity' with the actual field ID of the quantity field on the Work Order record
    });
	if (serialCheck == true){
	//alert ('getVinNumber'+getVinNumber);
	 if (getVinNumber == " " || getVinNumber == null || getVinNumber == "" ) {
      // Show an error message if the quantity is less than or equal to zero
      var errorMessage = 'Please select Vin Number.';
      showMessage('Error', errorMessage);
      throw error.create({
        name: 'INVALID_QUANTITY',
        message: errorMessage
      });
    }
	}
	let vinArr = getVinNumber.split(",")
	//alert('vinArr'+vinArr)
	//vinArr.push(getVinNumber);
	var lengthOfArr = vinArr.length;
	//alert('lengthOfArr'+lengthOfArr)
	  
    // Perform your validation logic here
    if (quantity != lengthOfArr) {
      // Show an error message if the quantity is less than or equal to zero
      var errorMessage = 'Quantity must be equal to Vin Number.';
      showMessage('Error', errorMessage);
      throw error.create({
        name: 'INVALID_QUANTITY',
        message: errorMessage
      });
    }

    // If validation passes, return true
    return true;
	
	
  }

  function showMessage(type, content) {
    var myMessage = message.create({
      title: type,
      message: content,
      type: message.Type.ERROR
    });
    // Show the error message
    myMessage.show();
  }

  function saveRecord(context) {
    try {
      // Validate the quantity before saving the record
      validateQuantity(context);
      return true; // Allow the record to be saved if validation passes
    } catch (e) {
      return false; // Prevent the record from being saved if an error occurred during validation
    }
  }

  return {
    saveRecord: saveRecord
  };
});