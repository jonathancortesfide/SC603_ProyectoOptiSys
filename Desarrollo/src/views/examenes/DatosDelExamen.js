import React from 'react';
import { HotTable } from '@handsontable/react-wrapper';
import './estilosExamenes.css';


const DatosDelExamen = () => {


    return (
        <div className="ht-theme-main-dark-auto">
            <HotTable
                data={[
                ['', '', '', '', '','','','',''],
                ['', '', '', '', '','','','',''],
                ]}
                
                rowHeaders={['Ojo der', 'Ojo izq']}
                colHeaders={[
                    'RX en uso',
                    'Esfe',
                    'Cilin',
                    'Eje',
                    'Adici',
                    'DNP',
                    'AVC',
                    'AVL',
                    'Altur',
                  ]}
                height="auto"
                autoWrapRow={true}
                autoWrapCol={true}
                licenseKey="non-commercial-and-evaluation" // for non-commercial use only
                />
            </div>
    );
}

export default DatosDelExamen;