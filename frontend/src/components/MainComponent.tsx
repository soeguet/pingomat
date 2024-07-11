import { useEffect, useState } from "react";
import {
	MakeWindowsTaskIconFlash,
	SendDesktopNotification,
	SendManualCurl,
} from "../../wailsjs/go/main/App";
import { EventsOn } from "../../wailsjs/runtime/runtime";
import { MiddleComponent } from "./MiddleComponent";
import { ResultComponent } from "./ResultComponent";
import { StatusComponent } from "./StatusComponent";

export interface PingResult {
	errorCount: number;
	time: string;
	reset: boolean;
	notification: boolean;
	internalIP: string;
	success: boolean;
	output: string;
}
const examplePingResult: PingResult = {
	errorCount: 0,
	time: "00:00:00",
	notification: false,
	reset: false,
	internalIP: "",
	success: true,
	output: "",
};
function MainComponent() {
	const [pingResults, setPingResults] = useState<PingResult[] | null>([
		examplePingResult,
	]);
	const [lastPingResult, setLastPingResult] = useState<PingResult | null>(null);

	const [buttonCooldown, setButtonCooldown] = useState(false);

	const [autoCurl, setAutoCurl] = useState(true);

	// biome-ignore lint/correctness/useExhaustiveDependencies: should run only once
	useEffect(() => {
		EventsOn("pingResult", async (result: PingResult) => {
			setLastPingResult(result);

			if (!result.success) {
				setPingResults((data) => {
					if (data === null || data.length === 0) {
						return [result];
					}

					const newData = [result, ...data];
					if (newData.length > 1000) {
						newData.pop();
					}
					return newData;
				});

				if (result.notification) {
					SendDesktopNotification(
						"Ping Fehler",
						"Das Gerät ist nicht erreichbar",
					)
						.then(() => {
							MakeWindowsTaskIconFlash("pingomat");
						})
						.then(() => {
							if (autoCurl) {
								SendManualCurl();
								setButtonCooldown(true);

								const timeout = setTimeout(() => {
									setButtonCooldown(false);

									return () => {
										clearTimeout(timeout);
									};
								}, 15000);
							}
						});
				}

				return;
			}

			setPingResults(null);
		});

		EventsOn("pingResultManual", async (result: PingResult) => {
			setLastPingResult(result);

			if (result.success) {
				setPingResults(null);
			}
		});
	}, []);

	return (
		<div className="container mx-auto flex flex-col gap-4 p-4">
			<h1 className="text-2xl font-bold">Ping Ergebnisse</h1>
			<StatusComponent lastPingResult={lastPingResult} />
			<MiddleComponent
				autoCurl={autoCurl}
				setAutoCurl={setAutoCurl}
				buttonCooldown={buttonCooldown}
				setButtonCooldown={setButtonCooldown}
			/>
			<ResultComponent
				pingResults={pingResults}
				lastPingResult={lastPingResult}
			/>
		</div>
	);
}

export { MainComponent };
