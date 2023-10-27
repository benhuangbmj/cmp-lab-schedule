import './App.css';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { getSingleAsset, update } from './api-operations';
import { scheme as dataScheme, courseOptions, blankForm } from './util';
import {PDFViewer, Document, Page, Text, View, StyleSheet} from '@react-pdf/renderer';
import bcrypt from 'bcryptjs';

import SelectTutor from './util-components/SelectTutor';
import IDCard from './IDcard/IDCard';
import CardDisplay from './IDcard/CardDisplay';

const spaceId = import.meta.env.VITE_SPACE_ID;
const accessToken = import.meta.env.VITE_ACCESS_TOKEN;
const cmaToken = import.meta.env.VITE_CMA_TOKEN;
const privilege = import.meta.env.VITE_PRIVILEGE;

const display = ['username','name','subject', 'links', 'password'];



export default function Management({ info, fetchInfo }) {
  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    reset: resetLogin,
    formState: {errors: errorsLogin},
  } = useForm();

  const [newPic, setNewPic] = useState();
  const [uploadStatus, setUploadStatus] = useState('Upload');
  const [profile, setProfile] = useState();
  const [selected, setSelected] = useState();
  const [loggedIn, setLoggedIn] = useState(false);
  const currUser = useRef();
  const newUsername = watch('username');

  function ChangeProfile() {
    function handleChangeProfile(e) {
      setNewPic(e.target.files[0]);
    }
    function uploadPic() {
      setUploadStatus('Uploading ...');
      const deleteAsset = async function(assetId) {
        let currAsset = await fetch(`https://api.contentful.com/spaces/${spaceId}/environments/master/assets/${assetId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${cmaToken}`
          }
        });
        currAsset = await currAsset.json();
        const currVersion = currAsset.sys.version;
        await fetch(`https://api.contentful.com/spaces/${spaceId}/environments/master/assets/${assetId}/published`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${cmaToken}`,
            "X-Contentful-Version": currVersion,
          }
        });
        let deletedAsset = await fetch(`https://api.contentful.com/spaces/${spaceId}/environments/master/assets/${assetId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${cmaToken}`,
            "X-Contentful-Version": currVersion,
          }
        });
      }
      const createAsset = async function(file, title) {
        let uploaded = await fetch(`https://upload.contentful.com/spaces/${spaceId}/uploads`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/octet-stream",
            Authorization: `Bearer ${cmaToken}`
          },
          body: file,
        });
        uploaded = await uploaded.json();
        const uploadedId = uploaded.sys.id;
        const resources = {
          "fields": {
            "title": {
              "en-US": title
            },
            "file": {
              "en-US": {
                "contentType": file.type,
                "fileName": file.name,
                "uploadFrom": {
                  "sys": {
                    "type": "Link",
                    "linkType": "Upload",
                    "id": uploadedId,
                  }
                }
              }
            }
          }
        }
        let created = await fetch(`https://api.contentful.com/spaces/${spaceId}/environments/master/assets`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/octet-stream",
            Authorization: `Bearer ${cmaToken}`
          },
          body: JSON.stringify(resources),
        });
        created = await created.json();
        const createdId = created.sys.id;
        const processed = await fetch(`https://api.contentful.com/spaces/${spaceId}/environments/master/assets/${createdId}/files/en-US/process`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${cmaToken}`,
            "X-Contentful-Version": 1
          }
        });
        if (processed.ok) {
          setTimeout(async () => {
            var published = await fetch(`https://api.contentful.com/spaces/${spaceId}/environments/master/assets/${createdId}/published`, {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${cmaToken}`,
                "X-Contentful-Version": 2,
              }
            });
            if (published.ok) {
              alert("Change profile picture sucessfully!");
            } else {
              alert("Change profile picture failed");
            }
            setUploadStatus('Upload');
            const currAsset = await getSingleAsset(createdId);
            const currUrl = currAsset.fields.file['en-US'].url;
            const newProfile = {
              url: currUrl,
              id: createdId,
            }
            update('profilePic', [selected], newProfile, fetchInfo);
          }, 1000);
        }
      }
      const tutor = info[selected];
      if (tutor.profilePic) {
        deleteAsset(tutor.profilePic.id);
      } else {
        tutor.profilePic = {};
      }
      createAsset(newPic, selected);
    }
    return (
      <span>
        <label>Change Profile Picture </label>
        <input disabled = {(selected||newUsername)? false : true} type='file' accept='image/*' onChange={handleChangeProfile} />
        <button type='button' disabled = {(selected||newUsername)? false : true} className="file-input-button" onClick={uploadPic}>{uploadStatus}</button>
        <button type='button' disabled = {profile? false: true} style={{marginLeft: '5px'}}>Rotate</button>
      </span>
    )
  }
