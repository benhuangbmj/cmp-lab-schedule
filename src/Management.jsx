import './App.css';
import { useState, useEffect, useCallback, useRef} from 'react';
import { useForm } from 'react-hook-form';
import { getSingleAsset, update } from './api-operations';

import SelectTutor from './util-components/SelectTutor';

const spaceId = import.meta.env.VITE_SPACE_ID;
const accessToken = import.meta.env.VITE_ACCESS_TOKEN;
const cmaToken = import.meta.env.VITE_CMA_TOKEN;

const courseOptions = ['MATH102', 'MATH107', 'MATH108', 'MATH111', 'MATH112', 'MATH190', 'MATH198', 'MATH211', 'MATH261', 'MATH270', 'MATH308', 'STAT269', 'STAT281', 'STAT291', 'STAT292'];  
const skip = ['courses', 'profilePic', 'schedule', 'time', 'day'];

export default function Management({ info, fetchInfo }) {
  const [newPic, setNewPic] = useState();
  const [uploadStatus, setUploadStatus] = useState('Upload');
  const [profile, setProfile] = useState();
  const [selected, setSelected] = useState();
  const currUser = useRef();

  const { register, reset, handleSubmit } = useForm();

  const infoKeys = ['username'].concat(Array.from(Object.keys(Object.values(info)[0])));
  const blankForm = Object.fromEntries(infoKeys.map(key => [key, null])); 
  
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
        <input type='file' accept='image/*' onChange={handleChangeProfile} />
        <button className="file-input-button" onClick={uploadPic}>{uploadStatus}</button>
      </span>
    )
  } 
  
  const isFieldArray = (key) => {
    return Array.isArray(Object.values(info)[0][key]);
  };
  
  const onSubmit = (data) => {
    for (let key in data) {
      if (isFieldArray(key) && typeof data[key] === 'string') {
        data[key] = data[key].split(',');
      }
    }
    const username = data.username;
    delete data.username;    
    update(username, [], data, fetchInfo).then(() => {
      setSelected(null);   
    });     
  }
  const handleSelect = (selected) => {
    if(selected) {
      setProfile();
      setSelected(selected.value);
      if (info[selected.value].profilePic) {
        setProfile(info[selected.value].profilePic.url);
      }
      const initialVal = Object.assign({}, { username: selected.value }, info[selected.value]);
      reset(initialVal);
    } else {
      setSelected();
      setProfile();
      reset(blankForm);
    }
  }
  
  const testFunc = function() {
    alert('Click "OK" to delete the selected user.')
  }

  useEffect(() => {
    if (newPic) {
      const newPicURL = URL.createObjectURL(newPic);
      setProfile(newPicURL);
    }
  }, [newPic]);
  
  return (
    <main>      
      <SelectTutor info={info} handleSelect={handleSelect} />
      <div className='profile-container'>{profile ? <img className="profilePic" src={profile} /> : <div style={{ marginTop: "35px" }}>profile picture</div>}</div>
      <ChangeProfile />
      <form onSubmit={handleSubmit(onSubmit)}>
        {infoKeys.map(e => {
          if (!skip.includes(e)) {
            return (
              <p key={e}>
                <label>{e}{e=='username' && <sup style={{color: "red"}}>*</sup>}: </label>
                {e == 'username' && selected? <input readOnly type='text' className = 'read-only' name={e} {...register(e)} /> : <input type='text' name={e} {...register(e, {required: true})} />}
              </p>
            )
          }
        }
        )}
        <p>
          <label>courses: </label>
          {courseOptions.map(e => <span key={e}><input type='checkbox' label={e} value={e} {...register('courses')} /><label className='small-label'>{e} </label></span>)}
        </p>
        <button type='submit'>{selected?"Update" : "Create"}</button>
        <button type='reset'>Reset</button>
        <button type='button' onClick={testFunc}>Delete</button>        
      </form>
      
    </main>
  )
}