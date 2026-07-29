import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowRight, Zap, Layers, 
  Network, Rocket, ShieldCheck, 
  Globe2, ChevronRight, Activity,
  Hexagon, Users, DollarSign,
  Gift, Target, Trophy, Medal, Crown, Calendar, Info, Timer, ChevronDown
} from 'lucide-react';

const AnimatedCounter = ({ end, duration = 2000, prefix = "", suffix = "", decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.5 }
    );
    if (counterRef.current) observer.observe(counterRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(easeOutQuart * end);
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [isVisible, end, duration]);

  const formattedNumber = count.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return <span ref={counterRef}>{prefix}{formattedNumber}{suffix}</span>;
};

const packagePlan = [
  { sr: 1, amount: "$10", cycle: "25 Days", dailyRoi: "5%", totalReturn: "$12.50" },
  { sr: 2, amount: "$50", cycle: "25 Days", dailyRoi: "5%", totalReturn: "$62.50" },
  { sr: 3, amount: "$100", cycle: "25 Days", dailyRoi: "5%", totalReturn: "$125.00" },
  { sr: 4, amount: "$250", cycle: "25 Days", dailyRoi: "5%", totalReturn: "$312.50" },
  { sr: 5, amount: "$500", cycle: "25 Days", dailyRoi: "5%", totalReturn: "$625.00" },
  { sr: 6, amount: "$1,000", cycle: "25 Days", dailyRoi: "5%", totalReturn: "$1,250.00" }
];

const faqData = [
  { q: "What is World Finance?", a: "World Finance is a secure and user-focused decentralized crypto platform offering transparent investment processes, daily ROI, and reliable financial support solutions." },
  { q: "How do I register?", a: "Registration is completely free. After registration, you can fund your wallet and activate your package." },
  { q: "How do I activate my package?", a: "Deposit USDT into your wallet balance. Once the funds are received, enter your Member ID and activate your investment package securely." },
  { q: "What is the daily ROI return?", a: "Activated investment packages yield 5% daily returns in USD over a structured 25-day cycle." },
  { q: "What is the minimum withdrawal amount?", a: "Please refer to the platform dashboard for the latest withdrawal rules and limits." }
];

