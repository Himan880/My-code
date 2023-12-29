/**
 *@NApiVersion 2.x
 *@NScriptType MapReduceScript
 */
define(["N/record", "N/search"], function (record, search) {

    function getInputData() {
        return  vendorpaymentSearchObj = search.create({
            type: "vendorpayment",
            filters:
            [
               ["type","anyof","VendPymt"], 
               "AND", 
               ["internalid","anyof","8995"], 
               "AND", 
               ["mainline","is","T"]
            ],
            columns:
            [
            ]
         });

    }


    function map(ctx) {
        var row = JSON.parse(ctx.value)

        log.debug('row', row)

        try {
            record.delete({
                type: row.recordType,
                id: row.id
            })
        } catch (e) {
            log.error("e", e);
        }

    }

  
    return {
        getInputData: getInputData,
        map: map
    }

});