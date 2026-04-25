import { Link } from 'react-router-dom';
import { Package, ShieldAlert, Cpu, BarChart3, TrendingUp, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Package className="h-8 w-8 text-indigo-600" />
          <span className="text-2xl font-bold text-slate-800">Inventra AI</span>
        </div>
        <div className="flex space-x-4">
          <Link to="/login" className="px-4 py-2 font-medium text-slate-600 hover:text-indigo-600 transition">Login</Link>
          <Link to="/signup" className="px-5 py-2 font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Smart Warehouse Inventory <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500">
            Management with AI Prediction
          </span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          Replace manual spreadsheets with a centralized, real-time platform that predicts stockouts before they happen and protects against fraud.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/signup" className="flex items-center px-8 py-4 text-lg font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition">
            Start Managing Inventory <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20 border-t border-slate-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-16">Enterprise Features</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard 
              icon={<Cpu className="h-10 w-10 text-purple-500" />}
              title="AI Stock Prediction"
              description="Automatically calculates daily usage and alerts you when stock will run out based on AI trends."
            />
            <FeatureCard 
              icon={<BarChart3 className="h-10 w-10 text-indigo-500" />}
              title="Real-time Tracking"
              description="Live WebSockets ensure every team member sees the exact same stock levels instantly."
            />
            <FeatureCard 
              icon={<ShieldAlert className="h-10 w-10 text-rose-500" />}
              title="Fraud Detection"
              description="Our anomaly detection algorithms flag suspicious deliveries and transfers automatically."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-6 py-20 border-t border-slate-100">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-16">How It Works</h2>
        <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 md:space-x-4">
          <Step number="1" title="Add Products" />
          <Step number="2" title="Receive Goods" />
          <Step number="3" title="Transfer & Deliver" />
          <Step number="4" title="Monitor AI Analytics" />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl transition duration-300">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}

function Step({ number, title }) {
  return (
    <div className="flex flex-col items-center text-center max-w-xs">
      <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl font-bold mb-4">
        {number}
      </div>
      <h4 className="text-lg font-bold text-slate-800">{title}</h4>
    </div>
  );
}
