import { spawnSync } from "child_process";
import { Address } from "../types/Data";

// Command format to change IP:
// 		netsh interface ipv4 set address name="YOUR INTERFACE NAME" static IP_ADDRESS SUBNET_MASK GATEWAY
// Example:
// 		netsh interface ipv4 set address name="Wi-Fi" static 192.168.3.8 255.255.255.0 192.168.3.1

/**
 * An helper class to run commands
 */
export abstract class CommandHandler {

	public static changeIp(address: Address) {
		const addrType = address.isStatic ? "static" : "dynamic";

		// tslint:disable-next-line:max-line-length
		const cmd = spawnSync("cmd", ["/c", `netsh interface ${address.type} set address name=\"${address.name}\" ${addrType} ${address.address} ${address.subnet} ${address.gateway}`]);

		switch (cmd.status) {
			case 0:
				return Promise.resolve({ changed: true });
			case 1:
				// Check if the provided interface doesn't exist.
				// In this case, an error complaining about syntax of file, dir or volume will be given
				if (cmd.stdout.toString().indexOf("file") > -1) {
					return Promise.reject({ invalidInterface: true });
				} else {
					return Promise.reject({ missingAdminPrivileges: true });
				}
			default:
				return Promise.reject(cmd.stderr.toString());
		}
	}
}
