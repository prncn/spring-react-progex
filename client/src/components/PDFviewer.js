import React, { useEffect, useMemo } from "react";
import ViewSDKClient from "../controller/ViewSDKClient";

export function lightbox(SDKclient, file, title) {
  SDKclient.ready().then(() => {
      SDKclient.previewFile(file, title, "", {
          embedMode: "LIGHT_BOX"
      });
  });
}

export function PDFviewer({ idn = 0, file, title, height = '96', embedMode = 'IN_LINE', scroll = true, setPaginator }) {
    const viewSDKClient = useMemo(() => new ViewSDKClient(), []);
  
    useEffect(() => {
      if (file === null) return;
      viewSDKClient.ready().then(() => {
        viewSDKClient.previewFile(file, title, `pdf-div-${idn}`, {
          embedMode,
          showPrintPDF: false,
          dockPageControls: false,
        });
      });
    });
    
    useEffect(() => {
      if(setPaginator) {
        setPaginator(viewSDKClient);
      }
    }, [setPaginator, viewSDKClient]);

  
    return (
      <div
        className={`rounded-xl h-${height} overflow-y-auto`} 
      >
        <div id={`pdf-div-${idn}`} className='h-full w-full' style={{ height: `${scroll && '850px'}` }}/>
      </div>
    );
  }