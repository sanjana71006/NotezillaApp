import React from 'react';
import Hero from '../../components/Hero/Hero';
import Features from '../../components/Features/Features'; // <-- Import
import PopularResources from '../../components/PopularResources/PopularResources';

const Home = () => {
  return (
    <>
      <Hero />
      <Features /> {/* <-- Add it here */}
      <PopularResources />
    </>
  );
};

export default Home;