export interface Address {
	id?: number;
	type: "ipv4" | "ipv6";
	name: string;
	description: string;
	isStatic: boolean;
	address: string;
	subnet: string;
	gateway: string;
}

export interface AddressesFile {
	$comment?: string;
	addresses: Address[];
}

export interface IdsFile {
	$comment?: string;
	lastId: number;
}
