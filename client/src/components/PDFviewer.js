import React, { useEffect, useMemo, useRef } from "react";
import ViewSDKClient from "../controller/ViewSDKClient";

export function lightbox(SDKclient, file, title) {
  SDKclient.ready().then(() => {
      SDKclient.previewFile(file, title, "", {
          embedMode: "LIGHT_BOX"
      });
  });
}

export function PDFviewer({ idn = 0, file, title, height = '96', embedMode = 'IN_LINE', scroll = true, setPaginator, rounded = true }) {
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

    const listInnerRef = useRef();

    const onScroll = (event) => {
      if (listInnerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
        if (scrollTop + clientHeight === scrollHeight) {
          console.log("Reached bottom");
        }
      }
  
      console.log(event.currentTarget.scrollHeight);
    };
  
    return (
      <div
        className={`${rounded && 'rounded-xl'} h-${height} overflow-y-auto hidescrollbar`} 
        onScroll={onScroll} ref={listInnerRef}
      >
        <div id={`pdf-div-${idn}`} className='h-full w-full' style={{ height: `${scroll && '850px'}` }}/>
      </div>
    );
  }