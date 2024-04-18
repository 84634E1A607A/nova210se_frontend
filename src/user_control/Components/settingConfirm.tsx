import { confirmDialog } from 'primereact/confirmdialog';
import { Button } from 'primereact/button';

type SCDProps = {
  changeField: string;
  event: any;
  requireOldPassword?: boolean;
};

export function settingConfirmDialog({ changeField, event, requireOldPassword = false }: SCDProps) {
  confirmDialog({
    message: 'Change pw',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    defaultFocus: 'summit',
  });
}
