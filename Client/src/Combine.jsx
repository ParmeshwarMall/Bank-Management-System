import React from 'react';
import Navbar from "./Navbar";
import Body from "./Body";
import Footer from './Footer';
import Map from './Map';



export default function Combine() {
    return (
        <div>
            <Navbar />
            <Body />
            <Map/>
            <Footer />
        </div>
    )
}