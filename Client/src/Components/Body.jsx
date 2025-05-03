import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";

import "../../public/CSS/Body.css";

export default function Body(props) {
  let [user, setUser] = useState({
    id: "",
    password: "",
    username: "",
    userpassword: "",
  });
  let name, value;

  let [isLog, setIsLog] = useState(false);
  const [resotp, setResotp] = useState();
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otp, setOtp] = useState();

  const handleInputs = (e) => {
    e.preventDefault;
    name = e.target.name;
    value = e.target.value;

    setUser({ ...user, [name]: value });
  };

  const navigate = useNavigate();

  const adsubmit = async (event) => {
    event.preventDefault();
    setIsLog(true);
    const toastId = toast.loading("Logging in, please wait...", {
      position: "top-center",
    });
    try {
      const res = await axios.post(`${props.api}/admin/login`, user, {
        withCredentials: true,
      });

      toast.dismiss(toastId);

      if (res.data.message === "Login successful") {
        toast.success("Login Successfully", {
          position: "top-center",
          autoClose: 2000,
        });

        navigate("/admdashboard");
      } else {
        setIsLog(false);
        toast.error("Invalid Id or Password!", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (e) {
      toast.dismiss(toastId);
      toast.error("Something went wrong!", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  const otpSend = async (event) => {
    event.preventDefault();
    const toastId = toast.loading("Sending OTP, please wait...", {
      position: "top-center",
    });

    try {
      const res = await axios.post(`${props.api}/user/loginOTP`, user);

      if (res.data.message === "OTP sent successfully") {
        setResotp(res.data.otp);
        setShowOtpPopup(true);
        toast.update(toastId, {
          render: "OTP sent successfully on your registered email id",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        toast.update(toastId, {
          render: res.data || "Failed to send OTP",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      }
    } catch (err) {
      toast.update(toastId, {
        render: "Something went wrong",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
      console.error("OTP Error:", err);
    }
  };

  const ussubmit = async (event) => {
    event.preventDefault();
    const toastId = toast.loading("Logging in, please wait...", {
      position: "top-center",
    });

    try {
      if (otp != resotp) {
        toast.update(toastId, {
          render: "Invalid OTP",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
        return;
      }
      const res = await axios.post(`${props.api}/user/login`, user, {
        withCredentials: true,
      });

      toast.dismiss(toastId);
      if (res.data === "exist") {
        toast.success("Login Successfully", {
          position: "top-center",
          autoClose: 2000,
        });
        navigate("/userdashboard");
      } else {
        toast.error(res.data, { position: "top-center" });
      }
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.message, { position: "top-center", autoClose: 2000 });
      console.log(err);
    }
  };

  useEffect(() => {
    AOS.init({
      // Initialize AOS options here
    });
  }, []);

  const [adpasswordVisible, setAdPasswordVisible] = useState(false);
  const [userpasswordVisible, setUserPasswordVisible] = useState(false);

  const handlePasswordVisibilityToggleAd = () => {
    setAdPasswordVisible(!adpasswordVisible);
  };
  const handlePasswordVisibilityToggleUser = () => {
    setUserPasswordVisible(!userpasswordVisible);
  };

  const [capVal1, setCapVal1] = useState(null);
  const [capVal2, setCapVal2] = useState(null);

  return (
    <div className="main-body-cont">
      <div className="container1">
        <h1 className="mainhead body-head">WELCOME TO BHARAT BANK</h1>
      </div>

      <div className="login">
        <div className="container2">
          <h2 className="heading" style={{ fontSize: "25px" }}>
            For Admin Only
          </h2>
          <form onSubmit={adsubmit}>
            <div class="mb-3">
              <label for="name" class="form-label">
                ID:{" "}
              </label>
              <input
                type="name"
                name="id"
                class="form-control"
                id="name"
                value={user.id}
                autoComplete="off"
                onChange={handleInputs}
                required
              />
              <div id="emailHelp" class="form-text">
                We'll never share your ID with anyone else.
              </div>
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">
                Password:{" "}
              </label>
              <div className="pass-input">
                <input
                  type={adpasswordVisible ? "text" : "password"}
                  name="password"
                  class="form-control"
                  id="password"
                  autoComplete="off"
                  value={user.password}
                  onChange={handleInputs}
                  required
                />
                <button
                  className="eye-icon cursor-pointer"
                  type="button"
                  onClick={handlePasswordVisibilityToggleAd}
                >
                  {adpasswordVisible ? <Eye /> : <EyeOff />}
                </button>
              </div>
            </div>
            <div className="recaptcha-container">
              <ReCAPTCHA
                sitekey="6LeIxdAqAAAAAL7KZ-w6vRReOl-mFlmGkcybGDIS"
                onChange={(val) => setCapVal1(val)}
              />
            </div>
            <br />
            <button
              type="submit"
              class="btn btn-primary"
              disabled={!capVal1 || isLog}
            >
              Login
            </button>
          </form>
        </div>

        <div className="container2">
          <h2 className="heading" style={{ fontSize: "25px" }}>
            For User Only
          </h2>
          <form onSubmit={otpSend}>
            <div class="mb-3">
              <label for="username" class="form-label">
                Username:{" "}
              </label>
              <input
                type="name"
                name="username"
                class="form-control"
                id="username"
                value={user.username}
                autoComplete="off"
                onChange={handleInputs}
                required
              />
              <div id="emailHelp" class="form-text">
                We'll never share your ID with anyone else.
              </div>
            </div>
            <div class="mb-3">
              <label for="userpassword" class="form-label">
                Password:{" "}
              </label>
              <div className="pass-input">
                <input
                  type={userpasswordVisible ? "text" : "password"}
                  name="userpassword"
                  class="form-control"
                  id="userpassword"
                  autoComplete="off"
                  value={user.userpassword}
                  onChange={handleInputs}
                  required
                />
                <a href="/passchg">Forgot Password!</a>
                <button
                  className="eye-icon2 cursor-pointer"
                  type="button"
                  onClick={handlePasswordVisibilityToggleUser}
                >
                  {userpasswordVisible ? <Eye /> : <EyeOff />}
                </button>
              </div>
            </div>
            <div className="recaptcha-container">
              <ReCAPTCHA
                sitekey="6LeIxdAqAAAAAL7KZ-w6vRReOl-mFlmGkcybGDIS"
                onChange={(val) => setCapVal2(val)}
              />
            </div>
            <br />
            <button
              type="submit"
              class="btn btn-primary"
              disabled={!capVal2 || isLog}
            >
              Login
            </button>
          </form>
        </div>
      </div>

      <div>
        {showOtpPopup && (
          <div className="popup">
            <div className="popup-content">
              <h2>Enter OTP</h2>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
              />
              <button onClick={ussubmit}>Submit OTP</button>
              <button onClick={() => setShowOtpPopup(false)}>Close</button>
            </div>
          </div>
        )}
      </div>

      <div className="userform">
        <h3 className="user-form-head">For Open new Account :</h3>
        <NavLink to="/userform">
          <Button variant="outlined" class="accopenbtn">
            Click here
          </Button>
        </NavLink>
      </div>
      <div className="iconcontainer1">
        <i class="fa-solid fa-address-book icons fa-2x"></i>
        <i class="fa-brands fa-whatsapp icons fa-2x"></i>
        <a href="https://www.instagram.com" target="_blank">
          <i
            class="fa-brands fa-square-instagram icons fa-2x"
            style={{ color: "black" }}
          ></i>
        </a>
        <a href="https://www.linkedin.com/feed/" target="_blank">
          <i
            class="fa-brands fa-linkedin icons fa-2x"
            style={{ color: "black" }}
          ></i>
        </a>
        <a href="https://www.youtube.com/" target="_blank">
          <i
            class="fa-brands fa-youtube icons fa-2x"
            style={{ color: "black" }}
          ></i>
        </a>
      </div>
      <div className="iconcontainer2">
        <i class="fa-solid fa-envelope icons fa-2x"></i>
        <a
          href="https://www.google.com/maps/place/Parmeshwar+Rath/@26.5701276,83.7566526,17z/data=!3m1!4b1!4m6!3m5!1s0x3993dd00652acd75:0x6415d834129bf35f!8m2!3d26.5701276!4d83.7592275!16s%2Fg%2F11vkbnp72k?entry=ttu"
          target="_blank"
        >
          <i
            class="fa-solid fa-location-dot icons fa-2x"
            style={{ color: "black" }}
          ></i>
        </a>
        <a href="https://www.twitter.com" target="_blank">
          {" "}
          <i
            class="fa-brands fa-twitter icons fa-2x"
            style={{ color: "black" }}
          ></i>
        </a>
        <i class="fa-solid fa-cloud icons fa-2x"></i>
        <i class="fa-solid fa-user icons fa-2x"></i>
      </div>

      <div className="container4 clearfix">
        <a
          href="https://www.india.gov.in/spotlight/pradhan-mantri-jan-dhan-yojana-pmjdy#tab=tab-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div class="card">
            <img
              src="./img1.jpg"
              class="card-img-top"
              alt="..."
              style={{ height: "250px" }}
            />
            <div class="card-body">
              <p class="card-text">
                Pradhan Mantri Jan Dhan Yojana is a National Mission on
                Financial Inclusion which has an integrated approach to bring
                about comprehensive financial inclusion and provide banking
                services to all households in the country.
              </p>
            </div>
          </div>
        </a>
        <a
          href="https://y20india.in/pm-kisan-samman-nidhi-yojana/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div class="card">
            <img
              src="./img2.jpg"
              class="card-img-top"
              alt="..."
              style={{ height: "250px" }}
            />
            <div class="card-body">
              <p class="card-text">
                Earlier, under the scheme, financial benefit has been provided
                to all Small and Marginal landholder farmer families with total
                cultivable holding upto 2 hectares with a benefit of Rs. 6000
                per annum per family payable in three equal installments, every
                four months.
              </p>
            </div>
          </div>
        </a>
        <a
          href="https://www.nsiindia.gov.in/(S(ydybfl45zqai3z3troeded45))/InternalPage.aspx?Id_Pk=89"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div class="card">
            <img
              src="./img3.jpg"
              class="card-img-top"
              alt="..."
              style={{ height: "250px" }}
            />
            <div class="card-body">
              <p class="card-text">
                The Sukanya Samriddhi Yojana (SSY) is a small deposit scheme by
                the Ministry of Finance exclusively for a girl child. SSY was
                launched by the Hon'ble Prime Minister on 22nd January 2015 as a
                part of the Beti Bachao Beti Padhao campaign.
              </p>
            </div>
          </div>
        </a>
      </div>

      <div className="container5 clearfix" data-aos="fade-up">
        <div className="infoCont">
          <h3 className="aboutImg">Retail</h3>
          <img src="retails-img.jpg" alt="" class="retailImage" />

          <div className="imgInfo">
            <button type="button" class="btn btn-outline-info imgBtn">
              Housing Loan
            </button>
            <button type="button" class="btn btn-outline-info imgBtn">
              Vehicle Loan
            </button>
            <button type="button" class="btn btn-outline-info imgBtn">
              Education Loan
            </button>
            <button type="button" class="btn btn-outline-info imgBtn">
              Loan to Senior Citizens
            </button>
          </div>
        </div>

        <div id="carouselExample" class="carousel slide" data-ride="carousel">
          <div class="carousel-inner">
            <div class="carousel-item active">
              <img
                src="img4.jpg"
                className="carousel-img"
                alt="First slide"
                height="300px"
              />
            </div>
            <div class="carousel-item">
              <img
                src="img5.jpg"
                className="carousel-img"
                alt="Second slide"
                height="300px"
              />
            </div>
            <div class="carousel-item">
              <img
                src="img6.jpg"
                className="carousel-img"
                alt="Third slide"
                height="300px"
              />
            </div>
          </div>
          <button
            class="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="prev"
          >
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
          </button>
          <button
            class="carousel-control-next"
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="next"
          >
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
          </button>
        </div>

        <div className="infoCont">
          <h3 className="aboutImg">MSME</h3>
          <img src="MSME-img_0.jpg" alt="" class="retailImage" />

          <div className="imgInfo">
            <button type="button" class="btn btn-outline-info imgBtn">
              MSME Banking
            </button>
            <button type="button" class="btn btn-outline-info imgBtn">
              Govt Sponsered Scheme
            </button>
            <button type="button" class="btn btn-outline-info imgBtn">
              MSE Loan Policy
            </button>
            <button type="button" class="btn btn-outline-info imgBtn">
              Read More
            </button>
          </div>
        </div>
      </div>

      <div className="container41 clearfix" data-aos="fade-up">
        <a
          href="http://agrilicense.upagriculture.com/pmkisankcc/#/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div class="card">
            <img
              src="./img8.jpg"
              class="card-img-top"
              alt="..."
              style={{ height: "250px" }}
            />
            <div class="card-body">
              <p class="card-text">
                The PM Kisan Credit Cards have now been linked to the Pradhan
                Mantri Kisan Samman Nidhi Yojana. Farmers can seek a loan from
                KCC for up to Rs. 3 lakh at 4% interest rate. Now it is also
                easier for PM Kisan beneficiaries to apply for KCC.
              </p>
            </div>
          </div>
        </a>
        <a
          href="https://www.rbi.org.in/commonperson/English/scripts/FAQs.aspx?Id=1289"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div class="card">
            <img
              src="./img9.jpg"
              class="card-img-top"
              alt="..."
              style={{ height: "250px" }}
            />
            <div class="card-body">
              <p class="card-text">
                A savings account is a type of deposit account provided by banks
                and financial institutions. It allows individuals to deposit and
                store their money while earning a certain rate of interest on
                the deposited amount.
              </p>
            </div>
          </div>
        </a>
        <a
          href="https://www.bitcoin.com/get-started/what-is-bitcoin/#:~:text=Bitcoin%20is%20an%20alternative%20form,they%20live)%2C%20and%20others."
          target="_blank"
          rel="noopener noreferrer"
        >
          <div class="card">
            <img
              src="./img10.jpg"
              class="card-img-top"
              alt="..."
              style={{ height: "250px" }}
            />
            <div class="card-body">
              <p class="card-text">
                Bitcoin (abbreviation: BTC or XBT; sign: ₿) is the first
                decentralized cryptocurrency. Nodes in the peer-to-peer bitcoin
                network verify transactions through cryptography and record them
                in a public distributed ledger, called a blockchain, without
                central oversight.
              </p>
            </div>
          </div>
        </a>
      </div>

      <div className="container51 clearfix" data-aos="fade-up">
        <div className="infoCont">
          <img src="img11.jpg" alt="" class="bankimg" />
        </div>

        <div id="carouselExampleIndicators" class="carousel slide">
          <div class="carousel-indicators">
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="0"
              class="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            ></button>
          </div>
          <div class="carousel-inner">
            <div class="carousel-item active">
              <img
                src="img12.jpg"
                class="d-block carousel-img"
                alt="..."
                style={{ height: "300px" }}
              />
            </div>
            <div class="carousel-item">
              <img
                src="img13.jpg"
                class="d-block carousel-img"
                alt="..."
                style={{ height: "300px" }}
              />
            </div>
            <div class="carousel-item">
              <img
                src="img14.jpg"
                class="d-block carousel-img"
                alt="..."
                style={{ height: "300px" }}
              />
            </div>
          </div>
          <button
            class="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="prev"
          >
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button
            class="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="next"
          >
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>

        <div className="infoCont">
          <img src="img7.jpg" alt="" class="bankimg" />
        </div>
      </div>
    </div>
  );
}
