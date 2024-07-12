export function validatePortRegex(ip: string) {
	const regex = /^[0-9]{1,5}$/;
	return regex.test(ip);
}

export function validateIpRegex(ip: string) {
	const regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
	return regex.test(ip);
}
