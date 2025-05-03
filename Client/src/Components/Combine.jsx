import React from "react";
import Navbar from "./Navbar";
import Body from "./Body";
import Footer from "./Footer";

export default function Combine(props) {
  return (
    <div>
      <Navbar />
      <Body api={props.api} />
      <Footer />
    </div>
  );
}
