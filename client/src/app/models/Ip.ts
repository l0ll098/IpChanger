/**
 * A simple data structure to keep in memory IP addresses.
 * Blocks from 1 to 4 are required. If only those are passed, this should be considered as an ipv4 address.
 * Blocks from 5 to 8 are optional. If those are passed, this should be considered as an ipv6 address.
 * If an ipv6 address need to have an empty block, pass an empty string.
 * E.g.: 2001:0db8:0000:0000::1428:57ab should be stored as "2001":"0db8":"0000":"0000":"":"1428":"57ab"
 */
export interface Ip {
	block1: string;
	block2: string;
	block3: string;
	block4: string;
	block5?: string;
	block6?: string;
	block7?: string;
	block8?: string;
}
