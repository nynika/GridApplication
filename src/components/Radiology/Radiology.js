import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import relalogo from '../../assets/relalogo.jpg'; 
import { useNavigate } from 'react-router-dom';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';


function Radiology({user}) {

  const [rowData, setRowData] = useState([]);
  const today = new Date().toISOString().slice(0,10);
  const [toDate, setToDate] = useState(today); 
  const [gridApi, setGridApi] = useState(null);
const [showPopup, setShowPopup] = useState(false); //  visibility  popup
const [popupData, setPopupData] = useState(null);  // Stores data  popup

  const columnDefs = [
   
    { headerName: "PatientId", field: "patientId", editable: false },
    { headerName: "PatientName", field: "patientName", editable: false }, 
    { headerName: "VisitId", field: "registrationId", editable: false }, 
    { headerName: "DoctorName", field: "doctorName", editable: false },
    { headerName: "VisitDate", field: "visitDate" , editable: false },
    { headerName: "Rad_Order", field: "rad_Order", editable: false  },

    {
      headerName: "Rad_Followup_Billed",field: "rad_Followup_Billed",
      editable: params => params.value !== "Billed",
      cellStyle: params => {
          return params.value === "Billed" ? { backgroundColor: 'green', color: 'white', cursor: 'not-allowed' } : null
      }
    },

    { headerName: "Study_Start", field: "study_Start" ,editable: true},
    { headerName: "Study_Authorized", field: "study_Authorized", editable: true },
   
];


const defaultColDef = {
  sortable: true,
  editable: true,
  flex: 1,
  filter: true,
  floatingFilter: true
};


/* logout */
const navigate = useNavigate();
const handleLogout = () => {  
  sessionStorage.clear(); 
  navigate('/Login'); 
};


/* post for overallview */
const onCellValueChanged = (params) => {
  const { data, colDef ,newValue } = params;
  let investigationType = null;
  let investigationOrder = null;
  let billedValue = null;

  switch (colDef.field) {
    case 'rad_Followup_Billed':
        console.log("Rad_Order value:", data.Rad_Order);
        if (data.rad_Order) {
            investigationType = 'RAD';
            investigationOrder = data.rad_Order;
            billedValue = newValue;  
        } else {
            console.error('Rad_Order is missing when it should be present:', data.rad_Order);
            alert('Please fill in the Rad Order before proceeding.');
            return;
        }
        break;
    case 'lab_Followup_Billed':
        console.log("Evaluating Lab_Order presence:", !!data.lab_Order);
        if (data.lab_Order) {
            investigationType = 'LAB';
            investigationOrder = data.lab_Order;
            billedValue = newValue;
        } else {
            console.error('Lab_Order is missing when it should be present:', data.lab_Order);
            alert('Please fill in the Lab Order before proceeding.');
            return;
        }
        break;
    default:
        console.error('Unhandled field:', params.colDef.field);
        return;
}

const postData = {
  VisitId: data.registrationId,
  InvestigationOrder: investigationOrder,
  Billed: billedValue,
  InvestigationType: investigationType,
  InvestigationStart: '',
  InvestigationAuthorized: '',
  Createdid: user ? user.userId : 'defaultUserId',
  LastModifyid: user ? user.userId : 'defaultUserId'
};

  console.log("Sending POST request with data:", postData);
  const saveUrl = `http://192.168.15.3/NewHIS/api/his/SaveOrUpdateQCOrderTracking`;
   fetch(saveUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('HTTP status ' + response.status);
    }
    return response.json();
  })
  .then(responseData => {
    console.log('Success:', responseData);
    alert('Saved Successfully: ' + (responseData.message || 'Your changes have been saved.'));
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Failed to Fetch: ' + error.message);
  });
};



/* get for overallview */

/*  useEffect(() =>{
if (gridApi && toDate){
  fetchData(toDate);
}
},[gridApi,toDate]);  */


const formatDate = (date) => {
  if (!date) return null; 
  return new Date(date).toISOString().slice(0,10);
};

/*  const fetchData = (date, ) => {
  const formattedDate = formatDate(date);
  if (!formattedDate) return;
  const url = `http://192.168.15.3/NewHIS/api/his/Get_opd_Process_v1?Todate=${formattedDate}`;

  http://192.168.15.3/NewHIS/api/his/Get_opd_Process_v1?Todate=2024-05-16&Type=4
  fetch(url)
    .then(response => response.json()) 
    .then(data => {
      if (gridApi) gridApi.setRowData(data);
    })
    .catch(error => {
      console.error('Failed to fetch data:', error);
    });
}; */


useEffect(() => {
  if (gridApi && toDate && user && user.userId) {
    fetchData(toDate, user.userId); 
  }
}, [gridApi, toDate, user]);


