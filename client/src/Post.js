import { Card } from 'react-bootstrap';

export default function Post({ data }) {

  function formatDate(dateString) {
    const iso = new Date(dateString.replace(' ', 'T')).toISOString().split('T')
    return iso[0] + ' ' + iso[1].slice(0,5)

  }

  return (
    <Card
      bg={'dark'}
      text={'white'}
      style={{ width: '18rem' }}
      className="m-2 shadow"
    >
      <Card.Header>{formatDate(data.date)}</Card.Header>
      <Card.Body>
        <Card.Title>{data.author}</Card.Title>
        <Card.Text>{data.content}</Card.Text>
      </Card.Body>
    </Card>
  );
}
