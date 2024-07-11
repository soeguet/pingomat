import { useState } from "react";
import { SendManualCurl, SetInternalIP } from "../../wailsjs/go/main/App";
import { EditSvg } from "./svgs/EditSvg";
import { SendSvg } from "./svgs/SendSvg";
import { HttpSvg } from "./svgs/HttpSvg";

type CurlComponentProps = {
	buttonCooldown: boolean;
	setButtonCooldown: React.Dispatch<React.SetStateAction<boolean>>;
	port: string;
	setPort: React.Dispatch<React.SetStateAction<string>>;
	autoCurl: boolean;
	setAutoCurl: React.Dispatch<React.SetStateAction<boolean>>;
};

function CurlComponent(props: CurlComponentProps) {
	const [editPort, setEditPort] = useState(false);

	function validatePortRegex(ip: string) {
		const regex = /^[0-9]{1,5}$/;
		return regex.test(ip);
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
				<div className="cursor-pointer" onClick={onClickPortChange}>
					<div className="rounded-xl bg-white p-1">
						<EditSvg title="Bearbeite den adressierten Port" />
					</div>
				</div>

				<input
					id="ping-ip-field"
					className="items-center rounded-xl py-2 text-center text-black disabled:opacity-50"
					disabled={!editPort}
					onChange={(e) => props.setPort(e.target.value)}
					value={props.port}
				/>

				{/* biome-ignore lint/a11y/useKeyWithClickEvents: no keyboard events needed */}
				<div
					className={`${props.buttonCooldown ? "opacity-70" : "cursor-pointer"}`}
					onClick={sendCurl}
				>
					<div className="rounded-xl bg-white px-5 py-1">
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
					<label htmlFor="ping-port-field">auto curl command</label>{" "}
				</div>
			)}
		</>
	);
}

export { CurlComponent };
