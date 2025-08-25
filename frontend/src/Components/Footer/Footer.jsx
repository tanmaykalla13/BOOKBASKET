import "./Footer.css";
import logo from "../../assets/logo.png";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="footer">
      <div className="footer-logo">
        <img src={logo} alt="Logo" />
      </div>
      <ul className="footer-links">
        <li>Company</li>
        <li>Products</li>
        <li>Offices</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
      <div className="footer-social-icons">
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <InstagramIcon fontSize="large" />
        </a>
        <a
          href="https://www.pinterest.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Pinterest"
        >
          <PinterestIcon fontSize="large" />
        </a>
        <a
          href="https://wa.me/916376778223"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
        >
          <WhatsAppIcon fontSize="large" />
        </a>
      </div>
      <div className="footer-copyright">
        <hr />
        <p>Copyright © {currentYear} - All Rights Reserved.</p>
        <p>
          ~Made with ❤️ by {" "}
          <a
            href="https://github.com/siddharthj14"
            target="_blank"
            rel="noopener noreferrer"
            title="Visit my GitHub"
            style={{
              textDecoration: "none",
              color: "#000",
              fontWeight: "bold",
            }}
          >
            Siddharth
          </a>
        </p>
      </div>
    </div>
  );
};

export default Footer;
