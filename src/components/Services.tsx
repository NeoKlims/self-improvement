import React from "react";
import "./Services.css";

const Services: React.FC = () => {
  const services = [
    {
      icon: "📞",
      title: "Клиентская поддержка",
      description: "Профессиональная поддержка клиентов 24/7 на любом языке",
      features: [
        "Многоязычная поддержка",
        "Быстрое время отклика",
        "CRM интеграция",
      ],
    },
    {
      icon: "📊",
      title: "Обработка данных",
      description: "Автоматизация обработки и анализа больших объемов данных",
      features: [
        "Автоматизация процессов",
        "Аналитика в реальном времени",
        "Безопасность данных",
      ],
    },
    {
      icon: "💰",
      title: "Финансовые услуги",
      description: "Аутсорсинг бухгалтерских и финансовых операций",
      features: [
        "Ведение учета",
        "Финансовая отчетность",
        "Налоговое планирование",
      ],
    },
    {
      icon: "📝",
      title: "HR процессы",
      description: "Полный цикл управления человеческими ресурсами",
      features: ["Подбор персонала", "Обработка документов", "Расчет зарплат"],
    },
    {
      icon: "🛒",
      title: "E-commerce поддержка",
      description: "Комплексная поддержка интернет-магазинов и платформ",
      features: ["Обработка заказов", "Управление складом", "Логистика"],
    },
    {
      icon: "🔧",
      title: "IT аутсорсинг",
      description: "Техническая поддержка и разработка IT-решений",
      features: ["Техподдержка", "Разработка ПО", "Облачные решения"],
    },
  ];

  return (
    <section id="services" className="services">
      <div className="container">
        <div className="section-title animate-fade-in-up">
          <h2>Наши услуги</h2>
          <p>
            Полный спектр BPO-услуг для оптимизации вашего бизнеса и повышения
            эффективности работы
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div
              key={index}
              className={`service-card animate-fade-in-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="service-icon">
                <span className="icon-emoji">{service.icon}</span>
              </div>
              <div className="service-content">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul className="service-features">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>{feature}</li>
                  ))}
                </ul>
              </div>
              <div className="service-footer">
                <button className="btn btn-secondary">Подробнее</button>
              </div>
            </div>
          ))}
        </div>

        <div className="services-cta animate-fade-in-up">
          <div className="cta-content">
            <h3>Нужна индивидуальная консультация?</h3>
            <p>
              Наши эксперты помогут подобрать оптимальное решение для вашего
              бизнеса
            </p>
            <button className="btn btn-primary">Заказать консультацию</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
