import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import "../public/CSS/Navbar.css";

export default function Navbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add("mobile-menu-open");
    } else {
      document.body.classList.remove("mobile-menu-open");
    }
  }, [isMobileMenuOpen]);

  return (
    <div className="navBar">
      <img src="/logo.jpg" alt="" class="logo-poster" />
      <div className={`items ${isMobileMenuOpen ? "active" : ""}`}>
        <ul className={`nav-items ${isMobileMenuOpen ? "active" : ""}`}>
          <li className="item">
            <i class="far fa-snowflake"></i>
          </li>
          <li className="item">
            <Button variant="outlined" size="small" href="/" id="btn" onClick={toggleMobileMenu}>
              Home
            </Button>
          </li>
          <li className="item">
            <Button variant="outlined" size="small" href="/about" id="btn" onClick={toggleMobileMenu}>
              About us
            </Button>
          </li>
          <li className="item">
            {" "}
            <Button variant="outlined" size="small" href="/services" id="btn" onClick={toggleMobileMenu}>
              Services
            </Button>
          </li>
          <li className="item">
            <Button variant="outlined" size="small" href="/contact" id="btn" onClick={toggleMobileMenu}>
              Contact us
            </Button>
          </li>
          <li className="item">
            <i class="far fa-snowflake"></i>
          </li>
        </ul>
      </div>
      <div className="nav-logo">
        <img src="/logo3.png" alt="" className="logo3" />
        <img src="/logo2.png" alt="" className="logoposter2" />
      </div>
      <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </div>
    </div>
  );
}