const fetchData = (date, userId) => {
const formattedDate = formatDate(date);
if (!formattedDate || !userId) return;
const url = `http://192.168.15.3/NewHIS/api/his/Get_opd_Process_v1?Todate=${formattedDate}&Type=${userId}`;

fetch(url)
  .then(response => response.json()) 
  .then(data => {
    if (gridApi) {
      setRowData(data);
      gridApi.setRowData(data, userId);
    } else {
      console.error('Grid API is not available.');
    }
  })
  .catch(error => {
    console.error('Failed to fetch data:', error);
  });
};

const onGridReady = (params) => {
  setGridApi(params.api);
};

const onDateChange = (event) => {
  const newDate = event.target.value;
  setToDate(newDate);
};



/* popup start */


/* const handleChange = (field, event) => {
setPopupData(prevDetails => ({
  ...prevDetails,
  [field]: event.target.value,
}));
};  
 */


const handleChange = (field, value) => {
  if (!value) {
    setPopupData(prevDetails => ({
      ...prevDetails,
      [field]: null,
    }));
  } else {
    let formattedValue = value;
    setPopupData(prevDetails => ({
      ...prevDetails,
      [field]: formattedValue,
    }));
  }
};

/* post */



/* 
  const handleSubmit = () => {
    const saveUrl = 'http://192.168.15.3/NewHIS/api/his/SaveOrUpdateQCVisittracking';
    fetch(saveUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        VisitId: popupData.registrationId,  
        Vitals_Completed_time: popupData.vitals_Completed_time,
        Doctor_Checkin: popupData.doctor_Checkin,
        Procedure_Advised: popupData.procedure_Advised,
        Admission_Advised: popupData.admission_Advised,
        Admission_Status: popupData.admission_Status,
        CreatedId: user ? user.userId : 'defaultUserId',  
        ModifyId: user ? user.userId : 'defaultUserId'
      }),
    })
    .then(response => response.json())
    .then(responseData => {
      console.log('Success:', responseData);
      alert('Saved Successfully: ' + (responseData.message || 'Your changes have been saved.'));
      setShowPopup(false);
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Failed to save changes: ' + error.message);
    });
  }; */
  
  

  const handleSubmit = () => {
    const saveUrl = 'http://192.168.15.3/NewHIS/api/his/SaveOrUpdateQCVisittracking';
    fetch(saveUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        VisitId: popupData.registrationId,  
        Vitals_Completed_time: popupData.vitals_Completed_time,
        Doctor_Checkin: popupData.doctor_Checkin,
        Procedure_Advised: popupData.procedure_Advised,
        Admission_Advised: popupData.admission_Advised,
        Admission_Status: popupData.admission_Status,
        CreatedId: user ? user.userId : 'defaultUserId',  
        ModifyId: user ? user.userId : 'defaultUserId'
      }),
    })
    .then(response => response.json())
    .then(responseData => {
      console.log('Success:', responseData);
      alert('Saved Successfully: ' + (responseData.message || 'Your changes have been saved.'));
      fetchVisitDetails(popupData.registrationId);  // Fetch the updated data
      setShowPopup(false);
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Failed to save changes: ' + error.message);
    });
  };
  

/* get for Popup */

/* 
const fetchVisitDetails = (visitId) => {
  if (!visitId) return;
  const url = `http://192.168.15.3/NewHIS/api/his/UpdateQCEMRDashboard_Visit?Todate=${toDate}&VisitId=${visitId}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log("Fetched visit details:", data); 
      if (data && data.length > 0) {
        setPopupData(prevData => ({ 
          ...prevData, ...data[0] }));
      }
    })
    .catch(error => {
      console.error('Failed to fetch visit details:', error);
    });
}; */

