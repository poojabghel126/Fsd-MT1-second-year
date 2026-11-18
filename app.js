const express = require('express');
const app = express();
app.use(express.json());

let registrations = [
  { id: 501, participantName: 'Riya Sharma', eventName: 'Tech Fest', department: 'CSE', ticketCount: 2, paymentStatus: 'Paid' },
  { id: 502, participantName: 'Arjun Mehta', eventName: 'Code Sprint', department: 'IT', ticketCount: 1, paymentStatus: 'Pending' },
  { id: 503, participantName: 'Neha Verma', eventName: 'Tech Fest', department: 'ECE', ticketCount: 3, paymentStatus: 'Paid' }
];
let nextId = 504;

function isValid(b) {
  return b &&
    typeof b.participantName === 'string' && b.participantName.trim() !== '' &&
    typeof b.eventName === 'string' && b.eventName.trim() !== '' &&
    typeof b.department === 'string' && b.department.trim() !== '' &&
    typeof b.ticketCount === 'number' && b.ticketCount > 0 &&
    (b.paymentStatus === 'Paid' || b.paymentStatus === 'Pending');
}

// 1. GET all
app.get('/api/registrations', (req, res) => {
  res.status(200).json(registrations);
});

// 6. Filter (must be above /:id)
app.get('/api/registrations/filter', (req, res) => {
  const dept = (req.query.department || '').toLowerCase();
  const result = registrations.filter(r => r.department.toLowerCase() === dept);
  res.status(200).json(result);
});

// 3. GET by id
app.get('/api/registrations/:id', (req, res) => {
  const reg = registrations.find(r => r.id === Number(req.params.id));
  if (!reg) return res.status(404).json({ message: 'Registration not found' });
  res.status(200).json(reg);
});

// 2. POST
app.post('/api/registrations', (req, res) => {
  if (!isValid(req.body)) {
    return res.status(400).json({ message: 'Invalid input' });
  }
  const { participantName, eventName, department, ticketCount, paymentStatus } = req.body;
  const newReg = { id: nextId++, participantName, eventName, department, ticketCount, paymentStatus };
  registrations.push(newReg);
  res.status(201).json(newReg);
});

// 4. PUT
app.put('/api/registrations/:id', (req, res) => {
  const reg = registrations.find(r => r.id === Number(req.params.id));
  if (!reg) return res.status(404).json({ message: 'Registration not found' });
  if (!isValid(req.body)) return res.status(400).json({ message: 'Invalid input' });

  reg.participantName = req.body.participantName;
  reg.eventName = req.body.eventName;
  reg.department = req.body.department;
  reg.ticketCount = req.body.ticketCount;
  reg.paymentStatus = req.body.paymentStatus;
  res.status(200).json(reg);
});

// 5. DELETE
app.delete('/api/registrations/:id', (req, res) => {
  const index = registrations.findIndex(r => r.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Registration not found' });
  registrations.splice(index, 1);
  res.status(200).json({ message: 'Registration deleted successfully' });
});

app.listen(3000, () => console.log('Server running on port 3000'));