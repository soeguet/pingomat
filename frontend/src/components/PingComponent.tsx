import { useState, useEffect } from "react";
import {
	MakeWindowsTaskIconFlash,
	SendDesktopNotification,
	SetInternalIP,
} from "../../wailsjs/go/main/App";
import { EventsOn } from "../../wailsjs/runtime/runtime";
import { MiddleComponent } from "./MiddleComponent";
import { ResultComponent } from "./ResultComponent";
import { StatusComponent } from "./StatusComponent";

export interface PingResult {
	time: string;
	internalIP: string;
	success: boolean;
	output: string;
}
function PingComponent() {
	const [pingResults, setPingResults] = useState<PingResult[]>([
		{
			time: "00:00:00",
			internalIP: "",
			success: true,
			output: "",
		},
	]);
	const [ip, setIP] = useState(
		localStorage.getItem("pingomat-ip") || "192.168.178.1",
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: should run only once
	useEffect(() => {
		SetInternalIP(ip);

		EventsOn("pingResult", (result: PingResult) => {
			if (!result.success) {
				SendDesktopNotification(
					"Ping Fehler",
					"Das Gerät ist nicht erreichbar",
				).then(() => {
					MakeWindowsTaskIconFlash("pingomat");
				});
			}

			setPingResults((data) => {
				const newData = [result, ...data];
				if (newData.length > 1000) {
					newData.pop();
				}
				return newData;
			});
		});
		EventsOn("pingResultManual", (result: PingResult) => {
			if (result.success) {
			} else {
			}

			setPingResults((data) => {
				const newData = [result, ...data];
				if (newData.length > 1000) {
					newData.pop();
				}
				return newData;
			});
		});
	}, []);

	return (
		<div className="container mx-auto flex flex-col gap-4 p-4">
			<h1 className="text-2xl font-bold">Ping Ergebnisse</h1>
			<StatusComponent firstPingResult={pingResults[0]} />
			<MiddleComponent ip={ip} setIP={setIP} />
			<ResultComponent pingResults={pingResults} />
		</div>
	);
}

export { PingComponent };
