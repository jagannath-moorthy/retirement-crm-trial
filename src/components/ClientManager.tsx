import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { supabase } from '../supabaseClient';
import CommunityDetails from './CommunityDetails';

const initialForm = {
  name: '',
  status: 'Lead',
  subscription_plan_id: '',
  contact_name: '',
  contact_designation: '',
  contact_email: '',
  contact_phone: '',
  website: '',
};

const statusOptions = ['Lead', 'In Discussion', 'Confirmed', 'Active', 'Inactive'];

interface ClientManagerProps {
  onShowDetails?: (id: string) => void;
}

const ClientManager: React.FC<ClientManagerProps> = ({ onShowDetails }) => {
  const [clients, setClients] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailsId, setDetailsId] = useState<string | null>(null);

  const fetchClients = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('client').select('*').order('name');
    if (error) setError(error.message);
    else setClients(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleShowForm = (client?: any) => {
    if (client) {
      setForm({ ...client });
      setEditingId(client.id);
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
    // Set subscription_plan_id to null if empty string
    const submitForm = {
      ...form,
      subscription_plan_id: form.subscription_plan_id === '' ? null : form.subscription_plan_id
    };
    if (editingId) {
      const { error } = await supabase.from('client').update(submitForm).eq('id', editingId);
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.from('client').insert([submitForm]);
      if (error) setError(error.message);
    }
    setShowForm(false);
    setForm(initialForm);
    setEditingId(null);
    await fetchClients();
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase.from('client').delete().eq('id', deleteId);
    if (error) setError(error.message);
    setShowDelete(false);
    setDeleteId(null);
    await fetchClients();
    setLoading(false);
  };

  // Show communities for the selected client
  const [clientCommunities, setClientCommunities] = useState<any[]>([]);
  useEffect(() => {
    if (detailsId) {
      supabase
        .from('community')
        .select('id, name')
        .eq('client_id', detailsId)
        .order('name')
        .then(({ data }) => setClientCommunities(data || []));
    } else {
      setClientCommunities([]);
    }
  }, [detailsId]);

  const [showCommunityDetailsId, setShowCommunityDetailsId] = useState<string | null>(null);

  const ClientDetailsModal = ({ client, onHide }: { client: any, onHide: () => void }) => (
    <Modal show={!!client} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Client Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {client && (
          <div>
            {Object.entries(client).map(([k, v]) => (
              <div key={k}><strong>{k}:</strong> {String(v)}</div>
            ))}
            <hr />
            <h5>Communities Owned</h5>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {clientCommunities.length === 0 ? (
                  <tr><td>No communities found for this client.</td></tr>
                ) : (
                  clientCommunities.map(comm => (
                    <tr key={comm.id}>
                      <td>
                        <Button variant="link" onClick={() => setShowCommunityDetailsId(comm.id)}>{comm.name}</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );

  // Show community details modal if a community is selected
  // ...existing code...

  return (
    <div>
      <h3>Clients</h3>
      <Button className="mb-3" onClick={() => handleShowForm()}>Add New Client</Button>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading && <Spinner animation="border" />}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Contact Name</th>
            <th>Contact Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.status}</td>
              <td>{c.contact_name}</td>
              <td>{c.contact_email}</td>
              <td>
                <Button size="sm" variant="info" className="me-2" onClick={() => onShowDetails ? onShowDetails(c.id) : setDetailsId(c.id)}>Details</Button>
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
          <Modal.Title>{editingId ? 'Update Client' : 'Add Client'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6} className="mb-2">
                <Form.Label>Name</Form.Label>
                <Form.Control name="name" value={form.name} onChange={handleChange} required />
              </Col>
              <Col md={6} className="mb-2">
                <Form.Label>Status</Form.Label>
                <Form.Select name="status" value={form.status} onChange={handleChange} required>
                  {statusOptions.map(opt => <option key={opt}>{opt}</option>)}
                </Form.Select>
              </Col>
              <Col md={6} className="mb-2">
                <Form.Label>Contact Name</Form.Label>
                <Form.Control name="contact_name" value={form.contact_name} onChange={handleChange} />
              </Col>
              <Col md={6} className="mb-2">
                <Form.Label>Contact Designation</Form.Label>
                <Form.Control name="contact_designation" value={form.contact_designation} onChange={handleChange} />
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
                <Form.Label>Website</Form.Label>
                <Form.Control name="website" value={form.website} onChange={handleChange} />
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
        <Modal.Body>Are you sure you want to delete this client?</Modal.Body>
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
      <ClientDetailsModal client={clients.find(c => c.id === detailsId)} onHide={() => setDetailsId(null)} />
      {showCommunityDetailsId && (
        <Modal show={true} onHide={() => setShowCommunityDetailsId(null)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Community Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Render CommunityDetails component for selected community */}
            <div>
              <Button variant="secondary" className="mb-3" onClick={() => setShowCommunityDetailsId(null)}>
                Back to Client
              </Button>
              <div>
                <CommunityDetails id={showCommunityDetailsId} onBack={() => setShowCommunityDetailsId(null)} />
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default ClientManager;
