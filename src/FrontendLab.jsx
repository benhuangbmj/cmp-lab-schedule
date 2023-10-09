import Scheduling from './scheduling/Scheduling'
  
export default function FrontendLab({info, fetchInfo}) {
  return(
    <>
      <Scheduling info={info} fetchInfo={fetchInfo}  />
    </>
  )
}