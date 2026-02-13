import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 5000;

// Paths
const dataDir = path.join(__dirname, 'data');
const uploadsDir = path.join(__dirname, 'uploads');
const purchasesFile = path.join(dataDir, 'purchases.json');
const referralsFile = path.join(dataDir, 'referrals.json');
const applicationsFile = path.join(dataDir, 'applications.json');

// Ensure directories and files exist
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(purchasesFile)) fs.writeFileSync(purchasesFile, '[]', 'utf-8');
if (!fs.existsSync(referralsFile)) fs.writeFileSync(referralsFile, '[]', 'utf-8');
if (!fs.existsSync(applicationsFile)) fs.writeFileSync(applicationsFile, '[]', 'utf-8');

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
})
const upload = multer({ storage: storage });

// Middleware
app.use(express.json());
app.use(cors({
  origin: (origin, cb) => {
    const allowed = [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
    ];
    if (!origin || allowed.includes(origin) || /\.(github\.io|vercel\.app|railway\.app)$/.test(origin)) cb(null, true);
    else cb(null, true); // allow all in dev
  },
  credentials: true,
}));
app.use('/uploads', express.static(uploadsDir));

// Simple admin token
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_TOKEN = 'admin-token';

function readPurchases(){
  try { return JSON.parse(fs.readFileSync(purchasesFile, 'utf-8')); } catch { return []; }
}
function writePurchases(list){
  fs.writeFileSync(purchasesFile, JSON.stringify(list, null, 2), 'utf-8');
}
function readReferrals(){
  try { return JSON.parse(fs.readFileSync(referralsFile, 'utf-8')); } catch { return []; }
}
function writeReferrals(list){
  fs.writeFileSync(referralsFile, JSON.stringify(list, null, 2), 'utf-8');
}
function readApplications(){
  try { return JSON.parse(fs.readFileSync(applicationsFile, 'utf-8')); } catch { return []; }
}
function writeApplications(list){
  fs.writeFileSync(applicationsFile, JSON.stringify(list, null, 2), 'utf-8');
}

// Health
app.get('/api/health', (req,res)=>res.json({ ok: true }));

// Debug: list registered routes
app.get('/api/routes', (req,res)=>{
  const routes = [];
  app._router.stack.forEach((m) => {
    if (m.route && m.route.path) {
      const methods = Object.keys(m.route.methods).filter(k=>m.route.methods[k]);
      routes.push({ path: m.route.path, methods });
    }
  });
  res.json({ success:true, data: routes });
});

// Auth
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return res.json({ success: true, data: { token: ADMIN_TOKEN, user: { username, role: 'admin' } } });
  }
  return res.status(401).json({ success: false, error: 'Invalid credentials' });
});
app.post('/api/auth/logout', (req, res) => res.json({ success: true }));
app.get('/api/auth/verify', (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '');
  if (token === ADMIN_TOKEN) return res.json({ success: true, data: { valid: true } });
  return res.status(401).json({ success: false, error: 'Unauthorized' });
});

// Purchases
app.get('/api/purchases', (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '');
  if (token !== ADMIN_TOKEN) return res.status(401).json({ success: false, error: 'Unauthorized' });
  const list = readPurchases();
  res.json({ success: true, data: list });
});

app.post('/api/purchases', (req, res) => {
  const body = req.body || {};
  const required = ['txnId','student','items','subtotal','taxes','total'];
  for (const f of required){ if(!(f in body)) return res.status(400).json({ success:false, error:`Missing ${f}` }); }

  const list = readPurchases();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  const purchase = {
    id,
    txnId: body.txnId,
    student: body.student,
    items: body.items,
    subtotal: body.subtotal,
    taxes: body.taxes,
    total: body.total,
    createdAt: new Date().toISOString(),
  };
  list.push(purchase);
  writePurchases(list);
  res.json({ success: true, data: purchase });
});

// Referrals CRUD (admin)
console.log('Registering referral routes...');
app.get('/api/referrals/ping', (req,res)=>res.json({ success:true, message:'referrals routes active' }));
app.get('/api/referrals', (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '');
  if (token !== ADMIN_TOKEN) return res.status(401).json({ success: false, error: 'Unauthorized' });
  const list = readReferrals();
  res.json({ success: true, data: list });
});

