import { enqueueSnackbar, VariantType } from 'notistack';

export interface ToastOptions {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
}

export function showToast({ type, title, description }: ToastOptions) {
  const message = description ? `${title}: ${description}` : title;
  
  const variantMap: Record<ToastOptions['type'], VariantType> = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info'
  };

  enqueueSnackbar(message, { 
    variant: variantMap[type],
    autoHideDuration: 5000,
    anchorOrigin: { horizontal: 'right', vertical: 'top' }
  });
}