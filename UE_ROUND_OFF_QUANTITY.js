/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/log'], function(record, log) {

    function beforeSubmit(context) {
        if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.EDIT) {
            var newRecord = context.newRecord;

            
            var sublistId = 'item';
            var fieldId = 'quantity';

            var lineCount = newRecord.getLineCount({ sublistId: sublistId });
           log.debug('lineCount',lineCount);
            for (var line = 0; line < lineCount; line++) {
                var currentQuantity = newRecord.getSublistValue({
                    sublistId: sublistId,
                    fieldId: fieldId,
                    line: line
                });
             log.debug('currentQuantity',currentQuantity);
                
                var roundedQuantity = Math.round(currentQuantity);
               log.debug("roundedQuantity",roundedQuantity);
              
                newRecord.setSublistValue({
                    sublistId: sublistId,
                    fieldId: fieldId,
                    value: roundedQuantity,
                    line: line
                });
            }
        }
    }

    return {
        beforeSubmit: beforeSubmit
    };

});
