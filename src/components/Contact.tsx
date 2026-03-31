import React, { useState } from "react";
import "./Contact.css";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    service: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        service: "",
        message: "",
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: "📧",
      title: "Email",
      value: "info@suppora.com",
      description: "Напишите нам в любое время",
    },
    {
      icon: "📞",
      title: "Телефон",
      value: "+7 (495) 123-45-67",
      description: "Пн-Пт с 9:00 до 18:00",
    },
    {
      icon: "📍",
      title: "Адрес",
      value: "Москва, ул. Примерная, 123",
      description: "Офис в центре города",
    },
    {
      icon: "💬",
      title: "Telegram",
      value: "@suppora_support",
      description: "Быстрая связь 24/7",
    },
  ];

  const services = [
    "Клиентская поддержка",
    "Обработка данных",
    "Финансовые услуги",
    "HR процессы",
    "E-commerce поддержка",
    "IT аутсорсинг",
    "Другое",
  ];

  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="section-title animate-fade-in-up">
          <h2>Свяжитесь с нами</h2>
          <p>
            Готовы начать сотрудничество? Оставьте заявку и мы свяжемся с вами в
            течение часа
          </p>
        </div>

        <div className="contact-content">
          <div className="contact-info animate-fade-in-left">
            <h3>Контактная информация</h3>
            <p>
              Мы всегда готовы ответить на ваши вопросы и обсудить возможности
              сотрудничества. Выберите удобный способ связи.
            </p>

            <div className="contact-methods">
              {contactInfo.map((info, index) => (
                <div key={index} className="contact-method">
                  <div className="method-icon">
                    <span className="icon-emoji">{info.icon}</span>
                  </div>
                  <div className="method-content">
                    <h4>{info.title}</h4>
                    <p className="method-value">{info.value}</p>
                    <p className="method-description">{info.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="contact-cta">
              <h4>Нужна срочная консультация?</h4>
              <p>Звоните прямо сейчас!</p>
              <a href="tel:+74951234567" className="btn btn-primary">
                Позвонить сейчас
              </a>
            </div>
          </div>

          <div className="contact-form-container animate-fade-in-right">
            <div className="contact-form-card">
              <div className="form-header">
                <h3>Оставить заявку</h3>
                <p>Заполните форму и мы свяжемся с вами</p>
              </div>

              {isSubmitted ? (
                <div className="form-success">
                  <div className="success-icon">✓</div>
                  <h4>Заявка отправлена!</h4>
                  <p>
                    Спасибо за обращение. Мы свяжемся с вами в течение часа.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Имя *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Ваше имя"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="company">Компания</label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Название компании"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Телефон</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+7 (999) 123-45-67"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="service">Интересующая услуга</label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                    >
                      <option value="">Выберите услугу</option>
                      {services.map((service, index) => (
                        <option key={index} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Сообщение *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      placeholder="Расскажите о ваших потребностях..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary form-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Отправляем..." : "Отправить заявку"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
