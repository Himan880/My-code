function customizeGlImpact(transactionRecord, standardLines, customLines, book) {
  var countStandard = standardLines.getCount();
  nlapiLogExecution("DEBUG", "Line Count", standardLines.getCount());
  //To get the first standard line which appear in the GL impact
  var currLine = standardLines.getLine(0);
  //To get the entity from the standard line
  var entityId = currLine.getEntityId();
  nlapiLogExecution("DEBUG", "entityId", entityId);
  //To get the subsidiary which is chosen on the transaction  
  var tranSubsidiary = transactionRecord.getFieldValue('subsidiary');
  //To get the record type of the transaction
  var recordType = transactionRecord.getRecordType();
  nlapiLogExecution("DEBUG", "recordType", recordType);
  nlapiLogExecution("DEBUG", "Subsidiary", tranSubsidiary);
  var approvalstatus = transactionRecord.getFieldValue('approvalstatus');
  nlapiLogExecution("DEBUG", "approvalstatus", approvalstatus);
  //To get the custom field value which is on the transaction
  var commission = parseFloat(transactionRecord.getFieldValue('custbody_vendor_prepayment_amount'));
  nlapiLogExecution("DEBUG", "commission", commission);
  if (recordType == 'vendorbill') {
    
    if (approvalstatus == 2 && commission > 0) {
      nlapiLogExecution("DEBUG", "commission", commission);
      //To add new custom line in the GL impact
      var newLine = customLines.addNewLine();
      //To set debit amount
      newLine.setDebitAmount(commission);
	 var accountIds = transactionRecord.getFieldValue('account');
	 nlapiLogExecution("DEBUG", "accountIds", accountIds);
	 var convertId = Number(accountIds);
      //set debit account- commissions account - 140 is the internal id of the respective account
      newLine.setAccountId(569);
      newLine.setEntityId(entityId);
      newLine.setMemo("TDS Amount");
      //To add new custom line in the GL impact
      var newLine = customLines.addNewLine();
      //To set Credit amount
      newLine.setCreditAmount(commission);
      //set credit account- commission liability account - 120 is the internal id of the respective account
      newLine.setAccountId(491);
      newLine.setEntityId(entityId);
      newLine.setMemo("TDS Amount");
    }
  }
}