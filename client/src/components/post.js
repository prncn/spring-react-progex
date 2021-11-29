import '../index.css';
import IconComment from '../icons/comment';
import IconBook from '../icons/book';
import IconHeart from '../icons/heart';

export default function Post({ data }) {
  function formatDate(dateString) {
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

  return (
    <div className="bg-gray-50 flex rounded-lg overflow-hidden m-2 p-2 text-black">
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
        <div className="font-semibold mb-1">{data.author + ' '} 
          &#183; <div className="font-light inline">{formatDate(data.date)}</div>
        </div>
        <div>{data.content}</div>
        <div className="my-5 w-full h-full relative">
        <iframe
          title="viewer"
          src={`https://docs.google.com/viewer?url=${data.url}&embedded=true`}
          className="h-full w-full rounded focus:outline-none absolute"
          style={{top: "-10px"}}
          frameBorder="0"
        ></iframe>
        </div>
        <div className="h-10 w-full">
          <div className="h-full w-3/4 flex justify-between items-center">
            <button><IconComment/></button>
            <button><IconBook/></button>
            <button><IconHeart/></button>
          </div>
        </div>
      </div>
    </div>
  );
}
