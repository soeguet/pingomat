import { useEffect, useRef, useState } from "react";
import {
	SendManualCurl,
	SendManualPing,
	SetInternalIP,
	SetInternalPort,
} from "../../wailsjs/go/main/App";
import { EditSvg } from "./svgs/EditSvg";
import { SendSvg } from "./svgs/SendSvg";
import { HttpSvg } from "./svgs/HttpSvg";
import { validateIpRegex, validatePortRegex } from "./util/validator";

type MiddleComponentProps = {
	buttonCooldown: boolean;
	setButtonCooldown: React.Dispatch<React.SetStateAction<boolean>>;
	autoCurl: boolean;
	setAutoCurl: React.Dispatch<React.SetStateAction<boolean>>;
};

function MiddleComponent(props: MiddleComponentProps) {
	const [editIP, setEditIP] = useState(false);
	const [editPort, setEditPort] = useState(false);

	const ipRef = useRef<HTMLInputElement>(null);
	const portRef = useRef<HTMLInputElement>(null);

	// const [ip, setIP] = useState(
	// 	localStorage.getItem("pingomat-ip") || "192.168.178.1",
	// );
	// const [port, setPort] = useState(
	// 	localStorage.getItem("pingomat-port") || "80",
	// );

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

	function onClickIpChange() {
		if (editIP && ipRef.current) {
			const ipPass = validateIpRegex(ipRef.current.value);

			if (ipPass) {
				SetInternalIP(ipRef.current.value);
			}

			setEditIP(false);
		} else {
			setEditIP(true);
		}
	}
	function onClickPortChange() {
		if (editPort && portRef.current) {
			const portPass = validatePortRegex(portRef.current.value);
			setEditPort(false);

			if (portPass) {
				SetInternalPort(portRef.current.value);
			}
			setEditPort(true);
		} else {
			setEditPort(true);
		}
	}

	useEffect(() => {
		const ip = localStorage.getItem("pingomat-ip");
		const port = localStorage.getItem("pingomat-port");

		if (ip && ipRef.current) {
			SetInternalIP(ip);
			ipRef.current.value = ip;
		}

		if (port && portRef.current) {
			SetInternalPort(port);
			portRef.current.value = port;
		}
	}, []);

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
						ref={ipRef}
						className="w-44 items-center rounded-xl py-2 text-center text-black disabled:opacity-50"
						disabled={!editIP}
					/>
					<input
						id="ping-port-field"
						ref={portRef}
						className="w-24 items-center rounded-xl py-2 text-center text-black disabled:opacity-50"
						disabled={!editIP}
					/>
				</div>

				{/* biome-ignore lint/a11y/useKeyWithClickEvents: no keyboard events needed */}
				<div
					className="cursor-pointer"
					onClick={() => {
						SendManualPing();
					}}
				>
					<div className="rounded-xl border-2 border-yellow-500 bg-white px-5 py-1">
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
				<div className="text-gray-200 opacity-80">
					Curl Anfrage wird durchgeführt..
				</div>
			) : (
				<div className="flex items-center justify-center gap-2">
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
