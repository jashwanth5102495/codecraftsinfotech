import React, { useState } from 'react';
import api from '@/services/api';
import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';

const InternshipPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
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
        setStatus({ type: 'success', message: 'Application submitted successfully! We will contact you soon.' });
        setFormData({
          name: '',
          email: '',
          phone: '',
          college: '',
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
                <label className="block text-sm font-medium text-gray-300 mb-2">College / University</label>
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
                  <span>Submit Application</span>
                  <Send className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </main>
  );
};

export default InternshipPage;
