import 'aos/dist/aos.css';
import { useEffect } from 'react';


export default function Map(){

  const style={
    width:"100%",
    height:"450px",
    style:"border:0",
    allowfullscreen:"",
    loading:"lazy",
    referrerpolicy:"no-referrer-when-downgrade"
  }

  useEffect(() => {
    AOS.init({
        // Initialize AOS options here
    });
}, []);

  return(
    <div data-aos="fade-up">
      <iframe style={style} src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3568.4438918446376!2d83.75435658044657!3d26.570127517170167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3993dd00652acd75%3A0x6415d834129bf35f!2sParmeshwar%20Rath!5e0!3m2!1sen!2sin!4v1708059764055!5m2!1sen!2sin"></iframe>
    </div>
  )
}