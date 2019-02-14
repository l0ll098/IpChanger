export interface Address {
	id?: number;
	type: "ipv4" | "ipv6";
	name: string;
	isStatic: boolean;
	address: string;
	subnet: string;
	gateway: string;
}
