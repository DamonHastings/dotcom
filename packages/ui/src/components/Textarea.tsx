import * as React from 'react';
import clsx from 'clsx';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
  <textarea ref={ref} {...props} className={clsx('mt-1 block w-full border rounded px-3 py-2', className)} />
));
Textarea.displayName = 'Textarea';
