function HttpSvg() {
	return (
		<>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				xmlSpace="preserve"
				width="2em"
				height="2em"
				viewBox="0 0 512 512"
			>
				<title>Sende eine HTTP Curl Anfrage an die Adresse.</title>
				<circle
					cx={256}
					cy={256}
					r={256}
					style={{
						fill: "#EAB308",
					}}
				/>
				<path
					d="M58.016 202.296h18.168v42.48h.296c2.192-3.368 5.128-6.152 8.936-8.2 3.512-2.056 7.76-3.224 12.304-3.224 12.16 0 24.896 8.064 24.896 30.912v42.04H104.6v-39.992c0-10.4-3.808-18.168-13.776-18.168-7.032 0-12.008 4.688-13.912 10.112-.584 1.472-.728 3.368-.728 5.424v42.624H58.016V202.296zM161.76 214.6v20.368h17.144v13.48H161.76v31.496c0 8.64 2.344 13.176 9.224 13.176 3.08 0 5.424-.44 7.032-.872l.296 13.768c-2.64 1.032-7.328 1.768-13.04 1.768-6.584 0-12.16-2.2-15.52-5.856-3.816-4.112-5.568-10.544-5.568-19.92v-33.544h-10.248V234.96h10.248v-16.12l17.576-4.24zM213.192 214.6v20.368h17.144v13.48h-17.144v31.496c0 8.64 2.344 13.176 9.224 13.176 3.08 0 5.424-.44 7.032-.872l.296 13.768c-2.64 1.032-7.328 1.768-13.04 1.768-6.584 0-12.16-2.2-15.52-5.856-3.816-4.112-5.568-10.544-5.568-19.92v-33.544h-10.248V234.96h10.248v-16.12l17.576-4.24zM243.984 258.688c0-9.376-.296-16.992-.592-23.728h15.832l.872 10.984h.296c5.264-8.056 13.616-12.6 24.464-12.6 16.408 0 30.024 14.064 30.024 36.328 0 25.784-16.256 38.232-32.512 38.232-8.936 0-16.408-3.808-20.072-9.512H262v36.904h-18.016v-76.608zM262 276.416c0 1.76.144 3.368.584 4.976 1.76 7.328 8.2 12.6 15.824 12.6 11.424 0 18.168-9.52 18.168-23.584 0-12.592-6.16-22.848-17.728-22.848-7.472 0-14.36 5.424-16.112 13.336-.448 1.464-.736 3.072-.736 4.536v10.984zM327.504 247.12c0-6.744 4.688-11.568 11.136-11.568 6.592 0 10.984 4.832 11.136 11.568 0 6.592-4.392 11.432-11.136 11.432-6.592 0-11.136-4.84-11.136-11.432zm0 49.368c0-6.744 4.688-11.576 11.136-11.576 6.592 0 10.984 4.688 11.136 11.576 0 6.448-4.392 11.424-11.136 11.424-6.592 0-11.136-4.976-11.136-11.424zM355.8 312.16l35.744-106.2h12.6l-35.752 106.2H355.8zM405.176 312.16l35.744-106.2h12.592l-35.728 106.2h-12.608z"
					style={{
						fill: "#fff",
					}}
				/>
			</svg>
		</>
	);
}

export { HttpSvg };
