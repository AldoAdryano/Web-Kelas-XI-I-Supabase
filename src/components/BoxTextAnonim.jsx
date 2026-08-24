import * as React from "react"
import Backdrop from "@mui/material/Backdrop"
import Box from "@mui/material/Box"
import Modal from "@mui/material/Modal"
import Button from "@mui/material/Button"
import Fade from "@mui/material/Fade"
import Chat from "./ChatAnonim"
import CloseIcon from "@mui/icons-material/Close"

export default function BoxTextAnonim() {
	const [open, setOpen] = React.useState(false)
	const handleOpen = () => setOpen(true)
	const handleClose = () => setOpen(false)

	return (
		<div>
			<div onClick={handleOpen}>
				<div id="BoxTextAnonim">
					<div className="flex justify-between">
						<img src="/paper-plane.png" alt="" className="w-auto h-6" />
						<img src="/next.png" alt="" className="h-3 w-3" />
					</div>
					<h1 className="capitalize text-white text-left pr-5 text-base font-semibold mt-5">Text Anonim</h1>
				</div>
			</div>

			<Modal
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				open={open}
				onClose={handleClose}
				closeAfterTransition
				slots={{ backdrop: Backdrop }}
				slotProps={{
					backdrop: {
						timeout: 500,
					},
				}}>
				<Fade in={open}>
					<Box className="" id="modal-container-chat">
						{/* Tambahkan tombol silang di kanan atas */}
						<Button onClick={handleClose} style={{ position: "absolute", top: "2%", right: "0" , color: "white",opacity: "70%"}}>
							<CloseIcon />
						</Button>
						<Box id="transition-modal-description" sx={{ mt: 3 }}>
							<Chat/>
						</Box>
					</Box>
				</Fade>
			</Modal>
		</div>
	)
}
