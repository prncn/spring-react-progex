import '../index.css';

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

  const iconcomment = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );

  const iconlike = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );

  const iconbook = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  );

  return (
    <div className="bg-gray-50 flex rounded-lg overflow-hidden m-2 text-black">
      <div className="w-20 bg-gray-50 pl-4">
        <div className="w-18 h-18 mt-12 rounded-full shadow-lg">
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
        <div className="text-sm mb-4">{formatDate(data.date)}</div>
        <div className="font-semibold text-lg">{data.author}</div>
        <div className="mb-2">{data.content}</div>
        <iframe
          title="viewer"
          src={`https://docs.google.com/viewer?url=${data.url}&embedded=true`}
          className="h-full rounded focus:outline-none no-scrollbar"
          frameBorder="0"
        ></iframe>
        <div className="h-16 w-full p-2">
          <div className="h-full w-3/4 flex justify-between items-center">
            <div>{iconcomment}</div>
            <div>{iconbook}</div>
            <div>{iconlike}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
