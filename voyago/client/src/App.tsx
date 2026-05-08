import React, { useState } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import StatsStrip from './components/StatsStrip';
import PlannerSection from './components/PlannerSection';
import DestinationsGrid from './components/DestinationsGrid';
import FeaturesGrid from './components/FeaturesGrid';
import RealTimeAlerts from './components/RealTimeAlerts';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';

export default function App() {
  const [prefilledDestination, setPrefilledDestination] = useState('');

  const scrollToPlanner = () =>
    document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' });

  const handleDestinationSelect = (dest: string) => {
    setPrefilledDestination(dest);
    setTimeout(() => document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  return (
    <div className="min-h-screen">
      <Nav />
      <Hero onStartPlanning={scrollToPlanner} />
      <StatsStrip />
      <PlannerSection prefilledDestination={prefilledDestination} />
      <DestinationsGrid onDestinationSelect={handleDestinationSelect} />
      <FeaturesGrid />
      <RealTimeAlerts />
      <Testimonials />
      <Footer />
    </div>
  );
}
