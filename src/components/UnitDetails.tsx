import React, { useEffect, useState } from 'react';
import { Button, Card, Row, Col, Spinner, Alert, Table, Modal } from 'react-bootstrap';
import { supabase } from '../supabaseClient';

interface UnitDetailsProps {
  id: string;
  onBack: () => void;
}

const UnitDetails: React.FC<UnitDetailsProps> = ({ id, onBack }) => {
  const [unit, setUnit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unitResidents, setUnitResidents] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [availableResidents, setAvailableResidents] = useState<any[]>([]);
  const [addLoading, setAddLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  // Fetch unit details
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

  // Fetch residents assigned to this unit
  const fetchUnitResidents = async () => {
    const { data, error } = await supabase
      .from('unit_resident')
      .select('id, resident_id, resident(first_name, last_name, primary_phone)')
      .eq('unit_id', id);
    if (!error) setUnitResidents(data || []);
  };

  useEffect(() => {
    fetchUnitResidents();
  }, [id]);

  // Fetch residents in the community not assigned to any unit
  const fetchAvailableResidents = async () => {
    setAddLoading(true);
    // Get all residents for the community
    const { data: allResidents, error: resError } = await supabase
      .from('resident')
      .select('id, first_name, last_name, primary_phone')
      .eq('community_id', unit.community_id);
    if (resError) {
      setAddLoading(false);
      return;
    }
    // Get all assigned resident ids
    const { data: assigned, error: assignError } = await supabase
      .from('unit_resident')
      .select('resident_id')
      .in('resident_id', allResidents.map((r: any) => r.id));
    const assignedIds = assignError ? [] : (assigned || []).map((ur: any) => ur.resident_id);
    // Filter out assigned
    const available = allResidents.filter((r: any) => !assignedIds.includes(r.id));
    setAvailableResidents(available);
    setAddLoading(false);
  };

  // Add resident to unit
  const handleAddResident = async (residentId: string) => {
    setAddLoading(true);
    await supabase.from('unit_resident').insert({ unit_id: id, resident_id: residentId });
    setShowAddModal(false);
    await fetchUnitResidents();
    setAddLoading(false);
  };

  // Delete resident from unit
  const handleDeleteUnitResident = async (unitResidentId: string) => {
    setDeleteLoading(unitResidentId);
    await supabase.from('unit_resident').delete().eq('id', unitResidentId);
    await fetchUnitResidents();
    setDeleteLoading(null);
  };

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
      {/* Residents Section */}
      <h5>Residents Assigned to This Unit</h5>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Resident ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {unitResidents.length === 0 ? (
            <tr><td colSpan={4}>No residents assigned to this unit.</td></tr>
          ) : (
            unitResidents.map((ur: any) => (
              <tr key={ur.id}>
                <td>{ur.resident_id}</td>
                <td>{ur.resident ? `${ur.resident.first_name} ${ur.resident.last_name}` : ''}</td>
                <td>{ur.resident ? ur.resident.primary_phone : ''}</td>
                <td>
                  <Button size="sm" variant="danger" disabled={deleteLoading === ur.id} onClick={() => handleDeleteUnitResident(ur.id)}>
                    {deleteLoading === ur.id ? <Spinner size="sm" animation="border" /> : 'Delete'}
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
      <Button variant="primary" className="mb-3" onClick={() => { setShowAddModal(true); fetchAvailableResidents(); }}>
        Add Resident
      </Button>
      {/* Add Resident Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add Resident to Unit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {addLoading ? <Spinner animation="border" /> : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Resident ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {availableResidents.length === 0 ? (
                  <tr><td colSpan={4}>No available residents to add.</td></tr>
                ) : (
                  availableResidents.map((r: any) => (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td>{r.first_name} {r.last_name}</td>
                      <td>{r.primary_phone}</td>
                      <td>
                        <Button size="sm" variant="success" onClick={() => handleAddResident(r.id)}>
                          Add
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UnitDetails;
