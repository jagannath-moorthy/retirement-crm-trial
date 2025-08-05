import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { supabase } from '../supabaseClient';

const initialForm = {
  unit_number: '',
  unit_name: '',
  unit_type: 'Studio',
  block: '',
  floor: '',
  area: '',
  bedroom: '',
  bathroom: '',
  status: 'Available',
  monthly_rent: '',
  resident_capacity: '',
  is_accessible: false,
};

const unitTypeOptions = ['Studio', '1BHK', '2BHK', 'Shared', 'Villa'];
const statusOptions = ['Available', 'Occupied', 'Reserved', 'Maintenance', 'Unavailable'];

interface UnitManagerProps {
  communityId: string;
}

const UnitManager: React.FC<UnitManagerProps> = ({ communityId }) => {
  const [units, setUnits] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailsId, setDetailsId] = useState<string | null>(null);

  const fetchUnits = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('unit').select('*').eq('community_id', communityId).order('unit_number');
    if (error) setError(error.message);
    else setUnits(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchUnits();
  }, [communityId]);

  const handleShowForm = (unit?: any) => {
    if (unit) {
      setForm({ ...unit });
      setEditingId(unit.id);
    } else {
      setForm(initialForm);
      setEditingId(null);
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setForm(initialForm);
    setEditingId(null);
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const payload = { ...form, community_id: communityId };
    if (editingId) {
      const { error } = await supabase.from('unit').update(payload).eq('id', editingId);
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.from('unit').insert([payload]);
      if (error) setError(error.message);
    }
    setShowForm(false);
    setForm(initialForm);
    setEditingId(null);
    await fetchUnits();
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase.from('unit').delete().eq('id', deleteId);
    if (error) setError(error.message);
    setShowDelete(false);
    setDeleteId(null);
    await fetchUnits();
    setLoading(false);
  };

  // Details modal for now just shows all fields
  const UnitDetailsModal = ({ unit, onHide }: { unit: any, onHide: () => void }) => (
    <Modal show={!!unit} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Unit Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {unit && (
          <div>
            {Object.entries(unit).map(([k, v]) => (
              <div key={k}><strong>{k}:</strong> {String(v)}</div>
            ))}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <div>
      <h5>Units</h5>
      <Button className="mb-3" onClick={() => handleShowForm()}>Add New Unit</Button>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading && <Spinner animation="border" />}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Unit Number</th>
            <th>Name</th>
            <th>Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {units.map((u) => (
            <tr key={u.id}>
              <td>{u.unit_number}</td>
              <td>{u.unit_name}</td>
              <td>{u.unit_type}</td>
              <td>{u.status}</td>
              <td>
                <Button size="sm" variant="info" className="me-2" onClick={() => setDetailsId(u.id)}>Details</Button>
                <Button size="sm" variant="secondary" onClick={() => handleShowForm(u)} className="me-2">Update</Button>
                <Button size="sm" variant="danger" onClick={() => { setShowDelete(true); setDeleteId(u.id); }}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add/Edit Modal */}
      <Modal show={showForm} onHide={handleCloseForm}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Update Unit' : 'Add Unit'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6} className="mb-2">
                <Form.Label>Unit Number</Form.Label>
                <Form.Control name="unit_number" value={form.unit_number} onChange={handleChange} required />
              </Col>
              <Col md={6} className="mb-2">
                <Form.Label>Unit Name</Form.Label>
                <Form.Control name="unit_name" value={form.unit_name} onChange={handleChange} />
              </Col>
              <Col md={6} className="mb-2">
                <Form.Label>Unit Type</Form.Label>
                <Form.Select name="unit_type" value={form.unit_type} onChange={handleChange} required>
                  {unitTypeOptions.map(opt => <option key={opt}>{opt}</option>)}
                </Form.Select>
              </Col>
              <Col md={6} className="mb-2">
                <Form.Label>Status</Form.Label>
                <Form.Select name="status" value={form.status} onChange={handleChange} required>
                  {statusOptions.map(opt => <option key={opt}>{opt}</option>)}
                </Form.Select>
              </Col>
              <Col md={6} className="mb-2">
                <Form.Label>Block</Form.Label>
                <Form.Control name="block" value={form.block} onChange={handleChange} />
              </Col>
              <Col md={6} className="mb-2">
                <Form.Label>Floor</Form.Label>
                <Form.Control name="floor" value={form.floor} onChange={handleChange} />
              </Col>
              <Col md={6} className="mb-2">
                <Form.Label>Area</Form.Label>
                <Form.Control name="area" value={form.area} onChange={handleChange} type="number" />
              </Col>
              <Col md={6} className="mb-2">
                <Form.Label>Bedroom</Form.Label>
                <Form.Control name="bedroom" value={form.bedroom} onChange={handleChange} type="number" />
              </Col>
              <Col md={6} className="mb-2">
                <Form.Label>Bathroom</Form.Label>
                <Form.Control name="bathroom" value={form.bathroom} onChange={handleChange} type="number" />
              </Col>
              <Col md={6} className="mb-2">
                <Form.Label>Monthly Rent</Form.Label>
                <Form.Control name="monthly_rent" value={form.monthly_rent} onChange={handleChange} type="number" />
              </Col>
              <Col md={6} className="mb-2">
                <Form.Label>Resident Capacity</Form.Label>
                <Form.Control name="resident_capacity" value={form.resident_capacity} onChange={handleChange} type="number" />
              </Col>
              <Col md={6} className="mb-2 d-flex align-items-center">
                <Form.Check
                  type="checkbox"
                  name="is_accessible"
                  checked={form.is_accessible}
                  onChange={handleChange}
                  label="Accessible Unit"
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseForm}>Cancel</Button>
            <Button variant="primary" type="submit">{editingId ? 'Update' : 'Add'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this unit?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Details Modal */}
      <UnitDetailsModal unit={units.find(u => u.id === detailsId)} onHide={() => setDetailsId(null)} />
    </div>
  );
};

export default UnitManager;
