import React, { useEffect, useState } from 'react';
import { Button, Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { supabase } from '../supabaseClient';

interface UnitDetailsProps {
  id: string;
  onBack: () => void;
}

const UnitDetails: React.FC<UnitDetailsProps> = ({ id, onBack }) => {
  const [unit, setUnit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.from('unit').select('*').eq('id', id).single();
      if (error) setError(error.message);
      else setUnit(data);
      setLoading(false);
    };
    fetchDetails();
  }, [id]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!unit) return <Alert variant="warning">Unit not found.</Alert>;

  return (
    <div>
      <Button variant="secondary" className="mb-3" onClick={onBack}>&larr; Back to Units</Button>
      <Card className="mb-4">
        <Card.Header as="h4">Unit {unit.unit_number} {unit.unit_name ? `- ${unit.unit_name}` : ''}</Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <strong>Type:</strong> {unit.unit_type}<br />
              <strong>Block:</strong> {unit.block}<br />
              <strong>Floor:</strong> {unit.floor}<br />
              <strong>Area:</strong> {unit.area}<br />
              <strong>Bedrooms:</strong> {unit.bedroom}<br />
              <strong>Bathrooms:</strong> {unit.bathroom}<br />
              <strong>Status:</strong> {unit.status}<br />
            </Col>
            <Col md={6}>
              <strong>Monthly Rent:</strong> {unit.monthly_rent}<br />
              <strong>Resident Capacity:</strong> {unit.resident_capacity}<br />
              <strong>Accessible:</strong> {unit.is_accessible ? 'Yes' : 'No'}<br />
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default UnitDetails;
