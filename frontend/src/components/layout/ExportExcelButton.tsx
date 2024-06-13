// frontend/src/components/ExportExcelButton.js

import React from 'react';
import { FaFileDownload } from 'react-icons/fa';
import axios from 'axios';
import { saveAs } from 'file-saver';

const ExportExcelButton = () => {
    const handleClickExcel = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/export/excel/departamentos/', {
                responseType: 'blob',
            });

            const excelBlob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            saveAs(excelBlob, 'departamentos.xlsx');
        } catch (error) {
            console.error('Error exporting data:', error);
        }
    };

    return (
        <button className="btn botonCPA me-3" onClick={handleClickExcel}>
            <FaFileDownload className="iconAntD" />
            Descargar Excel
        </button>
    );
};

export default ExportExcelButton;
