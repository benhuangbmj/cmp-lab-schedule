import {PDFViewer} from '@react-pdf/renderer';

import Scheduling from './scheduling/Scheduling'
import IDcard from './IDcard/IDcard';
  
export default function FrontendLab({info, fetchInfo}) {
  return(
    <>
      <Scheduling info={info} fetchInfo={fetchInfo}  />
      <PDFViewer style={{height: "100vh"}} width='100%'>
        <IDcard info={info}/>
      </PDFViewer>
    </>
  )
}