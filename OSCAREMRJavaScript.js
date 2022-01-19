"use strict";
/*  ----------------------------------------------------------------------------------------------------------------------------------
    OSCAREMRJavaScript.js
    Scott Gingras <sgingras@pinchermedical.ca>
    January 11, 2022
    This script is the companion to the OSCAR EMR Form
    ---
    --- VARIABLE TO CHANGE TO MATCH YOUR ENVIRONMENT:  strHostLocation
    ---
    --- UPDATES: Jan. 17/22: hide empty elements
    --- 
    --- Jan. 15/22: using DOMParser "goggles" to choose only useful columns of data to show
    ---
    --- Jan. 13/22: sendTickler function not currently being used but kept here for future use
    ---                                           ws/rs/tickler/add
    --- sendTickler(ptID, "TESTING ... Jan13 ---", -1);  // -1 means it is assigned to the System
    ----------------------------------------------------------------------------------------------------------------------------------
    */
const strHostName = window.location.origin + '/',
    strHostLocation = 'oscar/',
    ptID = document.getElementById('demographic_no').value,
    isEmpty = str => !str.trim().length,
    winProps = ',location=no,scrollbars=yes,menubars=no,status=yes,toolbars=no,resizable=yes,top=50,left=200',
    winWidthReduction = 250,  // INCREASING this makes the popup windows NARROWER
    winHeightReduction = 150,  // INCREASING this makes the popup windows SHORTER
    windowprops = 'width=' + (screen.width - winWidthReduction) + ',height=' + (screen.height - winHeightReduction) + winProps;
