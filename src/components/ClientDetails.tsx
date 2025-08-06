import React, { useEffect, useState } from 'react';
import { Button, Row, Col, Card, Spinner, Alert, Table } from 'react-bootstrap';
import { supabase } from '../supabaseClient';

interface ClientDetailsProps {
  id: string;
  onBack: () => void;
  onShowCommunityDetails?: (id: string) => void;
}

const ClientDetails: React.FC<ClientDetailsProps> = ({ id, onBack, onShowCommunityDetails }) => {
  const [client, setClient] = useState<any>(null);
  const [communities, setCommunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.from('client').select('*').eq('id', id).single();
      if (error) setError(error.message);
      else setClient(data);
      const { data: commData, error: commError } = await supabase.from('community').select('id, name').eq('client_id', id).order('name');
      if (commError) setError(commError.message);
      else setCommunities(commData || []);
      setLoading(false);
    };
    fetchDetails();
  }, [id]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!client) return <Alert variant="warning">Client not found.</Alert>;

  return (
    <div>
      <Button variant="secondary" className="mb-3" onClick={onBack}>&larr; Back to List</Button>
      <Card className="mb-4">
        <Card.Header as="h4">{client.name}</Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <strong>Status:</strong> {client.status}<br />
              <strong>Contact Name:</strong> {client.contact_name}<br />
              <strong>Contact Designation:</strong> {client.contact_designation}<br />
              <strong>Contact Email:</strong> {client.contact_email}<br />
              <strong>Contact Phone:</strong> {client.contact_phone}<br />
              <strong>Website:</strong> {client.website}<br />
            </Col>
            <Col md={6}>
              <strong>Subscription Plan:</strong> {client.subscription_plan_id || 'None'}<br />
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <h5>Communities Owned</h5>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {communities.length === 0 ? (
            <tr><td>No communities found for this client.</td></tr>
          ) : (
            communities.map(comm => (
              <tr key={comm.id}>
                <td>
                  <Button variant="link" onClick={() => {
                    if (typeof onShowCommunityDetails === 'function') {
                      onShowCommunityDetails(comm.id);
                    }
                  }}>{comm.name}</Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default ClientDetails;
