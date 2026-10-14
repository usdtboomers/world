// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { 
//   ArrowRight, Zap, Layers, 
//   Network, ShieldCheck, 
//   Globe2, ChevronDown, 
//   Users, DollarSign,
//   TrendingUp, Activity, BarChart3, Lock
// } from 'lucide-react';

// const AnimatedCounter = ({ end, duration = 2000, prefix = "", suffix = "", decimals = 0 }) => {
//   const [count, setCount] = useState(0);
//   const [isVisible, setIsVisible] = useState(false);
//   const counterRef = useRef(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
//       { threshold: 0.5 }
//     );
//     if (counterRef.current) observer.observe(counterRef.current);
//     return () => observer.disconnect();
//   }, []);

//   useEffect(() => {
//     if (!isVisible) return;
//     let startTimestamp = null;
//     const step = (timestamp) => {
//       if (!startTimestamp) startTimestamp = timestamp;
//       const progress = Math.min((timestamp - startTimestamp) / duration, 1);
//       const easeOutQuart = 1 - Math.pow(1 - progress, 4);
//       setCount(easeOutQuart * end);
//       if (progress < 1) window.requestAnimationFrame(step);
//     };
//     window.requestAnimationFrame(step);
//   }, [isVisible, end, duration]);

//   const formattedNumber = count.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//   return <span ref={counterRef}>{prefix}{formattedNumber}{suffix}</span>;
// };

// const packagePlan = [
//   { sr: 1, amount: "$10", cycle: "25 Days", dailyRoi: "5%", totalReturn: "$12.50" },
//   { sr: 2, amount: "$50", cycle: "25 Days", dailyRoi: "5%", totalReturn: "$62.50" },
//   { sr: 3, amount: "$100", cycle: "25 Days", dailyRoi: "5%", totalReturn: "$125.00" },
//   { sr: 4, amount: "$250", cycle: "25 Days", dailyRoi: "5%", totalReturn: "$312.50" },
//   { sr: 5, amount: "$500", cycle: "25 Days", dailyRoi: "5%", totalReturn: "$625.00" },
//   { sr: 6, amount: "$1,000", cycle: "25 Days", dailyRoi: "5%", totalReturn: "$1,250.00" }
// ];

// const faqData = [
//   { q: "What is World Finance 24?", a: "World Finance 24 is a secure decentralized crypto platform offering transparent investment processes, daily ROI through crypto trading, and network referral bonuses." },
//   { q: "How does the system generate profits?", a: "Our system pools deposited funds into high-frequency crypto trading algorithms, liquidity pools, and arbitrage opportunities across global exchanges to generate stable daily profits for our investors." },
//   { q: "How do I activate my package?", a: "Deposit USDT (BEP-20) into your wallet balance. Minimum upgrade package starts at $30. Once funds are received, activate your investment package securely from the dashboard." },
//   { q: "What is the daily ROI return?", a: "Activated investment packages yield 5% daily returns in USD over a structured 25-day cycle." },
//   { q: "What are the withdrawal rules?", a: "Withdrawals are processed daily between 10:00 AM - 12:00 PM (IST). A minimum withdrawal limit of $1-$2 applies, and an active package is required." }
// ];

