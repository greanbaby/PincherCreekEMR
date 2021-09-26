// ==UserScript==
// @name         fetchPatientDataIntoeChart
// @namespace    http://sgin.info
// @version      0.1
// @description  fetch demographics inside eChart and other stuff
// @author       Scott Gingras <sgingras@pinchermedical.ca>
// @match        */oscar/casemgmt/forward.jsp?action=view&demographicNo=*
// @icon         https://www.google.com/s2/favicons?domain=sgin.info
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';
    // set up global variables: PHN, Phone
    const ptPHN = '',
          ptPhoneNumber = '';
    // load the Master Demographics page using fetch and read the patient demographics
    (async () => {
        const response = await fetch('https://192.168.1.24:8443/' +
                                   'oscar/demographic/demographiccontrol.jsp?' +
                                   'demographic_no=2&displaymode=edit&dboperation=search_detail'),
              patientDemographicLargeHTMLBLOB = await response.text(),
              ptDemo = fnShrinkDemographic(patientDemographicLargeHTMLBLOB);
    })()
    function fnShrinkDemographic(largeText) {
     // split only the DIV class="demographicSection id="demographic" portion...
        const patientDemographicEnd = largeText.substring(
            largeText.indexOf(
                `<div class="demographicSection" id="demographic">`
            )+49
        ),
              patientDemographicShrunk = patientDemographicEnd.slice(
            0,-(patientDemographicEnd.indexOf(
                `<div class="demographicSection" id="notes">`
            )));
        alert(patientDemographicShrunk.slice(0,4800) + '...');
        return patientDemographicShrunk;
    }
})();