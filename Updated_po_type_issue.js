/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 */
 define(['N/record', 'N/render', 'N/search', "N/runtime",'N/xml','N/file'], function (record, render, search, runtime,xml,file) {
    
    function onRequest(context) {
        var rec_id = context.request.parameters.recordid;
        var po_rec = record.load({
            type: 'purchaseorder',
            id: rec_id
        });

//----Expense logic starts----
      //Test
    	var items_len = po_rec.getLineCount("item");
      	for(var i=0; i<items_len; i++){
            var item_id = po_rec.getSublistValue({
                sublistId:'item',
                fieldId : 'item',
                line    : i
            });
            item_id=item_id.replace(/&/g, "&amp;");
            var itemtype = po_rec.getSublistText({
                sublistId:'item',
                fieldId : 'itemtype',
                line    : i            });
          if(itemtype == 'Discount'){
                var item_rec=record.load({
                    type:'discountitem',
                    id: item_id
                });
               var item_name= item_rec.getText("itemid");
               item_name = item_name.replace(/&/g,"&amp;")
               var displayname = item_rec.getText("displayname");
               displayname = displayname.replace(/&/g,"&amp;")
               var item_amount = po_rec.getSublistText({
                 sublistId: 'item',
                 fieldId: 'amount',
                 line: i
               });
            var item_name = po_rec.getSublistText({
              sublistId: 'item',
              fieldId: 'item',
              line: i
            })
            log.error('Discount Name 47', item_name);
            log.error('Discount Amount 48', typeof item_amount);
          }
        }
      //Test


        var expense_line = po_rec.getLineCount("expense");
        log.error("Expense Line Count", expense_line);
      	var expense_amount = 0;
        for (var i=0; i<expense_line; i++) {
          var expense_line_amount = po_rec.getSublistValue({
            sublistId: 'expense',
            fieldId: 'amount',
            line: i
          });
          expense_amount += expense_line_amount;
        }
        log.error("Expense Amount", expense_amount);
      
// Address
      var locationId = po_rec.getValue('location');
	  log.error('locationId',locationId);
	  var subsidiaryId = po_rec.getValue('subsidiary');
	    log.error('subsidiaryId',subsidiaryId);
	  if(subsidiaryId != 11){
	  
      var locationRec = record.load({
        type: 'location',
        id: locationId
      });
      var addressId = locationRec.getValue('mainaddress');
	  log.error('addressId',addressId);
      var locationHead = 'a' // locationAddress.slice(0,33).toUpperCase();
      var locationBody = 'b' // locationAddress.slice(33);
      var addressee, addr1, addr2, city, state, zip, country, newAddress;
      if(addressId){
          var addressRec = record.load({
          type: 'address',
          id: addressId
        });
         addressee = addressRec.getValue('addressee').toUpperCase();
		  log.error('addressee',addressee);
         addr1 = addressRec.getValue('addr1');
		   log.error('addr1',addr1);
         addr2 = addressRec.getValue('addr2');
		  log.error('addr2',addr2);
         city = addressRec.getValue('city');
		  log.error('city',city);
         state = addressRec.getValue('state');
		  log.error('state',state);
         zip = addressRec.getValue('zip');
		   log.error('zip',zip);
         country = 'India';
         var subsidiarytext = po_rec.getText('subsidiary');
          newAddress =  subsidiarytext + '<br/>' +addr1 + '<br/>' + addr2 + '<br/>' + city + ' ' + state + ' ' + zip + '<br/>' + country;

         log.error('newAddress',newAddress);
      }
	  }
	  if(subsidiaryId == 11){
		  var locId = po_rec.getValue({
			  fieldId: 'location'
		  })
		  var locationRec = record.load({
        type: 'location',
        id: locId
      });
      var addressId = locationRec.getValue('mainaddress')
      var locationHead = 'a' // locationAddress.slice(0,33).toUpperCase();
      var locationBody = 'b' // locationAddress.slice(33);
      var addressee, addr1, addr2, city, state, zip, country, newAddress;
      if(addressId){
          var addressRec = record.load({
          type: 'address',
          id: addressId
        });
         addressee = addressRec.getValue('addressee').toUpperCase();
         addr1 = addressRec.getValue('addr1');
         addr2 = addressRec.getValue('addr2');
         city = addressRec.getValue('city');
         state = addressRec.getValue('state');
         zip = addressRec.getValue('zip');
         country = 'India';
		  newAddress =  'EVAGE AUTOMOTIVE PRIVATE LIMITED' + '<br/>' +addr1 + '<br/>' + addr2 + '<br/>' + city + ' ' + state + ' ' + zip + '<br/>' + country;
	  }
      }
      var subsidiaryCheck = po_rec.getText('subsidiary');
      if(subsidiaryCheck == 'EVage Ventures Private Limited'){
//        log.error('Success', 'yes');
        addressId = po_rec.getValue('shipaddress').replace('\n','<br/>');
        
        newAddress = 'EVAGE VENTURES PRIVATE LIMITED <br/>C-140, INDUSTRIAL AREA, Mohali, <br/> SAS Nagar, Punjab, 160055';
      }

//----Total----
      var newTotal = po_rec.getValue('total');
      var myTotal = Math.round(newTotal);
      var roundValue = newTotal - Math.floor(newTotal);
      roundValue = parseFloat(roundValue.toFixed(2))
//----Expense logic end----

        
        var termscond = po_rec.getText({fieldId:'custbody2'});
        termscond=termscond.replace(/<br>/g, "<br/>")||"";
        log.error("termscond", termscond);

        var subsidiary = po_rec.getValue({fieldId:'subsidiary'})||"";
        log.debug("subisdiara",subsidiary);
        var subsidiary_rec=record.load({
            type:'subsidiary',
            id  : subsidiary
        });
        var pan = subsidiary_rec.getValue("custrecord_in_permanent_account_number");
        var cin =  subsidiary_rec.getValue("custrecord_evage_companyidentification");
        log.debug("pan",pan);
        var get_img="";var img="";
      
		var poStatus = po_rec.getValue({fieldId:'approvalstatus'})
        log.error('poStatus', poStatus);
		var get_ceo = po_rec.getValue({fieldId:'custbody_evage_ceo'});
		log.error('get_ceo',get_ceo);
       if(get_ceo !=""){
          var emp_rec=record.load({
            type:'employee',
            id : get_ceo
          });
		  log.error('emp_rec',emp_rec);
          var get_id = emp_rec.getValue("image");
		  var fullimg;
          log.error("gtif",get_id);
          get_img = 'https://6810795.app.netsuite.com/core/media/media.nl?id=7798&amp;c=6810795&amp;h=qHUEGY2BLwEWB1QRaioCSsvf8R200xSyY5Ua7-70ylCcRtgx';
          if(get_id)
            if(poStatus == 2){
				 var myImageFromFileCabinet = file.load({id:get_id});
				     var imgURL = xml.escape({xmlText: myImageFromFileCabinet.url});
					 log.error('imgURL',imgURL);
            	img='<img src="https://6810795.app.netsuite.com'+imgURL+'" style="width:220px; height:65px;"/>'
            } else {
              img='<br/><br/><br/>'
            }
        }
		
        // else
        // img='<br/><br/><br/>'
        
    var taxdetails_len = po_rec.getLineCount("taxdetails");
      log.error('taxdetails_len 144', taxdetails_len);
    var items_len = po_rec.getLineCount("item");
      log.error('items_len 146', items_len);
    var expenses_len = po_rec.getLineCount("expense");
      log.error('expenses_len', expenses_len);
    var fr_check = po_rec.getValue("custbody_evage_freightonactual");
    var cgstamount; var sgstamount;  var igstamount ;   var cgst = 0;var sgst = 0;var igst = 0;var freight=0;var cgst_flag=false;
    var sgst_flag=false;var igst_flag=false;var fr_flag=false;var cgst_rate = 0;var sgst_rate = 0;var igst_rate=0;
    for(var i=0;i<taxdetails_len;i++){
        var taxcode = po_rec.getSublistValue({
            sublistId : 'taxdetails',
            fieldId   : 'taxcode_display',
            line      : i
        });
		 log.error('taxcode', taxcode);
        if(taxcode == "CGST"){
            cgst_flag=true;
             cgstamount = po_rec.getSublistValue({
                sublistId : 'taxdetails',
                fieldId   : 'taxamount',
                line      : i
            });
           cgst = cgst +cgstamount;
           log.debug("cgst",cgst);
          
                //cgst = getdecimal(cgst);
               // cgst = get_indian_format(cgst);
              
//f           cgst = Math.round(cgst);
           cgst_rate = po_rec.getSublistValue({
            sublistId : 'taxdetails',
            fieldId   : 'taxrate',
            line      : i
           });
        } 
        else if(taxcode == "SGST"){
            sgst_flag=true;
           sgstamount = po_rec.getSublistValue({
                sublistId : 'taxdetails',
                fieldId   : 'taxamount',
                line      : i
            });
           sgst = sgst + sgstamount;
          
             // sgst = getdecimal(sgst);
             // sgst = get_indian_format(sgst);
//f          sgst = Math.round(sgst);
          sgst_rate = po_rec.getSublistValue({
            sublistId : 'taxdetails',
            fieldId   : 'taxrate',
            line      : i
           });
        }
        else if(taxcode == "IGST"){
            igst_flag=true;
           igstamount = po_rec.getSublistValue({
                sublistId : 'taxdetails',
                fieldId   : 'taxamount',
                line      : i
            });
           igst = igst + igstamount;
          
              // igst = getdecimal(igst);
              // igst = get_indian_format(igst);
//f          igst = Math.round(igst);
          igst_rate = po_rec.getSublistValue({
            sublistId : 'taxdetails',
            fieldId   : 'taxrate',
            line      : i
           });
        }
    }
   

    var item_arr=[];
    for(var j=0;j<items_len;j++){
            var item_desc = po_rec.getSublistValue({
                sublistId:'item',
                fieldId : 'description',
                line    : j
            });
			log.debug('item_desc',item_desc);
            item_desc=item_desc.replace(/&/g, "&amp;");
            if(item_desc == "Freight"){
                fr_flag=true;
                freight =  po_rec.getSublistValue({
                    sublistId:'item',
                    fieldId : 'amount',
                    line    : j
                });
            }
            var item = po_rec.getSublistText({
                sublistId:'item',
                fieldId : 'item',
                line    : j
            });
            item=item.replace(/&/g, "&amp;");
			log.debug('item',item);
            var units = po_rec.getSublistText({
                sublistId:'item',
                fieldId : 'units',
                line    : j
            });
            var item_id = po_rec.getSublistValue({
                sublistId:'item',
                fieldId : 'item',
                line    : j
            });
            item_id=item_id.replace(/&/g, "&amp;");
			var item_name;
			var displayname;
				log.debug('item_id',item_id);
				var itemSearchObj = search.create({
   type: "item",
   filters:
   [
      ["internalid","anyof",item_id]
   ],
   columns:
   [
      search.createColumn({
         name: "itemid",
         sort: search.Sort.ASC,
         label: "Name"
      }),
      search.createColumn({name: "displayname", label: "Display Name"})
   ]
});
var searchResultCount = itemSearchObj.runPaged().count;
log.debug("itemSearchObj result count",searchResultCount);
itemSearchObj.run().each(function(result){
  item_name = result.getValue({
	  name: "itemid",
         sort: search.Sort.ASC
  })
 // item_name = displayname.replace(/&/g,"&amp;")
  displayname = result.getValue({
	  name: "displayname"
  })
  //displayname = displayname.replace(/&/g,"&amp;")
 
/*
itemSearchObj.id="customsearch1708953899511";
itemSearchObj.title="Item Search  (copy)";
var newSearchId = itemSearchObj.save();
*/
            // var itemtype = po_rec.getSublistValue({
                // sublistId:'item',
                // fieldId : 'itemtype',
                // line    : j
            // });
            // log.debug("itemtype",itemtype);
           /*var item_rec_type=  search.lookupFields({
                type: 'item',
                id: item_id,
                columns: ['type']
            });
            log.debug("item_rec_type",item_rec_type);*/
            // if(itemtype == 'InvtPart' || itemtype == 'inventoryitem'){
              // var is_serial = po_rec.getSublistValue({
                // sublistId:'item',
                // fieldId : 'isserial',
                // line    : j
            // });
             // if(is_serial == 'F'){
                // var item_rec=record.load({
                    // type:'inventoryitem',
                    // id: item_id
                // });
             // }
              /*else if(is_serial == 'T'){
                 var item_rec=record.load({
                    type:'serializedinventoryitem',
                    id: item_id
                });
              }*/
             /* else{
                log.debug("inventory item");
                var item_rec=record.load({
                    type:'inventoryitem',
                    id: item_id
                });
              }*/
               // var item_name= item_rec.getText("itemid");
               // item_name = item_name.replace(/&/g,"&amp;")
               // var displayname = item_rec.getText("displayname");
               // displayname = displayname.replace(/&/g,"&amp;")
              // log.debug("item_name",item_name);
            // }
            // else if(itemtype == 'NonInvtPart' || itemtype == 'InvtPart'){
                // var item_rec=record.load({
                    // type:'noninventoryitem',
                    // id: item_id
                // });
               // var item_name= item_rec.getText("itemid");
               // item_name = item_name.replace(/&/g,"&amp;")
               // var displayname = item_rec.getText("displayname");
               // displayname = displayname.replace(/&/g,"&amp;")
              // log.debug("item_name",item_name);
            // }
             // else if(itemtype == 'OthCharge'){
                // var item_rec=record.load({
                    // type:'otherchargeitem',
                    // id: item_id
                // });
               // var item_name= item_rec.getText("itemid");
               // item_name = item_name.replace(/&/g,"&amp;")
               // var displayname = item_rec.getText("displayname");
               // displayname = displayname.replace(/&/g,"&amp;")
              // log.debug("item_name",item_name);
            // }
            // else if(itemtype == 'Service'){
                // var item_rec=record.load({
                    // type:'serviceitem',
                    // id: item_id
                // });
               // var item_name= item_rec.getText("itemid");
               // item_name = item_name.replace(/&/g,"&amp;")
               // var displayname = item_rec.getText("displayname");
               // displayname = displayname.replace(/&/g,"&amp;")
              // log.debug("item_name",item_name);
            // }
            // else if(itemtype == 'Discount'){
                // var item_rec=record.load({
                    // type:'discountitem',
                    // id: item_id
                // });
               // var item_name= item_rec.getText("itemid");
               // item_name = item_name.replace(/&/g,"&amp;")
               // var displayname = item_rec.getText("displayname");
               // displayname = displayname.replace(/&/g,"&amp;")
              // log.debug("item_name",item_name);
            // }
            // else if(itemtype == 'Assembly'){
                // var item_rec=record.load({
                    // type:'assemblyitem',
                    // id: item_id
                // });
               // var item_name= item_rec.getText("itemid");
               // item_name = item_name.replace(/&/g,"&amp;")
               // var displayname = item_rec.getText("displayname");
               // displayname = displayname.replace(/&/g,"&amp;")
              // log.debug("item_name",item_name);
            // }
			  return true;
});

            var amount = po_rec.getSublistValue({
                sublistId:'item',
                fieldId : 'amount',
                line    : j
            })||0;
            var hsn = po_rec.getSublistText({
                sublistId:'item',
                fieldId : 'custcol_in_hsn_code',
                line    : j
            });
            log.debug("hsn",hsn);
            var hsn_ind=hsn.indexOf("-");
            log.debug("hsn_ind",hsn_ind);
            var hsn_code=""; var gstrate="";
            if(hsn_ind!=-1){
                 hsn_code = hsn.substring(0,hsn_ind);
                 gstrate = hsn.substring(hsn_ind+1);
            }
            else if(hsn.indexOf("%")!=-1){
                if(hsn.indexOf(" ")!=-1){ 
                    hsn_ind=hsn.indexOf(" ");
                    hsn_code = hsn.substring(0,hsn_ind);
                    gstrate = hsn.substring(hsn_ind+1);
                } 
            }
            else{
                hsn_code = hsn;
                if(cgst_flag == true && sgst_flag == true){
                    gstrate= cgst_rate + sgst_rate; 
                }
                else
                    gstrate = igst_rate;
                gstrate  = gstrate + "%"
            }
                

           
            var quantity = po_rec.getSublistValue({
                sublistId:'item',
                fieldId : 'quantity',
                line    : j
            });
            var rate_discounted = po_rec.getSublistValue({
                sublistId:'item',
                fieldId : 'rate',
                line    : j
            });
      		var rate = po_rec.getSublistValue({
                sublistId:'item',
                fieldId : 'custcolctra_rate',
                line    : j
            });
      		if(!rate) {
      			rate = rate_discounted;
            }
      		var discount = po_rec.getSublistValue({
                sublistId: 'item',
              	fieldId:   'custcol_ctra_discounted',
              	line : j
            });
      		if(discount){
              discount = discount + '(%)'
            }
            log.debug("rate",rate);
          //  rate = Math.round( rate);
            var amount = po_rec.getSublistValue({
                sublistId:'item',
                fieldId : 'amount',
                line    : j
            });
      
              if(itemtype == 'Discount'){
                var item_rec=record.load({
                    type:'discountitem',
                    id: item_id
                });
               var item_name= item_rec.getText("itemid");
               item_name = item_name.replace(/&/g,"&amp;")
               var displayname = item_rec.getText("displayname");
               displayname = displayname.replace(/&/g,"&amp;")
               amount = po_rec.getSublistText({
                 sublistId: 'item',
                 fieldId: 'amount',
                 line: j
               });
            amount = Math.abs(Number(amount.replace(',','')));
            item_name = po_rec.getSublistText({
              sublistId: 'item',
              fieldId: 'item',
              line: j
            })
            gstrate = '';
            log.error('Discount Name 423', item_name);
            log.error('Discount Amount 424', amount);
          }
      
           // amount = getdecimal(amount);
//f           amount = Math.round(amount);
          //if(item_desc!="Freight")
               item_arr.push({item:item,item_name:item_name,displayname:displayname,item_desc:item_desc,units:units,gstrate:gstrate,quantity:quantity,amount: get_indian_format(amount),hsn:hsn_code,rate: get_indian_format(rate),rate_discounted:get_indian_format(rate_discounted),discount:discount});
    }
    var tr;
    for(var t=0;t<item_arr.length;t++){
            var td = '<td align="left" style="border-right:1px;border-bottom:0px;border-left:0px;color:#000000;"><span style="font-family:verdana,geneva,sans-serif;"><span style="font-family:verdana,geneva,sans-serif;font-size:11px;">'+parseInt(t+1)+'</span></span></td>\
            <td align="left" style="border-right:1px;border-bottom:0px;color:#000000;"><span style="font-family:verdana,geneva,sans-serif;font-size:11px;">'+item_arr[t].item_name+'</span>&nbsp;&nbsp;&nbsp;<span style="font-family:verdana,geneva,sans-serif;font-size:11px;"></span></td>\
            <td align="left" style="border-right:1px;border-bottom:0px;color:#000000;"><span style="font-family:verdana,geneva,sans-serif;font-size:11px;">'+item_arr[t].displayname+'</span>&nbsp;&nbsp;&nbsp;<span style="font-family:verdana,geneva,sans-serif;font-size:11px;"></span></td>\
        <td align="center" style="border-right:1px;border-bottom:0px;border-left:0px;color:#000000;"><span style="font-family:verdana,geneva,sans-serif;font-size:9px;"></span>'+item_arr[t].hsn+'</td>\
        <td align="center" style="border-right:1px;border-bottom:0px;border-left:0px;color:#000000;"><span style="font-family:verdana,geneva,sans-serif;font-size:9px;"></span>'+item_arr[t].gstrate+'</td>\
        <td align="center" style="border-right:1px;border-bottom:0px;border-left:0px;color:#000000;"><span style="font-family:verdana,geneva,sans-serif;font-size:11px;">'+item_arr[t].quantity+'</span></td>\
        <td align="center" style="border-right:1px;border-bottom:0px;color:#000000;"><span style="font-family:verdana,geneva,sans-serif;font-size:11px;">'+item_arr[t].units+'</span></td>\
        <td align="center" style="border-right:1px;border-bottom:0px;color:#000000;"><span style="font-family:verdana,geneva,sans-serif;font-size:11px;">'+item_arr[t].rate+'</span></td>\
		<td align="center" style="border-right:1px;border-bottom:0px;color:#000000;"><span style="font-family:verdana,geneva,sans-serif;font-size:11px;"></span></td>\
        <td align="center" style="border-right:1px;border-bottom:0px;color:#000000;"><span style="font-family:verdana,geneva,sans-serif;font-size:11px;">'+item_arr[t].rate_discounted+'</span></td>\
        <td align="right" style="border-right:0px;border-bottom:0px;color:#000000;"><span style="font-family:verdana,geneva,sans-serif;font-size:11px;">'+item_arr[t].amount+'</span></td>';
      tr +='<tr style="line-height: 15px">'+td+'</tr>';  
    }
     
    var tax_arr = [];
    for(var k=0;k<taxdetails_len;k++){
        for(var l=0;l<items_len;l++){
            var tax_taxdetailsreference = po_rec.getSublistValue({
                sublistId:'taxdetails',
                fieldId:'taxdetailsreference',
                line    : k
            });
      //    log.error('tax_taxdetailsreference', tax_taxdetailsreference)
            var item_taxdetailsreference =  po_rec.getSublistValue({
                sublistId:'item',
                fieldId:'taxdetailsreference',
                line    : l
            });
            var expense_taxdetailsreference = po_rec.getSublistValue({
              sublistId: 'expense',
              fieldId: 'taxdetailsreference',
              line : l
            });
            if(tax_taxdetailsreference == item_taxdetailsreference){
                  var item_hsn = po_rec.getSublistText({
                    sublistId:'item',
                    fieldId : 'custcol_in_hsn_code',
                    line    : l
                });
            } else if(tax_taxdetailsreference == expense_taxdetailsreference){
                var item_hsn = po_rec.getSublistText({
                    sublistId:'expense',
                    fieldId : 'custcol_in_hsn_code',
                    line    : l
                });
            }
                var netamount = po_rec.getSublistValue({
                    sublistId:'taxdetails',
                    fieldId : 'netamount',
                    line    : k
                });
//f                netamount = Math.round(netamount); 
                var taxtype = po_rec.getSublistText({
                    sublistId:'taxdetails',
                    fieldId : 'taxtype',
                    line    : k
                });
                var taxrate = po_rec.getSublistText({
                    sublistId:'taxdetails',
                    fieldId : 'taxrate',
                    line    : k
                });
                var taxamount = po_rec.getSublistValue({
                    sublistId:'taxdetails',
                    fieldId : 'taxamount',
                    line    : k
                });
//f                taxamount = Math.round(taxamount); 
                if(taxamount > 0)
                   taxamount = get_indian_format(taxamount);
                else
                  taxamount =  parseInt(taxamount).toFixed(2);
        }
        tax_arr.push({item_hsn:item_hsn,netamount: get_indian_format(netamount),taxtype:taxtype,taxrate:taxrate, taxamount:  taxamount})
  //    log.error('510', tax_arr);
        var th;
        th = ' <tr>\
                <th align="center" border="0.5"   width="20%"  style="text-align: center; border-color: rgb(0,0,0); vertical-align: middle; border-top:0.5px"><span style="font-family:verdana,geneva,sans-serif;font-size:9px;"><span style="font-family:verdana,geneva,sans-serif;">HSN/SAC</span></span></th>\
        <th align="center" border="0.5"    width="20%" style="text-align: center;  border-color: rgb(0,0,0);vertical-align: middle; border-top:0.5px;border-left:0px;"><span><span style="font-family:verdana,geneva,sans-serif;font-size:9px;"><strong><span style="font-family:verdana,geneva,sans-serif;">Taxable Value</span></strong></span></span></th>\
            <th align="center" border="0.5"  width="20%"  style="text-align: center;  border-color: rgb(0,0,0);vertical-align: middle; border-top:0.5px;border-left:0px;"><span style="font-family:verdana,geneva,sans-serif;font-size:9px;border-left:0px;"><span style="font-family:verdana,geneva,sans-serif;">Tax Type</span></span></th>\
        <th align="center" border="0.5"   width="20%" style="text-align: center;  border-color: rgb(0,0,0); vertical-align: middle; border-top:0.5px; border-left:0px;"><span><span style="font-family:verdana,geneva,sans-serif;font-size:9px;"><strong><span style="font-family:verdana,geneva,sans-serif;">Tax Rate</span></strong></span></span></th>\
            <th align="center" border="0.5"   width="20%" style="text-align:center;  border-color: rgb(0,0,0); vertical-align: middle;  border-top:0.5px;border-left:0px;"><span><span style="font-family:verdana,geneva,sans-serif;font-size:9px;"><strong><span style="font-family:verdana,geneva,sans-serif;">Total  Tax Amount</span></strong></span></span></th>\
            </tr>';
       }
   
     var tr1;var td1;
     for(var b=0;b<tax_arr.length;b++){
        td1='<td align="center" style=" border-color: rgb(0,0,0);border-right:0.5px;border-bottom:0px;border-left:0.5px;"><span style="font-family:verdana,geneva,sans-serif;"><span style="font-family:verdana,geneva,sans-serif;font-size:10px;">'+tax_arr[b].item_hsn+'</span></span></td>\
          <td align="center" style=" border-color: rgb(0,0,0);border-right:0.5px;border-bottom:0px;"><span style="font-family:verdana,geneva,sans-serif;font-size:10PX">'+tax_arr[b].netamount+'</span></td>\
       <td align="center" style=" border-color: rgb(0,0,0);border-right:0.5px;border-bottom:0px;"><span style="font-family:verdana,geneva,sans-serif;font-size:10px;">'+tax_arr[b].taxtype+'</span></td>\
        <td align="center" style=" border-color: rgb(0,0,0);border-right:0.5px;border-bottom:0px;"><span style="font-family:verdana,geneva,sans-serif;font-size:10px;">'+tax_arr[b].taxrate+'</span></td>\
          <td align="center" style=" border-color: rgb(0,0,0);border-right:0.5px;border-bottom:0px;"><span style="font-family:verdana,geneva,sans-serif;font-size:10px;">'+tax_arr[b].taxamount+'</span></td>';
        tr1+='<tr>'+td1+'</tr>';
        }
    var sub_total = po_rec.getValue("subtotal");
    log.debug("sub_total",sub_total);
    if(fr_flag==true){
           sub_total =  sub_total - freight;
    }
//f    sub_total  = Math.round(sub_total); 
           
   
    var total = parseInt(sub_total)+parseInt(sgst)+parseInt(cgst)+parseInt(igst)+freight;
    total=total.toFixed(2);
    var amt_in_words;
    if(total>0){
       
       if(po_rec.getValue("currency")=="2"){
          amt_in_words = convert_number(total);
         amt_in_words = amt_in_words +" "+"Dollars"+" "+"Only";
       }
        
      else{
        amt_in_words= convertNumberToWords(total);
        
      }
         
    }
    
    if(cgst_flag==true)
       cgst = cgst;
    else
       cgst=" ";


    if(sgst_flag==true)
       sgst = sgst;
    else
       sgst=" ";


    if(igst_flag==true)
           igst = igst;
    else
           igst=" ";

     if(fr_flag==true)
           freight = get_indian_format(freight);
     else if(fr_check == true){
        freight="Freight on actual terms";
     }
     else
        freight = " ";
           
    var subsidiary=po_rec.getText("subsidiary");
    log.debug("su",subsidiary);
 var xmlTemplateFile ='<?xml version="1.0"?><!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">\
<pdf>\
<head>\
<#if .locale == "ru_RU">\
    <link name="verdana" type="font" subtype="opentype" src="${nsfont.verdana}" src-bold="${nsfont.verdana_bold}" bytes="2" />\
</#if>\
  <macrolist>\
        <macro id="nlheader">\
          <#assign order_type = record.custbody_po_type />\
          <table border="1" style="width:100%; border-color:rgb(0,0,0);border-collapse:collapse;">\
            <tr>\
             <td style="border-color: rgb(0,0,0);width: 30%;"><img src="https://6810795.app.netsuite.com/core/media/media.nl?id=3489&amp;c=6810795&amp;h=EB-Zc9L5bEhzIA0JV9O21dN9Gf3LCvhu0i4jm85tWaj8FcXg&amp;fcts=20220602053222&amp;whence=" style="width:140px; height:90px; float: left; margin: 7px;" /></td>\
\
                 <td style="border-color:rgb(0,0,0);width:40%;margin-left:50px;align:right;margin-top:35px;color:blue;font-size:23px;"><span style="font-family:verdana,geneva,sans-serif;font-color:rgb(70,130,180);"></span>PURCHASE ORDER</td>\
\
              <#if order_type == "Service Order">\
      <td style="border-color:rgb(0,0,0);width:40%;margin-left:50px;align:right;margin-top:25px;color:blue;"><span style="font-family:verdana,geneva,sans-serif;font-size:20px;font-color:rgb(70,130,180);"><strong>SERVICE ORDER</strong></span></td>\
		</#if>\
              <#if order_type == "Work Order">\
      <td style="border-color:rgb(0,0,0);width:40%;margin-left:50px;align:right;margin-top:25px;color:blue;"><span style="font-family:verdana,geneva,sans-serif;font-size:20px;font-color:rgb(70,130,180);"><strong>WORK ORDER</strong></span></td>\
		</#if>\
            </tr>\
             </table>\
    </macro>\
    <macro id="nlfooter">\
         <table border="0" style="width: 100%;margin-bottom:0px; border-color: rgb(0,0,0);border-collapse:collapse;">\
      <tr>\
           <td colspan="7" align="right" style="width:100%;border-right:0px;border-bottom:0px;font-size: 13px;" ><span style="font-family:verdana,geneva,serif;font-size:12px;">Page &nbsp;<pagenumber/> &nbsp;of &nbsp;<totalpages/></span><br /></td>\
            </tr>\
	</table>\
      </macro>\
    </macrolist>\
\
  <style type="text/css">table {\
        <#if .locale == "zh_CN">\
            font-family: stsong, sans-serif;\
        <#elseif .locale == "zh_TW">\
            font-family: msung, sans-serif;\
        <#elseif .locale == "ja_JP">\
            font-family: heiseimin, sans-serif;\
        <#elseif .locale == "ko_KR">\
            font-family: hygothic, sans-serif;\
        <#elseif .locale == "ru_RU">\
            font-family: verdana;\
        <#else>\
            font-family: sans-serif;\
        </#if>\
            font-size: 9pt;\
            table-layout: fixed;\
        }\
        th {\
            font-weight: bold;\
            font-size: 8pt;\
            vertical-align: middle;\
            padding: 5px 6px 3px;\
            background-color: #e3e3e3;\
            color: #333333;\
        }\
        td {\
            padding: 2px 4px;\
        }\
        b {\
            font-weight: bold;\
            color: #333333;\
        }\
        table.header td {\
            padding: 0;\
            font-size: 10pt;\
        }\
        table.footer td {\
            padding: 0;\
            font-size: 6pt;\
        }\
        table.itemtable th {\
            padding-bottom: 5px;\
            padding-top: 5px;\
        }\
\
        table.body td {\
            padding-top: 2px;\
        }\
        table.total {\
            page-break-inside: avoid;\
        }\
        tr.totalrow {\
            background-color: #e3e3e3;\
            line-height: 200%;\
        }\
        td.totalboxtop {\
            font-size: 12pt;\
            background-color: #e3e3e3;\
        }\
        td.addressheader {\
            font-size: 8pt;\
            padding-top: 6px;\
            padding-bottom: 2px;\
        }\
        td.address {\
            padding-top: 0;\
        }\
        td.totalboxmid {\
            font-size: 28pt;\
            padding-top: 20px;\
            background-color: #e3e3e3;\
        }\
        td.totalboxbot {\
            background-color: #e3e3e3;\
            font-weight: bold;\
        }\
        span.title {\
            font-size: 20pt;\
        }\
        span.number {\
            font-size: 14pt;\
        }\
        span.itemname {\
            font-weight: bold;\
            line-height: 150%;\
        }\
        hr {\
            width: 100%;\
            color: #d3d3d3;\
            background-color: #d3d3d3;\
            height: 1px;\
        }\
      .innertable td{\
        border:1px solid black;\
        padding:10px;\
      }\
   </style>\
</head>\
<body header="nlheader" header-height="10.5%"  footer="nlfooter" footer-height="01%" padding="0.2in 0.2in 0.5in 0.2in" size="A4">\
<#if record.approvalstatus =="Pending Approval">\
   <div class="background">\
  <p rotate="310"  style="color:lightgrey;position:absolute; top:120; bottom:0; left:10; right:0; font-size:98px;">${record.approvalstatus}</p>\
	</div></#if>\
<#if record.approvalstatus =="Rejected">\
   <div class="background">\
  <p rotate="310"  style="color:lightgrey;position:absolute; top:120; bottom:0; left:150; right:0; font-size:98px;">${record.approvalstatus}</p>\
	</div></#if>\
  <#macro repeat count end cgst igst sgst taxamount sqty><#list 1..count as x>\
  <table border="1" style="width:100%; border-collapse:collapse;border-top:0px;">\
   <tr>\
      <td width="50%"  style="align:center;color:white;font-family:verdana,geneva,sans-serif;font-size:10px;background-color: royalblue;border-top:0.5px;border-bottom:1px;padding-top:5px"><strong>Supplier</strong></td>\
      <td style="font-family:verdana,geneva,sans-serif;font-size:11px;border-bottom:1px;border-right:1px;border-left:1px;padding-top:5px;padding-bottom:5px;" align="left" width="25%"><b>Order Number</b></td>\
      <td align="left" style="font-size:11px;border-bottom:1px;padding-top:5px;padding-bottom:5px;" width="25%">${record.tranid}</td></tr>\
      <tr>      \
      <td  rowspan="2" style="font-family:verdana,geneva,sans-serif;font-size:11px;border-bottom:0px;border-right:0px;" width="50%"><!--<br/>${companyinformation.companyname}-->${record.billaddress}<br/><b>GST:</b>${record.entitytaxregnum}</td>\
       <td style="font-family:verdana,geneva,sans-serif;font-size:11px;border-bottom:1px;border-right:1px;border-left:1px;" align="left" width="25%"><b>Date</b></td>\
      <td align="left" style="font-size:11px;border-bottom:1px;" width="25%">${record.trandate}</td>\
     </tr>\
     <tr>\
       <td colspan="2" style="font-family:verdana,geneva,sans-serif;font-size:10px;border-bottom:0px;border-right:0px;border-left:1px;" align="left" width="50%">Please mention above order number in further correspondence/dispatch documents</td>\
     </tr>\
          </table>\
   <table border="1" style="width:100%; border-collapse:collapse;border-top:0px;">\
            <tr>\
              <td width="50%" style="align:center;color:white;font-family:verdana,geneva,sans-serif;font-size:10px;background-color: royalblue;"><strong>Billing Address</strong></td>\
              <td width="50%" style="align:center;color:white;font-family:verdana,geneva,sans-serif;font-size:10px;border-left:1px;background-color: royalblue;"><strong>Shipping Address</strong></td>\
            </tr>\
            </table>\
          <table border="1" style="width:100%; border-collapse:collapse;border-top:0px;">\
            <tr height="07%">\
           <td width="50%" style="align:left;font-family:verdana,geneva,sans-serif;font-size:10px;">'+ newAddress+'<br/><b>GST:</b>${record.subsidiarytaxregnum?keep_before(" ")}<br/><b>PAN:</b>'+pan+'<br/><b>CIN:</b>'+cin+'</td>\
          <td width="50%" style="align:left;font-family:verdana,geneva,sans-serif;font-size:10px;border-left:1px;">${record.shipaddress}<br/><b>GST:</b>${record.subsidiarytaxregnum?keep_before(" ")}<br/><b>PAN:</b>'+pan+'<br/><b>CIN:</b>'+cin+'</td>\
            </tr>\
            <!-- <tr>\
            <td width="100%" colspan="4" style="border-top:1px;"><b>Welcome Notes:</b><br/>&nbsp;</td>\
            </tr>-->\
              </table>\
    <table border="0" style="width:100%; height:10px;">\
    <tr><td></td></tr></table>\
    <table border="0" style="width:100%; border-collapse:collapse;border-top:0px;">\
      <tr height="02%">\
        <td style="border-right:1px;border-bottom:1px;border-top:1px;border-left:1px;"><b>Memo:</b>&nbsp;&nbsp;${record.memo}&nbsp;&nbsp;<b>Type of PO:</b>&nbsp;&nbsp;${record.custbody7}</td>\
      </tr>\
      <tr height="02%">\
        <td style="border-right:1px;border-bottom:1px;border-left:1px;"><b>Payment Terms:</b>&nbsp;&nbsp;${record.terms}&nbsp;&nbsp;<b>Incoterm:</b>&nbsp;&nbsp;${record.incoterm}</td>\
      </tr>\
      <tr height="02%">\
        <td style="border-right:1px;border-bottom:1px;border-left:1px;">Please Submit document in duplicate for each supply giving full details</td>\
      </tr>\
      <tr height="02%">\
        <td style="border-right:1px;border-bottom:0px;border-left:1px;"><b>Special Instruction:</b>&nbsp;&nbsp;${record.custbody_specialinstructions}</td>\
      </tr>\
    </table>\
<table border="1" class="itemtable" style="width: 100%; height:160px;border-collapse:collapse;"><!-- start items -->\
<thead>\
 <tr>\
   <th align="left"  rowspan="2" width="6%"  style="text-align: center;border-top:0px;border-left:0px;border-right:1px;border-bottom:1px;vertical-align: middle; background-color: rgb(224, 224, 224); border-color: rgb(0,0,0);"><span style="font-family:verdana,geneva,sans-serif;font-size:11px;color:#000000;"><span style="font-family:verdana,geneva,sans-serif;">Sl.No</span></span></th>\
   <th align="left"   rowspan="2" width="12%" style="text-align: center;border-top:0px;border-left:1px;border-right:1px;border-bottom:1px;vertical-align: middle; background-color: rgb(224, 224, 224); border-color: rgb(0,0,0);border-left:0px;"><span style="color:#000000;"><span style="font-family:verdana,geneva,sans-serif;font-size:11px;"><strong><span style="font-family:verdana,geneva,sans-serif;">Item Code</span></strong></span></span></th>\
    <th align="left" rowspan="2" width="15%" style="text-align: center;border-top:0px;border-left:1px;border-right:1px;border-bottom:1px;vertical-align: middle; background-color: rgb(224, 224, 224); border-color: rgb(0,0,0);border-left:0px;"><span style="color:#000000;"><span style="font-family:verdana,geneva,sans-serif;font-size:11px;"><strong><span style="font-family:verdana,geneva,sans-serif;">Item Display<br/>Name</span></strong></span></span></th>\
   <th align="center"  rowspan="2" width="7%" style="text-align: center;border-top:0px;border-left:1px;border-right:1px;border-bottom:1px;vertical-align: middle; background-color: rgb(224, 224, 224); border-color: rgb(0,0,0);border-left:0px;"><span style="color:#000000;"><span style="font-family:verd8a,geneva,sans-serif;font-size:11px;"><strong><span style="font-family:verdana,geneva,sans-serif;">HSN <br/>code</span></strong></span></span></th>\
    <th align="center"  rowspan="2" width="6%"  style="text-align: center;border-top:0px;border-left:0px;border-right:1px;border-bottom:1px;vertical-align: middle; background-color: rgb(224, 224, 224); border-color: rgb(0,0,0);"><span style="font-family:verdana,geneva,sans-serif;font-size:11px;color:#000000;"><span style="font-family:verdana,geneva,sans-serif;">GST <br/>Rate</span></span></th>\
 <th align="center"  rowspan="2" width="5%"   style="text-align: center;border-top:0px;border-left:1px;border-right:1px;border-bottom:1px;vertical-align: middle; background-color: rgb(224, 224, 224);border-color: rgb(0,0,0);border-left:0px;"><span style="color:#000000;"><span style="font-family:verdana,geneva,sans-serif;font-size:11px;"><strong><span style="font-family:verdana,geneva,sans-serif;">QTY</span></strong></span></span></th>\
  <th align="center" rowspan="2"  width="7%"  style="text-align: center;border-top:0px;border-right:1px;border-bottom:1px;vertical-align: middle; background-color: rgb(224, 224, 224);border-color: rgb(0,0,0);border-left:0px;"><span style="color:#000000;"><span style="font-family:verdana,geneva,sans-serif;font-size:11px;"><strong><span style="font-family:verdana,geneva,sans-serif;">Units</span></strong></span></span></th>\
   <th align="center" rowspan="2"  width="10%"  style="text-align: center;border-top:0px;border-right:1px;border-bottom:1px;vertical-align: middle; background-color: rgb(224, 224, 224);border-color: rgb(0,0,0);border-left:0px;"><span style="color:#000000;"><span style="font-family:verdana,geneva,sans-serif;font-size:11px;"><strong><span style="font-family:verdana,geneva,sans-serif;">Rate<br/><#if record.currency =="Indian Rupee">(INR)</#if></span></strong></span></span></th>\
   <th align="center" rowspan="2"  width="10%"  style="text-align: center;border-top:0px;border-right:1px;border-bottom:1px;vertical-align: middle; background-color: rgb(224, 224, 224);border-color: rgb(0,0,0);border-left:0px;"><span style="color:#000000;"><span style="font-family:verdana,geneva,sans-serif;font-size:11px;"><strong><span style="font-family:verdana,geneva,sans-serif;">Discount<br/></span></strong></span></span></th>\
   <th align="center" rowspan="2"  width="10%"  style="text-align: center;border-top:0px;border-right:1px;border-bottom:1px;vertical-align: middle; background-color: rgb(224, 224, 224);border-color: rgb(0,0,0);border-left:0px;"><span style="color:#000000;"><span style="font-family:verdana,geneva,sans-serif;font-size:11px;"><strong><span style="font-family:verdana,geneva,sans-serif;">Rate After Discount<br/><#if record.currency =="Indian Rupee">(INR)</#if></span></strong></span></span></th>\
    <th align="right"  rowspan="2"  width="12%"  style="text-align: right;border-top:0px;border-right:0px;border-left:1px;border-bottom:1px;vertical-align: middle; background-color: rgb(224, 224, 224);border-color: rgb(0,0,0);border-left:0px;"><span style="color:#000000;"><span style="font-family:verdana,geneva,sans-serif;font-size:11px;"><strong><span style="font-family:verdana,geneva,sans-serif;">Amount</span></strong></span></span></th>\
    </tr>\
  </thead>\
  <#assign cnt=0 />\
'+tr+'\
<#list record.item as item>\
    <#if  (item?counter == end && (x*100) gte item?counter)>\
<tr style="line-height: 10px">\
  <td align="center" style="border-right:1px;border-bottom:0px;border-left:0px;"></td>\
    <td align="left" style="border-right:1px;border-bottom:0px;"></td>\
  <td align="left" style="border-right:1px;border-bottom:0px;"></td>\
 <td align="right" style="border-right:1px;border-bottom:0px;border-left:0px;"></td>\
  <td align="left" style="border-right:1px;border-bottom:0px;"></td>\
   <td align="right" style="border-right:1px;border-bottom:0px;"></td>\
   <td align="right" style="border-right:1px;border-bottom:0px;"></td>\
  <td align="right" style="border-right:1px;border-bottom:0px;"></td>\
  <td align="right" style="border-right:0px;border-bottom:0px;"></td>\
  </tr>\
      <#if item?counter == end >\
      <!-- end items -->\
<tr style="height:2%;">\
  <td colspan="10"  border="1" style="border-bottom:0px;border-left:0px;border-right:1px;border-top:1px;align:right;"><span style="font-family:verdana,geneva,sans-serif;font-size:11px;align:right;"><b>SUBTOTAL(${record.currency})</b></span></td>\
   <#assign sub=record.subtotal?round>\
   <#if record.subtotal?has_content>\
        <#assign sub_tot = record.subtotal?round>\
   <#else>\
        <#assign sub_tot = 0/> \
   </#if>\
  <#assign sub=sub?string.currency>\
  <#assign sub=sub?remove_beginning("$")>\
  <td colspan="1"  align="right" border="1" style="border-top:1px;border-left:0px;border-bottom:0px;border-right:0px;"><span style="font-family:verdana,geneva,sans-serif;font-size:11px;align:right;"><b>'+ get_indian_format(sub_total-expense_amount)+'</b></span></td></tr>\
  <tr style="height:2%;">\
  <td colspan="10"  border="1" style="border-bottom:0px;border-left:0px;border-right:1px;border-top:1px;align:right;"><span style="font-family:verdana,geneva,sans-serif;font-size:11px;align:right;"><b>FREIGHT</b></span></td>\
   <#list record.item as item>\
   <#if item.description == "Freight">\
    <#assign freight = item.amount>\
   </#if>\
  </#list>\
\
  <#if freight?has_content>\
     <#assign freight_amt = freight>\
  <#else>\
     <#assign is_freight = record.custbody_evage_freightonactual>\
     <#assign is_freight = is_freight?string("yes","no")>\
     <#if is_freight=="yes">\
        <#assign freight_amt = "Freight on actual terms">\
    <#else>\
        <#assign freight_amt = " ">\
        <#assign freight = 0>\
     </#if>\
  </#if>\
  <td colspan="1"  align="right" border="1" style="border-top:1px;border-left:0px;border-bottom:0px;border-right:0px;"><span style="font-family:verdana,geneva,sans-serif;font-size:11px;align:right;"><b>'+freight+'</b></span></td></tr>\
  <tr style="height:2%;">\
  <td colspan="10"  border="1" style="border-bottom:0px;border-left:0px;border-right:1px;border-top:1px;align:right;"><span style="font-family:verdana,geneva,sans-serif;font-size:11px;align:right;"><b>MISCELLANEOUS</b></span></td>\
   <#list record.item as item>\
   <#if item.description == "Freight">\
    <#assign freight = item.amount>\
   </#if>\
  </#list>\
\
  <#if freight?has_content>\
     <#assign freight_amt = freight>\
  <#else>\
     <#assign is_freight = record.custbody_evage_freightonactual>\
     <#assign is_freight = is_freight?string("yes","no")>\
     <#if is_freight=="yes">\
        <#assign freight_amt = "Freight on actual terms">\
    <#else>\
        <#assign freight_amt = " ">\
        <#assign freight = 0>\
     </#if>\
  </#if>\
  <td colspan="1"  align="right" border="1" style="border-top:1px;border-left:0px;border-bottom:0px;border-right:0px;"><span style="font-family:verdana,geneva,sans-serif;font-size:11px;align:right;"><b>'+get_indian_format(expense_amount)+'</b></span></td></tr>\
  <tr style="height:2%;">\
  <td colspan="10"  border="1" style="border-bottom:0px;border-left:0px;border-right:1px;border-top:1px;align:right;"><span style="font-family:verdana,geneva,sans-serif;font-size:11px;align:right;"><b>IGST</b></span></td>\
   <#if record.taxtotal2?has_content>\
      <#assign igst_amt=0/>\
      <#list record.taxdetails as tax>\
                <#if tax.taxcode == "IGST">\
                <#assign igst_amt = igst_amt + tax.taxamount>\
                <#assign igst_amt = igst_amt?round>\
                <#assign igst_tot = igst_amt?round>\
                <#assign igst_amt = igst_amt?string.currency>\
                <#assign igst_amt=igst_amt?remove_beginning("$")>\
          </#if>\
      </#list>\
    <#else>\
        <#assign igst_amt=" "/> \
        <#assign igst_tot = 0>\
  </#if>\
  <td colspan="1"  align="right" border="1" style="border-top:1px;border-left:0px;border-bottom:0px;border-right:0px;"><span style="font-family:verdana,geneva,sans-serif;font-size:11px;align:right;"><b>'+ get_indian_format(igst)+'</b></span></td></tr>\
        <tr style="height:2%;">\
  <td colspan="10"  border="1" style="border-bottom:0px;border-left:0px;border-right:1px;border-top:1px;align:right;"><span style="font-family:verdana,geneva,sans-serif;font-size:11px;align:right;"><b>CGST</b></span></td>\
  <#if record.taxtotal3?has_content>\
           <#assign cgst_amt=0/>\
           <#list record.taxdetails as tax>\
            <#if tax.taxcode == "CGST">\
                <#assign cgst_amt = cgst_amt + tax.taxamount>\
                <#assign cgst_amt = cgst_amt?round>\
                <#assign cgst_tot = cgst_amt?round>\
                <#assign cgst_amt = cgst_amt?string.currency>\
                <#assign cgst_amt=cgst_amt?remove_beginning("$")>\
            </#if>\
           </#list>\
   <#else>\
        <#assign cgst_amt=" "/> \
        <#assign cgst_tot = 0>\
   </#if>\
  <td colspan="1"  align="right" border="1" style="border-top:1px;border-left:0px;border-bottom:0px;border-right:0px;"><span style="font-family:verdana,geneva,sans-serif;font-size:11px;align:right;"><b>'+ get_indian_format(cgst)+'</b></span></td></tr>\
        <tr style="height:2%;">\
        <#if record.taxtotal3?has_content>\
               <#assign sgst_amt=0/>\
               <#list record.taxdetails as tax>\
               <#if tax.taxcode == "SGST">\
                <#assign sgst_amt = sgst_amt + tax.taxamount>\
                <#assign sgst_amt = sgst_amt?round>\
                <#assign sgst_tot = sgst_amt?round>\
                <#assign sgst_amt = sgst_amt?string.currency>\
                <#assign sgst_amt=sgst_amt?remove_beginning("$")>\
              </#if>\
            </#list>\
        <#else>\
           <#assign sgst_amt=" "/> \
           <#assign sgst_tot = 0>\
   </#if>\
  <td colspan="10"  border="1" style="border-bottom:0px;border-left:0px;border-right:1px;border-top:1px;align:right;"><span style="font-family:verdana,geneva,sans-serif;font-size:11px;align:right;"><b>SGST</b></span></td>\
 \
  <td colspan="1"  align="right" border="1" style="border-top:1px;border-left:0px;border-bottom:0px;border-right:0px;"><span style="font-family:verdana,geneva,sans-serif;font-size:11px;align:right;"><b>'+ get_indian_format(sgst)+'</b></span></td></tr>\
        <tr>\
  <td colspan="10"  border="1" style="border-top:1px;border-left:0px;border-bottom:0px;align:right;"><br/><span style="font-family:verdana,geneva,sans-serif;font-size:11px;align:right;"><b>Total&nbsp;&nbsp;&nbsp;</b></span></td>\
  <#assign tot = sub_tot + igst_tot + cgst_tot + sgst_tot>\
   <#assign tot = tot?string.currency>\
             <#assign tot=tot?remove_beginning("$")>\
  <td colspan="1" align="right" border="1" style="border-top:1px;border-left:0px;border-bottom:0px;border-right:0px;"><br/><span style="font-family:verdana,geneva,sans-serif;font-size:11px;align:right;"><b>'+ get_indian_format(newTotal)+'</b></span></td>\
</tr>\
        <tr>\
  <td colspan="10"  border="1" style="border-top:1px;border-left:0px;border-bottom:0px;align:right;"><br/><span style="font-family:verdana,geneva,sans-serif;font-size:11px;align:right;"><b>Round Off&nbsp;&nbsp;&nbsp;</b></span></td>\
  <#assign tot = sub_tot + igst_tot + cgst_tot + sgst_tot>\
   <#assign tot = tot?string.currency>\
             <#assign tot=tot?remove_beginning("$")>\
  <td colspan="1" align="right" border="1" style="border-top:1px;border-left:0px;border-bottom:0px;border-right:0px;"><br/><span style="font-family:verdana,geneva,sans-serif;font-size:11px;align:right;"><b>'+ get_indian_format(roundValue)+'</b></span></td>\
</tr>\
        <tr style="height:2%;">\
  <td colspan="10"  border="1" style="border-top:1px;border-left:0px;border-bottom:0px;align:right;"><br/><span style="font-family:verdana,geneva,sans-serif;font-size:11px;align:right;"><b>Rounded Total&nbsp;&nbsp;&nbsp;</b></span></td>\
  <#assign tot = sub_tot + igst_tot + cgst_tot + sgst_tot>\
   <#assign tot = tot?string.currency>\
             <#assign tot=tot?remove_beginning("$")>\
  <td colspan="1" align="right" border="1" style="border-top:1px;border-left:0px;border-bottom:0px;border-right:0px;"><br/><span style="font-family:verdana,geneva,sans-serif;font-size:11px;align:right;"><b>'+ get_indian_format(myTotal)+'</b></span></td>\
</tr>\
         <tr style="height:2%;">\
          <td colspan="14" align="left" style="text-align: center; vertical-align: middle;border-bottom:1px;border-left:0px;border-top:1px;border-right:0px;width:100%;"><b>Amount In Words:</b>&nbsp;${record.currency}&nbsp;'+ amt_in_words+'</td></tr>\
        </#if></#if></#list>\
    </table>\
        <table style="width:100%;border-bottom:1px;height:2%">\
        <#if record.taxdetails?has_content>\
            <tr>\
                <th align="center" border="0.5"   width="20%"  style="text-align: center; border-color: rgb(0,0,0); vertical-align: middle; border-top:0.5px"><span style="font-family:verdana,geneva,sans-serif;font-size:9px;"><span style="font-family:verdana,geneva,sans-serif;">HSN/SAC</span></span></th>\
           <th align="center" border="0.5"    width="20%" style="text-align: center;  border-color: rgb(0,0,0);vertical-align: middle; border-top:0.5px;border-left:0px;"><span><span style="font-family:verdana,geneva,sans-serif;font-size:9px;"><strong><span style="font-family:verdana,geneva,sans-serif;">Taxable Value</span></strong></span></span></th>\
            <th align="center" border="0.5"  width="20%"  style="text-align: center;  border-color: rgb(0,0,0);vertical-align: middle; border-top:0.5px;border-left:0px;"><span style="font-family:verdana,geneva,sans-serif;font-size:9px;border-left:0px;"><span style="font-family:verdana,geneva,sans-serif;">Tax Type</span></span></th>\
           <th align="center" border="0.5"   width="20%" style="text-align: center;  border-color: rgb(0,0,0); vertical-align: middle; border-top:0.5px; border-left:0px;"><span><span style="font-family:verdana,geneva,sans-serif;font-size:9px;"><strong><span style="font-family:verdana,geneva,sans-serif;">Tax Rate</span></strong></span></span></th>\
             <th align="center" border="0.5"   width="20%" style="text-align:center;  border-color: rgb(0,0,0); vertical-align: middle;  border-top:0.5px;border-left:0px;"><span><span style="font-family:verdana,geneva,sans-serif;font-size:9px;"><strong><span style="font-family:verdana,geneva,sans-serif;">Total  Tax Amount</span></strong></span></span></th>\
            </tr>\
        </#if>\
            '+tr1+'\
      </table>\
    <table width="100%">\
            <tr>\
    <td  width="65%" height="100%" border="1" style="border-bottom:1px;border-left:1px;border-top:0px;align:left;border-right:0px;"><span style="font-family:verdana,geneva,sans-serif;"><span style="font-size:10px;"></span></span><span style="font-family:verdana,geneva,sans-serif;font-size:11px;"></span>\
     </td>\
              <td  width="35%"  border="1" style="border-bottom:1px;border-left:0px;border-top:0px;align:right"><b>For &nbsp;&nbsp;'+subsidiary+'</b><br/>'+ img+'<span style="margin-right:20px"><b>Authorised Signatory</b></span>\
     </td>\
    </tr>\
</table>\
  <table width="100%">\
  <tr>\
  <td  width="100%" height="100%" border="1" style="border-bottom:1px;border-left:1px;border-top:0px;align:left;border-right:1px;"><span style="font-family:verdana,geneva,sans-serif;"><span style="font-size:10px;"></span></span><span style="font-family:verdana,geneva,sans-serif;font-size:12px;"><b>Terms &amp; Condition: </b></span><span style="font-family:verdana,geneva,sans-serif;font-size:9px;"><br/>'+termscond+'</span></td>\
  </tr>\
</table>\
</#list></#macro>\
<#function sum><#list record.item as item><#assign summ=(item?counter/100)?ceiling /> </#list><#return summ/> </#function>\
<#function last><#list record.item as item><#assign lastt=item?counter /></#list><#return lastt/> </#function>\
<#function sumqty><#assign NewQty=0/><#list record.item as item><#assign NewQty = NewQty + item.quantity /></#list><#return NewQty/></#function>\
<#function cgstamt>\
  <#assign NewQty=0/>\
  <#list record.taxdetails as taxdetails>\
     <#if taxdetails.taxcode_display == "CGST">\
       <#assign NewQty = NewQty + taxdetails.taxamount>\
       <#else>\
       <#assign zz=0/>\
      </#if>\
  </#list>\
  <#return NewQty/>\
</#function>\
<#function sgstamt><#assign NewQty=0/><#list record.taxdetails as taxdetails><#if taxdetails.taxcode_display == "SGST"><#assign NewQty = NewQty + taxdetails.taxamount/><#else><#assign zz=0/></#if></#list><#return NewQty/></#function>\
<#function igstamt><#assign NewQty=0/><#list record.taxdetails as taxdetails><#if taxdetails.taxcode_display == "IGST"><#assign NewQty = NewQty + taxdetails.taxamount/><#else><#assign zz=0/></#if></#list><#return NewQty/></#function>\
<#function taxamt><#assign NewQty=0/> <#list record.item as item><#assign NewQty = NewQty + item.amount /></#list><#return NewQty/></#function>\
\
<@repeat count = sum() end=last() cgst=cgstamt()  sgst=sgstamt()  igst=igstamt() taxamount=taxamt() sqty=sumqty() > </@repeat>\
<div style="text-align: right;"></div>\
</body>\
 </pdf>';
        var tpl = xmlTemplateFile;
        var renderer = render.create();
        renderer.templateContent = tpl;
        // log.debug({
            // title: 'renderer',
            // details: renderer
        // });
        renderer.addRecord('record', po_rec)
        var invoicePdf = renderer.renderAsPdf();
        context.response.writeFile({
            file: invoicePdf,
            isInline: true
        });
    }
    return {
        onRequest: onRequest
    }
});
function convertNumberToWords(usertotal) {
    var fraction = Math.round(frac(usertotal) * 100);
    var f_text = "";

    if (fraction > 0) {
        f_text = "And " + convert_number(fraction) + " Paise";
    }

    return convert_number(usertotal) + " Rupees " + f_text + " Only";
}

