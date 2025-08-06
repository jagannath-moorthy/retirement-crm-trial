import React, { useEffect, useState } from 'react';
import { Button, Card, Row, Col, Spinner, Alert, Image } from 'react-bootstrap';
import { supabase } from '../supabaseClient';

interface ResidentDetailsProps {
  id: string;
  onBack: () => void;
}

const ResidentDetails: React.FC<ResidentDetailsProps> = ({ id, onBack }) => {
  const [resident, setResident] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.from('resident').select('*').eq('id', id).single();
      if (error) setError(error.message);
      else setResident(data);
      setLoading(false);
    };
    fetchDetails();
  }, [id]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!resident) return <Alert variant="warning">Resident not found.</Alert>;

  return (
    <div>
      <Button variant="secondary" className="mb-3" onClick={onBack}>&larr; Back to Residents</Button>
      <Card className="mb-4">
        <Card.Header as="h4">{resident.first_name} {resident.last_name}</Card.Header>
        <Card.Body>
          <Row>
            <Col md={3}>
              {resident.photo_blob ? (
                <Image src={`data:image/jpeg;base64,${resident.photo_blob}`} rounded width={128} height={128} />
              ) : (
                <div style={{ width: 128, height: 128, background: '#eee', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No Photo</div>
              )}
            </Col>
            <Col md={9}>
              <strong>Preferred Name:</strong> {resident.preferred_name}<br />
              <strong>Date of Birth:</strong> {resident.date_of_birth}<br />
              <strong>Gender:</strong> {resident.gender}<br />
              <strong>Primary Phone:</strong> {resident.primary_phone}<br />
              <strong>Primary Email:</strong> {resident.primary_email}<br />
              <strong>Status:</strong> {resident.status}<br />
              {/* Add more fields as needed */}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ResidentDetails;
