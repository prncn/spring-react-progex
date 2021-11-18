export default function Post({ data }) {
  
  function formatDate(dateString) {
    const options = { weekday: 'long', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'};
    const iso = new Date(dateString.replace(' ', 'T'))
    return iso.toLocaleDateString('en-US', options).replace(',', ' ');
  }

  return (
    <div className="bg-gray-700 flex justify-center align-center flex-col rounded h-32 w-80 m-2 p-4 text-white shadow-2xl">
      <div className="text-sm mb-4">{formatDate(data.date)}</div>
      <div className="mt-auto font-semibold text-lg">{data.author}</div>
      <div>{data.content}</div>
    </div>
  );
}
