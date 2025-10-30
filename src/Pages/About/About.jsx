import React from 'react';
import './About.css';

const About = () => {
  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: "Faculty Mentor",
      department: "Computer Science",
      image: "👩‍🏫",
      description: "Guiding students towards academic excellence"
    },
    {
      name: "Prof. Michael Chen",
      role: "Faculty Mentor", 
      department: "Mathematics",
      image: "👨‍🏫",
      description: "Promoting collaborative learning in STEM"
    },
    {
      name: "Emily Rodriguez",
      role: "Student Developer",
      department: "Computer Science",
      image: "👩‍💻",
      description: "Full-stack development and UI/UX design"
    },
    {
      name: "Alex Kumar",
      role: "Student Developer",
      department: "Information Technology",
      image: "👨‍💻", 
      description: "Backend development and database management"
    }
  ];

  const differentiators = [
    {
      icon: "🎯",
      title: "Academic-Focused",
      description: "Specifically designed for academic resources with proper categorization by year, semester, and subject"
    },
    {
      icon: "👥",
      title: "Community-Driven",
      description: "Built by students, for students, with faculty guidance and peer-to-peer knowledge sharing"
    },
    {
      icon: "🔒",
      title: "Secure Uploads",
      description: "Safe and secure file sharing with moderation and quality control mechanisms"
    },
    {
      icon: "📊",
      title: "Semester-Based Organization",
      description: "Intelligent organization system based on academic structure and examination cycles"
    },
    {
      icon: "⚡",
      title: "Fast & Reliable",
      description: "Quick search, instant downloads, and reliable availability of academic resources"
    },
    {
      icon: "🌟",
      title: "Quality Content",
      description: "Community-rated content with upvoting system and quality assurance"
    }
  ];

  const howItWorksSteps = [
    {
      step: "1",
      title: "Sign Up",
      description: "Create your account with your academic details. Choose your role as Student or Faculty member.",
      icon: "📝"
    },
    {
      step: "2", 
      title: "Browse & Upload",
      description: "Explore thousands of study materials or contribute by uploading your own notes, assignments, and projects.",
      icon: "📚"
    },
    {
      step: "3",
      title: "Share Knowledge",
      description: "Download resources you need, participate in discussions, and help your peers succeed academically.",
      icon: "🤝"
    }
  ];

  return (
    <div className="about-page">
      <div className="container">
        {/* Hero Section */}
        <div className="about-hero">
          <h1>About Notezilla</h1>
          <p className="hero-subtitle">
            Empowering academic success through collaborative learning and resource sharing
          </p>
        </div>

        {/* Mission Statement */}
        <section className="mission-section">
          <div className="section-content">
            <h2>Our Mission</h2>
            <div className="mission-content">
              <div className="mission-text">
                <p>
                  At Notezilla, we believe that knowledge shared is knowledge multiplied. Our mission is to create 
                  a comprehensive, peer-to-peer academic resource sharing platform that breaks down barriers to 
                  educational content and fosters collaborative learning among students.
                </p>
                <p>
                  We strive to build a community where students can access high-quality study materials, 
                  share their knowledge, and support each other's academic journey. By connecting learners 
                  across different disciplines and academic levels, we aim to democratize access to educational 
                  resources and promote academic excellence.
                </p>
              </div>
              <div className="mission-visual">
                <div className="mission-icon">🎓</div>
                <div className="mission-stats">
                  <div className="stat">
                    <div className="stat-number">10,000+</div>
                    <div className="stat-label">Resources Shared</div>
                  </div>
                  <div className="stat">
                    <div className="stat-number">5,000+</div>
                    <div className="stat-label">Active Students</div>
                  </div>
                  <div className="stat">
                    <div className="stat-number">100+</div>
                    <div className="stat-label">Faculty Members</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="how-it-works-section">
          <div className="section-content">
            <h2>How Notezilla Works</h2>
            <p className="section-subtitle">
              Getting started with Notezilla is simple and straightforward
            </p>
            <div className="steps-container">
              {howItWorksSteps.map((step, index) => (
                <div key={index} className="step-card">
                  <div className="step-icon">{step.icon}</div>
                  <div className="step-number">{step.step}</div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Differentiators */}
        <section className="differentiators-section">
          <div className="section-content">
            <h2>What Makes Us Different</h2>
            <p className="section-subtitle">
              Notezilla is designed specifically for academic success
            </p>
            <div className="differentiators-grid">
              {differentiators.map((item, index) => (
                <div key={index} className="differentiator-card">
                  <div className="differentiator-icon">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <div className="section-content">
            <h2>Our Team</h2>
            <p className="section-subtitle">
              Meet the dedicated individuals behind Notezilla
            </p>
            <div className="team-grid">
              {teamMembers.map((member, index) => (
                <div key={index} className="team-member-card">
                  <div className="member-avatar">{member.image}</div>
                  <h3>{member.name}</h3>
                  <div className="member-role">{member.role}</div>
                  <div className="member-department">{member.department}</div>
                  <p className="member-description">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="values-section">
          <div className="section-content">
            <h2>Our Values</h2>
            <div className="values-grid">
              <div className="value-card">
                <h3>🤝 Collaboration</h3>
                <p>We believe in the power of working together and sharing knowledge to achieve common academic goals.</p>
              </div>
              <div className="value-card">
                <h3>🔍 Quality</h3>
                <p>We maintain high standards for all content shared on our platform to ensure educational value.</p>
              </div>
              <div className="value-card">
                <h3>🌟 Innovation</h3>
                <p>We continuously innovate to provide the best possible experience for our academic community.</p>
              </div>
              <div className="value-card">
                <h3>🎯 Accessibility</h3>
                <p>We strive to make educational resources accessible to all students, regardless of their background.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Join the Notezilla Community</h2>
            <p>
              Ready to enhance your academic journey? Join thousands of students and faculty 
              members who are already benefiting from collaborative learning.
            </p>
            <div className="cta-buttons">
              <button className="cta-btn primary">Get Started Today</button>
              <button className="cta-btn secondary">Learn More</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;