// only proceed if ptID exists (which means that the demographic_no hidden input field is not empty)
if (ptID.length > 0) {
    document.getElementById('demographicsFromChartWarning').style.display = 'none';  // hide chart demographics loading warning
    loadAllPatientData();  // if there is patient data that has been loaded into the page using the hidden oscarDB input fields then show it
    hideRowsMissingEChartData();  // hide rows and labels for fields with no data in them
    hideInputs();
    showTicklers();
    showPreventions();
    showConsults();
    showeForms();
    showDocuments();
    showAppointmentHistory();
    resizeWindowAndMove();
    addAdditionalButtonEventListeners();
}
// ----------------------------------------------------------------------------------------------------------------------------------
// END OF SCRIPT EXECUTION
// FUNCTIONS BELOW: (sendTickler included here for future usage by web service ws/rs/tickler/add)
function hideRowsMissingEChartData() {
    const strDataEChartNote = document.getElementById('dataEChartNote').innerHTML,
          strDataDxRegistry = document.getElementById('dataDxRegistry').innerHTML,
          strDataDrugList = document.getElementById('dataDrugList').innerHTML,
          strDataOngoingConcerns = document.getElementById('dataOngoingConcerns').innerHTML,
          strDataAllergies = document.getElementById('dataAllergies').innerHTML,
          strDataMedicalHistory = document.getElementById('dataMedicalHistory').innerHTML,
          strDataSocialFamilyHistory = document.getElementById('dataSocialFamilyHistory').innerHTML;
    if (fieldIsEmpty(strDataEChartNote, 'latest_echart_note')) {
        document.getElementById('dataEChartNote').style.display = 'none';
    }
    if (fieldIsEmpty(strDataDxRegistry, 'dxregistry')) {
        document.getElementById('dataDxRegistry').style.display = 'none';
    }
    if (fieldIsEmpty(strDataDrugList, 'druglist_line')) {
        document.getElementById('dataDrugList').style.display = 'none';
    }
    if (fieldIsEmpty(strDataOngoingConcerns, 'ongoingconcerns')) {
        document.getElementById('dataOngoingConcerns').style.display = 'none';
    }
    if (fieldIsEmpty(strDataAllergies, 'allergies_des_no_archived')) {
        document.getElementById('dataAllergies').style.display = 'none';
    }
    if (fieldIsEmpty(strDataMedicalHistory, 'medical_history')) {
        document.getElementById('dataMedicalHistory').style.display = 'none';
    }
    if (fieldIsEmpty(strDataSocialFamilyHistory, 'social_family_history')) {
        document.getElementById('dataSocialFamilyHistory').style.display = 'none';
    }
}
function fieldIsEmpty(htmlText, oscarDBField) {
    const strValue = htmlText.substring(oscarDBField.length + 2 + htmlText.indexOf(oscarDBField),
                                      htmlText.length - 4);
    return isEmpty(strValue);
}
function hideInputs() {
    document.getElementById('demoEChartNote').style.display = 'none';
    document.getElementById('demoDxRegistry').style.display = 'none';
    document.getElementById('demoDrugList').style.display = 'none';
    document.getElementById('demoOngoingConcerns').style.display = 'none';
    document.getElementById('demoAllergies').style.display = 'none';
    document.getElementById('demoMedicalHistory').style.display = 'none';
    document.getElementById('demoSocialFamilyHistory').style.display = 'none';
}
function sendTickler(demographic_no, message, taskAssignedTo) {
    const ticklerMessage = {};
    ticklerMessage.demographicNo = demographic_no;
    ticklerMessage.message = message;
    ticklerMessage.taskAssignedTo = taskAssignedTo;
    fetch('../ws/rs/tickler/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ticklerMessage),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
function resizeWindowAndMove() {
	window.resizeTo(screen.width - 110,screen.height - 100);
	window.moveTo(45,35);
}
function addAdditionalButtonEventListeners() {
    const btnOpenLabs = document.getElementById('btnOpenLabs'),
        btnAllergies = document.getElementById('btnAllergies'),
        btnRx = document.getElementById('btnRx'),
        btnIntake = document.getElementById('btnIntake'),
        btneForms = document.getElementById('btneForms'),
        btnConsults = document.getElementById('btnConsults'),
        btnTicklers = document.getElementById('btnTicklers'),
        btnPreventions = document.getElementById('btnPreventions'),
        btnAppointments = document.getElementById('btnAppointments'),
        btnDocuments = document.getElementById('btnDocuments'),
        btnMaster = document.getElementById('btnMaster'),
        btnCloseWindow = document.getElementById('btnCloseWindow'),
        openLabs = () => {
            const url = strHostName + strHostLocation + 'lab/DemographicLab.jsp?demographicNo=' + ptID;
            window.open(url, 'Labs', windowprops);
        },
        openAllergies = () => {
            const url = strHostName + strHostLocation + 'oscarRx/showAllergy.do?demographicNo=' + ptID;
            window.open(url, 'Allergies', windowprops);
        },
        openRx = () => {
            const url = strHostName + strHostLocation + 'oscarRx/choosePatient.do?providerNo=&demographicNo=' + ptID;
            window.open(url, 'Rx', windowprops);
        },
        openIntake = () => {
            const url = strHostName + strHostLocation + 'provider/formIntake.jsp?demographic_no=' + ptID;
            window.open(url, 'Intake', windowprops);
        },
        openeForms = () => {
            const url = strHostName + strHostLocation + 'eform/efmpatientformlist.jsp?demographic_no=' + ptID +
                  '&apptProvider=1&appointment=&parentAjaxId=eforms';
            window.open(url, 'eForms', windowprops);
        },
        openConsults = () => {
            const url = strHostName + strHostLocation + 'oscarEncounter/oscarConsultationRequest/DisplayDemographicConsultationRequests.jsp?de=' + ptID;
            window.open(url, 'Consults', windowprops);
        },
        openTicklers = () => {
            const url = strHostName + strHostLocation + 'tickler/ticklerDemoMain.jsp?demoview=' + ptID + '&parentAjaxId=tickler';
            window.open(url, 'Ticklers', windowprops);
        },
        openPreventions = () => {
            const url = strHostName + strHostLocation + 'oscarPrevention/index.jsp?demographic_no=' + ptID;
            window.open(url, 'Preventions', windowprops);
        },
        openAppointments = () => {
            const url = strHostName + strHostLocation + 'demographic/demographiccontrol.jsp?demographic_no=' + ptID +
                  '&last_name=&first_name=&orderby=appttime&displaymode=appt_history&dboperation=appt_history&limit1=0&limit2=25';
            window.open(url, 'Appointments', windowprops);
        },
        openDocuments = () => {
            const url = strHostName + strHostLocation + 'dms/documentReport.jsp?function=demographic&doctype=lab&functionid=' + ptID + '&curUser=';
            window.open(url, 'Documents', windowprops);
        },
        openMaster = () => {
            const url = strHostName + strHostLocation + 'demographic/demographiccontrol.jsp?demographic_no=' + ptID +
                  '&displaymode=edit&dboperation=search_detail&appointment=';
            window.open(url, 'Master', windowprops);
        },
        fnCloseWindow = () => {
            window.close();
        };
    btnOpenLabs.addEventListener('click', event => {
        openLabs();
    });
    btnAllergies.addEventListener('click', event => {
        openAllergies();
    });
    btnRx.addEventListener('click', event => {
        openRx();
    });
    btnIntake.addEventListener('click', event => {
        openIntake();
    });
    btneForms.addEventListener('click', event => {
        openeForms();
    });
    btnConsults.addEventListener('click', event => {
        openConsults();
    });
    btnTicklers.addEventListener('click', event => {
        openTicklers();
    });
    btnPreventions.addEventListener('click', event => {
        openPreventions();
    });
    btnAppointments.addEventListener('click', event => {
        openAppointments();
    });
    btnDocuments.addEventListener('click', event => {
        openDocuments();
    });
    btnMaster.addEventListener('click', event => {
        openMaster();
    });
    btnCloseWindow.addEventListener('click', event => {
        fnCloseWindow();
    });
}
function loadAllPatientData() {
    const divDisplayPatient = document.getElementById('displayPatient'),
          divRow = document.createElement('div');
    divRow.class = 'w3-row-padding w3-small';
    insertEachDataItemIntoDivRow(divRow);
    divDisplayPatient.appendChild(divRow);
}
function insertEachDataItemIntoDivRow(divRow) {
    const named = document.getElementById('hiddenFields'),
		  dataFields = named.getElementsByTagName('input');
    for (let x in dataFields) {
        if (dataFields[x].value) {
            const divNew = document.createElement('div');
            divNew.class = 'w3-col';
            divNew.appendChild(
                document.createTextNode(
                    dataFields[x].id + ': ' + dataFields[x].value
                )
            )
        divRow.appendChild(divNew);
        }
    }
}
function showPreventions() {
    (async () => {
        const response = await fetch(strHostName + strHostLocation + 'oscarPrevention/index.jsp?demographic_no=' + ptID ),
              preventionLargeHTMLBLOB = await response.text(),
              preventionsSmallHTML = fnShrinkPreventions(preventionLargeHTMLBLOB);
        document.getElementById("itemsPreventions").innerHTML = '<table><tr>' + preventionsSmallHTML + '</td></tr></table>';
    })()
}
function fnShrinkPreventions(largeText) {
    const shrunkText = largeText.substring(
        largeText.indexOf(
            `<form name="printFrm" method="post" onsubmit="return onPrint();"
			action="` + strHostName + strHostLocation + `oscarPrevention/printPrevention.do">`
        ) + 76 + strHostName.length + strHostLocation.length + 36
    ),
          shrunkTextStart = shrunkText.slice(
              0, shrunkText.indexOf(
                      `<a href="#"
			onclick="Element.toggle('otherElements'); return false;"
			style="font-size: xx-small;">show/hide all other Preventions</a>`
                  ) - 1);
    return shrunkTextStart;
}
function showConsults() {
    (async () => {
        const response = await fetch(strHostName + strHostLocation + 'oscarEncounter/oscarConsultationRequest/DisplayDemographicConsultationRequests.jsp?de=' + ptID ),
              consultsLargeHTMLBLOB = await response.text(),
              consultsSmallHTML = fnShrinkConsults(consultsLargeHTMLBLOB);
        document.getElementById("itemsConsults").innerHTML = consultsSmallHTML;
    })()
}
function fnShrinkConsults(largeText) {
    const shrunkText = largeText.substring(
        largeText.indexOf(
            `<td class="MainTableRightColumn">`
        ) + 33
    ),
          shrunkTextStart = shrunkText.slice(
              0, shrunkText.indexOf(
                      `<td class="MainTableBottomRowLeftColumn"></td>`
                  ) - 15);
    return shrunkTextStart;
}
function showeForms() {
    (async () => {
        const response = await fetch(strHostName + strHostLocation + 
                                     'eform/efmpatientformlist.jsp?demographic_no=' + 
                                     ptID +
                                     '&apptProvider=&appointment=&parentAjaxId=eforms'),
              eformLargeHTMLBLOB = await response.text(),
              eformSmallHTML = fnShrinkeForm(eformLargeHTMLBLOB);
        document.getElementById("itemseForms").innerHTML = '<table>' + eformSmallHTML + '</table>';
    })()
}
function fnShrinkeForm(largeText) {
    const shrunkText = largeText.substring(
        largeText.indexOf(
            `<table class="elements" width="100%">`
        ) + 37
    ),
          shrunkTextStart = shrunkText.slice(
              0, shrunkText.indexOf(
                      `<button onclick="showHtml(); return false;">Save as PDF</button>`
                  ) - 8);
    return shrunkTextStart;
}
function showTicklers() {
    (async () => {
        const response = await fetch(strHostName + strHostLocation + 
                                     'tickler/ticklerDemoMain.jsp?' +
                                     'demoview=' + ptID +
                                     '&parentAjaxId=tickler'),
              ticklerLargeHTMLBLOB = await response.text(),
              ticklerSmallHTML = fnShrinkTickler(ticklerLargeHTMLBLOB);
        document.getElementById("itemsTicklers").innerHTML = ticklerSmallHTML;
    })()
}
function fnShrinkTickler(largeText) {
    const shrunkText = largeText.substring(
        largeText.indexOf(
            `<form name="ticklerform" method="post" action="dbTicklerDemoMain.jsp">`
        ) + 70
    ),
          shrunkTextStart = shrunkText.slice(
              0, shrunkText.indexOf(
                      `</form>`
                  ) - 7);
    return shrunkTextStart;
}
function showDocuments() {
    (async () => {
        const response = await fetch(strHostName + strHostLocation + 
                                     'dms/documentReport.jsp?function=demographic&doctype=lab&functionid=' + 
                                     ptID +
                                     '&curUser='),
              documentsBody = await response.text(),
              documentsSmallHTML = fnShrinkDocuments(documentsBody);
        document.getElementById("itemsDocuments").innerHTML = documentsSmallHTML;
    })()
}
function fnShrinkDocuments(largeText) {
    const goggles = new DOMParser(),
              docGoggle = goggles.parseFromString(largeText, "text/html"),
              privateDocumentsHTMLTable = docGoggle.getElementById('privateDocs');
    return fnShowOnlyUsefulDocumentColumns(privateDocumentsHTMLTable);
}
function fnShowOnlyUsefulDocumentColumns(htmlTable) {
    let displayText = '<table><tr><td>Description</td><td>Date</td></tr>';
    for (let x = 1; x<htmlTable.rows.length-1; x++) {
        const row = htmlTable.rows[x];
        if (row.cells[0].innerHTML.indexOf('No documents to display') === -1) {
            displayText += '<tr><td>' + 
			(row.cells[1].innerHTML).replace('ManageDocument.do','../dms/ManageDocument.do') + 
			'</td><td>' + 
			row.cells[6].innerHTML + 
			'</td></tr>';
        } else {
            displayText = '<table><tr><td>No documents to display</td></tr></html>';
            return displayText;
        }
    }
    return displayText += '</table>';
}
function showAppointmentHistory() {
    (async () => {
        const response = await fetch(strHostName + strHostLocation + 
                                     'demographic/demographiccontrol.jsp?demographic_no=' + 
                                     ptID +
                                     '&orderby=appttime&displaymode=appt_history&dboperation=appt_history&limit1=0&limit2=25'),
              apptBody = await response.text(),
              apptsSmallHTML = fnShrinkAppointments(apptBody);
        document.getElementById("itemsAppointments").innerHTML = '<table>' + apptsSmallHTML + '</table>';
    })()
}
function fnShrinkAppointments(largeText) {
    const goggles = new DOMParser(),
          docGoggle = goggles.parseFromString(largeText, "text/html"),
          tableAppts = docGoggle.getElementById('apptHistoryTbl');
    return tableAppts.innerHTML;
}
