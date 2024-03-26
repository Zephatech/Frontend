import React, { useEffect, useRef, useState } from 'react';
import * as LR from '@uploadcare/blocks';
import blocksStyles from '@uploadcare/blocks/web/lr-file-uploader-regular.min.css?url';

LR.registerBlocks(LR);

export default function ImageUpload({ setImage }) {
  const [files, setFiles] = useState([]);
  const ctxProviderRef = useRef(null);

  useEffect(() => {
    const ctxProvider = ctxProviderRef.current;
    if (!ctxProvider) return;

    const handleChangeEvent = (event) => {
      let result = event.detail.allEntries.filter((file) => file.status === 'success');
      if(result.length > 0){
        setImage(result[0].cdnUrl);
      }else{
        setImage('');
      }
      setFiles([...event.detail.allEntries.filter((file) => file.status === 'success')]);
    };

    ctxProvider.addEventListener('change', handleChangeEvent);

    return () => {
      ctxProvider.removeEventListener('change', handleChangeEvent);
    };
  }, [setFiles]);

  return (
    <div>
      <lr-upload-ctx-provider
        ctx-name="my-uploader"
        ref={ctxProviderRef}
      />
      <lr-config
        ctx-name="my-uploader"
        pubkey="53ae9f758b93baa07d09"
        maxLocalFileSizeBytes={10000000}
        multiple={false}
        imgOnly={true}
      />
      <lr-file-uploader-minimal
          css-src="https://cdn.jsdelivr.net/npm/@uploadcare/blocks@0.35.2/web/lr-file-uploader-minimal.min.css"
          ctx-name="my-uploader"
          class="my-config"
      />
    
      {/* <div>
        {files.map((file) => (
          <div key={file.uuid}>
            <img
              src={file.cdnUrl}
              alt={file.fileInfo.originalFilename}
            />
          </div>
        ))}
      </div> */}
    </div>
  );
}