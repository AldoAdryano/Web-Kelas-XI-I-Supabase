import React, { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./Pages/Home"
import Carousel from "./Pages/Gallery"
import FullWidthTabs from "./Pages/Tabs"
import Footer from "./Pages/Footer"
import Chat from "./components/ChatAnonim"
import AdminApp from "./Pages/Admin/AdminApp"
import AOS from "aos"
import "aos/dist/aos.css"

function MainApp() {
	useEffect(() => {
		AOS.init()
		AOS.refresh()
	}, [])

	return (
		<>
			<Home />

			<Carousel />
			<FullWidthTabs />

			<div id="Mesh1"></div>

			<div
				className="lg:mx-[12%] lg:mt-10 lg:mb-20 hidden lg:block"
				id="ChatAnonim_lg"
				data-aos="fade-up"
				data-aos-duration="1200">
				<Chat />
			</div>

			<Footer />
		</>
	)
}

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<MainApp />} />
				<Route path="/admin/*" element={<AdminApp />} />
			</Routes>
		</Router>
	)
}

export default App
