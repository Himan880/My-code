/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/ui/dialog', 'N/error', 'N/log'], function (record, search, dialog, error, log) {
    function saveRecord(context) {
        try {
		
            var objRecord = context.currentRecord;
          
			var vendorIsPersonType = objRecord.getValue({
                fieldId: 'isperson'
            });
			if(vendorIsPersonType == 'T'){
				var fullName;
				var vendorFirstName = objRecord.getValue({
					fieldId:'firstname' 
				});
					var vendorMiddkeName = objRecord.getValue({
					fieldId:'middlename'
				});
					var vendorLastName = objRecord.getValue({
					fieldId:'lastname'
				});
				if(vendorFirstName && vendorMiddkeName && vendorLastName){
				 fullName = vendorFirstName +' '+ vendorMiddkeName + ' '+vendorLastName;
				}
				else if (vendorFirstName && vendorLastName){
					 fullName = vendorFirstName + ' '+ vendorLastName;
				}
				else if(vendorFirstName && vendorMiddkeName){
					 fullName = vendorFirstName + ' '+ vendorMiddkeName;
				}
				else {
					 fullName = vendorFirstName;
				}
			//	alert('fullName'+fullName);
				var vendorSearchObj = search.create({
			   type: "vendor",
			   filters:
			   [
				  ["isperson","is","T"], 
				  "AND", 
				  ["entityid","is",fullName]
			   ],
			   columns:
			   [
				  search.createColumn({name: "altname", label: "Name"})
			   ]
			});
			var searchResultCount = vendorSearchObj.runPaged().count;
			log.debug("vendorSearchObj result count",searchResultCount);
			   if (searchResultCount > 0) {
                    dialog.alert({
                        title: 'Duplicate Vendor Name',
                        message: "Vendor Name is already exist"
                    });
                    return false; // Prevent record save
                }


			}
            
          if(vendorIsPersonType == 'F'){
				var panCheck = objRecord.getValue({
                fieldId: 'custentity_in_pan_availability'
            });
				if(panCheck == 4){
				  var panNo = objRecord.getValue({
                fieldId: 'custentity_permanent_account_number'
            });
                var vendorSearchObj = search.create({
				   type: "vendor",
				   filters:
				   [
					  ["isperson","is","F"], 
					  "AND", 
					  ["custentity_permanent_account_number","is",panNo]
				   ],
				   columns:
				   [
					  search.createColumn({name: "altname", label: "Name"})
				   ]
				});
				var searchResultCount = vendorSearchObj.runPaged().count;
				log.debug("vendorSearchObj result count",searchResultCount);
				
                if (searchResultCount > 0) {
                    dialog.alert({
                        title: 'Duplicate PAN',
                        message: "Vendor PAN is already exist"
                    });
                    return false; // Prevent record save
                }
		}
		  }
		
           // If the record is in edit mode or no duplicates were found, allow the record save
            return true;
			
        } catch (e) {
            log.error('Error', e.message);
            return false; // Prevent record save in case of error
        }
    }
	
 return {
        saveRecord: saveRecord,
		
    };
});