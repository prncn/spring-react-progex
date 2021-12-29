import '../index.css';
import IconComment from '../icons/comment';
import IconBook from '../icons/book';
import IconHeart from '../icons/heart';
import { useEffect, useState } from 'react';
import ViewSDKClient from '../controller/ViewSDKClient';
import { Link } from 'react-router-dom';
import {
  checkIfPostLikedByUser,
  likePost,
  unlikePost,
} from '../controller/QueryService';

export function timeDifference(previous) {
  previous = previous.seconds / 1000;
  const current = Math.floor(Date.now() / 1000);

  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + ' seconds ago';
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + ' minutes ago';
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + ' hours ago';
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + ' days ago';
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + ' months ago';
  } else {
    return Math.round(elapsed / msPerYear) + ' years ago';
  }
}

export default function Post({ data, offline, idn, currentUser }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLiked(await checkIfPostLikedByUser(data.id, currentUser?.uid));
      setIsLoading(false);
    })();
  }, [currentUser?.uid, data.id]);

  function toggleLiked(e) {
    e.preventDefault();
    if (!liked) {
      likePost(data.id, currentUser?.uid);
    } else {
      unlikePost(data.id, currentUser?.uid);
    }
    setLiked(!liked);
  }

  function toggleSaved(e) {
    e.preventDefault();
    setSaved(!saved);
  }

  return (
    <div
      className="flex rounded-lg lg:my-3 my-1 pt-2 px-2 mx-4 text-white bg-gray-800 hover:bg-gray-900 transition text-sm"
      style={{ width: '98%' }}
    >
      <div className="w-20 pl-4 rounded-lg">
        <div className="w-16 h-16 mt-2 rounded-full shadow-lg">
          <img
            className="w-full h-full object-cover rounded-full block shadow-lg transition-all"
            src={data.user.photoURL}
            alt={data.user.displayName}
          />
        </div>
        <div className="h-2/3">
          <div className="h-full px-2 mt-8 flex flex-col justify-around items-center">
            <button
              className="hover:bg-gray-800 p-4 rounded-full shadow-xl"
              onClick={toggleLiked}
            >
              <IconHeart filled={liked} />
            </button>
            <Link to={`/view?id=${data.id}`} state={data}>
              <button className="hover:bg-gray-800 p-4 rounded-full">
                <IconComment />
              </button>
            </Link>
            <button
              className="hover:bg-gray-800 p-4 rounded-full"
              onClick={toggleSaved}
            >
              <IconBook filled={saved} />
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-center align-center flex-col p-2 w-full">
        <div
          className={`font-semibold mb-1 w-1/3 ${
            isLoading ? 'rounded bg-gray-500' : ''
          }`}
        >
          <Link to={`/profile/${data.user.id}`}>{data.user.displayName}</Link>{' '}
          &#183;{' '}
          <div className="font-light inline">{timeDifference(data.date)}</div>
        </div>
        <div className="pb-3">{data.description}</div>
        <PDFviewer idn={idn} file={data.url} title={data.title} />
      </div>
    </div>
  );
}

export function PDFviewer({ idn = 0, file, title, height = '96' }) {
  useEffect(() => {
    if (file === null) return;

    const viewSDKClient = new ViewSDKClient();
    viewSDKClient.ready().then(() => {
      viewSDKClient.previewFile(file, title, `pdf-div-${idn}`, {
        embedMode: 'IN_LINE',
        showPrintPDF: false,
        dockPageControls: false,
      });
    });
  }, [idn, file, title]);

  return (
    <div
      className={`in-line-container w-full h-${height} overflow-y-scroll rounded-xl`}
    >
      <div id={`pdf-div-${idn}`} className="in-line-div w-full h-full" />
    </div>
  );
}