function frac(f) {
    return f % 1;
}

function convert_number(number) {
    if ((number < 0) || (number > 999999999)) {
        return "NUMBER OUT OF RANGE!";
    }
    var Gn = Math.floor(number / 10000000);  /* Crore */
    number -= Gn * 10000000;
    var kn = Math.floor(number / 100000);     /* lakhs */
    number -= kn * 100000;
    var Hn = Math.floor(number / 1000);      /* thousand */
    number -= Hn * 1000;
    var Dn = Math.floor(number / 100);       /* Tens (deca) */
    number = number % 100;               /* Ones */
    var tn = Math.floor(number / 10);
    var one = Math.floor(number % 10);
    var res = "";

    if (Gn > 0) {
        res += (convert_number(Gn) + " Crore");
    }
    if (kn > 0) {
        res += (((res == "") ? "" : " ") +
            convert_number(kn) + " Lakh");
    }
    if (Hn > 0) {
        res += (((res == "") ? "" : " ") +
            convert_number(Hn) + " Thousand");
    }

    if (Dn) {
        res += (((res == "") ? "" : " ") +
            convert_number(Dn) + " Hundred");
    }


    var ones = Array("", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "SIXTEEN", "Seventeen", "Eighteen", "Nineteen");
    var tens = Array("", "", "Twenty", "Thirty", "Fourty", "Fifty", "Sixty", "Sventy", "Eighty", "Ninety");

    if (tn > 0 || one > 0) {
        if (!(res == "")) {
            res += " And ";
        }
        if (tn < 2) {
            res += ones[tn * 10 + one];
        }
        else {

            res += tens[tn];
            if (one > 0) {
                res += ("-" + ones[one]);
            }
        }
    }

    if (res == "") {
        res = "zero";
    }
    return res;
}
function getdecimal(type_amount) {
  var type = type_amount;
    if(type.toString().indexOf(".")!=-1){
        var index = type.toString().indexOf(".");
        var get_digit = type.toString().charAt(index+1);
        log.debug("gt do",get_digit );
        if(parseInt(get_digit) >= 5){
            type = Math.round(type); 
            type = type.toFixed(2);
            return type
        }
        else
            return type_amount
    }
    return type_amount = parseInt(type_amount).toFixed(2);
    

 
}
function get_indian_format(get_tax_value){
    var org_amt = get_tax_value;
    get_tax_value = new Number(get_tax_value);
    if(get_tax_value > 0){
            get_tax_value = parseFloat(get_tax_value).toFixed(2);
            var get_point_index = get_tax_value.indexOf(".");//find index of point
            var get_whole_number = get_tax_value.slice(0,get_point_index);//get whole number by slicing decimal values
        if(get_whole_number.length > 3){
        log.debug("get_tax_value.length",get_tax_value.length);
            var arr_char=[];
                arr_char = get_tax_value.split("");
                var remove_last=get_tax_value.length - 6;//last three digits starting index
                var last_three_digits= [];//declare as an array variable inorder to perform join
                last_three_digits= arr_char.splice(remove_last);//removelast three digits[1,2,3,4,5,6 to 1,2,3]
                last_three_digits= last_three_digits.join('');
                var no_last_three= arr_char.join('');//join the separated string values to a single string value (1,2,3 to 123)
                var ind_currency_format= [];
                no_last_three = no_last_three.replace(/(\d)(?=(\d{2})+$)/g, '$1,');//addcomma at every two digits 
                ind_currency_format.push(no_last_three,last_three_digits);  
        }
        else
        ind_currency_format = get_tax_value; 
    }
    else
        ind_currency_format =  ' ';
return ind_currency_format;
}