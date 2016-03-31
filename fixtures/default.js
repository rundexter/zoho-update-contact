var _   = require('lodash')
  , env = require('./env')
;

module.exports = _.merge({
    instance_state: {
        active_step :  "local_test_step"
    }
    , steps: {
        local_test_step: {
            id: 'local_test_step'
            , type: 'module'
            //The test runner will change YOUR_MODULE_NAME to the correct module name
            , name: 'YOUR_MODULE_NAME'
            , next: []
        }
    }
    , modules: {
        //The test runner will add the proper data here
    }
    , environment: {
       /*
        * ZOHO_API_KEY required in env.js
        */
    }
    , user: {
    }
    , data: {
        local_test_step: {
            input: {
                "update_map": {
                    "Id"      : "1879981000000098027",
                    "Twitter" : "@danielilkovich"
                }
                /* stored in env.js "api_key":"DUMMY" */
            }
        }
    }
}, env);
