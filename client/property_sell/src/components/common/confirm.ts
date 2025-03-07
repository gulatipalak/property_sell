import { createConfirmation } from "react-confirm";
import ConfirmationDialog from "./ConfirmationDialog";

const confirm = createConfirmation(ConfirmationDialog);

export function confirmDialog(confirmation: string) {
  return confirm({ confirmation });
}
