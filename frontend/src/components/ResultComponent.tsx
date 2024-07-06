import type { PingResult } from "./PingComponent";

type ResultComponentProps = {
	pingResults: PingResult[] | null;
	lastPingResult: PingResult | null;
};

function ResultComponent(props: ResultComponentProps) {
	return (
		<>
			<div className="flex justify-center">
				<div
					id="ping-output"
					className="h-[20rem] min-h-[20rem] w-[30rem] min-w-[30rem] overflow-y-scroll rounded-xl border border-black bg-white p-2 text-xs text-black opacity-50"
				>
					{props.lastPingResult && (
						<div
							className="mb-3 rounded-xl bg-amber-300/20"
							id="last-ping-result"
						>
							<div className="mb-1 flex items-center justify-center gap-3">
								<p className="font-bold">{props.lastPingResult.time}</p>
								<p>-</p>
								<p>{props.lastPingResult.internalIP}</p>
								<p>-</p>
								<p className="font-bold">
									{props.lastPingResult.success ? "Success" : "Error"}
								</p>
							</div>
							{!props.lastPingResult.success && (
								<div className="mb-1">
									{`>> error count: ${props.lastPingResult.errorCount} / 5 <<`}
								</div>
							)}
							<pre className="mt-2 text-xs font-thin">
								{props.lastPingResult.output}
							</pre>
						</div>
					)}
					{props.pingResults?.map((result: PingResult) => {
						return (
							<div key={result.output + Math.random()} className="mb-3">
								<div className="mb-2 flex items-center justify-center gap-3">
									<p className="font-bold">{result.time}</p>
									<p>-</p>
									<p>{result.internalIP}</p>
									<p>-</p>
									<p className="font-bold">
										{result.success ? "Success" : "Error"}
									</p>
								</div>
								<pre className="text-xs font-thin">{result.output}</pre>
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
}

export { ResultComponent };
