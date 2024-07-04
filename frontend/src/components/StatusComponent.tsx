import type { PingResult } from "./PingComponent";
import { FailSvg } from "./svgs/FailSvg";
import { SuccessSvg } from "./svgs/SuccessSvg";

type StatusComponentProps = {
	firstPingResult: PingResult;
};
function StatusComponent(props: StatusComponentProps) {
	return (
		<>
			<div
				id="ping-results"
				className={`text-2xl font-semibold ${
					props.firstPingResult.success ? "text-green-500" : "text-red-500"
				}`}
			>
				{props.firstPingResult.success ? (
					<div className="flex items-center justify-center gap-3">
						<SuccessSvg />
						<div>Erfolgreich</div>
					</div>
				) : (
					<div className="flex items-center justify-center gap-3">
						<FailSvg />
						<div>Fehler</div>
					</div>
				)}
			</div>
		</>
	);
}

export { StatusComponent };
