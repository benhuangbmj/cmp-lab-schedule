import {useSelector} from 'react-redux';
import {Navigate} from 'react-router-dom';

export default function ProtectedRoute({children}) {
  const activeUser = useSelector(state => state.active.user);
  if (!activeUser) {
    return <Navigate to="/login" replace />
  }
  return children;
}