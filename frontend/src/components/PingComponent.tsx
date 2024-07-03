import { useState, useEffect } from "react";
import { EventsOn } from "../../wailsjs/runtime/runtime";
import Accordion from "./AccordionItem";
interface PingResult {
	internalIP: string;
	success: boolean;
	output: string;
}
function PingComponent() {
	const [pingResults, setPingResults] = useState<PingResult>({
		internalIP: "",
		success: false,
		output: "",
	});

	useEffect(() => {
		EventsOn("pingResult", (result: PingResult) => {
			setPingResults(result);
		});
	}, []);

	return (
		<div className="container mx-auto p-4">
			<h1 className="mb-4 text-2xl font-bold">Ping Results</h1>
			<div>
				<div className="rounded border border-white p-2 shadow">
					<div className="flex flex-col">
						<p className="text-sm">Internal IP</p>
						<p className="text-sm">{pingResults.internalIP}</p>
					</div>
					<p>{pingResults.success ? "Success" : "Error"}</p>
					<pre>{pingResults.output}</pre>
				</div>
			</div>
		</div>
	);
}

export { PingComponent };
