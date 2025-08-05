import React, { useEffect, useState } from 'react';
import { Button, Row, Col, Card, Spinner, Alert, Table } from 'react-bootstrap';
import { supabase } from '../supabaseClient';

interface CommunityDetailsProps {
  id: string;
  onBack: () => void;
}

const CommunityDetails: React.FC<CommunityDetailsProps> = ({ id, onBack }) => {
  const [community, setCommunity] = useState<any>(null);
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.from('community').select('*').eq('id', id).single();
      if (error) setError(error.message);
      else setCommunity(data);
      // Fetch units for this community
      const { data: unitData, error: unitError } = await supabase.from('unit').select('*').eq('community_id', id);
      if (unitError) setError(unitError.message);
      else setUnits(unitData || []);
      setLoading(false);
    };
    fetchDetails();
  }, [id]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!community) return <Alert variant="warning">Community not found.</Alert>;

  return (
    <div>
      <Button variant="secondary" className="mb-3" onClick={onBack}>&larr; Back to List</Button>
      <Card className="mb-4">
        <Card.Header as="h4">{community.name}</Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <strong>Address:</strong><br />
              {community.address_line1}<br />
              {community.address_line2 && <>{community.address_line2}<br /></>}
              {community.address_line3 && <>{community.address_line3}<br /></>}
              {community.locality}, {community.country_subdivision} {community.postal_code}<br />
              {community.country}
            </Col>
            <Col md={6}>
              <strong>Status:</strong> {community.status}<br />
              <strong>Onboarding Status:</strong> {community.onboarding_status}<br />
              <strong>Timezone:</strong> {community.timezone}<br />
              <strong>Contact Email:</strong> {community.contact_email}<br />
              <strong>Contact Phone:</strong> {community.contact_phone}<br />
              <strong>Logo URL:</strong> {community.logo_url}<br />
              <strong>Onboarding Date:</strong> {community.onboarding_date}
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <h5>Units</h5>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Unit Number</th>
            <th>Created</th>
            <th>Modified</th>
          </tr>
        </thead>
        <tbody>
          {units.map((u) => (
            <tr key={u.id}>
              <td>{u.unit_number}</td>
              <td>{u.created_datetime}</td>
              <td>{u.modified_datetime}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {/* Add unit management UI here in the future */}
    </div>
  );
};

export default CommunityDetails;
