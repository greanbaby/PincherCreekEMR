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
    // load the Master Demographics page using fetch and read the patient demographics
    (async () => {
        const response = await fetch('https://192.168.1.24:8443/' +
                                   'oscar/demographic/demographiccontrol.jsp?' +
                                   'demographic_no=2&displaymode=edit&dboperation=search_detail'),
              patientDemographicLargeHTMLBLOB = await response.text(),
              ptDemo = fnShrinkDemographic(patientDemographicLargeHTMLBLOB),
              ptPHN = fnParseDataValue(ptDemo, 'Health Ins. #:'),
              ptCity = fnParseDataValue(ptDemo, 'City:');
        let header = document.getElementById('encounterHeader');
        header.innerHTML += ('<br>' + ptPHN + '<br>' + ptCity);
    })()
    function fnShrinkDemographic(largeText) {
        const patientDemographicEnd = largeText.substring(
            largeText.indexOf(
                `<div class="demographicSection" id="demographic">`
            )+49
        ),
              patientDemographicShrunk = patientDemographicEnd.slice(
            0,-(patientDemographicEnd.indexOf(
                `<div class="demographicSection" id="notes">`
            )));
        return patientDemographicShrunk;
    }
    function fnParseDataValue(strTextBlob,oscarDataLabel) {
        let blobEnd = strTextBlob.substring(
            strTextBlob.indexOf(`<span class="label">` + oscarDataLabel) + 20
        );
        blobEnd = blobEnd.substring(
            blobEnd.indexOf(`<span class="info">`) + 19
        );
        let blobShrunk = blobEnd.substring(
            0,blobEnd.indexOf(`</span>`
            ));
        if (blobShrunk.indexOf(`&nbsp;`) > -1) {
            blobShrunk = blobShrunk.substring(
                0,blobShrunk.indexOf(`&nbsp;`));
        }
        blobShrunk = blobShrunk.trim();
        alert(oscarDataLabel + ' ' + blobShrunk);
        return oscarDataLabel + ' ' + blobShrunk;
    }
})();