export interface DialogData {
	title: string;
	message: string;
	secondMessage?: string;

	doActionBtn: DialogButton;
	cancelBtn?: DialogButton;
}

export interface DialogButton {
	text: string;
	onClick?: () => void;
}
