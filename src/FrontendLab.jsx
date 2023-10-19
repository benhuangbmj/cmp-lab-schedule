import {PDFViewer} from '@react-pdf/renderer';

import Scheduling from './scheduling/Scheduling'
import CardDisplay from './IDcard/CardDisplay';
  
export default function FrontendLab({info, fetchInfo}) {  
  return(
    <>
      <Scheduling info={info} fetchInfo={fetchInfo}  />{    
      <PDFViewer style={{height: "100vh",}} width='100%'>
        <CardDisplay info={info}/>
      </PDFViewer>}
    </>
  )
}