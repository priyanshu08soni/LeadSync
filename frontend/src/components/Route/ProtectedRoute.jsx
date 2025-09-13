import {useContext} from 'react';
import {Navigate} from 'react-router-dom';
import {AuthContext} from '../../contexts/AuthContext';

export default function ProtectedRoute({children}){
  const {user} = useContext(AuthContext);
  if(user === null) return <Navigate to="/login" replace />;
  return children;
}
