type EditSvgProps = {
	title: string;
};

function EditSvg(props: EditSvgProps) {
	return (
		<>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="-4.8 -4.8 33.6 33.6"
				width="2em"
				height="2em"
			>
				<title>{props.title}</title>
				<rect
					width={33.6}
					height={33.6}
					x={-4.8}
					y={-4.8}
					fill="#fff"
					strokeWidth={0}
					rx={16.8}
				/>
				<g
					stroke="#292D32"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.5}
				>
					<path
						d="M11 2H9C4 2 2 4 2 9v6c0 5 2 7 7 7h6c5 0 7-2 7-7v-2"
						opacity={0.4}
					/>
					<path
						strokeMiterlimit={10}
						d="M16.04 3.02 8.16 10.9c-.3.3-.6.89-.66 1.32l-.43 3.01c-.16 1.09.61 1.85 1.7 1.7l3.01-.43c.42-.06 1.01-.36 1.32-.66l7.88-7.88c1.36-1.36 2-2.94 0-4.94-2-2-3.58-1.36-4.94 0Z"
					/>
					<path
						strokeMiterlimit={10}
						d="M14.91 4.15a7.144 7.144 0 0 0 4.94 4.94"
						opacity={0.4}
					/>
				</g>
			</svg>
		</>
	);
}

export { EditSvg };
