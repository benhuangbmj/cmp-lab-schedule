import {useSelector} from 'react-redux';
import {useForm} from 'react-hook-form';
import {useEffect, useState} from 'react';



export default function Admin() {
  const userData = useSelector(state => state.userData.items);
  const [usernames, setUsernames] = useState([]);

  const display = ['username','name','subject', 'links', 'password', 'roles', 'scheule'];
  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    if(userData) setUsernames(Object.keys(userData));
  }, [userData]);

  return (
    <form>
      {usernames.map(e => 
      <div>
        <span>{e}</span>
      </div>
                    )}
    </form>
  )
}