import React, { useState, useEffect } from "react";
import "./Header.css";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <span className="logo-text">SUPPORA</span>
            <span className="logo-dot"></span>
          </div>

          <nav className={`nav ${isMobileMenuOpen ? "nav-open" : ""}`}>
            <ul className="nav-list">
              <li>
                <a href="#home" onClick={() => scrollToSection("home")}>
                  Главная
                </a>
              </li>
              <li>
                <a href="#about" onClick={() => scrollToSection("about")}>
                  О нас
                </a>
              </li>
              <li>
                <a href="#services" onClick={() => scrollToSection("services")}>
                  Услуги
                </a>
              </li>
              <li>
                <a
                  href="#advantages"
                  onClick={() => scrollToSection("advantages")}
                >
                  Преимущества
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  onClick={() => scrollToSection("testimonials")}
                >
                  Отзывы
                </a>
              </li>
              <li>
                <a href="#contact" onClick={() => scrollToSection("contact")}>
                  Контакты
                </a>
              </li>
            </ul>
          </nav>

          <div className="header-actions">
            <button
              className="btn btn-primary"
              onClick={() => scrollToSection("contact")}
            >
              Получить консультацию
            </button>

            <button
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
