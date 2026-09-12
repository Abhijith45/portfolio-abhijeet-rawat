import React from 'react';
import HeroSection from '../../sections/HeroSection';
import ServicesSection from '../../sections/ServicesSection';
import ProjectsSection from '../../sections/ProjectsSection';
import TechStackSection from '../../sections/TechStackSection';
import ReviewSection from '../../sections/ReviewSection';

const Home = () => {
    return (
        <>
            <HeroSection />
            <ServicesSection />
            <ProjectsSection />
            <TechStackSection />
            <ReviewSection />
        </>
    );
};

export default Home;
