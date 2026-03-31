import React from "react";
import "./About.css";

const About: React.FC = () => {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="section-title animate-fade-in-up">
          <h2>О компании SUPPORA</h2>
          <p>
            Мы — команда профессионалов, специализирующаяся на оптимизации
            бизнес-процессов и аутсорсинге для компаний любого масштаба
          </p>
        </div>

        <div className="about-content">
          <div className="about-text animate-fade-in-left">
            <div className="about-features">
              <div className="feature">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="feature-content">
                  <h3>Надежность</h3>
                  <p>
                    Гарантируем высокое качество услуг и соблюдение всех
                    договорных обязательств
                  </p>
                </div>
              </div>

              <div className="feature">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="feature-content">
                  <h3>Скорость</h3>
                  <p>
                    Быстрое внедрение решений и адаптация под потребности вашего
                    бизнеса
                  </p>
                </div>
              </div>

              <div className="feature">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="feature-content">
                  <h3>Качество</h3>
                  <p>
                    Используем современные технологии и лучшие практики в
                    области BPO
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="about-visual animate-fade-in-right">
            <div className="about-card">
              <div className="card-header">
                <h3>Наша миссия</h3>
              </div>
              <div className="card-content">
                <p>
                  Помогаем компаниям достигать максимальной эффективности через
                  оптимизацию бизнес-процессов и профессиональный аутсорсинг.
                </p>
                <div className="mission-stats">
                  <div className="mission-stat">
                    <span className="stat-number">500+</span>
                    <span className="stat-label">Проектов</span>
                  </div>
                  <div className="mission-stat">
                    <span className="stat-number">50+</span>
                    <span className="stat-label">Специалистов</span>
                  </div>
                  <div className="mission-stat">
                    <span className="stat-number">24/7</span>
                    <span className="stat-label">Поддержка</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="values">
              <h4>Наши ценности</h4>
              <ul>
                <li>Прозрачность в работе</li>
                <li>Индивидуальный подход</li>
                <li>Непрерывное развитие</li>
                <li>Клиентоориентированность</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
