import "../../public/CSS/Footer.css";
import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-about">
            <h2>About Us</h2>
            <p>
              We are dedicated to providing the best services and products to
              our customers. Our goal is to bring satisfaction and value through
              innovation and quality.
            </p>
          </div>

          <div className="footer-links">
            <h2>Quick Links</h2>
            <ul>
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              <li>
                <NavLink to="/services">Services</NavLink>
              </li>
              <li>
                <NavLink to="/about">About Us</NavLink>
              </li>
              <li>
                <NavLink to="/contact">Contact Us</NavLink>
              </li>
            </ul>
          </div>

          <div className="footer-social">
            <h2>Follow Us</h2>
            <ul className="social-links">
              <li>
                <a href="https://facebook.com" target="_blank" rel="noreferrer">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noreferrer">
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-contact">
            <h2>Contact Us</h2>
            <p>123 Main St, City, Country</p>
            <p>Email: info@example.com</p>
            <p>Phone: +123 456 7890</p>
          </div>
        </div>
      </footer>
      <div className="footerBottom">
        <h4 className="creater">Design and Develop By Parmeshwar Mall</h4>
        <h6 className="copyright">
          &copy; {new Date().getFullYear()} www.onlinebanking.com. All Rights
          Reserved
        </h6>
      </div>
    </>
  );
}
