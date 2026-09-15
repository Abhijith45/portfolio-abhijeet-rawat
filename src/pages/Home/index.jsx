import React from 'react';
import useSEO from '../../hooks/useSEO';
import HeroSection from '../../sections/HeroSection';
import ApproachSection from '../../sections/ApproachSection';
import ProjectsSection from '../../sections/ProjectsSection';
import TechStackSection from '../../sections/TechStackSection';
import ReviewSection from '../../sections/ReviewSection';

const Home = () => {
    useSEO({
        title: 'Abhijeet Rawat | Full Stack Developer — React, Node.js, MERN | Noida, India',
        description:
            'Abhijeet Rawat is a Full Stack Developer with 1.5+ years of experience building MERN stack applications, REST APIs, SaaS platforms, and automation tools. Available for software engineering roles in Noida, Gurugram, Jaipur, and remote across India.',
        canonical: 'https://abhijeet-rawat-portfolio.netlify.app/',
        keywords:
            'Full Stack Developer Noida, MERN Stack Developer India, React Developer, Node.js Developer, Backend Developer, Junior Software Developer, REST API Developer, MongoDB, JavaScript, Web Developer India, Abhijeet Rawat',
    });

    return (
        <>
            <HeroSection />
            <ApproachSection />
            <ProjectsSection />
            <TechStackSection />
            <ReviewSection />
        </>
    );
};

export default Home;

