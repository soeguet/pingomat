import { useState } from "react";
import {
	SendManualCurl,
	SendManualPing,
	SetInternalIP,
} from "../../wailsjs/go/main/App";
import { EditSvg } from "./svgs/EditSvg";
import { SendSvg } from "./svgs/SendSvg";
import { HttpSvg } from "./svgs/HttpSvg";
import { validateIpRegex, validatePortRegex } from "./util/validator";

type MiddleComponentProps = {
	ip: string;
	setIP: React.Dispatch<React.SetStateAction<string>>;
	port: string;
	setPort: React.Dispatch<React.SetStateAction<string>>;
	buttonCooldown: boolean;
	setButtonCooldown: React.Dispatch<React.SetStateAction<boolean>>;
	autoCurl: boolean;
	setAutoCurl: React.Dispatch<React.SetStateAction<boolean>>;
};
function MiddleComponent(props: MiddleComponentProps) {
	const [editIP, setEditIP] = useState(false);
	const [editPort, setEditPort] = useState(false);

	function sendPing() {
		SendManualPing();
	}

	function onClickIpChange() {
		if (editIP) {
			const ipPass = validateIpRegex(props.ip);

			if (ipPass) {
				localStorage.setItem("pingomat-ip", props.ip);
				SetInternalIP(props.ip);
			}
			setEditIP(false);
		} else {
			setEditIP(true);
		}
	}

	function sendCurl() {
		if (props.buttonCooldown) {
			return;
		}

		props.setButtonCooldown(true);

		const timeout = setTimeout(() => {
			props.setButtonCooldown(false);

			return () => {
				clearTimeout(timeout);
			};
		}, 15000);

		SendManualCurl();
	}

	function onClickPortChange() {
		if (editPort) {
			const portPass = validatePortRegex(props.port);

			if (portPass) {
				localStorage.setItem("pingomat-port", props.port);
				SetInternalIP(props.port);
			}
			setEditPort(false);
		} else {
			setEditPort(true);
		}
	}

	return (
		<>
			<div
				id="ping-ip-container"
				className="flex items-center justify-center gap-2"
			>
				{/* biome-ignore lint/a11y/useKeyWithClickEvents: no keyboard events needed */}
				<div className="cursor-pointer" onClick={onClickIpChange}>
					<div className="rounded-xl bg-white p-1">
						<EditSvg title="Bearbeite die interne IP Adresse" />
					</div>
				</div>
				<div className="flex gap-2">
					<input
						id="ping-ip-field"
						className="items-center rounded-xl py-2 w-44 text-center text-black disabled:opacity-50"
						disabled={!editIP}
						onChange={(e) => props.setIP(e.target.value)}
						value={props.ip}
					/>
					<input
						id="ping-port-field"
						className="items-center rounded-xl w-24 py-2 text-center text-black disabled:opacity-50"
						disabled={!editIP}
						onChange={(e) => props.setPort(e.target.value)}
						value={props.port}
					/>
				</div>

				{/* biome-ignore lint/a11y/useKeyWithClickEvents: no keyboard events needed */}
				<div className="cursor-pointer" onClick={sendPing}>
					<div className="rounded-xl bg-white border-2 border-yellow-500 px-5 py-1">
						<SendSvg />
					</div>
				</div>
				{/* biome-ignore lint/a11y/useKeyWithClickEvents: no keyboard events needed */}
				<div
					className={`${props.buttonCooldown ? "opacity-70" : "cursor-pointer"}`}
					onClick={sendCurl}
				>
					<div className="rounded-xl bg-white px-3 py-1">
						<HttpSvg />
					</div>
				</div>
			</div>
			{props.buttonCooldown ? (
				<div className="opacity-80 text-gray-200">
					Curl Anfrage wird durchgeführt..
				</div>
			) : (
				<div className="flex gap-2 justify-center items-center">
					<input
						id="ping-port-field"
						type="checkbox"
						className="items-center rounded-xl py-2 text-center text-black disabled:opacity-50"
						onChange={(e) => props.setAutoCurl(e.target.checked)}
						checked={props.autoCurl}
					/>
					<label htmlFor="ping-port-field">
						automatisch den Curl Befehl ausführen
					</label>{" "}
				</div>
			)}
		</>
	);
}

export { MiddleComponent };
