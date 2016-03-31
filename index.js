var q           = require('q')
  , _           = require('lodash')
  , assert      = require('assert')
  , superagent  = require('superagent')
  , xml2js      = require('xml2js')
;

module.exports = {
    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var api_key = step.input('api_key').first()
          , self = this
          , objects = step.input('update_map').toArray()
          , xml = ['<Leads>','</Leads>']
          , data = {
            authtoken: api_key
            , scope : 'crmapi'
            , version: 4
          }
          , xmlObj
        ;

        assert(api_key, 'Zoho API key required in ZOHO_API_KEY environment variable');

        objects = _.map(objects, function(i) { return _.omit(i, ['api_key']); });

        objects.forEach(function(object, idx) {
           xmlObj = ['<row no="'+(idx+1)+'">', '</row>'];
           _.each(object, function(val, key) {
               xmlObj.splice(1,0,'<FL val="'+key+'">'+val+'</FL>');
           });
           Array.prototype.splice.apply(xml, [xml.length-1, 0].concat(xmlObj));
        });

        data.xmlData = xml.join('');

        superagent
          .post("https://crm.zoho.com/crm/private/xml/Leads/updateRecords")
          .query(data)
          .end(function(err, response) {
              if(err) return self.fail(err);

              xml2js.Parser({explicitArray:false}).parseString(response.text, function(err, data) {
                if(err) return self.fail(err);

                var result = _.get(data, 'response.result.row.success')
                  //get the response code
                  , code   = result.code
                  //get the details collection sanely
                  , details = _.get(result, 'details.FL', []).reduce(function(final, item) {
                      final[_.get(item, '$.val')] = item._;
                      return final;
                    }, {});

                return code === '2001'
                  ? self.complete(details)
                  : self.fail(result);
              });
          });
    }
};
