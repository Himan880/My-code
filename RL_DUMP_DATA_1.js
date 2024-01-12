/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 */
define(['N/record', 'N/error'], (record, error) => {
    
    function _get(context) {
	log.debug('context',context)
        var recId = context.recordid;
		log.debug('recId',recId)
		var recType = context.type;
				log.debug('recType',recType)
        return JSON.stringify(record.load({
            type: recType,
            id: recId
        }));
	 
    }
    return {
        get: _get
    };
	
});
