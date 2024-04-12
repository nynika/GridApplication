
import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import Radiology from '../Radiology/Radiology';
import Lab from '../Lab/Lab'; 
import Admission from '../Admission/Admission'; 
import Pharmacy from '../Pharmacy/Pharmacy'; 
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

function OverallView() {
  const columnDefs = [
    { headerName: "No", field: "opD_Prcess_nbr", editable: false },
    { headerName: "PatientName", field: "patientName", editable: false }, 
    { headerName: "UHID", field: "uhid", editable: false },
    { headerName: "VisitNo", field: "visitNo", editable: false  },
    { headerName: "VisitDate", field: "visitDate" , editable: false },
    { headerName: "Rad_Order", field: "rad_Order", editable: false  },
    { headerName: "Study_Start_Status", field: "study_Start" ,editable: true},
    { headerName: "Radiology_Report_Authorized", field: "study_Authorized" ,editable: true},
    { headerName: "Lab_Order", field: "lab_Order", editable: false  },
    { headerName: "Sample_Collected", field: "sample_Collected" ,editable: true},
    { headerName: "Lab_Authorized", field: "lab_Authorized",editable: true },
    { headerName: "Admission_Status", field: "admission_Status" ,editable: true},
    { headerName: "Medicines_Prescribed", field: "medicines_Prescribed", editable: false  },
    { headerName: "Billing_Status", field: "billing_status", editable: true },
  ];

  const defaultColDef = {
    sortable: true,
    editable: true,
    flex: 1,
    filter: true,
    floatingFilter: true
  };

  const onGridReady = (params) => {
    console.log("grid is ready");
    fetch("http://192.168.15.3/NewHIS/api/his/Get_opd_Process")
    .then(resp => resp.json())
    .then(resp => {
      console.log(resp);
      params.api.applyTransaction({ add: resp });
    });
  };

  const onCellValueChanged = (event) => {
    const updatedData = event.data;
    console.log("Updated Data:", updatedData);

    fetch("http://192.168.15.3/NewHIS/api/his/save_opd_Process_Dtl", 
    { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };


  return (
    <div className="App">

 {/*      <nav>
        <ul>
          <li><Link to="/">OverallView</Link></li>
          <li><Link to="/radiology">Radiology</Link></li>
          <li><Link to="/lab">Lab</Link></li>
          <li><Link to="/admission">Admission</Link></li>
          <li><Link to="/pharmacy">Pharmacy</Link></li>
        </ul>
      </nav> */}
      <div className="ag-theme-alpine" style={{ height: '400px' }}>
      {/*   <Routes>
          <Route path="/radiology" element={<Radiology />} />
          <Route path="/lab" element={<Lab />} />
          <Route path="/admission" element={<Admission />} />
          <Route path="/pharmacy" element={<Pharmacy />} />
        </Routes> */}
        <AgGridReact
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          onCellValueChanged={onCellValueChanged}
        />
      </div>
    </div>
  );
}

export default OverallView;
