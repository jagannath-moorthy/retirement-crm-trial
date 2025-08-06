
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { supabase } from '../supabaseClient';
import CommunityDetails from './CommunityDetails';

const initialForm = {
  name: '',
  address_line1: '',
  address_line2: '',
  address_line3: '',
  locality: '',
  country_subdivision: '',
  postal_code: '',
  country: '',
  status: 'Active',
  onboarding_status: 'Setup Required',
  timezone: '',
  contact_email: '',
  contact_phone: '',
  logo_url: '',
  onboarding_date: '',
  client_id: '',
};

const statusOptions = ['Active', 'Inactive'];
const onboardingOptions = ['Setup Required', 'Data Import', 'Staff Training', 'Live'];

const CommunityManager: React.FC = () => {
  const [communities, setCommunities] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCommunities = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('community').select('*').order('name');
    if (error) setError(error.message);
    else setCommunities(data || []);
    setLoading(false);
  };

  const fetchClients = async () => {
    const { data, error } = await supabase.from('client').select('id, name').order('name');
    if (!error) setClients(data || []);
  };

  useEffect(() => {
    fetchCommunities();
    fetchClients();
  }, []);

  const handleShowForm = (community?: any) => {
    if (community) {
      setForm({ ...community, onboarding_date: community.onboarding_date ? community.onboarding_date.substring(0, 10) : '' });
      setEditingId(community.id);
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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (editingId) {
      // Update
      const { error } = await supabase.from('community').update(form).eq('id', editingId);
      if (error) setError(error.message);
    } else {
      // Insert
      const { error } = await supabase.from('community').insert([form]);
      if (error) setError(error.message);
    }
    setShowForm(false);
    setForm(initialForm);
    setEditingId(null);
    await fetchCommunities();
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase.from('community').delete().eq('id', deleteId);
    if (error) setError(error.message);
    setShowDelete(false);
    setDeleteId(null);
    await fetchCommunities();
    setLoading(false);
  };

  if (detailsId) {
    return <CommunityDetails id={detailsId} onBack={() => setDetailsId(null)} />;
  }

  return (
    <div>
      <h3>Communities</h3>
      <Button className="mb-3" onClick={() => handleShowForm()}>Add Community</Button>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading && <Spinner animation="border" />}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Locality</th>
            <th>Country</th>
            <th>Status</th>
            <th>Onboarding Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {communities.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.locality}</td>
              <td>{c.country}</td>
              <td>{c.status}</td>
              <td>{c.onboarding_status}</td>
              <td>
                <Button size="sm" variant="info" className="me-2" onClick={() => setDetailsId(c.id)}>Details</Button>
                <Button size="sm" variant="secondary" onClick={() => handleShowForm(c)} className="me-2">Update</Button>
                <Button size="sm" variant="danger" onClick={() => { setShowDelete(true); setDeleteId(c.id); }}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add/Edit Modal */}
      <Modal show={showForm} onHide={handleCloseForm}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Update Community' : 'Add Community'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={12} className="mb-3">
                <Form.Label><strong>Client</strong></Form.Label>
                <Form.Select name="client_id" value={form.client_id || ''} onChange={handleChange} required aria-label="Select client">
                  <option value="">Select a client</option>
                  {clients.length === 0 ? (
                    <option value="" disabled>No clients available</option>
                  ) : (
                    clients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))
                  )}
                </Form.Select>
                <Form.Text className="text-muted">Choose the organization this community belongs to.</Form.Text>
              </Col>
              {/* ...existing code... */}
              <Col md={12} className="mb-2">
                <Form.Label>Name</Form.Label>
                <Form.Control name="name" value={form.name} onChange={handleChange} required />
              </Col>
              <Col md={12} className="mb-2">
                <Form.Label>Address Line 1</Form.Label>
                <Form.Control name="address_line1" value={form.address_line1} onChange={handleChange} required />
              </Col>
              <Col md={12} className="mb-2">
                <Form.Label>Address Line 2</Form.Label>
                <Form.Control name="address_line2" value={form.address_line2} onChange={handleChange} />
              </Col>
              <Col md={12} className="mb-2">
                <Form.Label>Address Line 3</Form.Label>
                <Form.Control name="address_line3" value={form.address_line3} onChange={handleChange} />
              </Col>
              <Col md={6} className="mb-2">
                <Form.Label>Locality</Form.Label>
                <Form.Control name="locality" value={form.locality} onChange={handleChange} required />
              </Col>
              <Col md={6} className="mb-2">
                <Form.Label>Country Subdivision</Form.Label>
                <Form.Control name="country_subdivision" value={form.country_subdivision} onChange={handleChange} required />
              </Col>
              <Col md={6} className="mb-2">
                <Form.Label>Postal Code</Form.Label>
                <Form.Control name="postal_code" value={form.postal_code} onChange={handleChange} required />
              </Col>
              <Col md={6} className="mb-2">
                <Form.Label>Country</Form.Label>
                <Form.Control name="country" value={form.country} onChange={handleChange} required />
              </Col>
              <Col md={6} className="mb-2">
                <Form.Label>Status</Form.Label>
                <Form.Select name="status" value={form.status} onChange={handleChange} required>
                  {statusOptions.map(opt => <option key={opt}>{opt}</option>)}
                </Form.Select>
              </Col>
              <Col md={6} className="mb-2">
                <Form.Label>Onboarding Status</Form.Label>
                <Form.Select name="onboarding_status" value={form.onboarding_status} onChange={handleChange} required>
                  {onboardingOptions.map(opt => <option key={opt}>{opt}</option>)}
                </Form.Select>
              </Col>
              <Col md={6} className="mb-2">
                <Form.Label>Timezone</Form.Label>
                <Form.Control name="timezone" value={form.timezone} onChange={handleChange} />
              </Col>
              <Col md={6} className="mb-2">
                <Form.Label>Contact Email</Form.Label>
                <Form.Control name="contact_email" value={form.contact_email} onChange={handleChange} type="email" />
              </Col>
              <Col md={6} className="mb-2">
                <Form.Label>Contact Phone</Form.Label>
                <Form.Control name="contact_phone" value={form.contact_phone} onChange={handleChange} />
              </Col>
              <Col md={6} className="mb-2">
                <Form.Label>Logo URL</Form.Label>
                <Form.Control name="logo_url" value={form.logo_url} onChange={handleChange} />
              </Col>
              <Col md={6} className="mb-2">
                <Form.Label>Onboarding Date</Form.Label>
                <Form.Control name="onboarding_date" value={form.onboarding_date} onChange={handleChange} type="date" />
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
        <Modal.Body>Are you sure you want to delete this community?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CommunityManager;
