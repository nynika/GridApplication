import React from 'react'; 
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

function Admission() {
  const columnDefs = [
    { headerName: "No", field: "opD_Prcess_nbr", editable: false },
    { headerName: "PatientName", field: "patientName", editable: false }, 
    { headerName: "UHID", field: "uhid", editable: false },
    { headerName: "VisitNo", field: "visitNo", editable: false  },
    { headerName: "VisitDate", field: "visitDate" , editable: false },  
    { headerName: "Admission_Advice", field: "admission_Status" ,editable: true}  // need datepicker  and need color difference
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
       
        <div className="ag-theme-alpine" style={{ height: '400px' }}>
 
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

export default Admission;