const fetchVisitDetails = (visitId) => {
  if (!visitId) return;
  const url = `http://192.168.15.3/NewHIS/api/his/UpdateQCEMRDashboard_Visit?Todate=${toDate}&VisitId=${visitId}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log("Fetched visit details:", data);
      if (data && data.length > 0) {
        const visitData = data[0];
        const formatDate = (dateString) => {
          if (!dateString) return '';
          const date = new Date(dateString);
          const offset = date.getTimezoneOffset();
          date.setMinutes(date.getMinutes() - offset);
          return date.toISOString().split('T')[0];
        };
        setPopupData(prevData => ({
          ...prevData,
          ...visitData,
          vitals_Completed_time: formatDate(visitData.vitals_Completed_time),
          doctor_Checkin: formatDate(visitData.doctor_Checkin),
          admission_Advised: formatDate(visitData.admission_Advised)
        }));
      }
    })
    .catch(error => {
      console.error('Failed to fetch visit details:', error);
    });
};



/* download excel */

const handleExport = () => {
  console.log("Exporting data...", rowData);
  const exportData = rowData.map(row => ({
    'Patient ID': row.patientId,
    'Patient Name': row.patientName,
    'Visit ID': row.registrationId,
    'Doctor Name': row.doctorName,
    'Visit Date': row.visitDate,
    'Rad Order': row.rad_Order,
    'Rad Followup Billed': row.rad_Followup_Billed,
    'Lab Order': row.lab_Order,
    'Lab Followup Billed': row.lab_Followup_Billed,
    'Admission Advised': row.admission_advised,
    'Procedure Advised': row.proc_Billed,
  }));

  console.log("Export Data: ", exportData);

  if (exportData.length === 0) {
    alert("No data to export");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "PatientData.xlsx");
};



const onCellClicked = (event) => {
if (event.colDef.field === 'registrationId') {
  fetchVisitDetails(event.data.registrationId);
  setPopupData({
    ...event.data,
    toDate: today,  
  });
  setShowPopup(true);
}
};


function Popup({ data, onClose}) {
if (!data) return null; 


return (
  <div className="popup-container">
  <h1>Patient Details</h1>
        <form className="popup-form">
            <div className="form-group">
            <label>Patient ID:</label>
           <input type="text" value={data.patientId} readOnly disabled />
            </div>

            <div className="form-group">
                <label>Patient Name:</label>
                <input type="text" value={data.patientName} readOnly  disabled/>
            </div>

            <div className="form-group">
                <label>Visit ID:</label>
                <input type="text" value={data.registrationId} readOnly disabled />
            </div>

            <div className="form-group">
                <label>Visit Date:</label>
                <input type="text" value={data.visitDate} readOnly  disabled />
            </div>


            <div className="form-group">
                <label>Vitals Completed :</label>
                <input type="date" value={data.vitals_Completed_time || ''} 
                onChange={e => handleChange('vitals_Completed_time', e.target.value)}   placeholder="yyyy/mm/dd" />
            </div>

            <div className="form-group">
                <label>Doctor Checkin:</label>
                <input type="date" value={data.doctor_Checkin || ''} 
                onChange={e => handleChange('doctor_Checkin', e.target.value)}    placeholder="yyyy/mm/dd"  />    
            </div>

            
            <div className="form-group">
                  <label>Procedure Advised:</label>
                  <select
                    value={data.procedure_Advised || ''}
                    onChange={e => handleChange('procedure_Advised', e.target.value)}
                    style={{ width: '100%', height: '25px' }}>
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

            <div className="form-group">
            <label>Admission Advised:</label>            
           <input type="date" value={data.admission_Advised || ''}
            onChange={e => handleChange('admission_Advised', e.target.value)} placeholder="yyyy/mm/dd" />
            </div>




                <div className="form-group">
                  <label>Admission Status:</label>
                  <select
                    value={data.admission_Status || ''}
                    onChange={e => handleChange('admission_Status', e.target.value)}
                    style={{ width: '100%', height: '25px' }} 
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

             <div className="form-group">
                <label>OrderCount:</label>
                <input type="text" value={data.presOrdercnt || 0} readOnly  disabled/>
            </div>

             <div className="form-group">
                <label>BillCount</label>
                <input type="text" value={data.presBillcnt || 0}  disabled/>
             </div>
                                      
            <button type="button" className="save-btn" onClick={handleSubmit}>Save</button>
            <button type="button" className="close-btn" onClick={onClose}>Close</button>
    </form>
  </div>
  );
}


return (
<div className="App">
 <img src={relalogo} alt="OPD Patient Tracking" style={{ width: '150px',position:'absolute',left:'50px' ,top:'0px'}} /> 
  <h1>Patient Tracking System</h1>

  <input type="date" value={toDate} onChange={onDateChange}
    style={{ padding: '10px', border: '2px solid #ccc', borderRadius: '4px', right:'20px',
     fontSize: '16px', color: '#333', backgroundColor: 'LightGray', width: '200px',position:'absolute',top:'30px',right:'220px'}} />
  <div className="ag-theme-alpine">


    <AgGridReact
    columnDefs={columnDefs}
    defaultColDef={defaultColDef}
    onGridReady={onGridReady}
    onCellValueChanged={onCellValueChanged}
    rowData={rowData}
    onCellClicked={onCellClicked} />
    
  </div>

  <button className ="export-button "onClick={handleExport} >Export</button>
  
  <div style={{ padding: '10px', fontSize: '14px',marginTop:'20px' }}>
Click on any <strong>VisitId</strong> to view more details.
</div>



  {user && (
<div className="user-details" style={{ position: 'absolute', top: '10px', right: '10px',fontSize:'12px',color:'GrayText' }}>

  <div style={{fontSize:'15px',}}> <FontAwesomeIcon icon={faUser} className="input-icon" /> {user.username}</div>


  <button onClick={handleLogout} style={{ padding: '10px 20px', fontSize: '13px', color: 'white', backgroundColor: '#007bff', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center' ,marginTop:'10px'}}>
 <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '5px' }} />Logout</button>
</div>

)} 

{showPopup && popupData && (
<Popup
  data={popupData}
  toDate={toDate}  
  onClose={() => setShowPopup(false)}/>
)}
</div>
);
}


export default Radiology;
