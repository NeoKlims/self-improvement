import React from "react";
import "./Advantages.css";

const Advantages: React.FC = () => {
  const advantages = [
    {
      number: "01",
      title: "Снижение затрат",
      description:
        "Экономия до 30% операционных расходов за счет оптимизации процессов",
      icon: "💰",
    },
    {
      number: "02",
      title: "Повышение эффективности",
      description:
        "Увеличение производительности на 40% благодаря автоматизации",
      icon: "⚡",
    },
    {
      number: "03",
      title: "Масштабируемость",
      description: "Гибкие решения, которые растут вместе с вашим бизнесом",
      icon: "📈",
    },
    {
      number: "04",
      title: "24/7 поддержка",
      description: "Круглосуточная техническая поддержка и мониторинг",
      icon: "🛡️",
    },
    {
      number: "05",
      title: "Безопасность данных",
      description:
        "Соблюдение всех стандартов безопасности и защиты информации",
      icon: "🔒",
    },
    {
      number: "06",
      title: "Быстрое внедрение",
      description:
        "Запуск проектов в течение 2-4 недель с минимальными рисками",
      icon: "🚀",
    },
  ];

  const stats = [
    { value: "500+", label: "Довольных клиентов" },
    { value: "30%", label: "Средняя экономия" },
    { value: "99.9%", label: "Uptime сервисов" },
    { value: "24/7", label: "Поддержка" },
  ];

  return (
    <section id="advantages" className="advantages">
      <div className="container">
        <div className="section-title animate-fade-in-up">
          <h2>Почему выбирают SUPPORA</h2>
          <p>
            Мы предоставляем комплексные решения, которые помогают компаниям
            достигать новых высот в эффективности
          </p>
        </div>

        <div className="advantages-content">
          <div className="advantages-grid">
            {advantages.map((advantage, index) => (
              <div
                key={index}
                className={`advantage-card animate-fade-in-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="advantage-number">{advantage.number}</div>
                <div className="advantage-icon">
                  <span className="icon-emoji">{advantage.icon}</span>
                </div>
                <div className="advantage-content">
                  <h3>{advantage.title}</h3>
                  <p>{advantage.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="advantages-stats animate-fade-in-up">
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="advantages-cta animate-fade-in-up">
          <div className="cta-card">
            <div className="cta-content">
              <h3>Готовы начать экономить?</h3>
              <p>
                Получите бесплатную консультацию и узнайте, сколько вы можете
                сэкономить
              </p>
              <div className="cta-actions">
                <button className="btn btn-primary">
                  Получить консультацию
                </button>
                <button className="btn btn-secondary">Скачать кейсы</button>
              </div>
            </div>
            <div className="cta-visual">
              <div className="chart-container">
                <div className="chart-bar" style={{ height: "60%" }}>
                  <span className="chart-label">До</span>
                </div>
                <div className="chart-bar active" style={{ height: "40%" }}>
                  <span className="chart-label">После</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Advantages;
