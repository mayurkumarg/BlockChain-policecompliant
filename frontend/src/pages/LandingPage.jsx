import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, Database, Lock } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="text-xl font-semibold mb-2 text-slate-800">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const LandingPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-8">
          Decentralized Justice.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Transparent & Secure.
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-10 leading-relaxed">
          The next generation of public grievance management. Powered by Ethereum blockchain to ensure your reports are immutable, secure, and verifiable.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/user"
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/30 flex items-center justify-center group"
          >
            <FileText className="mr-2 h-5 w-5 group-hover:-translate-y-1 transition-transform" />
            File a Complaint
          </Link>
          <Link
            to="/police"
            className="w-full sm:w-auto px-8 py-4 bg-white text-slate-800 border-2 border-slate-200 font-semibold rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center group"
          >
            <Shield className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            Police Dashboard
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-gray-100">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900">Why Blockchain?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={Lock}
            title="Immutable Records"
            description="Once a complaint is filed, its hash is recorded on the Ethereum network. It can never be silently altered or deleted."
          />
          <FeatureCard
            icon={Shield}
            title="Complete Transparency"
            description="All status updates are logged cryptographically. Citizens can track the exact history of their cases with full trust."
          />
          <FeatureCard
            icon={Database}
            title="Decentralized Storage"
            description="Evidence and sensitive data are safely managed using modern distributed storage concepts, preventing centralized failures."
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
