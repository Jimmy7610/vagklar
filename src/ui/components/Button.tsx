import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { LinkProps } from 'react-router-dom';
import styles from './Button.module.css';
import { Icon } from '@/ui/icons/Icon';
import type { IconName } from '@/ui/icons/Icon';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'soft'
  | 'ghost'
  | 'danger'
  | 'dangerGhost';

export type ButtonSize = 'sm' | 'md' | 'lg';

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  icon?: IconName;
  iconAfter?: IconName;
  loading?: boolean;
  children?: ReactNode;
}

function classNames(props: CommonProps, extra?: string): string {
  const { variant = 'primary', size = 'md', block, loading, children } = props;
  return [
    styles.button,
    styles[variant],
    size !== 'md' ? styles[size] : '',
    block ? styles.block : '',
    loading ? styles.loading : '',
    children === undefined ? styles.iconOnly : '',
    extra ?? '',
  ]
    .filter(Boolean)
    .join(' ');
}

function Content({ icon, iconAfter, loading, children, size }: CommonProps) {
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 22 : 19;
  return (
    <>
      {icon && (
        <span className={styles.icon}>
          <Icon name={icon} size={iconSize} />
        </span>
      )}
      {children !== undefined && <span className={styles.label}>{children}</span>}
      {iconAfter && (
        <span className={styles.icon}>
          <Icon name={iconAfter} size={iconSize} />
        </span>
      )}
      {loading && <span className={styles.spinner} aria-hidden="true" />}
    </>
  );
}

export type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant,
  size,
  block,
  icon,
  iconAfter,
  loading,
  children,
  className,
  type = 'button',
  disabled,
  ...rest
}: ButtonProps) {
  const common = { variant, size, block, icon, iconAfter, loading, children };
  return (
    <button
      type={type}
      className={classNames(common, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      <Content {...common} />
    </button>
  );
}

export type ButtonLinkProps = CommonProps & LinkProps;

/** Same visual language, but a real link — so it is keyboard and SR correct. */
export function ButtonLink({
  variant,
  size,
  block,
  icon,
  iconAfter,
  loading,
  children,
  className,
  ...rest
}: ButtonLinkProps) {
  const common = { variant, size, block, icon, iconAfter, loading, children };
  return (
    <Link className={classNames(common, className)} {...rest}>
      <Content {...common} />
    </Link>
  );
}

export type ExternalButtonLinkProps = CommonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement>;

export function ExternalButtonLink({
  variant,
  size,
  block,
  icon,
  iconAfter,
  loading,
  children,
  className,
  ...rest
}: ExternalButtonLinkProps) {
  const common = { variant, size, block, icon, iconAfter, loading, children };
  return (
    <a className={classNames(common, className)} {...rest}>
      <Content {...common} />
    </a>
  );
}
