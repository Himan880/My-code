/**
* @NApiVersion 2.x
* @NScriptType Suitelet
*/
define(['N/ui/serverWidget', 'N/https', 'N/file'], function(serverWidget, https, file) {

    function onRequest(context) {

        if (context.request.method === 'GET') {
           log.debug('triggred');
		   
           var form = serverWidget.createForm({
           title: 'NASA | Astronomy Picture of the Day'
           });

            var fieldgroup = form.addFieldGroup({
             id: 'about',
             label: 'ABOUT NASA APOD API'
             });
			 
               var aboutField = form.addField({
               id: 'custpage_about',
               type: serverWidget.FieldType.TEXTAREA,
                label: '---------',
               container: 'about'
              }).defaultValue = "One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video. This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds; but generally help with discoverability of relevant imagery."

            var fieldgroup = form.addFieldGroup({
             id: 'date',
              label: 'Select the date to see the Astronomy Picture of that Day'
              });

            var dateField = form.addField({
             id: 'custpage_date',
            type: serverWidget.FieldType.DATE,
            label: 'DATE',
            container: 'date'
           }).isMandatory = true;

          form.addSubmitButton({
          label: 'Submit'
            });
         context.response.writePage(form);
      } 
	  else {
             var date = new Date(context.request.parameters.custpage_date);
             var month = date.getMonth() + 1;
             var dayDate = date.getDate();
             var year = date.getFullYear();
             var finalDate = year + "-" + month + "-" + dayDate;
             log.debug('finalDate', finalDate);

            const NASA_API = "https://api.nasa.gov/planetary/apod?api_key=CjHb2X9PieLtByN9cRVrC6SiIoQeysjYyqHxJ8I4&date=" + finalDate;
             var response = https.get({
                      url: NASA_API
              });
			log.debug("response.body", response.body);
           var jsonRespone = JSON.parse(response.body);
           var hdUrl = jsonRespone.hdurl;
            log.debug('hdUrl', hdUrl);
            var form = serverWidget.createForm({
            title: 'NASA | Astronomy Picture of the Day'
            });
			  var imageField = form.addField({
			  id: 'custpage_result_image',
			  type: serverWidget.FieldType.INLINEHTML,
			  label: 'Image'
             }).defaultValue = "<img src=" + hdUrl + ">";

            context.response.writePage(form);
        }
    }
    return {

        onRequest: onRequest
};
});