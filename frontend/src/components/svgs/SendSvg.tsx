function SendSvg() {
	return (
		<>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="icon flat-line"
				data-name="Flat Line"
				viewBox="-4.8 -4.8 33.6 33.6"
				width="2em"
				height="2em"
			>
				<title>Sende eine Ping Anfrage an die interne IP Adresse</title>
				<rect
					width={33.6}
					height={33.6}
					x={-4.8}
					y={-4.8}
					fill="#fff"
					strokeWidth={0}
					rx={16.8}
				/>
				<path
					d="m3.69 8.75 15.92-5.69a1 1 0 0 1 1.33 1.33l-5.69 15.92a1 1 0 0 1-1.95 0l-2.51-6.52a1 1 0 0 0-.6-.6L3.67 10.7a1 1 0 0 1 .02-1.95Z"
					style={{
						fill: "#2ca9bc",
						strokeWidth: 2,
					}}
				/>
				<path
					d="m10.62 13.38 3-3m-9.9.27 6.52 2.51a1 1 0 0 1 .6.6l2.51 6.52a1 1 0 0 0 1.95 0l5.64-15.89a1 1 0 0 0-1.33-1.33L3.69 8.75a1 1 0 0 0-.02 1.95Z"
					style={{
						fill: "none",
						stroke: "#000",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						strokeWidth: 2,
					}}
				/>
			</svg>
		</>
	);
}

export { SendSvg };
