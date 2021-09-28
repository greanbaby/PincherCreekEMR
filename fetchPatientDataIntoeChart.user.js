// ==UserScript==
// @name         fetchPatientDataIntoeChart
// @namespace    http://sgin.info
// @version      0.3
// @description  fetch demographics into eChart. change strHostName to match your instance. built either for GreaseMonkey or TamperMonkey
// @author       Scott Gingras <sgingras@pinchermedical.ca>
// @include      */oscar/casemgmt/forward.jsp?action=view&demographicNo=*
// @icon         https://www.google.com/s2/favicons?domain=sgin.info
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';
    // load the Master Demographics page using fetch and read the patient demographics into the eChart header
    function currentDemographicNo() {
        const qry = window.location.search.substring(1),
              vars = qry.split("&");
        for (let i=0;i<vars.length;i++) {
            const pair = vars[i].split("=");
            if(pair[0] == 'demographicNo'){return pair[1];}
        }
        return(false);
    }
    (async () => {
        const strHostName = 'https://192.168.1.24:8443/';
        const response = await fetch(strHostName +
                                     'oscar/demographic/demographiccontrol.jsp?' +
                                     'demographic_no=' +
                                     currentDemographicNo() +
                                     '&displaymode=edit&dboperation=search_detail'),
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
            ) + 49
        ),
              patientDemographicShrunk = patientDemographicEnd.slice(
            0, -(patientDemographicEnd.indexOf(
                `<div class="demographicSection" id="notes">`
            )));
        return patientDemographicShrunk;
    }
    function fnParseDataValue(strTextBlob, oscarDataLabel) {
        let blobEnd = strTextBlob.substring(
            strTextBlob.indexOf(`<span class="label">` + oscarDataLabel) + 20
        );
        blobEnd = blobEnd.substring(
            blobEnd.indexOf(`<span class="info">`) + 19
        );
        let dataValue = blobEnd.substring(
            0, blobEnd.indexOf(`</span>`
            ));
        if (dataValue.indexOf(`&nbsp;`) > -1) {
            dataValue = dataValue.substring(
                0, dataValue.indexOf(`&nbsp;`));
        }
        return oscarDataLabel + ' ' + dataValue.trim();
    }
})();
