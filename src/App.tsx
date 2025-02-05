import React, { useState, useEffect } from 'react'
import ReactGA from 'react-ga4'
import { useLocation } from 'react-router-dom'

import Nav from './Assets/Structures/Nav/Nav'
import Footer from './Assets/Structures/Footer/Footer'

import AnimatedRoutes from './Assets/AnimatedRoutes'

import './App.css'


function App() {
  
    const [width, setWidth] = useState('100vw')

    const location = useLocation()
    ReactGA.initialize('G-8W78FTZKPV')

    useEffect(() => {
        ReactGA.send({ hitType: "pageview", page: location.pathname + location.search })
    }, [location])

    useEffect(() => {
        setInterval(() => {
            setWidth(`${document.body.clientWidth}px`)
        }, 5000)
        window.addEventListener('resize', (e) => {
            setWidth(`${document.body.clientWidth}px`)
        })
        console.log('%cAll images here are under strict copyright. Illegal hotlinking or sharing without attribution is forbidden.', "color: red; font-size: 2rem")
    }, [])


    return (
        <>
            <Nav />
            <div id='parallax' style={{ width: width }}></div>
            <div id="main">
                <AnimatedRoutes />
            </div>
            <Footer />
            {/* <Breadcrumbs /> */}
        </>
    )
}

export default App
