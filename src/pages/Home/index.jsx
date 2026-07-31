import React from 'react';
import HeroSection from '../../sections/HeroSection';
import ServicesSection from '../../sections/ServicesSection';
import ProjectsSection from '../../sections/ProjectsSection';
import TechStackSection from '../../sections/TechStackSection';

const Home = () => {
    return (
        <>
            <HeroSection />
            <ServicesSection />
            {/* <ProjectsSection /> */}
            <TechStackSection />
        </>
    );
};

export default Home;
