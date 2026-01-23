import { enqueueSnackbar, closeSnackbar } from 'notistack';

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
}

function toast({ title, description, variant = 'default' }: ToastOptions) {
  const message = title ? `${title}${description ? `: ${description}` : ''}` : description || '';
  
  const variantMap = {
    default: 'info',
    destructive: 'error',
    success: 'success',
    warning: 'warning',
    info: 'info'
  } as const;

  const snackbarVariant = variantMap[variant] || 'info';
  
  const id = enqueueSnackbar(message, {
    variant: snackbarVariant,
    autoHideDuration: 5000,
  });

  return {
    id: id.toString(),
    dismiss: () => closeSnackbar(id),
    update: (newOptions: ToastOptions) => {
      closeSnackbar(id);
      return toast(newOptions);
    }
  };
}

function useToast() {
  return {
    toast,
    dismiss: (id?: string) => {
      if (id) {
        closeSnackbar(id);
      }
    },
    toasts: [] // Material UI Snackbar manages toasts internally
  };
}

export { useToast, toast };