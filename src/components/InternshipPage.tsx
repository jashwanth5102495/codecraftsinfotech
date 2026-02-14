import React, { useState } from 'react';
import api from '@/services/api';
import { motion } from 'framer-motion';
import { Send, Loader2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InternshipPage: React.FC = () => {
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [txnId, setTxnId] = useState('');
  const [txnError, setTxnError] = useState<string | null>(null);
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    universityName: '',
    currentCourse: '',
    year: '',
    domain: 'Web Development',
    project: '',
    coverLetter: ''
  });

  const domainProjects: { [key: string]: string[] } = {
    "Web Development": [
      "E-Commerce Website",
      "Portfolio Website",
      "Blog Application",
      "Task Management System",
      "Social Media Dashboard",
      "Real-time Chat Application",
      "Weather Forecasting App",
      "Job Board Platform",
      "Learning Management System (LMS)",
      "Event Booking System",
      "News Aggregator Portal",
      "Food Delivery Web App",
      "Expense Tracker",
      "Real Estate Listing Site",
      "Customer Relationship Management (CRM)"
    ],
    "App Development": [
      "Fitness Tracker App",
      "Expense Manager App",
      "Chat Application",
      "Weather App",
      "To-Do List App",
      "Recipe & Cooking App",
      "Language Learning App",
      "Travel Companion App",
      "Music Player App",
      "Habit Tracker",
      "Quiz & Trivia App",
      "Meditation & Mindfulness App",
      "Virtual Study Group App",
      "Grocery Shopping List",
      "Local Event Finder"
    ],
    "Data Science & A.I": [
      "Stock Price Predictor",
      "Sentiment Analysis",
      "Chatbot Development",
      "Image Classification Model",
      "Customer Churn Prediction",
      "Movie Recommendation System",
      "Credit Card Fraud Detection",
      "Handwritten Digit Recognition",
      "Traffic Sign Recognition",
      "Speech Emotion Recognition",
      "House Price Prediction",
      "Spam Email Classifier",
      "Face Mask Detection",
      "Product Demand Forecasting",
      "Text Summarizer"
    ],
    "Cyber Security": [
      "Password Manager",
      "Network Scanner",
      "Encryption Tool",
      "Vulnerability Scanner",
      "Secure Chat App",
      "Keylogger Detector",
      "Packet Sniffer",
      "Intrusion Detection System",
      "Phishing Website Detector",
      "Steganography Tool",
      "Malware Analysis Sandbox",
      "Firewall Rule Manager",
      "Digital Forensic Tool",
      "Hash Cracker",
      "Secure File Transfer Protocol"
    ],
    "Cloud Computing": [
      "Serverless File Uploader",
      "Cloud Dashboard",
      "AWS Resource Manager",
      "Dockerized App Deployment",
      "Multi-Cloud Storage Manager",
      "Serverless Chatbot",
      "Auto-Scaling Web Server",
      "Cloud-based IoT Dashboard",
      "Backup & Disaster Recovery Tool",
      "Content Delivery Network (CDN) Setup",
      "Cloud Log Analyzer",
      "Virtual Machine Monitor",
      "Serverless Image Resizer",
      "Cloud Cost Estimator",
      "Distributed Database System"
    ],
    "DevOps": [
      "CI/CD Pipeline Setup",
      "Infrastructure as Code (Terraform)",
      "Kubernetes Cluster Management",
      "Automated Testing Framework",
      "Log Monitoring System",
      "Docker Container Orchestration",
      "Ansible Configuration Management",
      "Jenkins Build Automation",
      "Prometheus & Grafana Monitoring",
      "GitOps Workflow Implementation",
      "Automated Database Migration",
      "Cloud Infrastructure Auditing",
      "Microservices Deployment Pipeline",
      "Server Configuration Drift Detector",
      "Incident Response Automation"
    ],
    "Special Projects": [
      "Car Rental Booking System",
      "College Canteen",
      "Hostel Management",
      "AI Resume Analyzer",
      "AI-Crop-Suggestion with Real Time GPS",
      "AI-CS-Chatbot",
      "AI-Mail-Automation (Multi AI Agent)"
    ]
  };

  const [resume, setResume] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'domain') {
        newData.project = '';
      }
      return newData;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume) {
      setStatus({ type: 'error', message: 'Please upload your resume' });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      data.append('resume', resume);

      const response = await api.submitApplication(data);

      if (response.success) {
        setStatus({ type: 'success', message: 'Application submitted successfully! Redirecting to payment...' });
        // Navigate to the Payment page interface with prefilled internship item and student details
        navigate('/payment', {
          state: {
            student: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              college: formData.college,
              year: formData.year,
              domain: formData.domain,
              project: formData.project,
              context: 'internship_application'
            },
            items: [
              {
                title: 'Internship Registration',
                price: 4000,
                originalPrice: 6500,
                quantity: 1,
                includes: ['Project', 'Internship Certificate', 'Online Training']
              }
            ],
            subtotal: 4000
          }
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          college: '',
          universityName: '',
          currentCourse: '',
          year: '',
          domain: 'Web Development',
          project: '',
          coverLetter: ''
        });
        setResume(null);
        // Reset file input manually if needed
        const fileInput = document.getElementById('resume-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        setStatus({ type: 'error', message: response.error || 'Failed to submit application' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-16">
      <div className="container mx-auto px-6 max-w-3xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold text-white">
            Internship Application
          </h1>
          <p className="text-gray-400 mt-2">Join our team and kickstart your career with hands-on experience.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8 shadow-xl"
        >
          {status && (
            <div className={`mb-6 p-4 rounded-lg ${status.type === 'success' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                <input
                  required
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">College</label>
                <input
                  required
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Your College Name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">University Name</label>
                <input
                  type="text"
                  name="universityName"
                  value={formData.universityName}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Your University Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Currently Pursuing Course</label>
                <input
                  type="text"
                  name="currentCourse"
                  value={formData.currentCourse}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="e.g., B.Tech CSE, B.Sc, MBA"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Year of Study</label>
                <select
                  required
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all [&>option]:bg-gray-900"
                >
                  <option value="" disabled>Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Graduate">Graduate</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Domain of Interest</label>
                <select
                  required
                  name="domain"
                  value={formData.domain}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all [&>option]:bg-gray-900"
                >
                  {Object.keys(domainProjects).map((domain) => (
                    <option key={domain} value={domain}>{domain}</option>
                  ))}
                </select>
              </div>
            </div>

            {formData.domain && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Select Project</label>
                <select
                  required
                  name="project"
                  value={formData.project}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all [&>option]:bg-gray-900"
                >
                  <option value="" disabled>Select a project based on {formData.domain}</option>
                  {domainProjects[formData.domain]?.map((project) => (
                    <option key={project} value={project}>{project}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Cover Letter / Why should we hire you?</label>
              <textarea
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleInputChange}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Tell us about yourself and your skills..."
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Resume (PDF/DOCX)</label>
              <div className="relative group">
                <input
                  id="resume-upload"
                  type="file"
                  required
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`
                group relative w-full flex items-center justify-center gap-3
                py-4 px-8 rounded-xl font-bold text-lg tracking-wide
                transition-all duration-300 ease-out shadow-lg
                ${loading 
                  ? 'bg-white/10 text-white/50 cursor-not-allowed' 
                  : 'bg-white text-black hover:bg-gray-100 hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]'
                }
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Continue with Payment</span>
                  <Send className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1a1a1a] border border-white/10 p-8 rounded-2xl max-w-lg w-full relative shadow-2xl"
          >
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Application Received — Continue with Payment</h3>
              </div>

              <ol className="space-y-3 text-sm text-gray-300 mb-6">
                <li className="flex items-start gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-white/80 text-xs">1</span>
                  <span>Scan the QR below with any UPI app to pay your internship fee.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-white/80 text-xs">2</span>
                  <span>Enter the Transaction/Reference ID you receive after payment.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-white/80 text-xs">3</span>
                  <span>We will verify and send the synopsis and payment confirmation shortly.</span>
                </li>
              </ol>

              <div className="flex flex-col items-center gap-4 mb-4">
                <img src="/qr.png" alt="QR Code" className="w-48 h-48 rounded-md border border-white/20" />
                <div className="w-full">
                  <label className="text-xs text-white/70">Transaction ID</label>
                  <input
                    className="mt-1 w-full rounded-md bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Enter transaction/reference ID"
                    value={txnId}
                    onChange={(e)=>{ setTxnId(e.target.value); if (txnError) setTxnError(null); }}
                  />
                  {txnError && <div className="text-xs text-red-400 mt-1">{txnError}</div>}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={async ()=>{
                    const id = txnId.trim();
                    if (!id) { setTxnError('Please enter the transaction ID.'); return; }
                    setTxnError(null);
                    setConfirmingPayment(true);
                    try {
                      const payload = {
                        txnId: id,
                        student: {
                          name: formData.name,
                          email: formData.email,
                          phone: formData.phone,
                          college: formData.college,
                          year: formData.year,
                          domain: formData.domain,
                          project: formData.project,
                          note: 'Internship Registration'
                        },
                        items: [{ title: 'Internship Registration', price: 0, quantity: 1 }],
                        subtotal: 0,
                        taxes: 0,
                        total: 0
                      };
                      const res = await api.createPurchase(payload);
                      if (res.success){
                        setTxnError(null);
                        setShowSuccessModal(false);
                        alert('Payment recorded successfully. Project synopsis and training details will be mailed shortly.');
                      } else {
                        setTxnError(res.error || 'Failed to record payment. Please try again.');
                      }
                    } catch (err){
                      setTxnError('Error recording payment. Please try again.');
                    } finally {
                      setConfirmingPayment(false);
                    }
                  }}
                  disabled={confirmingPayment}
                  className={`flex-1 py-3 rounded-xl font-semibold text-white ${confirmingPayment ? 'bg-blue-700/60 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
                >
                  {confirmingPayment ? 'Confirming…' : 'Confirm Payment'}
                </button>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 py-3 rounded-xl font-semibold border border-white/20 text-white hover:bg-white/5 transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
};

export default InternshipPage;
