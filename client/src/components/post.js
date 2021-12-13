import '../index.css';
import IconComment from '../icons/comment';
import IconBook from '../icons/book';
import IconHeart from '../icons/heart';
import { useEffect, useState } from 'react';
import ViewSDKClient from '../controller/ViewSDKClient';

export default function Post({ data, offline, idn }) {
  const [fill, setFill] = useState(false);

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

  function toggleFill(e) {
    e.preventDefault();
    setFill(!fill)
  }

  return (
    <div className="w-full flex rounded-lg my-3 pt-2 pl-2 text-white bg-gray-800">
      <div className="w-20 pl-4 bg-gray-800 rounded-lg">
        <div className="w-16 h-16 mt-2 rounded-full shadow-lg">
          <img
            className="w-full h-full object-contained rounded-full block shadow-lg"
            src={data.user.icon}
            alt="pfp_icon"
          />
        </div>
        <div className="h-2/3">
          <div className="h-full px-2 mt-8 flex flex-col justify-around items-center">
            <button className="hover:bg-gray-700 p-4 rounded-full shadow-xl" onClick={toggleFill}>
              <IconHeart fill={fill}/>
            </button>
            <button className="hover:bg-gray-700 p-4 rounded-full">
              <IconComment />
            </button>
            <button className="hover:bg-gray-700 p-4 rounded-full">
              <IconBook />
            </button>
          </div>
        </div>
      </div>
      <div
        className="flex justify-center align-center flex-col p-2 w-full"
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
        <div className="pb-3">{data.description}</div>
        <PDFviewer idn={idn} file={data.url} title={data.title}/>
      </div>
    </div>
  );
}

function PDFviewer({ idn, file, title }) {
  useEffect(() => {
    const viewSDKClient = new ViewSDKClient();
    viewSDKClient.ready().then(() => {
      viewSDKClient.previewFile(file, title, `pdf-div-${idn}`, {
        embedMode: 'IN_LINE',
        showPrintPDF: false,
        dockPageControls: false
      });
    });
  }, [idn, file, title]);

  return (
    <div className="in-line-container w-full h-96 overflow-y-scroll rounded-xl">
      <div id={`pdf-div-${idn}`} className="in-line-div w-full h-full" />
    </div>
  );
}