/*
  const isFieldArray = (key) => {
    return Array.isArray(Object.values(info)[0][key]);
  };*/

  const handleUpdate = (data) => {
    const username = data.username;
    delete data.username;
    const links = {};
    Object.keys(dataScheme.links).forEach(key => {      
      links[key] = data[key];      
      delete data[key];
    });
    data.links = links;
    if(data.password != "") {
      data.password = bcrypt.hashSync(data.password, 10);
    } else {
      delete data.password;
    }
    data = Object.assign(dataScheme, data);
    update(username, [], data, fetchInfo).then(() => {
      setSelected(null);
      reset(blankForm);
    });
  };
  const handleSelect = (currSelected) => {
    const resetAll = () => {
      reset(blankForm);
      resetLogin({pw: null});
      setLoggedIn(false);
    }
    if (currSelected) {
      const user = currSelected.value
      resetAll();
      setSelected(user);
      if(!info[user].password) {
        displayInfo(user);
        setLoggedIn(true);
      }
    } else {
      setSelected();
      setProfile();
      resetAll();
    }
  }
  
  const handleBackup = () => {
    const passcode = prompt("Please enter the passocde.");
    if(passcode === privilege) {
      update(null, [], info, fetchInfo).then(()=>{
        alert("Backup Successful!");
      });
    } else {
      alert('No privilege to back up.');
    }
  }

  const displayInfo = (user) => {
    setProfile();
    if (info[user].profilePic) {
      setProfile(info[user].profilePic.url);      
    }
    const initialVal = Object.assign({}, { username: user }, info[user], info[user].links);
    delete initialVal.links;
    delete initialVal.password;
    reset(initialVal);    
  }
  
  const handleLogin = (data) => {
    if(info[selected].password) {
      const verified = bcrypt.compareSync(data.pw, info[selected].password);
      if(!verified) {
        alert('Invalid password.');
        return;
      } else {
        alert('Log in successfully!');
        setLoggedIn(true);
      }
    }
    displayInfo(selected);
  };

  const testFunc = function() {
    const confirm = prompt('Type "Confirm" to proceed to delete the user');
    if (confirm === 'Confirm') {
      alert('This function is under construction.');
    } else {
      alert('Action terminated.');
    }
  }

  useEffect(() => {
    if (newPic) {
      const newPicURL = URL.createObjectURL(newPic);
      setProfile(newPicURL);
    }
  }, [newPic]);
  return (
    <main>
      <div className="login">
        <SelectTutor info={info} handleSelect={handleSelect} />
        <form onSubmit={handleSubmitLogin(handleLogin)}>
          <label>password: </label>
          <input type='password' name='pw' {...registerLogin('pw', {required: 'Please enter your password.'})}>            
          </input> <button disabled={selected == null} type='submit'>Log in</button>          
        </form>
        {errorsLogin.pw && <p className='errorMessage'>{errorsLogin.pw.message}</p>}
      </div>
      <div className='flexbox-row'>
        {selected? 
          [
            <img key='profile' className="profile-container" src={profile?profile:'https://images.ctfassets.net/o0mxfnwxsmg0/7wk9sXm2sQjMhg7pmyffqr/39c218f89506084b406222c6ee680905/question-mark-hacker-attack-mask-preview.jpg'} />,
            <div key="IDCard" className='card-holder'>
              {loggedIn && <CardDisplay pageSize={[220, 290]} pageOrientation='landscape' info={{user: info[selected]}} />}
            </div>
          ] : [
            <div key="profile" className='profile-container'>profile picture</div>, 
            <div key="IDCard" className='card-holder'></div>
          ] }
      </div>
      <ChangeProfile />
      <form onSubmit={handleSubmit(handleUpdate)}>
        <div className='input-holder'>
          {['username'].concat(Object.keys(dataScheme)).map(e => {          
            if (display.includes(e)) {
              return (
                e != 'links'? <p key={e}>
                  <label>{e=='password'?'new passowrd':e}{e == 'username' && <sup style={{ color: "red" }}>*</sup>}: </label>
                  {
                    e == 'username' && selected ?
                      <input readOnly type='text' className='read-only' name={e} {...register(e)} /> : e == "username" ?
                        <>
                          <input type='text' name={e} {...register(e, { required: "Username is required." })}/>
                          {errors.username ? <p className='errorMessage'>{errors.username.message}</p> : null}
                        </> :
                        <input type={e=='password'?'password':"text"} name={e} {...register(e)} />
                  }
                </p> : Object.keys(dataScheme[e]).map(link => <p key={link}><label style={{textTransform: 'capitalize'}}>{link}: </label><input type='url' name={link} {...register(link)}/> </p>) 
              )
            }
          }
          )}     
        </div>   
          <label style={{display:'block'}}>courses: </label>
          <div className='course-container'>
            {courseOptions.map(e =><div key={e}><input type='checkbox' label={e} value={e} {...register('courses')} /><label className='small-label'>{e} </label></div>)}
          </div>  
        <button type='submit'>{selected ? "Update" : "Create"}</button>
        <button type='reset'>Reset</button>
        <button type='button' disabled={selected ? false : true} onClick={testFunc}>Delete</button>
        <button type='button' onClick={handleBackup}>Backup</button >
      </form>
      
    </main>
  )
}