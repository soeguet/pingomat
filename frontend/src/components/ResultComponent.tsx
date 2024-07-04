import type { PingResult } from "./PingComponent";

type ResultComponentProps = {
	pingResults: PingResult[];
};
function ResultComponent(props: ResultComponentProps) {
	return (
		<>
			<div className="flex justify-center">
				<div
					id="ping-output"
					className="h-[20rem] min-h-[20rem] w-[30rem] min-w-[30rem] overflow-y-scroll rounded-xl border border-black bg-white p-2 text-xs text-black opacity-50"
				>
					{props.pingResults.map((result: PingResult, index: number) => {
						return (
							<div key={result.time} className="mb-3">
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