app.post('/api/referrals', (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '');
  if (token !== ADMIN_TOKEN) return res.status(401).json({ success: false, error: 'Unauthorized' });
  const { agentName, email, code, discountPercent } = req.body || {};
  const required = ['agentName','email','code','discountPercent'];
  for (const f of required){ if(!(f in (req.body||{}))) return res.status(400).json({ success:false, error:`Missing ${f}` }); }
  if (typeof discountPercent !== 'number' || discountPercent <= 0 || discountPercent > 100) {
    return res.status(400).json({ success:false, error:'discountPercent must be 1-100' });
  }
  const list = readReferrals();
  if (list.some(r => r.code.toLowerCase() === String(code).toLowerCase())) {
    return res.status(409).json({ success:false, error:'Referral code already exists' });
  }
  const entry = { agentName, email, code, discountPercent, active: true, createdAt: new Date().toISOString() };
  list.push(entry);
  writeReferrals(list);
  res.json({ success: true, data: entry });
});

app.delete('/api/referrals/:code', (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '');
  if (token !== ADMIN_TOKEN) return res.status(401).json({ success: false, error: 'Unauthorized' });
  const code = req.params.code;
  const list = readReferrals();
  const idx = list.findIndex(r => r.code.toLowerCase() === String(code).toLowerCase());
  if (idx === -1) return res.status(404).json({ success:false, error:'Referral not found' });
  const [removed] = list.splice(idx,1);
  writeReferrals(list);
  res.json({ success:true, data: removed });
});

// Validate referral (public)
app.post('/api/referrals/validate', (req, res) => {
  const { code } = req.body || {};
  if (!code) return res.status(400).json({ success:false, error:'Missing code' });
  const list = readReferrals();
  const found = list.find(r => r.code.toLowerCase() === String(code).toLowerCase() && r.active);
  if (!found) return res.json({ success:true, data: { valid:false } });
  res.json({ success:true, data: { valid:true, discountPercent: found.discountPercent, agentName: found.agentName } });
});

// New alternative Referral Codes routes (fallback if /api/referrals not matched)
app.get('/api/referral-codes', (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '');
  if (token !== ADMIN_TOKEN) return res.status(401).json({ success: false, error: 'Unauthorized' });
  const list = readReferrals();
  res.json({ success: true, data: list });
});

app.post('/api/referral-codes', (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '');
  if (token !== ADMIN_TOKEN) return res.status(401).json({ success: false, error: 'Unauthorized' });
  const { agentName, email, code, discountPercent } = req.body || {};
  const required = ['agentName','email','code','discountPercent'];
  for (const f of required){ if(!(f in (req.body||{}))) return res.status(400).json({ success:false, error:`Missing ${f}` }); }
  if (typeof discountPercent !== 'number' || discountPercent <= 0 || discountPercent > 100) {
    return res.status(400).json({ success:false, error:'discountPercent must be 1-100' });
  }
  const list = readReferrals();
  if (list.some(r => r.code.toLowerCase() === String(code).toLowerCase())) {
    return res.status(409).json({ success:false, error:'Referral code already exists' });
  }
  const entry = { agentName, email, code, discountPercent, active: true, createdAt: new Date().toISOString() };
  list.push(entry);
  writeReferrals(list);
  res.json({ success: true, data: entry });
});

app.delete('/api/referral-codes/:code', (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '');
  if (token !== ADMIN_TOKEN) return res.status(401).json({ success: false, error: 'Unauthorized' });
  const code = req.params.code;
  const list = readReferrals();
  const idx = list.findIndex(r => r.code.toLowerCase() === String(code).toLowerCase());
  if (idx === -1) return res.status(404).json({ success:false, error:'Referral not found' });
  const [removed] = list.splice(idx,1);
  writeReferrals(list);
  res.json({ success:true, data: removed });
});

app.post('/api/referral-codes/validate', (req, res) => {
  const { code } = req.body || {};
  if (!code) return res.status(400).json({ success:false, error:'Missing code' });
  const list = readReferrals();
  const found = list.find(r => r.code.toLowerCase() === String(code).toLowerCase() && r.active);
  if (!found) return res.json({ success:true, data: { valid:false } });
  res.json({ success:true, data: { valid:true, discountPercent: found.discountPercent, agentName: found.agentName } });
});

// Internship Applications
app.post('/api/applications', upload.single('resume'), (req, res) => {
  try {
    const { name, email, phone, college, year, domain, project, coverLetter } = req.body;
    const resume = req.file ? `/uploads/${req.file.filename}` : null;
    
    if (!name || !email || !phone || !domain) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const applications = readApplications();
    const newApplication = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      college,
      year,
      domain,
      project,
      coverLetter,
      resume,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    applications.push(newApplication);
    writeApplications(applications);
    
    res.json({ success: true, data: newApplication });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.get('/api/applications', (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '');
  if (token !== ADMIN_TOKEN) return res.status(401).json({ success: false, error: 'Unauthorized' });
  
  const applications = readApplications();
  res.json({ success: true, data: applications });
});

// 404 fallback
app.use((req,res)=>res.status(404).json({ success:false, error:'Not found' }));

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});