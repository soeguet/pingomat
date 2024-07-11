import { useState } from "react";
import { SendManualPing, SetInternalIP } from "../../wailsjs/go/main/App";
import { EditSvg } from "./svgs/EditSvg";
import { SendSvg } from "./svgs/SendSvg";

type MiddleComponentProps = {
	ip: string;
	setIP: React.Dispatch<React.SetStateAction<string>>;
};
function MiddleComponent(props: MiddleComponentProps) {
	const [editIP, setEditIP] = useState(false);
	function sendPing() {
		SendManualPing();
	}
	function validateIpRegex(ip: string) {
		const regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
		return regex.test(ip);
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
				<input
					id="ping-ip-field"
					className="items-center rounded-xl py-2 text-center text-black disabled:opacity-50"
					disabled={!editIP}
					onChange={(e) => props.setIP(e.target.value)}
					value={props.ip}
				/>

				{/* biome-ignore lint/a11y/useKeyWithClickEvents: no keyboard events needed */}
				<div className="cursor-pointer" onClick={sendPing}>
					<div className="rounded-xl bg-white px-5 py-1">
						<SendSvg />
					</div>
				</div>
			</div>
		</>
	);
}

export { MiddleComponent };
