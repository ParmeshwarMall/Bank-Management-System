import Navbar from "./Navbar"

export default function Contact(){
    return(
        <div>
            <Navbar/>

            <div className="container11">
                <h1 className="conthead">Contact Us</h1>
                <h6 className="conthead">Have questions or need assistance? We're here to help! Feel free to reach out to us through any of the following channels:</h6>

                <h2>Customer Service:</h2>
                <ul>
                    <li><h6>Phone: Call our customer service representatives at <strong>7706811920</strong> during our business hours, <strong>24X7</strong>.</h6></li>
                    <li><h6>Email: Send us an email at <strong>parmeshwarmall64@gmail.com</strong>, and our team will get back to you as soon as possible.</h6></li>
                    <li><h6>Live Chat: Chat with us online through our website during our business hours for real-time support and assistance.</h6></li>
                </ul>

                <h2>Branch Locations:</h2>
                <h6>Visit one of our convenient branch locations to speak with a banking representative in person. Find a branch near you using our branch locator tool.</h6>

                <h2>Social Media:</h2>
                <h6>Stay connected with us on social media for news, updates, and customer support. Follow us on [Facebook/Twitter/LinkedIn] for the latest information and to engage with our community.</h6>

                <h2>Feedback:</h2>
                <h6>We value your feedback and suggestions. Share your thoughts with us by filling out our online feedback form on our website.</h6>
            </div>
        </div>
    )
}