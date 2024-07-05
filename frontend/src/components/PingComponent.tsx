import { useState, useEffect } from "react";
import {
	MakeWindowsTaskIconFlash,
	SendDesktopNotification,
	SendManualPing,
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
const examplePingResult: PingResult = {
	time: "00:00:00",
	internalIP: "",
	success: true,
	output: "",
};
function PingComponent() {
	const [pingResults, setPingResults] = useState<PingResult[] | null>([
		examplePingResult,
	]);
	const [lastPingResult, setLastPingResult] = useState<PingResult | null>(null);
	const [errorCount, setErrorCount] = useState(0);
	const [ip, setIP] = useState(
		localStorage.getItem("pingomat-ip") || "192.168.178.1",
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: should run only once
	useEffect(() => {
		SetInternalIP(ip);

		console.log("errorcount", errorCount);
		// regular 30 second interval ping
		EventsOn("pingResult", (result: PingResult) => {
			console.log("errorcount", errorCount);
			if (!result.success) {
				// if error, try again and increment error count
				setErrorCount((prevErrorCount) => {
					if (prevErrorCount < 5) {
						SendManualPing();
						return prevErrorCount + 1;
					}

					// after 5 errors, send desktop notification and flash taskbar icon
					SendDesktopNotification(
						"Ping Fehler",
						"Das Gerät ist nicht erreichbar",
					)
						.then(() => {
							MakeWindowsTaskIconFlash("pingomat");
						})
						.finally(() => {
							// Optionally, you can reset the error count here if needed
							// setErrorCount(0);
						});
					return prevErrorCount; // Do not increment further
				});

				setLastPingResult(result);
				setPingResults((data) => {
					if (data === null) {
						return [result];
					}
					const newData = [result, ...data];
					if (newData.length > 1000) {
						newData.pop();
					}
					return newData;
				});
			} else {
				setLastPingResult(result);
				setPingResults(null);
				setErrorCount(0); // Reset error count on successful ping
			}
		});

		EventsOn("pingResultManual", (result: PingResult) => {
			setPingResults((data) => {
				if (data === null) {
					return [result];
				}
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
			<StatusComponent firstPingResult={lastPingResult} />
			<MiddleComponent ip={ip} setIP={setIP} />
			<ResultComponent
				pingResults={pingResults}
				lastPingResult={lastPingResult}
			/>
		</div>
	);
}

export { PingComponent };
