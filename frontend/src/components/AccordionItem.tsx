import React, { useState } from "react";

export interface AccordionItemProps {
	title: string;
	content: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, content }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="border-b">
			<button
				className="flex w-full items-center justify-between px-6 py-4 text-left"
				onClick={() => setIsOpen(!isOpen)}
			>
				<span>{title}</span>
				<span
					className={`transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
				>
					▼
				</span>
			</button>
			{isOpen && (
				<div className="px-6 pb-4">
					<p>{content}</p>
				</div>
			)}
		</div>
	);
};

interface AccordionProps {
	items: AccordionItemProps[];
}

const Accordion: React.FC<AccordionProps> = ({ items }) => {
	return (
		<div className="overflow-hidden rounded-lg border">
			{items.map((item, index) => (
				<AccordionItem key={index} title={item.title} content={item.content} />
			))}
		</div>
	);
};

export default Accordion;
