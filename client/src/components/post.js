import '../index.css';
import IconComment from '../icons/comment';
import IconBook from '../icons/book';
import IconHeart from '../icons/heart';
import { Document, Page, pdfjs } from 'react-pdf';
import { useEffect, useRef, useState } from 'react';

export default function Post({ data, offline }) {
  const docRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [numPages, setNumPages] = useState(null);
  console.log(numPages);
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

  useEffect(() => {
    setWidth(docRef.current.getBoundingClientRect().width);
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

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
      return new Date(dateString.seconds * 1000).toLocaleDateString("en-US")
    }
  }

  return (
    <div className="bg-gray-50 flex rounded-lg m-2 p-2 text-black">
      <div className="w-20 bg-gray-50 pl-4">
        <div className="w-16 h-16 mt-2 rounded-full shadow-lg">
          <img
            className="w-full h-full object-contained rounded-full block shadow-lg"
            src={data.icon}
            alt="pfp_icon"
          />
        </div>
      </div>
      <div
        className="flex justify-center align-center flex-col p-2"
        style={{ width: '600px', height: '500px' }}
      >
        <div className="font-semibold mb-1">{data.authorId + ' '}
          &#183; <div className="font-light inline">{offline ? formatDateString(data.date) : formatUnixTimestamp(data.date)}</div>
        </div>
        <div>{data.content}</div>
        <div ref={docRef} className="my-5 w-full h-full relative overflow-hidden">
          <Document className="w-full" file={{ url: `https://cors-anywhere.herokuapp.com/${data.url}`, mode: 'no-cors', httpHeaders: { "Access-Control-Allow-Origin": "*" } }} cache={false} onLoadSuccess={onDocumentLoadSuccess}>
            <Page width={width} pageNumber={1} />
          </Document>
        </div>
        <div className="h-10 w-full">
          <div className="h-full w-3/4 flex justify-between items-center">
            <button><IconComment /></button>
            <button><IconBook /></button>
            <button><IconHeart /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
