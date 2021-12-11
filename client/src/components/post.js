import '../index.css';
import IconComment from '../icons/comment';
import IconBook from '../icons/book';
import IconHeart from '../icons/heart';
import { useEffect } from 'react';
import ViewSDKClient from '../controller/ViewSDKClient';

export default function Post({ data, offline, idn }) {
  function formatDateString(dateString) {
    const options = {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    const iso = new Date(dateString.replace(' ', 'T'));
    return iso.toLocaleDateString('en-US', options).replace(',', ' ');
  }

  function formatUnixTimestamp(dateString) {
    if (dateString !== null) {
      return new Date(dateString.seconds * 1000).toLocaleDateString('en-US');
    }
  }

  return (
    <div className="flex rounded-lg m-2 p-2 text-black" style={{backgroundColor: '#EAEAEA'}}>
      <div className="w-20 pl-4" style={{backgroundColor: '#EAEAEA'}}>
        <div className="w-16 h-16 mt-2 rounded-full shadow-lg">
          <img
            className="w-full h-full object-contained rounded-full block shadow-lg"
            src={data.user.icon}
            alt="pfp_icon"
          />
        </div>
      </div>
      <div
        className="flex justify-center align-center flex-col p-2"
        style={{ width: '600px', height: '500px' }}
      >
        <div className="font-semibold mb-1">
          {data.user.name + ' '}
          &#183;{' '}
          <div className="font-light inline">
            {offline
              ? formatDateString(data.date)
              : formatUnixTimestamp(data.date)}
          </div>
        </div>
        <div>{data.description}</div>
        <PDFviewer idn={idn} file={data.url} title={data.title}/>
        <div className="h-10 w-full">
          <div className="h-full w-3/4 flex justify-between items-center">
            <button>
              <IconComment />
            </button>
            <button>
              <IconBook />
            </button>
            <button>
              <IconHeart />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PDFviewer({ idn, file, title }) {
  useEffect(() => {
    const viewSDKClient = new ViewSDKClient();
    viewSDKClient.ready().then(() => {
      viewSDKClient.previewFile(file, title, `pdf-div-${idn}`, {
        embedMode: 'SIZED_CONTAINER',
        showPrintPDF: false,
        dockPageControls: false
      });
    });
  }, [idn, file, title]);

  return (
    <div className="in-line-container w-full h-full overflow-y-auto">
      <div id={`pdf-div-${idn}`} className="in-line-div w-full h-full" />
    </div>
  );
}
