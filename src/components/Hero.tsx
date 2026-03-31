import React from "react";
import "./Hero.css";

const Hero: React.FC = () => {
  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="hero">
      <div className="hero-background">
        <div className="hero-gradient"></div>
        <div className="hero-particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
        <div className="hero-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
          <div className="shape shape-6"></div>
        </div>
        <div className="hero-lights">
          <div className="light light-1"></div>
          <div className="light light-2"></div>
          <div className="light light-3"></div>
        </div>
        <div className="hero-grid"></div>
      </div>

      <div className="container">
        <div className="hero-content">
          <div className="hero-text animate-fade-in-left">
            <h1 className="hero-title">
              Оптимизируйте бизнес-процессы с{" "}
              <span className="gradient-text">SUPPORA</span>
            </h1>
            <p className="hero-subtitle">
              Профессиональные BPO-решения для повышения эффективности вашего
              бизнеса. Снижаем операционные расходы до 30% и ускоряем развитие.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Довольных клиентов</span>
              </div>
              <div className="stat">
                <span className="stat-number">5+</span>
                <span className="stat-label">Лет опыта</span>
              </div>
              <div className="stat">
                <span className="stat-number">30%</span>
                <span className="stat-label">Экономия затрат</span>
              </div>
            </div>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={scrollToContact}>
                Получить консультацию
              </button>
              <button className="btn btn-secondary">Скачать презентацию</button>
            </div>
          </div>

          <div className="hero-visual animate-fade-in-right">
            <div className="hero-card">
              <div className="card-header">
                <div className="card-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <h3>SUPPORA Dashboard</h3>
              </div>
              <div className="card-content">
                <div className="metric">
                  <span className="metric-label">Эффективность</span>
                  <span className="metric-value">+45%</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Экономия</span>
                  <span className="metric-value">$2.5M</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Время обработки</span>
                  <span className="metric-value">-60%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
