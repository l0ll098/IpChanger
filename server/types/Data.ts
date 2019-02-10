export interface Address {
	type: "ipv4" | "ipv6";
	name: string;
	isStatic: boolean;
	address: string;
	subnet: string;
	gateway: string;
}

export interface AddressesFile {
	addresses: Address[];
}
