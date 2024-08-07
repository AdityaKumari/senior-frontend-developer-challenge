import React, { useState } from 'react';
import './Styles.css';
import { base_object } from './BaseObject';
import { JsonPatchOperations } from './JsonPatchOperations';


const applyPatch = (object, patch) => {
  const pathArray = patch.path.slice(1).split('/');
  let obj = object;
  for (let i = 0; i < pathArray.length - 1; i++) {
    obj = obj[pathArray[i]];
  }
  switch (patch.op) {
    case 'replace':
      obj[pathArray[pathArray.length - 1]] =  patch.value;
      break;
    case 'add':
      obj[pathArray[pathArray.length - 1]] = patch.value;
      break;
    case 'remove':
      delete obj[pathArray[pathArray.length - 1]];
      break;
  }
};

function JsonPatchUI() {
  const [currentObject, setCurrentObject] = useState(base_object);
  const [remainingPatches, setRemainingPatches] = useState(JsonPatchOperations);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleApprove = (index) => {
    const patch = remainingPatches[index];
    applyPatch(currentObject, patch);
    setCurrentObject({ ...currentObject });
    createNwwPatch(index)
  };

  const createNwwPatch = (index) => {
    const newPatches = remainingPatches.filter((_, i) => i !== index);
    setRemainingPatches(newPatches);
  };

  return (
    <div className='parent-class'>
     <div className='child-class'>
     <div className='heading'>Current Object State:</div>
     <div className='current-object'>
     {JSON.stringify(currentObject).split(',').map((line, index) => (
        <div key={index} className="json-line">
          {line}
        </div>
      ))}
     </div>

     </div>
     <div className='child-class'>
      <div className='heading'>Pending Patch Operations:</div>
      {remainingPatches.length > 0 ? (
        <div>
          {remainingPatches.map((patch, index) => (
            <div
              key={index}
              className="patch-item"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <span>{JSON.stringify(patch)}</span>
              {hoveredIndex === index && (
                <div className="buttons">
                  <button className="accept-button" onClick={() => handleApprove(index)}>Approve</button>
                  <button className="reject-button" onClick={() => createNwwPatch(index)}>Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No more patches to apply.</p>
      )}
      </div>
    </div>
  );
}

export default JsonPatchUI;
