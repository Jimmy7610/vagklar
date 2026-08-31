import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { LinkProps } from 'react-router-dom';
import styles from './Card.module.css';

export type CardPadding = 'sm' | 'md' | 'lg' | 'flush';
export type CardTone = 'default' | 'sunken' | 'elevated';

interface CardBaseProps {
  padding?: CardPadding;
  tone?: CardTone;
  /** Left accent strip; pair with a text or icon cue, never colour alone. */
  accentColor?: string;
  children?: ReactNode;
}

function cardClass(
  { padding = 'md', tone = 'default', accentColor }: CardBaseProps,
  interactive: boolean,
  extra?: string,
): string {
  return [
    styles.card,
    padding !== 'md' ? styles[padding] : '',
    tone !== 'default' ? styles[tone] : '',
    accentColor ? styles.accent : '',
    interactive ? styles.interactive : '',
    extra ?? '',
  ]
    .filter(Boolean)
    .join(' ');
}

export type CardProps = CardBaseProps & HTMLAttributes<HTMLDivElement>;

export function Card({ padding, tone, accentColor, className, style, children, ...rest }: CardProps) {
  return (
    <div
      className={cardClass({ padding, tone, accentColor }, false, className)}
      style={accentColor ? { ...style, ['--accent-color' as string]: accentColor } : style}
      {...rest}
    >
      {children}
    </div>
  );
}

export type CardButtonProps = CardBaseProps & ButtonHTMLAttributes<HTMLButtonElement>;

export function CardButton({
  padding,
  tone,
  accentColor,
  className,
  style,
  children,
  type = 'button',
  ...rest
}: CardButtonProps) {
  return (
    <button
      type={type}
      className={cardClass({ padding, tone, accentColor }, true, className)}
      style={accentColor ? { ...style, ['--accent-color' as string]: accentColor } : style}
      {...rest}
    >
      {children}
    </button>
  );
}

export type CardLinkProps = CardBaseProps & LinkProps;

export function CardLink({
  padding,
  tone,
  accentColor,
  className,
  style,
  children,
  ...rest
}: CardLinkProps) {
  return (
    <Link
      className={cardClass({ padding, tone, accentColor }, true, className)}
      style={accentColor ? { ...style, ['--accent-color' as string]: accentColor } : style}
      {...rest}
    >
      {children}
    </Link>
  );
}

export function CardHeader({ children, className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={[styles.header, className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={[styles.title, className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </h3>
  );
}

export function CardSubtitle({ children, className, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={[styles.subtitle, className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </p>
  );
}
