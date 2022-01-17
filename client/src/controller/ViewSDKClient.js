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
    this.viewAPI = undefined;
  }

  ready() {
    return this.readyPromise;
  }


  async previewFile(file, fileName, divId, viewerConfig) {
    const config = {
      clientId: 'cfb77c914b3444668a74f3b1f0a30e78',
    };
    if (divId) {
      config.divId = divId;
    }
    this.adobeDCView = new window.AdobeDC.View(config);

    const previewFilePromise = this.adobeDCView.previewFile(
      {
        content: {
          location: {
            url: file,
          },
        },
        metaData: {
          fileName: `${fileName}.pdf`,
          id: '6d07d124-ac85-43b3-a867-36930f502ac6',
        },
      },
      viewerConfig
    );

    previewFilePromise.then(function (adobeViewer) {
      adobeViewer.getAPIs().then((apis) => {
        apis
          .getCurrentPage()
          .catch((error) => console.log(error));
      });
    })

    this.viewAPI = previewFilePromise;
    return previewFilePromise;
  }

  goToPage(pageNum) {
    this.viewAPI.then(function (adobeViewer) {
      adobeViewer.getAPIs().then((apis) => {
        apis
          .gotoLocation(pageNum);
      });
    })
  }

  registerSaveApiHandler() {
    const saveApiHandler = (metaData, content, options) => {
      console.log(metaData, content, options);
      return new Promise((resolve) => {
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
