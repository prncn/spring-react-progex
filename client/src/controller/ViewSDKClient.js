class ViewSDKClient {
  constructor() {
    this.readyPromise = new Promise((resolve) => {
      if (window.AdobeDC) {
        resolve();
      } else {
        document.addEventListener('adobe_dc_view_sdk.ready', () => {
          resolve();
        });
      }
    });
    this.adobeDCView = undefined;
  }

  ready() {
    return this.readyPromise;
  }

  previewFile(file, divId, viewerConfig) {
    const config = {
      clientId: 'cfb77c914b3444668a74f3b1f0a30e78',
    };
    if (divId) {
      /* Optional only for Light Box embed mode */
      /* Pass the div id in which PDF should be rendered */
      config.divId = divId;
    }
    /* Initialize the AdobeDC View object */
    this.adobeDCView = new window.AdobeDC.View(config);

    /* Invoke the file preview API on Adobe DC View object */
    const previewFilePromise = this.adobeDCView.previewFile(
      {
        content: {
          location: {
            url: file,
            /*
                  If the file URL requires some additional headers, then it can be passed as follows:-
                  headers: [
                      {
                          key: "<HEADER_KEY>",
                          value: "<HEADER_VALUE>",
                      }
                  ]
                  */
          },
        },
        metaData: {
          fileName: 'Bodea Brochure.pdf',
          id: '6d07d124-ac85-43b3-a867-36930f502ac6',
        },
      },
      viewerConfig
    );

    return previewFilePromise;
  }

  previewFileUsingFilePromise(divId, filePromise, fileName) {
    /* Initialize the AdobeDC View object */
    this.adobeDCView = new window.AdobeDC.View({
      /* Pass your registered client id */
      clientId: 'cfb77c914b3444668a74f3b1f0a30e78',
      /* Pass the div id in which PDF should be rendered */
      divId,
    });

    /* Invoke the file preview API on Adobe DC View object */
    this.adobeDCView.previewFile(
      {
        /* Pass information on how to access the file */
        content: {
          /* pass file promise which resolve to arrayBuffer */
          promise: filePromise,
        },
        /* Pass meta data of file */
        metaData: {
          /* file name */
          fileName: fileName,
        },
      },
      {}
    );
  }

  registerSaveApiHandler() {
    /* Define Save API Handler */
    const saveApiHandler = (metaData, content, options) => {
      console.log(metaData, content, options);
      return new Promise((resolve) => {
        /* Dummy implementation of Save API, replace with your business logic */
        setTimeout(() => {
          const response = {
            code: window.AdobeDC.View.Enum.ApiResponseCode.SUCCESS,
            data: {
              metaData: Object.assign(metaData, {
                updatedAt: new Date().getTime(),
              }),
            },
          };
          resolve(response);
        }, 2000);
      });
    };

    this.adobeDCView.registerCallback(
      window.AdobeDC.View.Enum.CallbackType.SAVE_API,
      saveApiHandler,
      {}
    );
  }

  registerEventsHandler() {
    /* Register the callback to receive the events */
    this.adobeDCView.registerCallback(
      /* Type of call back */
      window.AdobeDC.View.Enum.CallbackType.EVENT_LISTENER,
      /* call back function */
      (event) => {
        console.log(event);
      },
      /* options to control the callback execution */
      {
        /* Enable PDF analytics events on user interaction. */
        enablePDFAnalytics: true,
      }
    );
  }
}

export default ViewSDKClient;