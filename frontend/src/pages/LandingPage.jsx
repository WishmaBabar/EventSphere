import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, BarChart3, Users, ArrowRight, CheckCircle2, Zap } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-500/10 blur-[120px] animate-morph pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-500/10 blur-[120px] animate-morph pointer-events-none" />

        <div className="container relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8">
            <Zap className="w-4 h-4 text-indigo-400" />
            <span>Next-Gen Event Management is Here</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-heading font-black mb-8 leading-[1.1] tracking-tight">
            The World's Most <br />
            <span className="text-gradient">Premium</span> Event Hub
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-body">
            Streamline your event management with cutting-edge analytics, secure registration, and a flawless user experience. Built for the modern professional.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="btn-premium group">
              Get Started Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="px-8 py-3 rounded-lg border border-white/10 hover:bg-white/5 transition-all text-sm font-semibold">
              Live Demo
            </Link>
          </div>

          {/* Feature Bento Grid Reveal */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="card-premium group">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
                <Shield className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Enterprise Security</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Atomic overbooking prevention and JWT-secured transactions keep your attendees safe and your data intact.
              </p>
            </div>

            <div className="card-premium group">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center mb-6 border border-rose-500/20 group-hover:bg-rose-500/20 transition-colors">
                <BarChart3 className="w-6 h-6 text-rose-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Deep Analytics</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Gain real-time insights into registration trends, attendee demographics, and event performance metrics.
              </p>
            </div>

            <div className="card-premium group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-6 border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-colors">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Seamless Networking</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Connect organizers and attendees with a system designed for maximum engagement and minimal friction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-deep relative overflow-hidden">
        <div className="container relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-black mb-4">Precision Pricing</h2>
            <p className="text-slate-400">Scale your events from meetups to global summits.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="p-8 rounded-2xl border border-white/5 bg-black/40 backdrop-blur-sm flex flex-col">
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-2">Starter</h3>
              <div className="text-4xl font-black mb-6">PKR 0 <span className="text-lg font-normal text-slate-500">/mo</span></div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Up to 50 attendees
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Basic event list
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Email support
                </li>
              </ul>
              <button className="w-full py-3 rounded-lg border border-white/10 hover:bg-white/5 transition-all text-sm font-semibold">Join Free</button>
            </div>

            {/* Pro */}
            <div className="p-8 rounded-2xl border-2 border-indigo-500/50 bg-indigo-500/5 backdrop-blur-sm relative flex flex-col transform md:-translate-y-4 shadow-[0_0_50px_rgba(99,102,241,0.15)]">
              <div className="absolute top-0 right-8 -translate-y-1/2 px-3 py-1 bg-indigo-500 text-[10px] font-bold uppercase rounded-full tracking-wider">Most Popular</div>
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-2">Pro</h3>
              <div className="text-4xl font-black mb-6">PKR 49 <span className="text-lg font-normal text-slate-500">/mo</span></div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Unlimited attendees
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Real-time Analytics
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> QR Check-ins
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Priority Support
                </li>
              </ul>
              <button className="btn-premium w-full text-sm">Elevate Now</button>
            </div>

            {/* Enterprise */}
            <div className="p-8 rounded-2xl border border-white/5 bg-black/40 backdrop-blur-sm flex flex-col">
              <h3 className="text-sm font-bold text-rose-400 uppercase tracking-widest mb-2">Enterprise</h3>
              <div className="text-4xl font-black mb-6">Custom</div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Custom branding
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Dedicated Manager
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> SLA Guarantee
                </li>
              </ul>
              <button className="w-full py-3 rounded-lg border border-white/10 hover:bg-white/5 transition-all text-sm font-semibold">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 text-2xl font-black">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-rose-500 rounded-lg flex items-center justify-center text-white">E</div>
            EventSphere
          </div>
          <div className="flex gap-8 text-sm text-slate-500 font-medium">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIN</a>
          </div>
          <div className="text-xs text-slate-600 font-medium">
            Copyright 2026 EventSphere. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
