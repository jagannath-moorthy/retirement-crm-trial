import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { supabase } from '../supabaseClient';

interface StaffManagerProps {
  communityId: string;
}

interface StaffForm {
  first_name: string;
  last_name: string;
  preferred_name: string;
  date_of_birth: string | null;
  gender: string;
  nationality: string;
  job_title: string;
  department: string;
  employment_type: string;
  status: string;
  hire_date: string | null;
  end_date: string | null;
  primary_phone: string;
  primary_email: string;
  notes: string;
  photo_blob: any;
}

const initialForm: StaffForm = {
  first_name: '',
  last_name: '',
  preferred_name: '',
  date_of_birth: null,
  gender: '',
  nationality: '',
  job_title: '',
  department: '',
  employment_type: 'Full-time',
  status: 'Active',
  hire_date: null,
  end_date: null,
  primary_phone: '',
  primary_email: '',
  notes: '',
  photo_blob: null,
};

const employmentTypeOptions = ['Full-time', 'Part-time', 'Contract'];
const statusOptions = ['Active', 'Inactive', 'On Leave'];

const StaffManager: React.FC<StaffManagerProps> = ({ communityId }) => {
  const [staff, setStaff] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showTerminate, setShowTerminate] = useState(false);
  const [terminateId, setTerminateId] = useState<string | null>(null);
  const [terminateHireDate, setTerminateHireDate] = useState<string>('');
  const [terminateEndDate, setTerminateEndDate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStaff = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('staff').select('*').eq('community_id', communityId).order('last_name');
    if (error) setError(error.message);
    else setStaff(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchStaff();
  }, [communityId]);

  const handleShowForm = (staffMember?: any) => {
    if (staffMember) {
      setForm({ ...staffMember });
      setEditingId(staffMember.id);
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
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // Convert empty date strings to null
    const payload = { ...form, community_id: communityId };
    if (payload.date_of_birth === '') payload.date_of_birth = null;
    if (payload.hire_date === '') payload.hire_date = null;
    if (payload.end_date === '') payload.end_date = null;
    if (editingId) {
      // Prevent hire_date update
      if ('hire_date' in payload) {
        delete (payload as any).hire_date;
      }
      const updatePayload = { ...payload };
      if (updatePayload.date_of_birth === '') updatePayload.date_of_birth = null;
      if (updatePayload.end_date === '') updatePayload.end_date = null;
      const { error } = await supabase.from('staff').update(updatePayload).eq('id', editingId);
      if (error) setError(error.message);
    } else {
      const insertPayload = { ...payload };
      if (insertPayload.date_of_birth === '') insertPayload.date_of_birth = null;
      if (insertPayload.hire_date === '') insertPayload.hire_date = null;
      if (insertPayload.end_date === '') insertPayload.end_date = null;
      const { error } = await supabase.from('staff').insert([insertPayload]);
      if (error) setError(error.message);
    }
    setShowForm(false);
    setForm(initialForm);
    setEditingId(null);
    await fetchStaff();
    setLoading(false);
  };

  // Terminate staff: set status to Inactive and set end_date
  const handleShowTerminate = (staffMember: any) => {
    setTerminateId(staffMember.id);
    setTerminateHireDate(staffMember.hire_date);
    setTerminateEndDate('');
    setShowTerminate(true);
  };

  const handleTerminate = async () => {
    if (!terminateId) return;
    if (!terminateEndDate || terminateEndDate <= terminateHireDate) {
      setError('End date must be after hire date.');
      return;
    }
    setLoading(true);
    setError(null);
    const { error } = await supabase.from('staff').update({ status: 'Inactive', end_date: terminateEndDate }).eq('id', terminateId);
    if (error) setError(error.message);
    setShowTerminate(false);
    setTerminateId(null);
    setTerminateHireDate('');
    setTerminateEndDate('');
    await fetchStaff();
    setLoading(false);
  };

  return (
    <div>
      <h5>Staff</h5>
      <Button className="mb-3" onClick={() => handleShowForm()}>Add Staff Member</Button>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading && <Spinner animation="border" />}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Job Title</th>
            <th>Department</th>
            <th>Status</th>
            <th>Hire Date</th>
            <th>End Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((s) => (
            <tr key={s.id}>
              <td>{s.first_name} {s.last_name}</td>
              <td>{s.job_title}</td>
              <td>{s.department}</td>
              <td>{s.status}</td>
              <td>{s.hire_date}</td>
              <td>{s.end_date || '-'}</td>
              <td>
                <Button size="sm" variant="secondary" className="me-2" onClick={() => handleShowForm(s)}>Edit</Button>
                <Button size="sm" variant="danger" onClick={() => handleShowTerminate(s)}>Terminate</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {/* Add/Edit Modal */}
      <Modal show={showForm} onHide={handleCloseForm}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Edit Staff Member' : 'Add Staff Member'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6} className="mb-2">
                <Form.Label>First Name</Form.Label>
                <Form.Control name="first_name" value={form.first_name} onChange={handleChange} required />
              </Col>
              <Col md={6} className="mb-2">
                <Form.Label>Last Name</Form.Label>
                <Form.Control name="last_name" value={form.last_name} onChange={handleChange} required />
              </Col>
              <Col md={6} className="mb-2">
                <Form.Label>Preferred Name</Form.Label>
                <Form.Control name="preferred_name" value={form.preferred_name} onChange={handleChange} />
              </Col>
              <Col md={6} className="mb-2">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control name="date_of_birth" value={form.date_of_birth || ''} onChange={handleChange} type="date" />
              </Col>
              <Col md={6} className="mb-2">
                <Form.Label>Gender</Form.Label>
                <Form.Control name="gender" value={form.gender} onChange={handleChange} />
              </Col>
              <Col md={6} className="mb-2">
                <Form.Label>Nationality</Form.Label>
                <Form.Control name="nationality" value={form.nationality} onChange={handleChange} />
              </Col>
              <Col md={6} className="mb-2">
                <Form.Label>Job Title</Form.Label>
                <Form.Control name="job_title" value={form.job_title} onChange={handleChange} required />
              </Col>
              <Col md={6} className="mb-2">
                <Form.Label>Department</Form.Label>
                <Form.Control name="department" value={form.department} onChange={handleChange} />
              </Col>
              <Col md={6} className="mb-2">
                <Form.Label>Employment Type</Form.Label>
                <Form.Select name="employment_type" value={form.employment_type} onChange={handleChange} required>
                  {employmentTypeOptions.map(opt => <option key={opt}>{opt}</option>)}
                </Form.Select>
              </Col>
              <Col md={6} className="mb-2">
                <Form.Label>Status</Form.Label>
                <Form.Select name="status" value={form.status} onChange={handleChange} required>
                  {statusOptions.map(opt => <option key={opt}>{opt}</option>)}
                </Form.Select>
              </Col>
              <Col md={6} className="mb-2">
                <Form.Label>Hire Date</Form.Label>
                <Form.Control name="hire_date" value={form.hire_date || ''} onChange={handleChange} type="date" required disabled={!!editingId} />
              </Col>
              <Col md={6} className="mb-2">
                <Form.Label>End Date</Form.Label>
                <Form.Control name="end_date" value={form.end_date || ''} onChange={handleChange} type="date" disabled />
              </Col>
              <Col md={6} className="mb-2">
                <Form.Label>Primary Phone</Form.Label>
                <Form.Control name="primary_phone" value={form.primary_phone} onChange={handleChange} />
              </Col>
              <Col md={6} className="mb-2">
                <Form.Label>Primary Email</Form.Label>
                <Form.Control name="primary_email" value={form.primary_email} onChange={handleChange} type="email" />
              </Col>
              <Col md={12} className="mb-2">
                <Form.Label>Notes</Form.Label>
                <Form.Control name="notes" value={form.notes} onChange={handleChange} as="textarea" rows={2} />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseForm}>Cancel</Button>
            <Button variant="primary" type="submit">{editingId ? 'Update' : 'Add'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
      {/* Terminate Modal */}
      <Modal show={showTerminate} onHide={() => setShowTerminate(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Terminate Staff Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Hire Date</Form.Label>
            <Form.Control value={terminateHireDate} type="date" disabled />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>End Date</Form.Label>
            <Form.Control value={terminateEndDate} type="date" onChange={e => setTerminateEndDate(e.target.value)} required />
            <Form.Text className="text-muted">End date must be after hire date.</Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTerminate(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleTerminate}>Terminate</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StaffManager;