// const Home = () => {
//   const navigate = useNavigate();
//   const [scrolled, setScrolled] = useState(false);
//   const [openFaq, setOpenFaq] = useState(null);

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 50);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const toggleFaq = (index) => {
//     setOpenFaq(openFaq === index ? null : index);
//   };

//   return (
//     <div className="min-h-screen bg-[#0b101e] text-gray-300 font-sans overflow-x-hidden relative selection:bg-[#e4c568]/30 selection:text-[#e4c568]">
      
//       <style>{`
//         .glass-header {
//           background: rgba(11, 16, 30, 0.85);
//           backdrop-filter: blur(12px);
//           border-bottom: 1px solid rgba(228, 197, 104, 0.1);
//         }
//         .text-gold-gradient {
//           background: linear-gradient(135deg, #e4c568, #d4af37, #f3e5ab);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//         }
//         .bg-gold-gradient {
//           background: linear-gradient(135deg, #e4c568, #d4af37);
//         }
//       `}</style>

//       {/* --- TOP HEADER NAVBAR --- */}
//       <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass-header py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' : 'bg-transparent py-5'}`}>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
//           <Link to="/" className="flex items-center gap-2 no-underline group">
//             <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#131927] border border-[#e4c568]/50 flex items-center justify-center group-hover:border-[#e4c568] transition-colors shadow-[0_0_10px_rgba(228,197,104,0.2)]">
//                <Globe2 className="text-[#e4c568]" size={20} />
//             </div>
//             <span className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center">
//               WORLD<span className="text-[#e4c568]">FINANCE24</span>
//             </span>
//           </Link>
          
//           <div className="hidden lg:flex items-center gap-8 font-semibold text-sm text-gray-300">
//             <a href="#" className="hover:text-[#e4c568] transition-colors">Home</a>
//             <a href="#about" className="hover:text-[#e4c568] transition-colors">Ecosystem</a>
//             <a href="#packages" className="hover:text-[#e4c568] transition-colors">Packages</a>
//             <a href="#faq" className="hover:text-[#e4c568] transition-colors">FAQ</a>
//             <Link to="/login" className="hover:text-[#e4c568] transition-colors">Login</Link>
//           </div>
          
//           <div className="flex gap-3">
//             <Link to="/login" className="hidden sm:flex bg-[#131927] border border-[#e4c568]/30 hover:border-[#e4c568] text-white font-bold px-5 py-2.5 rounded transition text-sm items-center justify-center">
//               Login
//             </Link>
//             <Link to="/register" className="bg-gold-gradient hover:scale-105 text-black font-extrabold px-5 sm:px-6 py-2.5 rounded transition-transform text-sm shadow-[0_0_15px_rgba(228,197,104,0.3)]">
//               Register
//             </Link>
//           </div>
//         </div>
//       </nav>

//       {/* --- HERO SECTION --- */}
//       <section className="relative pt-32 pb-20 sm:pb-24 px-4 sm:px-6 bg-[#0b101e] min-h-[85vh] flex items-center overflow-hidden">
//         {/* Background Gradients */}
//         <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#e4c568]/5 blur-[120px] rounded-full pointer-events-none"></div>
//         <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>

//         <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
//           <div className="text-center lg:text-left">
//             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#131927] border border-[#e4c568]/30 text-[#e4c568] text-xs font-bold tracking-wide mb-6">
//               <Activity size={14} /> LIVE USDT (BEP-20) DEPOSITS & WITHDRAWALS
//             </div>
//             <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight text-white">
//               MASTER YOUR <br />
//               <span className="text-gold-gradient">CRYPTO WEALTH</span>
//             </h1>
//             <p className="text-gray-400 text-base sm:text-lg mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
//               Join worldfinance24 to unlock daily ROI through automated crypto trading and powerful multi-level referral networks.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
//               <Link to="/register" className="bg-gold-gradient text-black font-black px-8 py-3.5 rounded transition shadow-[0_0_20px_rgba(228,197,104,0.4)] hover:shadow-[0_0_30px_rgba(228,197,104,0.6)] hover:-translate-y-1 text-center uppercase tracking-wider text-sm">
//                 Start Earning
//               </Link>
//               <Link to="/login" className="bg-[#161c2d] hover:bg-[#1e2536] border border-[#2d3748] text-white font-bold px-8 py-3.5 rounded transition text-center uppercase tracking-wider text-sm">
//                 Member Dashboard
//               </Link>
//             </div>
//           </div>

//           {/* Right Side Visual */}
//           <div className="hidden lg:block relative">
//             <div className="absolute inset-0 bg-gradient-to-tr from-[#e4c568]/10 to-transparent rounded-full blur-[80px]"></div>
//             <div className="bg-[#131927] border border-[#2d3748] p-6 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)] relative z-10">
//               <div className="flex justify-between items-center mb-6 border-b border-[#2d3748] pb-4">
//                 <span className="text-white font-bold flex items-center gap-2"><TrendingUp className="text-[#00ff88]" /> Platform Stats</span>
//                 <span className="text-[#e4c568] text-xs font-bold bg-[#e4c568]/10 px-3 py-1 rounded">UPDATED LIVE</span>
//               </div>
//               <div className="space-y-6">
//                 <div>
//                   <p className="text-gray-500 text-sm font-semibold mb-1">Total Active Traders</p>
//                   <p className="text-3xl font-black text-white"><AnimatedCounter end={12540} prefix="" suffix="+" /></p>
//                 </div>
//                 <div>
//                   <p className="text-gray-500 text-sm font-semibold mb-1">Total Volume Traded</p>
//                   <p className="text-3xl font-black text-[#00ff88]"><AnimatedCounter end={458} prefix="$" suffix="K+" decimals={1} /></p>
//                 </div>
//                 <div>
//                   <p className="text-gray-500 text-sm font-semibold mb-1">Daily Payouts</p>
//                   <p className="text-3xl font-black text-[#e4c568]"><AnimatedCounter end={5} prefix="" suffix="%" decimals={0} /></p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* --- FEATURE BOXES BAR --- */}
//       <div className="bg-[#0f1423] border-y border-[#2d3748] py-6 sm:py-8 relative z-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
//           <div className="flex items-center gap-4 bg-[#131927] p-5 rounded-xl border border-[#2d3748] hover:border-[#e4c568]/50 transition-colors">
//             <ShieldCheck className="text-[#e4c568] shrink-0" size={32} />
//             <div>
//               <h4 className="font-bold text-white text-[15px]">Secure USDT Ecosystem</h4>
//               <p className="text-gray-400 text-xs mt-1">100% transparent BEP-20 transactions.</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-4 bg-[#131927] p-5 rounded-xl border border-[#2d3748] hover:border-[#e4c568]/50 transition-colors">
//             <TrendingUp className="text-[#e4c568] shrink-0" size={32} />
//             <div>
//               <h4 className="font-bold text-white text-[15px]">5% Daily Trading ROI</h4>
//               <p className="text-gray-400 text-xs mt-1">Consistent profits over a 25-day cycle.</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-4 bg-[#131927] p-5 rounded-xl border border-[#2d3748] hover:border-[#e4c568]/50 transition-colors">
//             <Network className="text-[#e4c568] shrink-0" size={32} />
//             <div>
//               <h4 className="font-bold text-white text-[15px]">MLM Network Bonus</h4>
//               <p className="text-gray-400 text-xs mt-1">Earn massive rewards by building your team.</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <main className="relative z-10">
        
//         {/* --- EARNING ECOSYSTEM (Replaced Calculator) --- */}
//         <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto" id="about">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
//             {/* Left Content */}
//             <div>
//               <p className="text-[#e4c568] font-black text-sm tracking-widest uppercase mb-2">How We Generate Value</p>
//               <h2 className="text-3xl sm:text-4xl font-black mb-6 text-white leading-tight">
//                 The Engine Behind Your <br className="hidden sm:block" />
//                 <span className="text-gold-gradient">Daily 5% Returns</span>
//               </h2>
//               <p className="text-gray-400 text-justify mb-6 leading-relaxed text-sm sm:text-base">
//                  worldfinance24 utilizes your deposits as liquidity for our high-frequency crypto trading algorithms and market arbitrage bots. By trading in high-volume markets, our system generates consistent profit margins.
//               </p>
//               <p className="text-gray-400 text-justify mb-8 leading-relaxed text-sm sm:text-base">
//                 A portion of these profits is distributed back to our investors as a guaranteed <strong>5% Daily ROI</strong>, while the rest sustains the platform and funds our lucrative multi-level referral network.
//               </p>

//               <div className="space-y-4">
//                 <div className="bg-[#131927] p-4 rounded-xl border border-[#2d3748] flex gap-4 items-center">
//                   <div className="bg-[#1e2536] p-3 rounded-lg text-[#00ff88] border border-[#2d3748]"><BarChart3 size={24} /></div>
//                   <div>
//                     <h3 className="font-bold text-white text-base">Algorithmic Crypto Trading</h3>
//                     <p className="text-gray-500 text-xs mt-1">24/7 automated trades across Binance & KuCoin.</p>
//                   </div>
//                 </div>
//                 <div className="bg-[#131927] p-4 rounded-xl border border-[#2d3748] flex gap-4 items-center">
//                   <div className="bg-[#1e2536] p-3 rounded-lg text-[#e4c568] border border-[#2d3748]"><Layers size={24} /></div>
//                   <div>
//                     <h3 className="font-bold text-white text-base">Liquidity Pooling</h3>
//                     <p className="text-gray-500 text-xs mt-1">Earning fees through decentralized exchange liquidity.</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Right Side: Earning Steps */}
//             <div>
//               <div className="bg-[#131927] border border-[#2d3748] rounded-2xl shadow-xl p-6 sm:p-8 relative overflow-hidden">
//                 <div className="absolute top-0 right-0 w-32 h-32 bg-[#e4c568]/10 blur-[50px] rounded-full"></div>
//                 <h3 className="text-xl sm:text-2xl font-bold mb-8 text-white border-b border-[#2d3748] pb-4">
//                   Start Earning in 3 Simple Steps
//                 </h3>
                
//                 <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[1.1rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#2d3748] before:to-transparent">
                  
//                   {/* Step 1 */}
//                   <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
//                     <div className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-[#e4c568] bg-[#161c2d] text-[#e4c568] font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_10px_rgba(228,197,104,0.3)] z-10">
//                       1
//                     </div>
//                     <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-[#1e2536] p-4 rounded-xl border border-[#2d3748] shadow-sm">
//                       <div className="flex items-center gap-2 mb-1">
//                         <DollarSign size={16} className="text-[#e4c568]"/>
//                         <h4 className="font-bold text-white text-sm">Deposit USDT</h4>
//                       </div>
//                       <p className="text-xs text-gray-400">Add funds to your wallet using the secure BEP-20 network.</p>
//                     </div>
//                   </div>

//                   {/* Step 2 */}
//                   <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
//                     <div className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-[#e4c568] bg-[#161c2d] text-[#e4c568] font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_10px_rgba(228,197,104,0.3)] z-10">
//                       2
//                     </div>
//                     <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-[#1e2536] p-4 rounded-xl border border-[#2d3748] shadow-sm">
//                       <div className="flex items-center gap-2 mb-1">
//                         <Lock size={16} className="text-[#e4c568]"/>
//                         <h4 className="font-bold text-white text-sm">Activate Package</h4>
//                       </div>
//                       <p className="text-xs text-gray-400">Upgrade your account (Min $30) to unlock earning potentials.</p>
//                     </div>
//                   </div>

//                   {/* Step 3 */}
//                   <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
//                     <div className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-[#e4c568] bg-[#161c2d] text-[#e4c568] font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_10px_rgba(228,197,104,0.3)] z-10">
//                       3
//                     </div>
//                     <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-[#1e2536] p-4 rounded-xl border border-[#2d3748] shadow-sm">
//                       <div className="flex items-center gap-2 mb-1">
//                         <TrendingUp size={16} className="text-[#00ff88]"/>
//                         <h4 className="font-bold text-white text-sm">Earn & Withdraw</h4>
//                       </div>
//                       <p className="text-xs text-gray-400">Get 5% ROI daily. Withdraw directly to your crypto wallet.</p>
//                     </div>
//                   </div>

//                 </div>
//               </div>
//             </div>

//           </div>
//         </section>

//         {/* --- INVESTMENT PACKAGE TABLE --- */}
//         <section className="py-20 px-4 sm:px-6 max-w-5xl mx-auto" id="packages">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl sm:text-4xl font-black mb-3 text-white"> <span className="text-gold-gradient">Packages</span></h2>
//             <p className="text-[#e4c568] font-bold bg-[#131927] border border-[#2d3748] inline-block px-5 py-2 rounded-full shadow-sm text-sm sm:text-base">
//               Guaranteed Daily ROI: <span className="text-white font-black">5% for 25 Days</span>
//             </p>
//           </div>

//           <div className="bg-[#131927] rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-[#2d3748] overflow-hidden">
//             <div className="overflow-x-auto custom-scrollbar">
//               <table className="w-full text-left border-collapse whitespace-nowrap">
//                 <thead>
//                   <tr className="bg-[#1e2536] border-b border-[#2d3748]">
//                     <th className="p-4 sm:p-5 font-black text-center text-[#e4c568] text-xs sm:text-sm uppercase tracking-wider">Sr.</th>
//                     <th className="p-4 sm:p-5 font-black text-center text-[#e4c568] text-xs sm:text-sm uppercase tracking-wider">Package Amount</th>
//                     <th className="p-4 sm:p-5 font-black text-center text-[#e4c568] text-xs sm:text-sm uppercase tracking-wider">Cycle Duration</th>
//                     <th className="p-4 sm:p-5 font-black text-center text-[#e4c568] text-xs sm:text-sm uppercase tracking-wider">Daily ROI</th>
//                     <th className="p-4 sm:p-5 font-black text-right text-[#e4c568] text-xs sm:text-sm uppercase tracking-wider">Total Return</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {packagePlan.map((row, idx) => (
//                     <tr key={idx} className="border-b border-[#2d3748] hover:bg-[#161c2d] transition-colors">
//                       <td className="p-4 sm:p-5 text-center text-gray-400 font-bold">{row.sr}</td>
//                       <td className="p-4 sm:p-5 text-center text-white font-black text-sm sm:text-base">{row.amount}</td>
//                       <td className="p-4 sm:p-5 text-center text-gray-400 font-bold">{row.cycle}</td>
//                       <td className="p-4 sm:p-5 text-center text-[#00ff88] font-bold">{row.dailyRoi}</td>
//                       <td className="p-4 sm:p-5 text-right text-[#e4c568] font-black text-base sm:text-lg">{row.totalReturn}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//           <div className="text-center mt-6">
//              <p className="text-xs text-gray-500">* Minimum upgrade required to access Fund Transfer & Withdrawals is $30.</p>
//           </div>
//         </section>

//         {/* --- FAQ SECTION --- */}
//         <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto" id="faq">
//           <div className="text-center mb-14">
//             <h2 className="text-3xl sm:text-4xl font-black mb-4 text-white">Frequently Asked <span className="text-gold-gradient">Questions</span></h2>
//             <p className="text-gray-400 text-sm sm:text-base">Everything you need to know about worldfinance24.</p>
//           </div>
//           <div className="space-y-4">
//             {faqData.map((faq, index) => (
//               <div key={index} className="bg-[#131927] border border-[#2d3748] rounded-xl overflow-hidden shadow-sm">
//                 <button
//                   onClick={() => toggleFaq(index)}
//                   className="w-full px-5 sm:px-6 py-4 text-left flex justify-between items-center focus:outline-none hover:bg-[#1e2536] transition-colors"
//                 >
//                   <span className="font-bold text-gray-200 text-sm sm:text-base">{faq.q}</span>
//                   <div className={`shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-[#161c2d] border border-[#2d3748] transition-transform duration-300 ${openFaq === index ? 'rotate-180 border-[#e4c568]' : ''}`}>
//                     <ChevronDown className={openFaq === index ? "text-[#e4c568]" : "text-gray-400"} size={16} strokeWidth={3} />
//                   </div>
//                 </button>
//                 <div className={`transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
//                   <div className="px-5 sm:px-6 pb-4 pt-2 border-t border-[#2d3748] bg-[#0b101e]">
//                     <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* --- CALL TO ACTION --- */}
//         <section className="py-20 px-4 sm:px-6 bg-gold-gradient text-black text-center relative overflow-hidden">
//           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
//           <div className="max-w-4xl mx-auto relative z-10">
//             <h2 className="text-3xl sm:text-4xl font-black mb-4 uppercase tracking-wide">Start Your Trading Journey Today</h2>
//             <p className="text-black/80 font-bold text-sm sm:text-lg mb-8 max-w-xl mx-auto">
//               Join worldfinance24 now to unlock daily crypto ROI and build a powerful global network.
//             </p>
//             <Link to="/register" className="bg-[#0b101e] text-[#e4c568] font-black px-8 py-4 rounded-lg shadow-2xl hover:bg-[#131927] hover:scale-105 inline-block transition-all text-sm sm:text-base uppercase tracking-widest border border-[#e4c568]/30">
//               Create Free Account
//             </Link>
//           </div>
//         </section>

//       </main>

//       {/* --- FOOTER --- */}
//       <footer className="bg-[#0b101e] border-t border-[#2d3748] text-gray-400 py-12 px-4 sm:px-6 relative z-10">
//         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
//           <div className="col-span-1 md:col-span-2">
//             <div className="flex items-center gap-2 mb-4">
//               <Globe2 className="text-[#e4c568]" size={24} />
//               <span className="text-xl font-black tracking-tight text-white">WORLD<span className="text-[#e4c568]">FINANCE24</span></span>
//             </div>
//             <p className="text-sm leading-relaxed mb-4 max-w-sm">
//               Premium decentralized crypto trading. Empowering users with automated ROI and transparent BEP-20 technology.
//             </p>
//           </div>
          
//           <div>
//             <h3 className="text-white font-bold text-lg mb-4 border-b border-[#2d3748] pb-2 inline-block">Quick Links</h3>
//             <ul className="space-y-2 text-sm font-medium">
//               <li><a href="#" className="hover:text-[#e4c568] transition-colors">Home</a></li>
//               <li><a href="#about" className="hover:text-[#e4c568] transition-colors">Ecosystem</a></li>
//               <li><a href="#packages" className="hover:text-[#e4c568] transition-colors">Packages</a></li>
//               <li><Link to="/login" className="hover:text-[#e4c568] transition-colors">Member Login</Link></li>
//             </ul>
//           </div>
          
//           <div>
//             <h3 className="text-white font-bold text-lg mb-4 border-b border-[#2d3748] pb-2 inline-block">Support Info</h3>
//             <p className="text-sm mb-2 font-medium">Email: <span className="text-[#e4c568]">support@worldfinance24.online</span></p>
//             <p className="text-sm font-medium">Mon - Sat: 10:00 AM - 6:00 PM</p>
//             <p className="text-xs text-gray-500 mt-4">* Withdrawals processed daily between 10 AM to 12 PM.</p>
//           </div>
//         </div>
//         <div className="max-w-7xl mx-auto border-t border-[#2d3748] pt-6 flex flex-col md:flex-row justify-between items-center text-xs">
//           <p>&copy; {new Date().getFullYear()} worldfinance24. All Rights Reserved.</p>
//           <p className="mt-2 md:mt-0 text-gray-500">Secured via 256-Bit SSL Encryption.</p>
//         </div>
//       </footer>

//     </div>
//   );
// };

// export default Home;






















import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowRight, Zap, Layers, 
  Network, ShieldCheck, 
  Globe2, ChevronDown, 
  Users, DollarSign,
  TrendingUp, Activity, BarChart3, Lock, Star
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

// 🔥 Naya FAQ data bina specific numbers ke
const faqData = [
  { q: "What is World Finance 24?", a: "World Finance 24 is a secure decentralized crypto platform offering transparent investment processes, daily ROI through crypto trading, and network referral bonuses." },
  { q: "How does the system generate profits?", a: "Our system pools deposited funds into high-frequency crypto trading algorithms, liquidity pools, and arbitrage opportunities across global exchanges to generate stable daily profits for our investors." },
  { q: "How do I activate my package?", a: "Deposit USDT (BEP-20) into your wallet balance. Once funds are received, you can explore and activate your preferred investment package securely from the dashboard." },
  { q: "What is the daily ROI return?", a: "Activated investment packages yield consistent daily returns in USD based on the specific plan you choose from your dashboard." },
  { q: "What are the withdrawal rules?", a: "Withdrawals are processed daily between 10:00 AM - 12:00 PM (IST). An active package is required to place a withdrawal request." }
];

const Home = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#0b101e] text-gray-300 font-sans overflow-x-hidden relative selection:bg-[#e4c568]/30 selection:text-[#e4c568]">
      
      <style>{`
        .glass-header {
          background: rgba(11, 16, 30, 0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(228, 197, 104, 0.1);
        }
        .text-gold-gradient {
          background: linear-gradient(135deg, #e4c568, #d4af37, #f3e5ab);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .bg-gold-gradient {
          background: linear-gradient(135deg, #e4c568, #d4af37);
        }
      `}</style>

      {/* --- TOP HEADER NAVBAR --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass-header py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 no-underline group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#131927] border border-[#e4c568]/50 flex items-center justify-center group-hover:border-[#e4c568] transition-colors shadow-[0_0_10px_rgba(228,197,104,0.2)]">
               <Globe2 className="text-[#e4c568]" size={20} />
            </div>
            <span className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center">
              WORLD<span className="text-[#e4c568]">FINANCE24</span>
            </span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-8 font-semibold text-sm text-gray-300">
            <a href="#" className="hover:text-[#e4c568] transition-colors">Home</a>
            <a href="#about" className="hover:text-[#e4c568] transition-colors">Ecosystem</a>
            <a href="#packages" className="hover:text-[#e4c568] transition-colors">Packages</a>
            <a href="#faq" className="hover:text-[#e4c568] transition-colors">FAQ</a>
            <Link to="/login" className="hover:text-[#e4c568] transition-colors">Login</Link>
          </div>
          
          <div className="flex gap-3">
            <Link to="/login" className="hidden sm:flex bg-[#131927] border border-[#e4c568]/30 hover:border-[#e4c568] text-white font-bold px-5 py-2.5 rounded transition text-sm items-center justify-center">
              Login
            </Link>
            <Link to="/register" className="bg-gold-gradient hover:scale-105 text-black font-extrabold px-5 sm:px-6 py-2.5 rounded transition-transform text-sm shadow-[0_0_15px_rgba(228,197,104,0.3)]">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 sm:pb-24 px-4 sm:px-6 bg-[#0b101e] min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#e4c568]/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#131927] border border-[#e4c568]/30 text-[#e4c568] text-xs font-bold tracking-wide mb-6">
              <Activity size={14} /> LIVE USDT (BEP-20) DEPOSITS & WITHDRAWALS
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight text-white">
              MASTER YOUR <br />
              <span className="text-gold-gradient">CRYPTO WEALTH</span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Join worldfinance24 to unlock stable daily ROI through automated crypto trading and powerful multi-level referral networks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/register" className="bg-gold-gradient text-black font-black px-8 py-3.5 rounded transition shadow-[0_0_20px_rgba(228,197,104,0.4)] hover:shadow-[0_0_30px_rgba(228,197,104,0.6)] hover:-translate-y-1 text-center uppercase tracking-wider text-sm">
                Start Earning
              </Link>
              <Link to="/login" className="bg-[#161c2d] hover:bg-[#1e2536] border border-[#2d3748] text-white font-bold px-8 py-3.5 rounded transition text-center uppercase tracking-wider text-sm">
                Member Dashboard
              </Link>
            </div>
          </div>

          <div className="hidden lg:block relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#e4c568]/10 to-transparent rounded-full blur-[80px]"></div>
            <div className="bg-[#131927] border border-[#2d3748] p-6 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)] relative z-10">
              <div className="flex justify-between items-center mb-6 border-b border-[#2d3748] pb-4">
                <span className="text-white font-bold flex items-center gap-2"><TrendingUp className="text-[#00ff88]" /> Platform Stats</span>
                <span className="text-[#e4c568] text-xs font-bold bg-[#e4c568]/10 px-3 py-1 rounded">UPDATED LIVE</span>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-gray-500 text-sm font-semibold mb-1">Total Active Traders</p>
                  <p className="text-3xl font-black text-white"><AnimatedCounter end={12540} prefix="" suffix="+" /></p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-semibold mb-1">Total Volume Traded</p>
                  <p className="text-3xl font-black text-[#00ff88]"><AnimatedCounter end={458} prefix="$" suffix="K+" decimals={1} /></p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-semibold mb-1">Active Global Markets</p>
                  <p className="text-3xl font-black text-[#e4c568]"><AnimatedCounter end={40} prefix="" suffix="+" decimals={0} /></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     

      <main className="relative z-10">
        
        {/* --- ABOUT SECTION --- */}
        <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto" id="about">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div>
              <p className="text-[#e4c568] font-black text-sm tracking-widest uppercase mb-2">How We Generate Value</p>
              <h2 className="text-3xl sm:text-4xl font-black mb-6 text-white leading-tight">
                The Engine Behind Your <br className="hidden sm:block" />
                <span className="text-gold-gradient">Consistent Returns</span>
              </h2>
              <p className="text-gray-400 text-justify mb-6 leading-relaxed text-sm sm:text-base">
                 worldfinance24 utilizes deposited liquidity to power our high-frequency crypto trading algorithms and market arbitrage bots. By trading in high-volume markets, our system generates consistent profit margins regardless of market direction.
              </p>
              <p className="text-gray-400 text-justify mb-8 leading-relaxed text-sm sm:text-base">
                A portion of these profits is distributed back to our investors as a stable Daily ROI, while the rest sustains the platform and funds our lucrative multi-level referral network.
              </p>

              <div className="space-y-4">
                <div className="bg-[#131927] p-4 rounded-xl border border-[#2d3748] flex gap-4 items-center">
                  <div className="bg-[#1e2536] p-3 rounded-lg text-[#00ff88] border border-[#2d3748]"><BarChart3 size={24} /></div>
                  <div>
                    <h3 className="font-bold text-white text-base">Algorithmic Crypto Trading</h3>
                    <p className="text-gray-500 text-xs mt-1">24/7 automated trades across global exchanges.</p>
                  </div>
                </div>
                <div className="bg-[#131927] p-4 rounded-xl border border-[#2d3748] flex gap-4 items-center">
                  <div className="bg-[#1e2536] p-3 rounded-lg text-[#e4c568] border border-[#2d3748]"><Layers size={24} /></div>
                  <div>
                    <h3 className="font-bold text-white text-base">Liquidity Pooling</h3>
                    <p className="text-gray-500 text-xs mt-1">Earning fees through decentralized exchange liquidity.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Earning Steps */}
            <div>
              <div className="bg-[#131927] border border-[#2d3748] rounded-2xl shadow-xl p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#e4c568]/10 blur-[50px] rounded-full"></div>
                <h3 className="text-xl sm:text-2xl font-bold mb-8 text-white border-b border-[#2d3748] pb-4">
                  Start Earning in 3 Simple Steps
                </h3>
                
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[1.1rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#2d3748] before:to-transparent">
                  
                  {/* Step 1 */}
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-[#e4c568] bg-[#161c2d] text-[#e4c568] font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_10px_rgba(228,197,104,0.3)] z-10">
                      1
                    </div>
                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-[#1e2536] p-4 rounded-xl border border-[#2d3748] shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign size={16} className="text-[#e4c568]"/>
                        <h4 className="font-bold text-white text-sm">Deposit USDT</h4>
                      </div>
                      <p className="text-xs text-gray-400">Add funds to your wallet using the secure BEP-20 network.</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-[#e4c568] bg-[#161c2d] text-[#e4c568] font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_10px_rgba(228,197,104,0.3)] z-10">
                      2
                    </div>
                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-[#1e2536] p-4 rounded-xl border border-[#2d3748] shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <Lock size={16} className="text-[#e4c568]"/>
                        <h4 className="font-bold text-white text-sm">Activate Package</h4>
                      </div>
                      <p className="text-xs text-gray-400">Select and activate a package to unlock your earning potential.</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-[#e4c568] bg-[#161c2d] text-[#e4c568] font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_10px_rgba(228,197,104,0.3)] z-10">
                      3
                    </div>
                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-[#1e2536] p-4 rounded-xl border border-[#2d3748] shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp size={16} className="text-[#00ff88]"/>
                        <h4 className="font-bold text-white text-sm">Earn & Withdraw</h4>
                      </div>
                      <p className="text-xs text-gray-400">Enjoy consistent ROI daily. Withdraw directly to your crypto wallet.</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </section>

        {/* --- FLEXIBLE PACKAGES SECTION (Table Removed) --- */}
        <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto" id="packages">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black mb-3 text-white"> Flexible <span className="text-gold-gradient">Packages</span></h2>
            <p className="text-[#e4c568] font-bold bg-[#131927] border border-[#2d3748] inline-block px-5 py-2 rounded-full shadow-sm text-sm sm:text-base">
              Tailored plans to suit every financial goal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-[#131927] border border-[#2d3748] hover:border-[#e4c568] p-8 rounded-2xl transition-all hover:-translate-y-2 group">
              <div className="w-14 h-14 bg-[#1e2536] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-[#2d3748]">
                <Star className="text-gray-400" size={24} />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Starter Plans</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Perfect for beginners looking to step into the world of crypto earning with minimal risk.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-gray-300"><CheckIcon /> Entry-level access</li>
                <li className="flex items-center gap-2 text-sm text-gray-300"><CheckIcon /> Standard ROI rates</li>
                <li className="flex items-center gap-2 text-sm text-gray-300"><CheckIcon /> Basic network bonuses</li>
              </ul>
              <Link to="/login" className="block text-center border border-[#e4c568] text-[#e4c568] hover:bg-[#e4c568] hover:text-black font-bold py-3 rounded-lg transition-colors text-sm">View in Dashboard</Link>
            </div>

            <div className="bg-[#131927] border border-[#e4c568] relative p-8 rounded-2xl transition-all hover:-translate-y-2 shadow-[0_0_25px_rgba(228,197,104,0.15)] group">
              <div className="absolute top-0 right-0 bg-[#e4c568] text-black text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-lg rounded-tr-lg">Most Popular</div>
              <div className="w-14 h-14 bg-gold-gradient rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(228,197,104,0.4)]">
                <TrendingUp className="text-black" size={24} />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Professional Plans</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Designed for serious investors seeking optimized returns and team-building potential.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-gray-300"><CheckIcon /> Mid-tier investments</li>
                <li className="flex items-center gap-2 text-sm text-gray-300"><CheckIcon /> Enhanced ROI access</li>
                <li className="flex items-center gap-2 text-sm text-gray-300"><CheckIcon /> Advanced network rewards</li>
              </ul>
              <Link to="/login" className="block text-center bg-gold-gradient text-black font-bold py-3 rounded-lg transition-colors text-sm">View in Dashboard</Link>
            </div>

            <div className="bg-[#131927] border border-[#2d3748] hover:border-[#e4c568] p-8 rounded-2xl transition-all hover:-translate-y-2 group">
              <div className="w-14 h-14 bg-[#1e2536] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-[#2d3748]">
                <ShieldCheck className="text-gray-400" size={24} />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Executive Plans</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                For crypto whales wanting maximum leverage, highest yields, and priority support.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-gray-300"><CheckIcon /> High-volume limits</li>
                <li className="flex items-center gap-2 text-sm text-gray-300"><CheckIcon /> Premium ROI multipliers</li>
                <li className="flex items-center gap-2 text-sm text-gray-300"><CheckIcon /> Maximum network depth</li>
              </ul>
              <Link to="/login" className="block text-center border border-[#e4c568] text-[#e4c568] hover:bg-[#e4c568] hover:text-black font-bold py-3 rounded-lg transition-colors text-sm">View in Dashboard</Link>
            </div>

          </div>
        </section>

        {/* --- FAQ SECTION --- */}
        <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto" id="faq">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black mb-4 text-white">Frequently Asked <span className="text-gold-gradient">Questions</span></h2>
            <p className="text-gray-400 text-sm sm:text-base">Everything you need to know about worldfinance24.</p>
          </div>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-[#131927] border border-[#2d3748] rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-5 sm:px-6 py-4 text-left flex justify-between items-center focus:outline-none hover:bg-[#1e2536] transition-colors"
                >
                  <span className="font-bold text-gray-200 text-sm sm:text-base">{faq.q}</span>
                  <div className={`shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-[#161c2d] border border-[#2d3748] transition-transform duration-300 ${openFaq === index ? 'rotate-180 border-[#e4c568]' : ''}`}>
                    <ChevronDown className={openFaq === index ? "text-[#e4c568]" : "text-gray-400"} size={16} strokeWidth={3} />
                  </div>
                </button>
                <div className={`transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                  <div className="px-5 sm:px-6 pb-4 pt-2 border-t border-[#2d3748] bg-[#0b101e]">
                    <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- CALL TO ACTION --- */}
        <section className="py-20 px-4 sm:px-6 bg-gold-gradient text-black text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="text-3xl sm:text-4xl font-black mb-4 uppercase tracking-wide">Start Your Trading Journey Today</h2>
            <p className="text-black/80 font-bold text-sm sm:text-lg mb-8 max-w-xl mx-auto">
              Join worldfinance24 now to unlock daily crypto ROI and build a powerful global network.
            </p>
            <Link to="/register" className="bg-[#0b101e] text-[#e4c568] font-black px-8 py-4 rounded-lg shadow-2xl hover:bg-[#131927] hover:scale-105 inline-block transition-all text-sm sm:text-base uppercase tracking-widest border border-[#e4c568]/30">
              Create Free Account
            </Link>
          </div>
        </section>

      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-[#0b101e] border-t border-[#2d3748] text-gray-400 py-12 px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Globe2 className="text-[#e4c568]" size={24} />
              <span className="text-xl font-black tracking-tight text-white">WORLD<span className="text-[#e4c568]">FINANCE24</span></span>
            </div>
            <p className="text-sm leading-relaxed mb-4 max-w-sm">
              Premium decentralized crypto trading. Empowering users with automated ROI and transparent BEP-20 technology.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-lg mb-4 border-b border-[#2d3748] pb-2 inline-block">Quick Links</h3>
            <ul className="space-y-2 text-sm font-medium">
              <li><a href="#" className="hover:text-[#e4c568] transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-[#e4c568] transition-colors">Ecosystem</a></li>
              <li><a href="#packages" className="hover:text-[#e4c568] transition-colors">Packages</a></li>
              <li><Link to="/login" className="hover:text-[#e4c568] transition-colors">Member Login</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-lg mb-4 border-b border-[#2d3748] pb-2 inline-block">Support Info</h3>
            <p className="text-sm mb-2 font-medium">Email: <span className="text-[#e4c568]">support@worldfinance24.online</span></p>
            <p className="text-sm font-medium">Mon - Sat: 10:00 AM - 6:00 PM</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-[#2d3748] pt-6 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>&copy; {new Date().getFullYear()} worldfinance24. All Rights Reserved.</p>
          <p className="mt-2 md:mt-0 text-gray-500">Secured via 256-Bit SSL Encryption.</p>
        </div>
      </footer>

    </div>
  );
};

// Check Icon Component Helper
const CheckIcon = () => (
  <svg className="w-4 h-4 text-[#00ff88]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

export default Home;