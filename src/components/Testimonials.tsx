import React, { useState } from "react";
import "./Testimonials.css";

const Testimonials: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Александр Петров",
      position: "CEO, TechCorp",
      company: "Технологическая компания",
      avatar: "👨‍💼",
      rating: 5,
      text: "SUPPORA помогла нам снизить операционные расходы на 35% и значительно повысить качество клиентского сервиса. Профессиональная команда и отличные результаты.",
      results: [
        "-35% расходов",
        "+50% удовлетворенность клиентов",
        "24/7 поддержка",
      ],
    },
    {
      name: "Мария Сидорова",
      position: "Директор по развитию, RetailPlus",
      company: "Розничная сеть",
      avatar: "👩‍💼",
      rating: 5,
      text: "Благодаря аутсорсингу HR-процессов мы смогли сосредоточиться на стратегическом развитии. SUPPORA обеспечивает высокое качество и надежность.",
      results: [
        "-60% времени на HR",
        "+40% эффективность",
        "100% соответствие стандартам",
      ],
    },
    {
      name: "Дмитрий Козлов",
      position: "Финансовый директор, FinanceGroup",
      company: "Финансовая группа",
      avatar: "👨‍💻",
      rating: 5,
      text: "Отличная работа с финансовыми процессами. Автоматизация и оптимизация помогли нам сократить время обработки документов в 3 раза.",
      results: [
        "-70% время обработки",
        "+90% точность",
        "Полная автоматизация",
      ],
    },
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const {
    avatar,
    name,
    position,
    company,
    rating,
    text,
    results,
  } = testimonials[currentTestimonial];

  return (
    <section id="testimonials" className="testimonials">
      <div className="container">
        <div className="section-title animate-fade-in-up">
          <h2>Отзывы наших клиентов</h2>
          <p>
            Более 500 компаний доверяют нам оптимизацию своих бизнес-процессов
          </p>
        </div>

        <div className="testimonials-content">
          <div className="testimonial-card animate-fade-in-up">
            <div className="testimonial-header">
              <div className="testimonial-avatar">
                <span className="avatar-emoji">{avatar}</span>
              </div>
              <div className="testimonial-info">
                <h3>{name}</h3>
                <p className="position">{position}</p>
                <p className="company">{company}</p>
                <div className="rating">
                  {[...Array(rating)].map((_, i) => (
                    <span key={i} className="star">
                      ⭐
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="testimonial-content">
              <blockquote>"{text}"</blockquote>

              <div className="testimonial-results">
                <h4>Достигнутые результаты:</h4>
                <div className="results-grid">
                  {results.map((result, index) => (
                    <div key={index} className="result-item">
                      <span className="result-icon">✓</span>
                      <span className="result-text">{result}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="testimonial-controls">
            <button
              className="control-btn prev"
              onClick={prevTestimonial}
              aria-label="Previous testimonial"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="testimonial-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentTestimonial ? "active" : ""}`}
                  onClick={() => setCurrentTestimonial(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              className="control-btn next"
              onClick={nextTestimonial}
              aria-label="Next testimonial"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="testimonials-stats animate-fade-in-up">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <div className="stat-value">4.9/5</div>
                <div className="stat-label">Средняя оценка</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <div className="stat-value">500+</div>
                <div className="stat-label">Довольных клиентов</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🔄</div>
              <div className="stat-content">
                <div className="stat-value">95%</div>
                <div className="stat-label">Повторных обращений</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">⚡</div>
              <div className="stat-content">
                <div className="stat-value">24ч</div>
                <div className="stat-label">Среднее время ответа</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