const Home = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // Calculator slider states matching the template image style
  const [sliderAmount, setSliderAmount] = useState(100);
  const [sliderMonths, setSliderMonths] = useState(8);
  const [sliderInterest, setSliderInterest] = useState(4);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Calculations for calculator widget
  const calculatedMonthly = Math.round((sliderAmount * sliderInterest) / 100 + sliderAmount / sliderMonths);
  const calculatedTotal = calculatedMonthly * sliderMonths;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans overflow-x-hidden relative selection:bg-blue-500/30 selection:text-blue-900">
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .glass-panel {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(13, 110, 253, 0.2);
          box-shadow: 0 8px 32px rgba(0,0,0,0.04);
        }
        .text-theme-blue {
          background: linear-gradient(135deg, #0d6efd, #0043a8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .bg-grid-light {
          background-image: linear-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>

      {/* --- TOP HEADER NAVBAR --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <span className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1.5">
              <span className="w-3 h-3 bg-red-600 rounded-full inline-block"></span> WORLD FINANCE
            </span>
          </Link>
          <div className="hidden lg:flex items-center gap-8 font-semibold text-sm text-slate-700">
            <a href="#" className="hover:text-blue-600">Home</a>
            <a href="#about" className="hover:text-blue-600">About Us</a>
            <a href="#services" className="hover:text-blue-600">Service</a>
            <a href="#features" className="hover:text-blue-600">Features</a>
            <a href="#testi" className="hover:text-blue-600">Testimonials</a>
            <Link to="/login" className="hover:text-blue-600">Login</Link>
            <Link to="/register" className="hover:text-blue-600">Register</Link>
          </div>
          <Link to="/register" className="bg-[#0d6efd] hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-sm transition text-sm">
            Get Started
          </Link>
        </div>
      </nav>

      {/* --- HERO SLIDER SECTION WITH BACKGROUND IMAGE STYLE --- */}
      <section className="relative pt-32 pb-24 px-6 bg-slate-900 text-white overflow-hidden min-h-[85vh] flex items-center" style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.9)), url('web_assets/assets/images/main-slider/1.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <p className="text-blue-400 font-bold uppercase tracking-widest text-sm mb-3">Trusted & Seamless Digital Service Platform</p>
            <h1 className="text-4xl lg:text-6xl font-black mb-6 leading-tight">
              WELCOME TO <br /><span className="text-blue-500">WORLD FINANCE</span>
            </h1>
            <p className="text-slate-300 text-lg mb-8 max-w-lg leading-relaxed">
              Connecting You With Trusted Financial Solutions, Secure Staking, and Automated Daily ROI Payouts.
            </p>
            <div className="flex gap-4">
              <Link to="/login" className="bg-[#0d6efd] hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-sm transition shadow-lg">
                Login
              </Link>
              <Link to="/register" className="bg-white hover:bg-slate-100 text-slate-900 font-bold px-8 py-3.5 rounded-sm transition shadow-lg">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURE BOXES BAR --- */}
      <div className="bg-slate-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4 bg-slate-700/50 p-4 rounded-lg border border-slate-600">
            <Zap className="text-blue-400 shrink-0" size={32} />
            <div>
              <h4 className="font-bold text-base">Fast & Easy Investment Access</h4>
              <p className="text-slate-400 text-xs">Instant package activation and automated processing.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-slate-700/50 p-4 rounded-lg border border-slate-600">
            <ShieldCheck className="text-blue-400 shrink-0" size={32} />
            <div>
              <h4 className="font-bold text-base">Flexible & Daily ROI Benefits</h4>
              <p className="text-slate-400 text-xs">Earn 5% daily returns over structured 25-day cycles.</p>
            </div>
          </div>
        </div>
      </div>

      <main className="relative z-10">
        
        {/* --- ABOUT & CALCULATOR WIDGET SECTION (Matched with Image layout) --- */}
        <section className="py-20 px-6 max-w-7xl mx-auto" id="about">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Content */}
            <div className="lg:col-span-7">
              <p className="text-blue-600 font-bold text-sm tracking-wider uppercase mb-2">Smart Crypto Solutions & Support</p>
              <h2 className="text-3xl md:text-4xl font-black mb-6 text-slate-900 leading-snug">
                Helping You Move Forward with Reliable Staking & Returns
              </h2>
              <p className="text-slate-600 text-justify mb-4 leading-relaxed">
                Our platform is built to deliver secure, transparent, and user-focused crypto investment services with a strong commitment to reliability and customer satisfaction. We focus on creating a smooth and professional experience through structured blockchain systems, responsive support, and modern financial solutions designed to meet evolving user needs.
              </p>
              <p className="text-slate-600 text-justify mb-8 leading-relaxed">
                We are dedicated to maintaining high standards of trust, security, and service quality. Our objective is to provide dependable digital asset solutions with clear processes, user-friendly features, and responsible operational practices that support long-term confidence and convenience for all members.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex gap-4 items-start">
                  <div className="bg-blue-50 p-3 rounded text-blue-600"><Users size={24} /></div>
                  <div>
                    <h3 className="font-bold text-base mb-1">Dedicated Customer Assistance</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">Focused on reliable, transparent, and user-friendly digital asset service experiences.</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex gap-4 items-start">
                  <div className="bg-blue-50 p-3 rounded text-blue-600"><Globe2 size={24} /></div>
                  <div>
                    <h3 className="font-bold text-base mb-1">Trusted Crypto Platform</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">Providing reliable and user-focused decentralized solutions with secure blockchain standards.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Calculator Widget Box matching Image UI */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-slate-200 rounded-lg shadow-xl p-6">
                <h3 className="text-xl font-bold mb-6 text-slate-900 border-b pb-3">Select Your Preferred Service</h3>
                
                {/* Range Slider 1 */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                    <span>₹1,000</span>
                    <span>₹40,000</span>
                  </div>
                  <input 
                    type="range" 
                    min="1000" 
                    max="40000" 
                    value={sliderAmount} 
                    onChange={(e) => setSliderAmount(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer" 
                  />
                  <div className="text-right font-bold text-blue-600 text-sm mt-1">₹{sliderAmount}</div>
                </div>

                {/* Range Slider 2 */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                    <span>1 Month</span>
                    <span>12 Months</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="12" 
                    value={sliderMonths} 
                    onChange={(e) => setSliderMonths(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer" 
                  />
                  <div className="text-right font-bold text-blue-600 text-sm mt-1">{sliderMonths} Months</div>
                </div>

                {/* Range Slider 3 */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                    <span>1%</span>
                    <span>15%</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="15" 
                    value={sliderInterest} 
                    onChange={(e) => setSliderInterest(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer" 
                  />
                  <div className="text-right font-bold text-blue-600 text-sm mt-1">{sliderInterest}%</div>
                </div>

                {/* Output results */}
                <div className="bg-slate-50 p-4 rounded-lg space-y-3 border border-slate-200">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 font-medium">Monthly Amount</span>
                    <b className="text-slate-900 font-bold text-lg">₹{calculatedMonthly}</b>
                  </div>
                  <div className="flex justify-between items-center text-sm border-t pt-2">
                    <span className="text-slate-600 font-medium">Total Repayment</span>
                    <b className="text-blue-600 font-bold text-lg">₹{calculatedTotal}</b>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* --- SERVICES CARDS SECTION --- */}
        <section className="py-20 px-6 bg-slate-100 border-y border-slate-200" id="services">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-blue-600 font-bold text-sm tracking-wider uppercase mb-1">Our Services</p>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">Financial Support Solutions</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition">
                <div className="p-6">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded flex items-center justify-center mb-4">
                    <Layers size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">Individual Financial Support</h3>
                  <p className="text-slate-600 text-sm leading-relaxed text-justify">
                    An individual financial support service is designed to help users manage personal expenses and planned requirements such as education, healthcare, home improvement, or lifestyle needs with clear terms.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition">
                <div className="p-6">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded flex items-center justify-center mb-4">
                    <DollarSign size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">Education Support Service</h3>
                  <p className="text-slate-600 text-sm leading-relaxed text-justify">
                    An education support service is designed to help individuals manage academic-related expenses such as tuition, study materials, accommodation, and other learning needs with flexible planning.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition">
                <div className="p-6">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded flex items-center justify-center mb-4">
                    <Network size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">Business Support Service</h3>
                  <p className="text-slate-600 text-sm leading-relaxed text-justify">
                    A business support service is designed to help entrepreneurs and organizations manage operational needs, expand activities, and improve financial planning with structured assistance options.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- INVESTMENT PACKAGE TABLE --- */}
        <section className="py-20 px-6 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-2 text-slate-900">Investment <span className="text-blue-600">Packages</span></h2>
            <p className="text-slate-600 font-bold bg-slate-100 inline-block px-4 py-1.5 rounded-full border border-slate-200 shadow-sm mt-2">
              Daily ROI Return: <span className="text-blue-600 text-lg font-black">5% for 25 Days</span>
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="p-4 font-black text-center text-sm uppercase tracking-wider">Sr.</th>
                    <th className="p-4 font-black text-center text-sm uppercase tracking-wider">Package Amount</th>
                    <th className="p-4 font-black text-center text-sm uppercase tracking-wider">Cycle Duration</th>
                    <th className="p-4 font-black text-center text-sm uppercase tracking-wider">Daily ROI</th>
                    <th className="p-4 font-black text-right text-base uppercase tracking-wider">Total Return</th>
                  </tr>
                </thead>
                <tbody>
                  {packagePlan.map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-center text-slate-500 font-bold">{row.sr}</td>
                      <td className="p-4 text-center text-slate-800 font-black text-base">{row.amount}</td>
                      <td className="p-4 text-center text-slate-600 font-bold">{row.cycle}</td>
                      <td className="p-4 text-center text-blue-600 font-bold">{row.dailyRoi}</td>
                      <td className="p-4 text-right text-emerald-600 font-black text-lg">{row.totalReturn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* --- FAQ SECTION --- */}
        <section className="py-20 px-6 max-w-4xl mx-auto" id="features">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-slate-900">Frequently Asked <span className="text-blue-600">Questions</span></h2>
            <p className="text-slate-600 text-base">Everything you need to know about World Finance platform.</p>
          </div>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none bg-white hover:bg-slate-50 transition"
                >
                  <span className="font-bold text-slate-800 text-base">{faq.q}</span>
                  <div className={`shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-blue-50 transition-transform duration-300 ${openFaq === index ? 'rotate-180 bg-blue-100' : ''}`}>
                    <ChevronDown className="text-blue-600" size={16} strokeWidth={3} />
                  </div>
                </button>
                <div className={`transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                  <div className="px-6 pb-4 pt-2 border-t border-slate-100 bg-slate-50">
                    <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- CALL TO ACTION --- */}
        <section className="py-20 px-6 bg-[#0d6efd] text-white text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Start Your Staking Journey Today</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
              Join World Finance now to unlock daily ROI returns and robust platform support.
            </p>
            <Link to="/register" className="bg-white text-blue-900 font-bold px-8 py-4 rounded-sm shadow-lg hover:bg-slate-100 inline-block transition text-base">
              Get Started Now
            </Link>
          </div>
        </section>

      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">World Finance</h3>
            <p className="text-sm leading-relaxed mb-4">
              We provide reliable and user-focused crypto staking and financial support services with simple processes and transparent terms.
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Home</a></li>
              <li><a href="#about" className="hover:text-white">About Us</a></li>
              <li><a href="#services" className="hover:text-white">Services</a></li>
              <li><a href="#features" className="hover:text-white">Features</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Individual Support</a></li>
              <li><a href="#" className="hover:text-white">Education Support</a></li>
              <li><a href="#" className="hover:text-white">Business Support</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact Info</h3>
            <p className="text-sm mb-2">Email: support@worldfinance24.online</p>
            <p className="text-sm">Mon - Sat: 8:00 AM - 6:00 PM</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-slate-800 pt-6 text-center text-xs">
          <p>&copy; Copyright 2026 by worldfinance24.online. All Rights Reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default Home;