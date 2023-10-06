import './App.css';
import { useState, useEffect } from 'react';
import Select from "react-select";
import { useForm } from 'react-hook-form';
import { getSingleAsset } from './api-operations';
import {sortByLastName} from './util';

export default function Management({ info, fetchInfo, setRerender, update }) {
  const [newPic, setNewPic] = useState();
  const [uploadStatus, setUploadStatus] = useState('Upload');
  useEffect(() => {
    if (newPic) {
      const newPicURL = URL.createObjectURL(newPic);
      setProfile(newPicURL);
    }
  }, [newPic]);
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
            update('profilePic', [selected], newProfile);
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

  const courseOptions = ['MATH102', 'MATH107', 'MATH108', 'MATH111', 'MATH112', 'MATH190', 'MATH198', 'MATH211', 'MATH261', 'MATH270', 'MATH308', 'STAT269', 'STAT281', 'STAT291', 'STAT292'];
  const options = [];
  const skip = ['courses', 'profilePic'];

  Object.entries(info).forEach(e => {
    options.push({ value: e[0], label: e[1].name });
  });
  sortByLastName(options, ['label']);
  const isFieldArray = (key) => {
    return Array.isArray(Object.values(info)[0][key]);
  };

  const infoKeys = Array.from(Object.keys(Object.values(info)[0]));
  infoKeys.unshift('username');

  const { register, reset, handleSubmit } = useForm();

  const [profile, setProfile] = useState();
  const [selected, setSelected] = useState();

  const onSubmit = (data) => {
    for (let key in data) {
      if (isFieldArray(key) && typeof data[key] === 'string') {
        data[key] = data[key].split(',');
      }
    }
    const username = data.username;
    delete data.username;    
    update(username, [], data).then(() => {
      setSelected(null);
      setRerender(prev => prev+1); 
    });     
  }
  const handleSelect = (selected) => {
    setProfile();
    setSelected(selected.value);
    if (info[selected.value].profilePic) {
      setProfile(info[selected.value].profilePic.url);
    }
    const initialVal = Object.assign({}, { username: selected.value }, info[selected.value]);
    reset(initialVal);
  }
  const testFunc = function() {
    fetch(`https://api.contentful.com/spaces/${spaceId}/environments/master/assets/3YEEPT914X0B8vi6RGkBnc`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cmaToken}`,
      }
    }).then(res => res.json()).then(res => console.log(res.fields.file['en-US'].url));
  }

  return (
    <main>
      <label>Select tutor </label>
      <Select className="select" options={options} onChange={handleSelect}/>
      <div className='profile-container'>{profile ? <img className="profilePic" src={profile} /> : <div style={{ marginTop: "35px" }}>profile picture</div>}</div>
      <ChangeProfile />
      <form onSubmit={handleSubmit(onSubmit)}>
        {infoKeys.map(e => {
          if (!skip.includes(e)) {
            return (
              <p key={e}>
                <label>{e}: </label>
                <input type='text' name={e} {...register(e)} />
              </p>
            )
          }
        }
        )}
        <p>
          <label>courses: </label>
          {courseOptions.map(e => <span key={e}><input type='checkbox' label={e} value={e} {...register('courses')} /><label className='small-label'>{e} </label></span>)}
        </p>
        <button type='submit'>Update</button>
      </form>
      <button onClick={testFunc} style={{display: 'none'}}>Test</button>
    </main>
  )
}