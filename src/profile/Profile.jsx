import '/src/App.css';

import bcrypt from 'bcryptjs';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { getSingleAsset, update } from '/src/api-operations';
import { schema as dataSchema, courseOptions, blankForm } from '/src/utils';
//import {PDFViewer, Document, Page, Text, View, StyleSheet} from '@react-pdf/renderer';



import SelectUser from '/src/util-components/SelectUser';
//import IDCard from './IDcard/IDCard';
import CardDisplay from '/src/IDcard/CardDisplay';
import Scheduling from '/src/scheduling/Scheduling';
//import ResetPassword from 'src/management/ResetPassword';

import sendEmail from '/src/utils/sendEmail';

const spaceId = import.meta.env.VITE_SPACE_ID;
const accessToken = import.meta.env.VITE_ACCESS_TOKEN;
const cmaToken = import.meta.env.VITE_CMA_TOKEN;
const privilege = import.meta.env.VITE_PRIVILEGE;

const display = ['username','name','subject', 'links', 'password'];

export default function Profile({ info, fetchInfo }) {
  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm();
/*
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    reset: resetLogin,
    formState: {errors: errorsLogin},
  } = useForm();
*/
  const activeUser = useSelector(state => state.active.user);
  const userData = useSelector(state => state.userData.items)
  const [newPic, setNewPic] = useState();
  const [uploadStatus, setUploadStatus] = useState('Upload');
  const [profile, setProfile] = useState();
  const [selected, setSelected] = useState(activeUser);
  const [loggedIn, setLoggedIn] = useState(true);
  const currUser = useRef();
  const newUsername = watch('username');

  const resetAll = () => {
    reset(blankForm);
    //resetLogin({pw: null});
    //setLoggedIn(false);
    setNewPic();
    setProfile();
  }
  
  function ChangeProfile() {
    function handleChangeProfile(e) {
      setNewPic(e.target.files[0]);
    }
    async function uploadPic() {
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
        const unpublished = await fetch(`https://api.contentful.com/spaces/${spaceId}/environments/master/assets/${assetId}/published`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${cmaToken}`,
            "X-Contentful-Version": currVersion,
          }
        });
        if (unpublished.ok) {
          var deletedAsset = await fetch(`https://api.contentful.com/spaces/${spaceId}/environments/master/assets/${assetId}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${cmaToken}`,
              "X-Contentful-Version": currVersion,
            }
          });
          return deletedAsset;
        }
        
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
      if (tutor.profilePic && tutor.profilePic.id) {
        var deleted = await deleteAsset(tutor.profilePic.id);
      } else {
        var deleted = true;
      }
      if (deleted) {
        createAsset(newPic, selected);
      }
    }
    return (
      <span>
        <label>Change Profile Picture </label>
        <input disabled = {(loggedIn||newUsername)? false : true} type='file' accept='image/*' onChange={handleChangeProfile} />
        <button type='button' disabled = {(loggedIn && newPic)? false : true} className="file-input-button" onClick={uploadPic}>{uploadStatus}</button>
        <button type='button' disabled = {(loggedIn && profile)? false: true} style={{marginLeft: '5px'}} onClick={() => {
        alert('This feature is under construction.')
        } }>Remove</button>
        <button type='button' disabled = {(loggedIn && profile)? false: true} style={{marginLeft: '5px'}} onClick={() => {handleRotate(true)} }>Rotate Clockwise</button>
        <button type='button' disabled = {(loggedIn && profile)? false: true} style={{marginLeft: '5px'}} onClick={() => {handleRotate(false)} }>Rotate Counterclockwise</button>
      </span>
    )
  }

  const handleRotate = (clockwise) => {
    const newDeg = clockwise ? 90 : -90;
    const currInfo = info[selected];
    let newRotate;
    if(!currInfo.profilePic.transform) {
      newRotate = `rotate(${newDeg}deg)`;
    } else {
      const currRotation = currInfo.profilePic.transform;
      const regex = /-*\d+/g;
      const currDeg = currRotation.match(regex)[0];
      newRotate = currRotation.replace(regex, `${(Number(currDeg) + newDeg)%360}`);      
    }
    update('transform',[selected,'profilePic'], newRotate, fetchInfo);    
  }
  
  const handleUpdate = (data) => {
    const username = data.username;
    delete data.username;
    const links = {};
    Object.keys(dataSchema.links).forEach(key => {      
      links[key] = data[key];      
      delete data[key];
    });
    data.links = links;
    if(data.password != "") {
      data.password = bcrypt.hashSync(data.password, 10);
      setLoggedIn(false);
    } else {
      data.password = info[selected].password;
    }
    data.lastUpdate = new Date().toString();
    data = Object.assign(dataSchema, data);
    console.log(data);//delete
    update(username, [], data, fetchInfo).then(() => {
      if(!selected) {
        resetAll();
      }
    });
  };
  const handleSelect = (currSelected) => {
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
      update(null, [], info, fetchInfo, true).then(()=>{
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
        const now = new Date();
        sendEmail('bhuang', `User ${selected} logged in at ${now.toLocaleString("en-US", {timeZone: "America/New_York"})}.`)
        
      }
    }
    displayInfo(selected);
  };

  const handleDelete = function() {
    const confirm = prompt('Type "Confirm" to proceed to delete the user');
    if (confirm === 'Confirm') {
      delete info[selected];
      update(null,[],info,fetchInfo);
      setSelected();
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

  useEffect(() => {
    displayInfo(selected);
  }, [])
  return (
    <main> 
      {/*      
      <div className="login">
        <SelectTutor info={info} handleSelect={handleSelect} />
        
        {/*<form onSubmit={handleSubmitLogin(handleLogin)}>
          <label>password: </label>
          <input style={{marginTop: '1rem'}} type='password' name='pw' {...registerLogin('pw', {required: 'Please enter your password.'})}>            
          </input>
          <button disabled={selected == null || info[selected].password == null} type='submit'>Log in</button>
          <ResetPassword disabled={selected == null} user={selected} fetchInfo={fetchInfo} info={info}/>
        </form>
        {errorsLogin.pw? <p className='errorMessage'>{errorsLogin.pw.message}</p> : <p className='errorMessage'>&nbsp;</p>}        
      </div>*/
        userData[activeUser].roles.admin && <> 
          <SelectUser info={info} handleSelect={handleSelect} />
          <button type='button' onClick={() => handleSelect(null)}>Create New User</button>
        </>
      
      }
      {selected && <p style={{width: 'fit-content', textAlign: 'left', margin: 'auto',}}>Last Update: {info[selected].lastUpdate}</p>}
      <div className='flexbox-row card-profile-frame'>
        {(selected && loggedIn)? 
          [
            <img key='profile' className="profile-container" src={profile?profile:'https://www.messiah.edu/images/stained_glass_circle1_multicolor.jpg'} />,
            <div key="IDCard" className='card-holder'>
              <CardDisplay pageSize={[220, 290]} pageOrientation='landscape' info={{user: info[selected]}} />
            </div>
          ] : [
            <div key="profile" className='profile-container'>
              <span style={{position: 'absolute'}}>
                profile
              </span>
              <span style={{position: 'relative', top: '20px'}}>
                picture
              </span>
            </div>, 
            <div key="IDCard" className='card-holder'>ID card</div>
          ] }
      </div>
      <ChangeProfile />
      <form onSubmit={handleSubmit(handleUpdate)}>
        <div className = 'flexbox-row input-timetable-frame'>
          <div className='input-holder'>
            {['username'].concat(Object.keys(dataSchema)).map(e => {          
              if (display.includes(e)) {
                return (
                  e != 'links'? <p key={e}>
                    <label>{e=='password'?'new passowrd':e}{e == 'username' && <sup style={{ color: "red" }}>*</sup>}: </label>
                    {
                      e == 'username' && selected ?
                        <input readOnly type='text' className='read-only' {...register(e)} /> : e == "username" ?
                          <>
                            <input type='text' {...register(e, { required: "Username is required." })}/>
                            {errors.username ? <p className='errorMessage'>{errors.username.message}</p> : null}
                          </> :
                          <input type={e=='password'?'password':"text"} {...register(e)} />
                    }
                  </p> : Object.keys(dataSchema[e]).map(link => <p key={link}><label style={{textTransform: 'capitalize'}}>{link}: </label><input type='url' {...register(link)}/> </p>) 
                )
              }
            }
            )}     
          </div>
          <div>
            <Scheduling info={info} fetchInfo={fetchInfo} selected={loggedIn?selected:null}/>
          </div>
        </div>
        
          <div>
            <label style={{display:'block'}}>courses: </label>
            <div className='course-container'>
              {courseOptions.map(e =><div key={e}><input type='checkbox' label={e} value={e} {...register('courses')} /><label className='small-label'>{e} </label></div>)}
            </div>  
          </div>    
        <button type='submit' disabled={!selected? false : loggedIn? false : true} >{selected ? "Update" : "Create"}</button>
        <button type='reset'>Reset</button>
        <button type='button' disabled={loggedIn ? false : true} onClick={handleDelete}>Delete</button>
        <button type='button' onClick={handleBackup}>Backup</button >
      </form>
      
    </main>
  )
}