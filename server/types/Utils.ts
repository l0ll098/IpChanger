/**
 * This enum contains some useful constants to write stuff in the console, such as colorred messages.
 * The properties that have the Fg prefix, are used to write a colored text.
 * The properties that have the Bg prefix, are used to color the background of the following printed message.
 *
 * @example To write a colored text (Cyan)
 * console.log(ConsoleColors.FgCyan + "%s", ' <Message here>');
 *
 * @example To write a colored text (white) on a colored background (Magenta)
 * console.log(ConsoleColors.BgMagenta + "%s" + ConsoleColors.Reset, ' <My message here> ');
 *
 * @example To clear the console
 * process.stdout.write(ConsoleColors.Clear);
 *
 * @readonly
 * @enum {string}
 */
export enum ConsoleColors {
	/** This will clear the console.
	 * Equivalent of the 'cls' command on Windows and 'clear' on Linux.
	 * Don't use this in the console.log, use process.stdout.write() instead
	 * (otherwise you would get an empty line printed before the screen was cleared)
	 */
	Clear = "\x1B[2J\x1B[0f",
	Reset = "\x1b[0m",
	Bright = "\x1b[1m",
	Dim = "\x1b[2m",
	Underscore = "\x1b[4m",
	Blink = "\x1b[5m",
	Reverse = "\x1b[7m",
	Hidden = "\x1b[8m",

	FgBlack = "\x1b[30m",
	FgRed = "\x1b[31m",
	FgGreen = "\x1b[32m",
	FgYellow = "\x1b[33m",
	FgBlue = "\x1b[34m",
	FgMagenta = "\x1b[35m",
	FgCyan = "\x1b[36m",
	FgWhite = "\x1b[37m",

	BgBlack = "\x1b[40m",
	BgRed = "\x1b[41m",
	BgGreen = "\x1b[42m",
	BgYellow = "\x1b[43m",
	BgBlue = "\x1b[44m",
	BgMagenta = "\x1b[45m",
	BgCyan = "\x1b[46m",
	BgWhite = "\x1b[47m",
}
