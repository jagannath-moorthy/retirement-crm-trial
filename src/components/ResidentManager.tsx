import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner, Alert, Modal, Form, Row, Col, Card, Image } from 'react-bootstrap';
import { supabase } from '../supabaseClient';

interface ResidentManagerProps {
  communityId: string;
  communityName: string;
  onShowResidentDetails: (id: string) => void;
}

interface ResidentForm {
  first_name: string;
  last_name: string;
  preferred_name: string;
  date_of_birth: string;
  gender: string;
  primary_phone: string;
  primary_email: string;
  status: string;
  photo_blob: Blob | string | null;
}

const initialForm: ResidentForm = {
  first_name: '',
  last_name: '',
  preferred_name: '',
  date_of_birth: '',
  gender: '',
  primary_phone: '',
  primary_email: '',
  status: 'Active',
  photo_blob: null,
};

const statusOptions = ['Active', 'Inactive'];

const ResidentManager: React.FC<ResidentManagerProps> = ({ communityId, communityName, onShowResidentDetails }) => {
  const [residents, setResidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const fetchResidents = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('resident').select('*').eq('community_id', communityId).order('last_name');
    if (error) setError(error.message);
    else setResidents(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchResidents();
  }, [communityId]);

  const handleShowForm = (resident?: any) => {
    if (resident) {
      setForm({ ...resident, photo_blob: null });
      setEditingId(resident.id);
      setPhotoPreview(resident.photo_blob ? URL.createObjectURL(new Blob([resident.photo_blob])) : null);
    } else {
      setForm(initialForm);
      setEditingId(null);
      setPhotoPreview(null);
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setForm(initialForm);
    setEditingId(null);
    setPhotoPreview(null);
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const img = new window.Image();
      img.src = ev.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = 640 / Math.max(img.width, img.height);
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            setForm(f => ({ ...f, photo_blob: blob }));
            setPhotoPreview(canvas.toDataURL('image/jpeg'));
          }, 'image/jpeg', 0.85);
        }
      };
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    let payload = { ...form, community_id: communityId };
    if (form.photo_blob instanceof Blob) {
      // Convert blob to base64 for Supabase
      const reader = new FileReader();
      reader.onloadend = async () => {
        payload.photo_blob = reader.result?.toString().split(',')[1] || null;
        await saveResident(payload);
      };
      reader.readAsDataURL(form.photo_blob);
    } else {
      await saveResident(payload);
    }
  };

  const saveResident = async (payload: any) => {
    let error;
    if (editingId) {
      ({ error } = await supabase.from('resident').update(payload).eq('id', editingId));
    } else {
      ({ error } = await supabase.from('resident').insert([payload]));
    }
    if (error) setError(error.message);
    setShowForm(false);
    setForm(initialForm);
    setEditingId(null);
    setPhotoPreview(null);
    await fetchResidents();
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase.from('resident').delete().eq('id', deleteId);
    if (error) setError(error.message);
    setShowDelete(false);
    setDeleteId(null);
    await fetchResidents();
    setLoading(false);
  };

  return (
    <div>
      <Card className="mb-4">
        <Card.Header as="h4">Residents of {communityName}</Card.Header>
        <Card.Body>
          <Button className="mb-3" onClick={() => handleShowForm()}>Add Resident</Button>
          {error && <Alert variant="danger">{error}</Alert>}
          {loading && <Spinner animation="border" />}
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Status</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {residents.map(r => (
                <tr key={r.id}>
                  <td>{r.photo_blob ? <Image src={URL.createObjectURL(new Blob([r.photo_blob]))} rounded width={48} height={48} /> : null}</td>
                  <td>{r.first_name} {r.last_name}</td>
                  <td>{r.status}</td>
                  <td>{r.primary_phone}</td>
                  <td>{r.primary_email}</td>
                  <td>
                    <Button size="sm" variant="info" className="me-2" onClick={() => onShowResidentDetails(r.id)}>Details</Button>
                    <Button size="sm" variant="secondary" onClick={() => handleShowForm(r)} className="me-2">Update</Button>
                    <Button size="sm" variant="danger" onClick={() => { setShowDelete(true); setDeleteId(r.id); }}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      {/* Add/Edit Modal */}
      <Modal show={showForm} onHide={handleCloseForm} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Update Resident' : 'Add Resident'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={4} className="mb-2">
                <Form.Label>Photo</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handlePhotoChange} />
                {photoPreview && <Image src={photoPreview} rounded width={96} height={96} className="mt-2" />}
              </Col>
              <Col md={4} className="mb-2">
                <Form.Label>First Name</Form.Label>
                <Form.Control name="first_name" value={form.first_name} onChange={handleChange} required />
              </Col>
              <Col md={4} className="mb-2">
                <Form.Label>Last Name</Form.Label>
                <Form.Control name="last_name" value={form.last_name} onChange={handleChange} required />
              </Col>
              <Col md={4} className="mb-2">
                <Form.Label>Preferred Name</Form.Label>
                <Form.Control name="preferred_name" value={form.preferred_name} onChange={handleChange} />
              </Col>
              <Col md={4} className="mb-2">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control name="date_of_birth" value={form.date_of_birth} onChange={handleChange} type="date" />
              </Col>
              <Col md={4} className="mb-2">
                <Form.Label>Gender</Form.Label>
                <Form.Control name="gender" value={form.gender} onChange={handleChange} />
              </Col>
              <Col md={4} className="mb-2">
                <Form.Label>Primary Phone</Form.Label>
                <Form.Control name="primary_phone" value={form.primary_phone} onChange={handleChange} />
              </Col>
              <Col md={4} className="mb-2">
                <Form.Label>Primary Email</Form.Label>
                <Form.Control name="primary_email" value={form.primary_email} onChange={handleChange} type="email" />
              </Col>
              <Col md={4} className="mb-2">
                <Form.Label>Status</Form.Label>
                <Form.Select name="status" value={form.status} onChange={handleChange} required>
                  {statusOptions.map(opt => <option key={opt}>{opt}</option>)}
                </Form.Select>
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
        <Modal.Body>Are you sure you want to delete this resident?</Modal.Body>
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

export default ResidentManager;
