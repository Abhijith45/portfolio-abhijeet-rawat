import React from 'react';
import useSEO from '../../hooks/useSEO';
import CyberContactSection from '../../sections/CyberContactSection';

const Contact = () => {
    useSEO({
        title: 'Contact Abhijeet Rawat — Hire a Full Stack Developer in Noida, India',
        description:
            'Get in touch with Abhijeet Rawat — Full Stack Developer available for full-time roles, freelance projects, and collaborations. Based in Noida, open to opportunities in Gurugram, Jaipur, and remote across India.',
        canonical: 'https://abhijeet-rawat-portfolio.netlify.app/contact',
        keywords:
            'Hire Full Stack Developer India, Contact Abhijeet Rawat, MERN Developer for Hire, React Node.js Developer Noida, Freelance Web Developer India, Backend Developer for Hire',
    });

    return (
        <>
            {/* Cyberpunk Contact Redesign Section */}
            <CyberContactSection />
        </>
    );
};

export default Contact;

