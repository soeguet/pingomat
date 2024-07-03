import { useState, useEffect } from "react";
import { EventsOn } from "../../wailsjs/runtime/runtime";
interface PingResult {
	success: boolean;
	output: string;
}
const PingComponent: React.FC = () => {
	const [pingResults, setPingResults] = useState<PingResult[]>([]);

	useEffect(() => {
		EventsOn("pingResult", (result: PingResult) => {
			setPingResults((prevResults) => [...prevResults, result]);
		});
	}, []);

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Ping Results</h1>
			<div className="space-y-2">
				{pingResults.map((result, index) => {
					console.log(result);
					return (
						<div key={index} className="p-2 bg-gray-100 rounded shadow">
							<p>{result.success ? "Success" : "Error"}</p>
							<pre>{result.output}</pre>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default PingComponent;
