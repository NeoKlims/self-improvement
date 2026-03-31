import React from "react";
import "./Footer.css";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "О компании", href: "#about" },
      { name: "Услуги", href: "#services" },
      { name: "Преимущества", href: "#advantages" },
      { name: "Отзывы", href: "#testimonials" },
    ],
    services: [
      { name: "Клиентская поддержка", href: "#" },
      { name: "Обработка данных", href: "#" },
      { name: "Финансовые услуги", href: "#" },
      { name: "HR процессы", href: "#" },
    ],
    support: [
      { name: "Контакты", href: "#contact" },
      { name: "Техподдержка", href: "#" },
      { name: "Документация", href: "#" },
      { name: "FAQ", href: "#" },
    ],
  };

  const socialLinks = [
    { name: "Telegram", icon: "📱", href: "#" },
    { name: "WhatsApp", icon: "💬", href: "#" },
    { name: "LinkedIn", icon: "💼", href: "#" },
    { name: "Email", icon: "📧", href: "mailto:info@suppora.com" },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-text">SUPPORA</span>
              <span className="logo-dot"></span>
            </div>
            <p className="footer-description">
              Ваш надежный партнер в сфере BPO-услуг. Оптимизируем
              бизнес-процессы для повышения эффективности и снижения затрат.
            </p>
            <div className="footer-social">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="social-link"
                  aria-label={social.name}
                >
                  <span className="social-icon">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="footer-links">
            <div className="link-group">
              <h4>Компания</h4>
              <ul>
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(link.href.replace("#", ""));
                      }}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="link-group">
              <h4>Услуги</h4>
              <ul>
                {footerLinks.services.map((link, index) => (
                  <li key={index}>
                    <a href={link.href}>{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="link-group">
              <h4>Поддержка</h4>
              <ul>
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        if (link.href.startsWith("#")) {
                          e.preventDefault();
                          scrollToSection(link.href.replace("#", ""));
                        }
                      }}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="footer-contact">
            <h4>Контакты</h4>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <span>info@suppora.com</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span>+7 (495) 123-45-67</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span>Москва, ул. Примерная, 123</span>
              </div>
            </div>

            <div className="footer-cta">
              <button
                className="btn btn-primary"
                onClick={() => scrollToSection("contact")}
              >
                Получить консультацию
              </button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} SUPPORA. Все права защищены.
            </p>
            <div className="footer-legal">
              <a href="#">Политика конфиденциальности</a>
              <a href="#">Условия использования</a>
              <a href="#">Пользовательское соглашение</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
