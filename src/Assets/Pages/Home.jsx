import React, { useState, useEffect, useRef } from "react";
import { motion } from 'framer-motion'

import Carousel from "../Structures/Carousel/Carousel";
import RecentCard from "../Structures/Recent Card/RecentCard.jsx";

import updateDetails from "../../Functions/UpdateDetails.ts";
import getClicks from "../../Functions/getClicks.ts";
import getRecent from "../../Functions/getRecent.ts";
import mentis from "../Structures/Carousel/Cards/Assets/Mentis.svg"

import { useFeed, useRepos } from "../../Hooks";

import '../Styles/Home.css'

function Home() {

    document.title = "Soil Boys"
    
    const [images, setImages] = useState(Array(10).fill(0))
    const [recent, setRecent] = useState({
        title: "Mentis – Your Personal Mood Tracking App!",
        logo: mentis,
        labels: {
            tools: ["React Native", "NodeJS"],
            type: ["App"]
        },
        links: [
            {
                name: "Download",
                url: "https://github.com/soil-boys/Mentis/releases/tag/v1.0.0",
                icon: ["download"]
            },
            {
                name: "GitHub",
                url: "https://github.com/soil-boys/Mentis/releases/tag/v1.0.0",
                icon: ["github"]
            }
        ],
        description: "Thrilled to announce the android launch of Mentis, our groundbreaking mood tracking app!"
    })
    const [loadingClicks, setLoadingClicks] = useState(false)
    const [loadingRecent, setLoadingRecent] = useState(false)
    const [err, setErr] = useState('');

    const { feed, loading, error } = useFeed(4)
    const { repos, loadingRepos } = useRepos()

    const section1 = useRef(null)
    const section2 = useRef(null)
    const divider = useRef(null)
    const section3 = useRef(null)
    const details = useRef(null)

    const picture1 = useRef(null)
    const picture2 = useRef(null)
    const picture3 = useRef(null)
    const picture4 = useRef(null)
    const pictureRefArr = [picture1, picture2, picture3, picture4]

    const fetchData = async () => {
        setLoadingClicks(true)
        setLoadingRecent(true)

        try {
            const data = await getClicks()
            const recentData = await getRecent(null, true)
            setImages(data)
            setRecent(recentData)
            setLoadingClicks(false)
            setLoadingRecent(false)
        } catch (err) {
            setErr(err)
        } finally {
            setLoadingClicks(false)
            setLoadingRecent(false)
        }

    }
    
    useEffect(() => {
        fetchData()
        
        const clicksObserver = new IntersectionObserver(entries => {
            entries[0].target.classList.toggle('visible', entries[0].isIntersecting)
        }, { threshold: .9 })
        clicksObserver.observe(section1.current)
        
        const recentObserver = new IntersectionObserver(entries => {
            entries[0].target.classList.toggle('visible', entries[0].isIntersecting)
        }, { threshold: .5 })
        recentObserver.observe(section2.current)
        
        const divisionObserver = new IntersectionObserver(entries => {
            entries[0].target.classList.toggle('visible', entries[0].isIntersecting)
        }, { threshold: 1 })
        divisionObserver.observe(divider.current)
        
        const latestObserver = new IntersectionObserver(entries => {
            entries[0].target.classList.toggle('visible', entries[0].isIntersecting)
        }, { threshold: 0.2 })
        latestObserver.observe(section3.current)

    }, [])
    
    useEffect(() => {
        const pictureObserver = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) updateDetails(entries[0].target, details.current)
        }, { threshold: 1 })
        if (feed) {
            pictureRefArr.forEach(ref => {
                if (!ref.current) return
                pictureObserver.observe(ref.current)
            });
        }
    }, [loading])

    const defaultRegex = /^([^\n]+)$/gmi
    const equipmentRegex = /^(📸|🎞️)(.+)$/gmi
    const authorRegex = /^@(.+)$/gmi

    console.log(feed)

    let latestContent = feed.map(post => ({
        id: post.id,
        img: post.high_res_url,
        post_name: post.caption.match(defaultRegex)[0],
        post_author: post.caption.match(authorRegex)[0].replace(/@|@(\s+)/gi, ''),
        post_equipment: post.caption.match(equipmentRegex)[0].replace(/^(📸|🎞️)/gi, '')
    }))

    return(
        <motion.div
            id="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div id="quote" select="false">
                <span className="quote-start">“</span>
                <p className="quote-text">Technology, Photography, and Innovation for Positive Impact.</p>
                <span className="quote-end">”</span>
            </div>
            <section className='section-1' style={{ '--speed': '20s' }} ref={section1}>
                <Carousel content={images} />
                <div className="heading-container">
                    <h2 className="heading" select="false">Clicks</h2>
                </div>
            </section>
            <div id="divider" ref={divider}>
                <span className="line left"></span>
                <span className="dot"></span>
                <span className="line right"></span>
            </div>
            <section className='section-2' style={{ '--speed': '10s' }} ref={section2}>
                {!loadingRecent && <RecentCard content={recent} />}
                <div className="heading-container">
                    <h2 className="heading" select="false">Recent</h2>
                </div>
            </section>
            <section className="section-3" ref={section3}>
                <div className="heading-container">
                    <h2 className="heading" select="false">Latest</h2>
                </div>
                <div className="content-wrapper">
                    {/* <div className="err-text">
                        Down for the time being.
                    </div> */}
                    <div className="side-bar">
                        <span className="dot"></span>
                        <span className="line"></span>
                    </div>
                    <div className="section-container">
                        <div className="picture-section">
                            {latestContent.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="img-container"
                                    ref={pictureRefArr[index]}
                                    data-name={item.post_name}
                                    data-author={item.post_author}
                                    data-equip={item.post_equipment}  
                                    select="false"  
                                >
                                    <img src={item.img} alt="" />
                                </div>
                            ))}
                        </div>
                        <div className="details-section" ref={details}>
                            <div className="details">
                                <div className="post-name" maskable="true">Post Name</div>
                                <a className="post-credit" target="_blank" rel="noopener noreferrer">
                                    <span className="post-credit-line">@</span>
                                    <span className="post-credit-author" maskable="true">Post Author</span>
                                </a>
                                <div className="post-equipment"><span>Shot on</span><span maskable="true">equipment used</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </motion.div>
    )

}

export default Home


const _recentData = {
    title: "Mentis – Your Personal Mood Tracking App!",
    logo: mentis,
    labels: {
        tools: ["React Native", "NodeJS", "TensorFlow"],
        type: ["App"]
    },
    links: [
        {
            name: "Download",
            url: "https://github.com/soil-boys/Mentis/releases/tag/v1.0.0",
            icon: ["download"]
        },
        {
            name: "GitHub",
            url: "https://github.com/soil-boys/Mentis/releases/tag/v1.0.0",
            icon: ["github"]
        }
    ],
    description: "Thrilled to announce the android launch of Mentis, our groundbreaking mood tracking app!"
}