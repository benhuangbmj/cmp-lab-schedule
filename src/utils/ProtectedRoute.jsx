import {useSelector} from 'react-redux';
import {Navigate} from 'react-router-dom';
import {useState, useEffect} from 'react';

export default function ProtectedRoute({children, role}) {
  const activeUser = useSelector(state => state.active.user);
  const loaded = useSelector(state => state.active.loaded);
  const userData = useSelector(state => state.userData.items);
  const [activeRole, setActiveRole] = useState();
  
  useEffect(() => {        
    if(activeUser && role) setActiveRole(userData[activeUser].roles[role]);
  }, [activeUser,role]);
  
  if (!loaded) {
    return (
      <p>Loading</p>
    )
  } else {
    if (!activeUser) {
      return <Navigate to="/login" replace />
    } else if (role != undefined) {
      if (activeRole === null) {
        return <p>Loading</p>
      } else if (!activeRole) {
        return <p>Unauthorised</p>
      }
    } 
    return children;
  } 
}